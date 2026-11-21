import os
import sys
import io
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend")))

from fastapi.testclient import TestClient
from main import app, STORED_COMMENTS, STORED_REELS

client = TestClient(app)

class TestFinalReleaseValidation(unittest.TestCase):
    def setUp(self):
        self.test_user = "test_release_user"

    def test_1_backend_health_and_version(self):
        """Backend health check endpoint responds with 200 OK and healthy status"""
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data.get("status"), ["ONLINE", "healthy"])
        print("✅ Backend health verification passed.")

    def test_2_profile_avatar_upload_and_validation(self):
        """Profile avatar upload accepts valid images, enforces size and MIME boundaries"""
        # A. Valid PNG image
        fake_image_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 500
        file_obj = io.BytesIO(fake_image_bytes)
        res = client.post(
            "/api/profile/upload-avatar",
            files={"file": ("avatar.png", file_obj, "image/png")},
            data={"user": self.test_user}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("/uploads/avatars/", data["avatar_url"])

        # B. Invalid MIME type (text file)
        res_txt = client.post(
            "/api/profile/upload-avatar",
            files={"file": ("bad.txt", io.BytesIO(b"not an image"), "text/plain")},
            data={"user": self.test_user}
        )
        self.assertEqual(res_txt.status_code, 400)
        self.assertIn("Only valid image files", res_txt.json()["detail"])

        # C. Exceeding 5MB limit
        large_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * (5 * 1024 * 1024 + 100)
        res_large = client.post(
            "/api/profile/upload-avatar",
            files={"file": ("huge.png", io.BytesIO(large_bytes), "image/png")},
            data={"user": self.test_user}
        )
        self.assertEqual(res_large.status_code, 400)
        self.assertIn("exceeds 5MB limit", res_large.json()["detail"])
        print("✅ Profile avatar upload validation passed: MIME type and 5MB boundary strictly enforced.")

    def test_3_reels_feed_diversity_and_uniqueness(self):
        """Reels recommendation feed guarantees zero duplicate IDs and category anti-clustering"""
        res = client.get(f"/api/reels/feed?user_id={self.test_user}&limit=20&refresh=true")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        reels = data["reels"]
        self.assertEqual(len(reels), 20)

        # 1. Zero duplicate reel IDs
        reel_ids = [r["id"] for r in reels]
        self.assertEqual(len(reel_ids), len(set(reel_ids)))

        # 2. Zero consecutive category duplicates
        for i in range(len(reels) - 1):
            self.assertNotEqual(
                reels[i]["category"],
                reels[i + 1]["category"],
                f"Consecutive category repetition at {i}: {reels[i]['category']}"
            )

        # 3. Zero consecutive creator duplicates
        for i in range(len(reels) - 1):
            self.assertNotEqual(
                reels[i]["user_name"],
                reels[i + 1]["user_name"],
                f"Consecutive creator repetition at {i}: {reels[i]['user_name']}"
            )
        print("✅ Reels uniqueness & anti-clustering verified: zero duplicates, zero consecutive repeats.")

    def test_4_reel_comments_strict_isolation(self):
        """Comments submitted to reel X never bleed into reel Y"""
        reel_x = "release_test_reel_x"
        reel_y = "release_test_reel_y"

        client.post("/api/comments", json={
            "post_id": reel_x,
            "content": "Secret comment for Reel X exclusively",
            "user": "user_alpha"
        })
        client.post("/api/comments", json={
            "post_id": reel_y,
            "content": "Secret comment for Reel Y exclusively",
            "user": "user_beta"
        })

        res_x = client.get(f"/api/comments?post_id={reel_x}").json()
        res_y = client.get(f"/api/comments?post_id={reel_y}").json()

        comments_x = [c["content"] for c in res_x["comments"]]
        comments_y = [c["content"] for c in res_y["comments"]]

        self.assertIn("Secret comment for Reel X exclusively", comments_x)
        self.assertNotIn("Secret comment for Reel X exclusively", comments_y)
        self.assertIn("Secret comment for Reel Y exclusively", comments_y)
        self.assertNotIn("Secret comment for Reel Y exclusively", comments_x)
        print("✅ Reel comment isolation verified: 100% partitioned by reel ID.")

    def test_5_toxic_comment_moderation_zero_leak(self):
        """Toxic comments are rejected with HTTP 422 and code COMMENT_MODERATION_REJECTED with zero DB leak"""
        toxic_samples = [
            "fuck man",
            "lanja koduku",
            "nuvvu puttakundaa undaalsindi",
            "pooku sannaasi"
        ]
        target_reel = "release_mod_reel"

        for toxic in toxic_samples:
            res = client.post("/api/comments", json={
                "post_id": target_reel,
                "content": toxic,
                "user": "bad_actor"
            })
            self.assertEqual(res.status_code, 422)
            data = res.json()
            self.assertEqual(data.get("code"), "COMMENT_MODERATION_REJECTED")

        # Verify none leaked into the comments list
        get_res = client.get(f"/api/comments?post_id={target_reel}").json()
        saved = [c["content"] for c in get_res["comments"]]
        for toxic in toxic_samples:
            self.assertNotIn(toxic, saved)
        print("✅ Moderation zero-leak verified: prohibited comments rejected and never stored.")

    def test_6_authentic_comment_preservation(self):
        """Safe comments preserve exact original user text without AI rewriting or modification"""
        safe_text = "This engineering architecture is rock-solid and fast! 🚀"
        target_reel = "release_auth_reel"

        res = client.post("/api/comments", json={
            "post_id": target_reel,
            "content": safe_text,
            "user": "mubashir_hussen.sk"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["comment"]["content"], safe_text)
        print("✅ Authentic comment preservation verified: zero AI rewriting.")

if __name__ == "__main__":
    unittest.main()
