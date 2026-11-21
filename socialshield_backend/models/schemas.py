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

class CommentListResponse(BaseModel):
    success: bool
    post_id: str
    comments: List[CommentSuccessItem]

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

# --- Reels Recommendation Engine Schemas ---

class ReelInteractionEvent(BaseModel):
    user_id: str = Field("guest_user", description="Authenticated user ID or guest identifier")
    reel_id: str = Field(..., description="Target reel identifier")
    event_type: str = Field(..., description="view, watch_duration, completion, like, unlike, save, unsave, comment, share, skip, not_interested, hide_creator, report")
    duration_seconds: Optional[float] = Field(0.0, description="Duration watched in seconds")
    percentage_watched: Optional[float] = Field(0.0, description="Percentage of reel watched (0.0 to 100.0)")
    category: Optional[str] = None
    creator_name: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: Optional[str] = None

class ReelInteractionBatchRequest(BaseModel):
    events: List[ReelInteractionEvent]

class ReelFeedbackRequest(BaseModel):
    user_id: str = Field("guest_user", description="User identifier")
    action: str = Field(..., description="not_interested, hide_creator, reset_preferences")
    reel_id: Optional[str] = None
    creator_name: Optional[str] = None
    category: Optional[str] = None

class UserPreferencesUpdateRequest(BaseModel):
    user_id: str = Field(..., description="User identifier")
    preferred_categories: List[str] = Field(..., description="List of chosen interest categories")

class ReelRecommendationResponse(BaseModel):
    success: bool
    session_id: str
    page: int
    limit: int
    total: int
    has_more: bool
    reels: List[Dict[str, Any]]
    categories_represented: List[str] = []
    exploration_count: int = 0

class RecommendationAnalyticsResponse(BaseModel):
    user_id: str
    total_interactions: int
    category_distribution: Dict[str, int]
    top_categories: List[str]
    diversity_score: float
    exploration_rate: float
    total_watched_seconds: float
    completion_count: int
    likes_count: int
    saves_count: int
    suppressed_reels_count: int
    hidden_creators_count: int
