import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend")))

from fastapi.testclient import TestClient
from main import app
from services.recommendation_engine import recommendation_engine, CATEGORIES_TAXONOMY

client = TestClient(app)

class TestReelsRecommendationEngine(unittest.TestCase):
    def setUp(self):
        self.test_user = "test_user_rec_001"
        recommendation_engine.apply_feedback(self.test_user, "reset_preferences")

    def tearDown(self):
        recommendation_engine.apply_feedback(self.test_user, "reset_preferences")

    def test_1_cold_start_diverse_feed(self):
        """New user receives a balanced, non-repetitive feed across diverse categories"""
        res = client.get(f"/api/reels/feed?user_id={self.test_user}&limit=10")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertTrue(data["is_cold_start"])
        reels = data["reels"]
        self.assertEqual(len(reels), 10)

        # 1. Zero duplicate reel IDs
        reel_ids = [r["id"] for r in reels]
        self.assertEqual(len(reel_ids), len(set(reel_ids)))

        # 2. No two consecutive reels share the same category
        for i in range(len(reels) - 1):
            self.assertNotEqual(
                reels[i]["category"],
                reels[i + 1]["category"],
                f"Consecutive categories detected at {i}: {reels[i]['category']}"
            )

        # 3. No two consecutive reels share the same creator
        for i in range(len(reels) - 1):
            self.assertNotEqual(
                reels[i]["user_name"],
                reels[i + 1]["user_name"],
                f"Consecutive creators detected at {i}: {reels[i]['user_name']}"
            )

        # 4. Diversity representation: at least 7 distinct categories in 10 reels
        distinct_cats = set(r["category"] for r in reels)
        self.assertGreaterEqual(len(distinct_cats), 7)
        print(f"✅ Cold-start verified: {len(distinct_cats)} distinct categories in 10-reel window with zero consecutive duplicates.")

    def test_2_interaction_tracking_and_personalization(self):
        """User engagement (watch duration, completion, like) boosts relevant category ranking"""
        target_category = "Technology"

        # Track multiple high-engagement events for Technology
        for i in range(3):
            track_res = client.post("/api/reels/track", json={
                "user_id": self.test_user,
                "reel_id": f"dummy_reel_tech_{i}",
                "event_type": "completion",
                "duration_seconds": 35.0,
                "percentage_watched": 100.0,
                "category": target_category,
                "creator_name": "tech_insider"
            })
            self.assertEqual(track_res.status_code, 200)

        # Also like a technology reel
        client.post("/api/reels/track", json={
            "user_id": self.test_user,
            "reel_id": "dummy_reel_tech_like",
            "event_type": "like",
            "category": target_category,
            "creator_name": "tech_insider"
        })

        # Request personalized feed
        res = client.get(f"/api/reels/feed?user_id={self.test_user}&limit=10&refresh=true")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["is_cold_start"])

        reels = data["reels"]
        # The top slot or early slots should prioritize user's preferred category
        top_3_categories = [r["category"] for r in reels[:3]]
        self.assertIn(target_category, top_3_categories)

        # But diversity must still be preserved: no consecutive technology reels!
        for i in range(len(reels) - 1):
            self.assertNotEqual(reels[i]["category"], reels[i + 1]["category"])
        print(f"✅ Personalization verified: {target_category} prioritized while preserving category anti-clustering.")

    def test_3_not_interested_suppression(self):
        """Reels marked 'not_interested' are permanently suppressed from future feed generations"""
        # Get initial feed
        res1 = client.get(f"/api/reels/feed?user_id={self.test_user}&limit=10")
        target_reel = res1.json()["reels"][0]
        suppressed_id = target_reel["id"]

        # Mark target reel as Not Interested
        fb_res = client.post("/api/reels/feedback", json={
            "user_id": self.test_user,
            "action": "not_interested",
            "reel_id": suppressed_id
        })
        self.assertEqual(fb_res.status_code, 200)

        # Refresh feed and inspect full 20 reels
        res2 = client.get(f"/api/reels/feed?user_id={self.test_user}&limit=30&refresh=true")
        new_ids = [r["id"] for r in res2.json()["reels"]]
        self.assertNotIn(suppressed_id, new_ids, "Suppressed reel must not appear in recommended feed")
        print(f"✅ Negative feedback verified: Reel '{suppressed_id}' successfully suppressed from user feed.")

    def test_4_hide_creator(self):
        """Creators marked 'hide_creator' have all their content completely excluded"""
        target_creator = "fifa_official"

        fb_res = client.post("/api/reels/feedback", json={
            "user_id": self.test_user,
            "action": "hide_creator",
            "creator_name": target_creator
        })
        self.assertEqual(fb_res.status_code, 200)

        res = client.get(f"/api/reels/feed?user_id={self.test_user}&limit=40&refresh=true")
        creators_in_feed = [r["user_name"] for r in res.json()["reels"]]
        self.assertNotIn(target_creator, creators_in_feed, "Hidden creator content must be 100% excluded")
        print(f"✅ Creator moderation verified: Zero reels from '{target_creator}' returned.")

    def test_5_stable_feed_session_pagination(self):
        """Pagination using session_id returns stable, non-overlapping slices without reshuffling"""
        res_p1 = client.get(f"/api/reels/feed?user_id={self.test_user}&page=1&limit=10")
        self.assertEqual(res_p1.status_code, 200)
        p1_data = res_p1.json()
        session_id = p1_data["session_id"]
        p1_ids = [r["id"] for r in p1_data["reels"]]
        self.assertEqual(len(p1_ids), 10)

        res_p2 = client.get(f"/api/reels/feed?user_id={self.test_user}&session_id={session_id}&page=2&limit=10")
        self.assertEqual(res_p2.status_code, 200)
        p2_data = res_p2.json()
        p2_ids = [r["id"] for r in p2_data["reels"]]
        self.assertEqual(len(p2_ids), 10)

        # Ensure zero overlap between Page 1 and Page 2
        overlap = set(p1_ids).intersection(set(p2_ids))
        self.assertEqual(len(overlap), 0, f"Overlapping reels detected across pages: {overlap}")
        print("✅ Session pagination verified: Page 1 and Page 2 are non-overlapping and stable.")

    def test_6_recommendation_analytics(self):
        """Recommendation analytics computes diversity score, watch duration, and category distribution"""
        # Track 2 events
        client.post("/api/reels/track", json={
            "user_id": self.test_user,
            "reel_id": "reel_1",
            "event_type": "view",
            "duration_seconds": 25.0,
            "category": "Education",
            "creator_name": "pycode.dev"
        })
        client.post("/api/reels/track", json={
            "user_id": self.test_user,
            "reel_id": "reel_4",
            "event_type": "completion",
            "duration_seconds": 30.0,
            "category": "Sports",
            "creator_name": "fifa_official"
        })

        analytics_res = client.get(f"/api/reels/analytics?user_id={self.test_user}")
        self.assertEqual(analytics_res.status_code, 200)
        adata = analytics_res.json()
        self.assertGreaterEqual(adata["total_interactions"], 2)
        self.assertGreaterEqual(adata["total_watched_seconds"], 50.0)
        self.assertGreater(adata["diversity_score"], 0.0)
        self.assertIn("Education", adata["category_distribution"])
        self.assertIn("Sports", adata["category_distribution"])
        print(f"✅ Analytics verified: Diversity score = {adata['diversity_score']}, Watched = {adata['total_watched_seconds']}s")

if __name__ == "__main__":
    unittest.main()
