from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TextModerationRequest(BaseModel):
    text: str = Field(..., description="Text content to be evaluated for toxicity")
    context: Optional[str] = Field("comment", description="Context of content: comment, post, direct_message, bio")
    user: Optional[str] = Field("anonymous_user", description="Author username or user ID")

class CommentCreateRequest(BaseModel):
    post_id: str = Field(..., description="Target post or reel identifier")
    content: str = Field(..., min_length=1, max_length=500, description="Comment body text")
    user: Optional[str] = Field("anonymous_user", description="Author username")

class CommentModerationDetail(BaseModel):
    blocked: bool
    categories: List[str] = []

class CommentSuccessItem(BaseModel):
    id: str
    post_id: str
    user_name: str
    content: str
    created_at: str
    moderation_status: str = "approved"

class CommentResponse(BaseModel):
    success: bool
    code: Optional[str] = None
    message: Optional[str] = None
    comment: Optional[CommentSuccessItem] = None
    moderation: Optional[CommentModerationDetail] = None

class ModerationResponse(BaseModel):
    isToxic: bool
    status: str = Field(..., description="ALLOWED or BLOCKED")
    toxicityScore: float = Field(..., ge=0.0, le=1.0)
    confidence: str
    categories: List[str] = []
    reason: str
    context: Optional[str] = None
    timestamp: str

class VideoModerationResponse(BaseModel):
    isToxic: bool
    status: str
    maxToxicityScore: float
    averageToxicityScore: float
    confidence: str
    totalFramesAnalyzed: int
    flaggedFramesCount: int
    categories: List[str] = []
    reason: str
    timestamp: str

class ModerationLogSchema(BaseModel):
    id: str
    contentType: str
    context: str
    contentSample: str
    fullContent: Optional[str] = None
    author: str
    status: str
    isToxic: bool
    toxicityScore: float
    confidence: str
    categories: List[str] = []
    reason: str
    timestamp: str

class AnalyticsResponse(BaseModel):
    totalChecked: int
    totalBlocked: int
    totalSafe: int
    toxicityRate: str
    averageConfidence: str
    categoriesBreakdown: Dict[str, int]
