import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend")))

from fastapi.testclient import TestClient
from main import app, STORED_COMMENTS

client = TestClient(app)

class TestReelsAndCommentsAPI(unittest.TestCase):
    def setUp(self):
        # Reset test reels in STORED_COMMENTS
        STORED_COMMENTS.pop("test_reel_playback", None)
        STORED_COMMENTS.pop("test_reel_isolated", None)

    def test_1_get_comments_initial_seed(self):
        """Reel comments endpoint returns initial seeded comments for a new reel"""
        res = client.get("/api/comments?post_id=test_reel_playback")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["post_id"], "test_reel_playback")
        self.assertTrue(len(data["comments"]) >= 3)
        self.assertIn("pawavarma795", [c["user_name"] for c in data["comments"]])

    def test_2_post_authentic_comment_without_ai_rewriting(self):
        """Approved comment preserves exact user text verbatim in database and response"""
        original_user_text = "Nice video bro 🔥"
        payload = {
            "post_id": "test_reel_playback",
            "content": original_user_text,
            "user": "mubashir_hussen.sk"
        }
        res = client.post("/api/comments", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        saved_comment = data["comment"]
        # CRITICAL: Text must be identical to what user typed (no AI rewriting or polishing)
        self.assertEqual(saved_comment["content"], original_user_text)
        self.assertEqual(saved_comment["user_name"], "mubashir_hussen.sk")
        self.assertEqual(saved_comment["post_id"], "test_reel_playback")

        # Verify comment is persisted in database and returned in subsequent GET requests
        get_res = client.get("/api/comments?post_id=test_reel_playback")
        self.assertEqual(get_res.status_code, 200)
        get_data = get_res.json()
        saved_contents = [c["content"] for c in get_data["comments"]]
        self.assertIn(original_user_text, saved_contents)
        print("✅ Authenticity verified: Exact user comment persisted without AI modification.")

    def test_3_reel_comment_isolation(self):
        """Comments submitted to reel A do not appear in reel B"""
        client.post("/api/comments", json={
            "post_id": "test_reel_playback",
            "content": "Comment exclusively for Reel A",
            "user": "user_a"
        })
        client.post("/api/comments", json={
            "post_id": "test_reel_isolated",
            "content": "Comment exclusively for Reel B",
            "user": "user_b"
        })

        res_a = client.get("/api/comments?post_id=test_reel_playback").json()
        res_b = client.get("/api/comments?post_id=test_reel_isolated").json()

        contents_a = [c["content"] for c in res_a["comments"]]
        contents_b = [c["content"] for c in res_b["comments"]]

        self.assertIn("Comment exclusively for Reel A", contents_a)
        self.assertNotIn("Comment exclusively for Reel A", contents_b)
        self.assertIn("Comment exclusively for Reel B", contents_b)
        self.assertNotIn("Comment exclusively for Reel B", contents_a)
        print("✅ Isolation verified: Comments do not bleed across reels.")

    def test_4_toxic_comment_blocked_from_persistence(self):
        """Toxic comments are rejected with HTTP 422 and never stored in database"""
        toxic_texts = [
            "fuck girl",
            "nuvvu puttakundaa undaalsindi",
            "pooku sannaasi",
            "lanja koduku"
        ]
        for toxic in toxic_texts:
            res = client.post("/api/comments", json={
                "post_id": "test_reel_playback",
                "content": toxic,
                "user": "troll_user"
            })
            self.assertEqual(res.status_code, 422)
            data = res.json()
            self.assertEqual(data.get("code"), "COMMENT_MODERATION_REJECTED")

            # Verify toxic comment is NOT in database
            get_res = client.get("/api/comments?post_id=test_reel_playback").json()
            saved_contents = [c["content"] for c in get_res["comments"]]
            self.assertNotIn(toxic, saved_contents)

        print("✅ Moderation zero-leak verified: Prohibited comments blocked from database.")

    def test_5_input_boundary_validation(self):
        """Empty comments and excessive length comments are rejected"""
        # Empty
        res_empty = client.post("/api/comments", json={
            "post_id": "test_reel_playback",
            "content": "   ",
            "user": "user"
        })
        self.assertIn(res_empty.status_code, (400, 422))

        # Too long
        long_text = "a" * 501
        res_long = client.post("/api/comments", json={
            "post_id": "test_reel_playback",
            "content": long_text,
            "user": "user"
        })
        self.assertIn(res_long.status_code, (400, 422))
        print("✅ Boundary validation verified: Empty and >500 char comments rejected.")

if __name__ == "__main__":
    unittest.main()
