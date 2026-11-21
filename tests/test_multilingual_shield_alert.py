"""
Test Multilingual SocialShield Alert & Toxic Content Blocking
Validates exact multi-language word meanings (English, Hindi, Telugu, Tamil, Kannada, Malayalam)
and prevents unparliamentary/toxic comments from publishing.
"""
import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "socialshield_backend"))
from main import app
from services.ml_pipelines import text_pipeline

client = TestClient(app)

TARGET_TEST_PHRASES = [
    {
        "phrase": "nuvvu puttakundaa undaalsindi",
        "expected_sub": "Death-wish Profanity",
        "expected_en_contains": "never have been born",
        "expected_hi_contains": "जन्म ही नहीं होना चाहिए था",
        "expected_te_contains": "నువ్వు పుట్టకుండా",
    },
    {
        "phrase": "pooku sannaasi",
        "expected_sub": "Body-part Profanity",
        "expected_en_contains": "Vaginal bum",
        "expected_hi_contains": "योनि-संबंधी",
        "expected_te_contains": "పూకు సన్నాసి",
    },
    {
        "phrase": "puku la undi weather",
        "expected_sub": "Sexual Profanity",
        "expected_en_contains": "Vagina",
        "expected_te_contains": "పూకు",
    },
    {
        "phrase": "fuck girl",
        "expected_sub": "General Profanity",
        "expected_en_contains": "Explicit vulgar English profanity",
        "expected_hi_contains": "असंसदीय",
    },
    {
        "phrase": "lanja koduku",
        "expected_sub": "Paternal Profanity",
        "expected_en_contains": "whore",
        "expected_hi_contains": "वेश्या की संतान",
    },
]

@pytest.mark.parametrize("item", TARGET_TEST_PHRASES)
def test_ml_pipeline_multilingual_exact_meanings(item):
    """Test text_pipeline predicts toxic and returns exact 6-language meanings"""
    res = text_pipeline.predict(item["phrase"])
    assert res["isToxic"] is True
    assert res["status"] == "BLOCKED"
    
    multi = res.get("multilingual")
    assert multi is not None
    assert multi.get("isProfane") is True
    
    trans = multi.get("translations")
    assert trans is not None
    
    # Must have all 6 languages
    for lang_key in ["english", "hindi", "telugu", "tamil", "kannada", "malayalam"]:
        assert lang_key in trans, f"Missing {lang_key} translation for '{item['phrase']}'"
        assert "meaning" in trans[lang_key]
        assert len(trans[lang_key]["meaning"]) > 0

    # Specific language meaning checks
    if "expected_en_contains" in item:
        assert item["expected_en_contains"].lower() in trans["english"]["meaning"].lower()
    if "expected_hi_contains" in item:
        assert item["expected_hi_contains"] in trans["hindi"]["meaning"]
    if "expected_te_contains" in item:
        assert item["expected_te_contains"] in trans["telugu"]["meaning"]


def test_api_block_toxic_comment_and_return_shield_data():
    """Test that POST /api/comments blocks toxic comment with 422 and returns blockResult"""
    payload = {
        "post_id": "test_post_shield",
        "content": "nuvvu puttakundaa undaalsindi",
        "user": "rahul"
    }
    response = client.post("/api/comments", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["code"] == "COMMENT_MODERATION_REJECTED"
    
    block_result = data.get("blockResult")
    assert block_result is not None
    assert block_result.get("isToxic") is True
    
    multi = block_result.get("multilingual")
    assert multi is not None
    assert "english" in multi["translations"]
    assert "hindi" in multi["translations"]
    assert "telugu" in multi["translations"]
    assert "tamil" in multi["translations"]
    assert "kannada" in multi["translations"]
    assert "malayalam" in multi["translations"]


def test_api_clean_comment_allowed():
    """Test that non-toxic comments are allowed verbatim"""
    payload = {
        "post_id": "test_post_shield",
        "content": "Soo beautiful, Soo elegent, just looking like a WoW. #Photography",
        "user": "rahul"
    }
    response = client.post("/api/comments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["comment"]["content"] == payload["content"]
