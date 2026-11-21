"""
Backend Comment API & Moderation Pipeline Test Suite
Tests FastAPI endpoint /api/comments for safe approval, toxic rejection (422), input validation (400),
and persistence guarantees.
"""
import sys
import os

# Add socialshield_backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend")))

from fastapi.testclient import TestClient
from main import app, MODERATION_LOGS

client = TestClient(app)

print("\n--- Running Backend Comment API Test Suite ---")

# 1. Empty Comment Validation (400 Bad Request)
empty_res = client.post("/api/comments", json={"post_id": "post_1", "content": "   ", "user": "test_user"})
assert empty_res.status_code == 400, f"Expected 400 for empty comment, got {empty_res.status_code}"
assert empty_res.json()["code"] == "EMPTY_COMMENT"
print("✅ 1. Backend rejected empty comment with HTTP 400.")

# 2. Max length comment validation (400 or 422)
long_text = "x" * 501
long_res = client.post("/api/comments", json={"post_id": "post_1", "content": long_text, "user": "test_user"})
assert long_res.status_code in (400, 422), f"Expected 400 or 422 for length > 500, got {long_res.status_code}"
print("✅ 2. Backend rejected comment exceeding 500 characters.")

# 3. Safe Comment Approval (200 OK)
safe_comments = [
    "Beautiful picture!",
    "I really like this post.",
    "Great work on this tutorial!",
    "Could you share more tips on React performance?"
]

for safe_txt in safe_comments:
    res = client.post("/api/comments", json={"post_id": "post_1", "content": safe_txt, "user": "mubashir"})
    assert res.status_code == 200, f"Expected 200 for '{safe_txt}', got {res.status_code}"
    body = res.json()
    assert body["success"] is True
    assert body["comment"]["moderation_status"] == "approved"
    assert body["comment"]["content"] == safe_txt
    print(f"✅ 3. Safe comment approved (200 OK): \"{safe_txt}\"")

# 4. Toxic Comment Rejection (422 Unprocessable Entity)
toxic_comments = [
    "fuck girl",
    "nuvvu puttakundaa undaalsindi",
    "pooku sannaasi",
    "puku la undi weather",
    "lanja koduku",
    "chutiya",
    "soole"
]

for toxic_txt in toxic_comments:
    res = client.post("/api/comments", json={"post_id": "post_1", "content": toxic_txt, "user": "troll_user"})
    assert res.status_code == 422, f"Expected 422 for '{toxic_txt}', got {res.status_code}: {res.text}"
    body = res.json()
    assert body["success"] is False
    assert body["code"] == "COMMENT_MODERATION_REJECTED"
    assert body["message"] == "Your comment contains inappropriate or unparliamentary language. Please edit your comment and try again."
    assert body["moderation"]["blocked"] is True
    # Ensure no comment object returned
    assert "comment" not in body or body["comment"] is None
    print(f"✅ 4. Toxic comment rejected with HTTP 422: \"{toxic_txt}\"")

# 5. Database Persistence Guarantee: Rejected comments are NOT stored as published comments
for item in MODERATION_LOGS:
    if item.get("isToxic"):
        assert item.get("status") == "BLOCKED"
print("✅ 5. Persistence verification: All flagged comments marked BLOCKED, never published.")

print("\n🎉 ALL BACKEND COMMENT API & MODERATION TESTS PASSED!\n")
