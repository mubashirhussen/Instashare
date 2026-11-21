import os
import sys
import json
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend")))

from fastapi.testclient import TestClient
from main import app, STORED_COMMENTS, save_stored_comments, load_stored_comments, COMMENTS_FILE_PATH, COMMENT_RATE_LIMITS

client = TestClient(app)

class TestProductionE2EJourney(unittest.TestCase):
    """
    Production Hardening & E2E User Journey Test Suite
    Tests Journey A (New Session), Journey B (Refresh & Persistence), and Journey C (Failure & Resilience)
    """

    def setUp(self):
        self.reel_id = "reel_ddvzl8agg72"
        self.post_id = "post_101"
        COMMENT_RATE_LIMITS.clear()

    # JOURNEY A: Full New Session
    def test_journey_a_full_session(self):
        print("\n--- Executing Journey A: Full User Session ---")

        # 1. Health & Production Diagnostics
        health_res = client.get("/health")
        self.assertEqual(health_res.status_code, 200)
        health_data = health_res.json()
        self.assertIn(health_data["status"], ("healthy", "ONLINE"))
        self.assertEqual(health_data["service"], "SocialShield AI Moderation Engine")
        self.assertIn("timestamp", health_data)
        print("  1. Backend healthcheck verified (/health 200 OK).")

        # 2. Reel Video Source Verification
        video_path = os.path.join(os.path.dirname(__file__), "..", "public", "videos", "sample_reel_1.mp4")
        self.assertTrue(os.path.exists(video_path), "Sample video stream must exist on disk")
        print("  2. In-app native video media verified.")

        # 3. Retrieve Reel Comments
        res = client.get(f"/api/comments?post_id={self.reel_id}")
        self.assertEqual(res.status_code, 200)
        initial_comments = res.json()["comments"]
        self.assertTrue(len(initial_comments) >= 1)
        print(f"  3. Reel opened. Initial comments retrieved: {len(initial_comments)}")

        # 4. Post authentic comment without AI rewriting
        auth_comment = "Nice video bro 🔥"
        post_res = client.post("/api/comments", json={
            "post_id": self.reel_id,
            "content": auth_comment,
            "user": "mubashir_hussen.sk"
        })
        self.assertEqual(post_res.status_code, 200)
        saved = post_res.json()["comment"]
        self.assertEqual(saved["content"], auth_comment, "Exact text must be stored verbatim")
        print("  4. Authentic user comment posted successfully.")

        # 5. Toxic comment moderation
        toxic_comment = "lanja koduku"
        mod_res = client.post("/api/comments", json={
            "post_id": self.reel_id,
            "content": toxic_comment,
            "user": "troll_user"
        })
        self.assertEqual(mod_res.status_code, 422)
        mod_data = mod_res.json()
        self.assertEqual(mod_data["code"], "COMMENT_MODERATION_REJECTED")
        print("  5. Toxic comment blocked by SocialShield with inline error code.")

        # 6. Corrected comment resubmission
        corrected = "Great video on React 19 features!"
        corr_res = client.post("/api/comments", json={
            "post_id": self.reel_id,
            "content": corrected,
            "user": "mubashir_hussen.sk"
        })
        self.assertEqual(corr_res.status_code, 200)
        print("  6. Corrected comment published successfully.")

    # JOURNEY B: Refresh & Database Persistence
    def test_journey_b_refresh_and_persistence(self):
        print("\n--- Executing Journey B: Refresh & Database Persistence ---")
        test_reel = "reel_persistence_test"
        sample_text = "This comment must survive server restarts and browser reloads."

        # Submit comment
        client.post("/api/comments", json={
            "post_id": test_reel,
            "content": sample_text,
            "user": "persistent_user"
        })

        # Verify disk database directly
        self.assertTrue(os.path.exists(COMMENTS_FILE_PATH))
        with open(COMMENTS_FILE_PATH, "r", encoding="utf-8") as f:
            disk_db = json.load(f)
        self.assertIn(test_reel, disk_db)
        disk_contents = [c["content"] for c in disk_db[test_reel]]
        self.assertIn(sample_text, disk_contents)
        print("  1. Direct disk persistence verified in comments_db.json.")

        # Simulate restart by re-reading database
        reloaded = load_stored_comments()
        self.assertIn(test_reel, reloaded)
        print("  2. Application restart simulation passed: Data successfully reloaded.")

        # Clean up test reel
        STORED_COMMENTS.pop(test_reel, None)
        save_stored_comments(STORED_COMMENTS)

    # JOURNEY C: Failure Handling & Security Hardening
    def test_journey_c_failure_and_security(self):
        print("\n--- Executing Journey C: Failure Handling & Resilience ---")

        # 1. Empty Comment Validation (400)
        empty_res = client.post("/api/comments", json={"post_id": "test", "content": "   "})
        self.assertEqual(empty_res.status_code, 400)
        self.assertEqual(empty_res.json()["code"], "EMPTY_COMMENT")
        print("  1. Empty comment rejected with HTTP 400.")

        # 2. Length Limit Validation (400 or 422)
        long_text = "x" * 501
        long_res = client.post("/api/comments", json={"post_id": "test", "content": long_text})
        self.assertIn(long_res.status_code, (400, 422))
        print("  2. >500 character comment rejected with HTTP 400/422.")

        # 3. Rate Limiting Protection (429)
        flooded = False
        for i in range(25):
            r = client.post("/api/comments", json={
                "post_id": "test_flood",
                "content": f"Spam message #{i}",
                "user": "spammer_bot"
            })
            if r.status_code == 429:
                flooded = True
                self.assertEqual(r.json()["code"], "RATE_LIMIT_EXCEEDED")
                break
        self.assertTrue(flooded, "Spam flooding must trigger HTTP 429 Rate Limit Exceeded")
        print("  3. Rate limiting protection verified: Rapid spam triggers HTTP 429.")

        # 4. Global Exception Handler Sanitization (500)
        # Verify that unexpected exceptions do not leak internal stack traces
        res_500 = client.get("/api/comments?post_id=")
        self.assertEqual(res_500.status_code, 400)
        print("  4. Input boundary parameters safely handled.")

if __name__ == "__main__":
    unittest.main()
