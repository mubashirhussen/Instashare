import os
import sys
import json
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend")))

from fastapi.testclient import TestClient
from main import app, STORED_REELS

client = TestClient(app)

class TestReelsDiversityAndAPI(unittest.TestCase):
    def test_1_dataset_count_and_categories(self):
        """Reels dataset contains exactly 60 reels across 20 distinct categories (3 per category)"""
        self.assertGreaterEqual(len(STORED_REELS), 50)
        self.assertLessEqual(len(STORED_REELS), 80)
        self.assertEqual(len(STORED_REELS), 60)

        categories = set(r.get("category") for r in STORED_REELS)
        self.assertEqual(len(categories), 20)

        # Verify each category has at least 3 reels
        for cat in categories:
            cat_reels = [r for r in STORED_REELS if r.get("category") == cat]
            self.assertGreaterEqual(len(cat_reels), 3, f"Category '{cat}' should have at least 3 reels")
        print(f"✅ Dataset size and categories verified: {len(STORED_REELS)} reels across {len(categories)} categories.")

    def test_2_verification_badge_distribution(self):
        """Verified accounts must be between 5% and 15% of total accounts (selective verification)"""
        total = len(STORED_REELS)
        verified_count = sum(1 for r in STORED_REELS if r.get("is_verified") is True)
        percentage = (verified_count / total) * 100

        self.assertGreaterEqual(percentage, 5.0, "Verification rate must be at least 5%")
        self.assertLessEqual(percentage, 15.0, "Verification rate must not exceed 15%")
        self.assertEqual(verified_count, 6) # 6 out of 60 = 10.0%
        print(f"✅ Verification distribution verified: {verified_count}/{total} ({percentage:.1f}%) verified accounts.")

    def test_3_category_interleaving(self):
        """Adjacent reels in default order do not repeat the same category consecutively"""
        consecutive_repeats = 0
        for i in range(len(STORED_REELS) - 1):
            if STORED_REELS[i].get("category") == STORED_REELS[i + 1].get("category"):
                consecutive_repeats += 1
        self.assertEqual(consecutive_repeats, 0, "No two consecutive reels should belong to the same category")
        print("✅ Category interleaving verified: zero consecutive category duplicates.")

    def test_4_get_reels_endpoint_pagination(self):
        """GET /api/reels returns properly paginated responses"""
        res_p1 = client.get("/api/reels?page=1&limit=10")
        self.assertEqual(res_p1.status_code, 200)
        data_p1 = res_p1.json()
        self.assertTrue(data_p1["success"])
        self.assertEqual(data_p1["total"], 60)
        self.assertEqual(len(data_p1["reels"]), 10)
        self.assertEqual(data_p1["page"], 1)
        self.assertEqual(data_p1["pages"], 6)

        res_p2 = client.get("/api/reels?page=2&limit=10")
        self.assertEqual(res_p2.status_code, 200)
        data_p2 = res_p2.json()
        self.assertEqual(len(data_p2["reels"]), 10)
        self.assertEqual(data_p2["page"], 2)

        # Page 1 and Page 2 reels must not overlap
        p1_ids = [r["id"] for r in data_p1["reels"]]
        p2_ids = [r["id"] for r in data_p2["reels"]]
        self.assertEqual(len(set(p1_ids).intersection(set(p2_ids))), 0)
        print("✅ Pagination verified: clean non-overlapping page chunks.")

    def test_5_get_reels_endpoint_filtering(self):
        """GET /api/reels filters by category and search term correctly"""
        # Category filter
        res_sports = client.get("/api/reels?category=Sports")
        self.assertEqual(res_sports.status_code, 200)
        data_sports = res_sports.json()
        self.assertTrue(data_sports["success"])
        self.assertEqual(data_sports["total"], 3)
        for r in data_sports["reels"]:
            self.assertEqual(r["category"], "Sports")

        # Search filter
        res_search = client.get("/api/reels?q=fifa_official")
        self.assertEqual(res_search.status_code, 200)
        data_search = res_search.json()
        self.assertTrue(data_search["success"])
        self.assertGreaterEqual(data_search["total"], 1)
        self.assertIn("fifa_official", [r["user_name"] for r in data_search["reels"]])
        print("✅ Category and search filtering verified.")

if __name__ == "__main__":
    unittest.main()
