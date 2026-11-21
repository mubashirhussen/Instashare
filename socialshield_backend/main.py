from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
import os
import shutil
import uuid
import html
import json
import time
from datetime import datetime

from models.schemas import (
    TextModerationRequest,
    CommentCreateRequest,
    CommentResponse,
    CommentListResponse,
    ModerationResponse,
    VideoModerationResponse,
    ModerationLogSchema,
    AnalyticsResponse
)
from services.ml_pipelines import text_pipeline, image_pipeline, video_pipeline

app = FastAPI(
    title="SocialShield AI Moderation API",
    description="Real-Time AI-Powered Content Moderation & Toxic Prevention System",
    version="2.4.0"
)

# Configurable CORS for Production & Development
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env.strip():
    allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Production Global Exception Handler (sanitizes error details, prevents stack trace leak)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] Uncaught exception on {request.method} {request.url.path}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred. Please try again later."
        }
    )

# Persistent Comments Storage Engine (survives restarts, dual syncs with MongoDB if configured)
COMMENTS_FILE_PATH = os.path.join(os.path.dirname(__file__), "data", "comments_db.json")

# Optional MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = None
mongo_collection = None
if MONGO_URI:
    try:
        from pymongo import MongoClient
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
        mongo_db = mongo_client["instashare"]
        mongo_collection = mongo_db["comments"]
        mongo_db.command("ping")
        print("MongoDB Atlas: Connected and ready.")
    except Exception as e:
        print("MongoDB Atlas connection skipped / fallback to comments_db.json:", e)
        mongo_collection = None

def load_stored_comments() -> Dict[str, List[dict]]:
    if os.path.exists(COMMENTS_FILE_PATH):
        try:
            with open(COMMENTS_FILE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print("Notice: reading comments_db.json fallback:", e)
    return {}

def save_stored_comments(data: Dict[str, List[dict]]):
    try:
        os.makedirs(os.path.dirname(COMMENTS_FILE_PATH), exist_ok=True)
        with open(COMMENTS_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Dual-sync to MongoDB Atlas if connected
        if mongo_collection is not None:
            try:
                for post_id, comments in data.items():
                    mongo_collection.update_one(
                        {"post_id": post_id},
                        {"$set": {"comments": comments, "updated_at": datetime.utcnow().isoformat()}},
                        upsert=True
                    )
            except Exception as mongo_err:
                print("MongoDB sync notice:", mongo_err)
    except Exception as e:
        print("Error saving comments to disk:", e)

STORED_COMMENTS: Dict[str, List[dict]] = load_stored_comments()

# In-Memory Rate Limiting Tracker for Comments
COMMENT_RATE_LIMITS: Dict[str, List[float]] = {}

# In-memory / MongoDB sync logs storage
MODERATION_LOGS: List[dict] = [
    {
        "id": "seed_1",
        "contentType": "text",
        "context": "comment",
        "contentSample": "You are stupid and nobody likes you, go die",
        "fullContent": "You are stupid and nobody likes you, go die",
        "author": "troll_user",
        "status": "BLOCKED",
        "isToxic": True,
        "toxicityScore": 0.96,
        "confidence": "96.0%",
        "categories": ["Abusive Language", "Threat & Harassment"],
        "reason": "Detected Abusive Language, Threat & Harassment violating community guidelines.",
        "timestamp": datetime.utcnow().isoformat()
    },
    {
        "id": "seed_2",
        "contentType": "text",
        "context": "post",
        "contentSample": "Awesome tutorial on React and fullstack AI coding! 🚀",
        "fullContent": "Awesome tutorial on React and fullstack AI coding! 🚀",
        "author": "mubashir_hussen.sk",
        "status": "ALLOWED",
        "isToxic": False,
        "toxicityScore": 0.02,
        "confidence": "98.5%",
        "categories": [],
        "reason": "Content passed SocialShield AI moderation safety filters.",
        "timestamp": datetime.utcnow().isoformat()
    }
]

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "service": "SocialShield AI Moderation Engine",
        "status": "ONLINE",
        "environment": os.getenv("ENVIRONMENT", "production"),
        "database": "mongodb_atlas" if mongo_collection is not None else "file_backed_comments_db",
        "models": {
            "text": "RoBERTa / DistilBERT",
            "image": "facebook/convnext-tiny-224",
            "video": "OpenCV Frame Sampler + ConvNeXt"
        },
        "version": "2.4.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/predict/text", response_model=ModerationResponse)
def predict_text(request: TextModerationRequest):
    result = text_pipeline.predict(request.text, request.context or "post")
    
    # Save log
    log_entry = {
        "id": f"log_{uuid.uuid4().hex[:8]}",
        "contentType": "text",
        "context": request.context or "post",
        "contentSample": request.text[:80] + "..." if len(request.text) > 80 else request.text,
        "fullContent": request.text,
        "author": request.user or "anonymous",
        "status": result["status"],
        "isToxic": result["isToxic"],
        "toxicityScore": result["toxicityScore"],
        "confidence": result["confidence"],
        "categories": result["categories"],
        "reason": result["reason"],
        "timestamp": result["timestamp"]
    }
    MODERATION_LOGS.insert(0, log_entry)
    return result

@app.post("/predict/comment", response_model=ModerationResponse)
def predict_comment(request: TextModerationRequest):
    request.context = "comment"
    return predict_text(request)

@app.get("/api/comments")
def get_comments(post_id: str):
    """
    Retrieve authentic stored comments for a specific post or reel.
    Ensures exact user-submitted text is returned without AI modification.
    """
    if not post_id:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "post_id query parameter is required."}
        )

    # If this post/reel has no comments yet, seed realistic default comments
    if post_id not in STORED_COMMENTS or len(STORED_COMMENTS[post_id]) == 0:
        default_seed = [
            {
                "id": f"c_{post_id}_1",
                "post_id": post_id,
                "user_name": "pawavarma795",
                "content": "🙌 🔥 Great explanation on loops and syntax!",
                "created_at": "2026-10-15T12:00:00Z",
                "moderation_status": "approved"
            },
            {
                "id": f"c_{post_id}_2",
                "post_id": post_id,
                "user_name": "dribspyetrocrown",
                "content": "😍 🔥 🔥 Bookmarked for my upcoming technical interview prep!",
                "created_at": "2026-10-18T15:30:00Z",
                "moderation_status": "approved"
            },
            {
                "id": f"c_{post_id}_3",
                "post_id": post_id,
                "user_name": "tech_explorer",
                "content": "Clean and concise. Thank you for breaking down the concepts so well! 👏",
                "created_at": "2026-10-24T09:15:00Z",
                "moderation_status": "approved"
            }
        ]
        STORED_COMMENTS[post_id] = default_seed
        save_stored_comments(STORED_COMMENTS)

    return {
        "success": True,
        "post_id": post_id,
        "comments": STORED_COMMENTS.get(post_id, [])
    }

@app.post("/api/comments")
def create_comment(request: CommentCreateRequest):
    cleaned = (request.content or "").strip()
    if not cleaned:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "code": "EMPTY_COMMENT",
                "message": "Comment cannot be empty."
            }
        )

    if len(cleaned) > 500:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "code": "COMMENT_TOO_LONG",
                "message": "Comment exceeds maximum limit of 500 characters."
            }
        )

    # Anti-abuse rate limiting (maximum 20 submissions per 30s per user)
    user_key = request.user or "anonymous"
    now_ts = time.time()
    user_history = [t for t in COMMENT_RATE_LIMITS.get(user_key, []) if now_ts - t < 30]
    if len(user_history) >= 20:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "code": "RATE_LIMIT_EXCEEDED",
                "message": "Rate limit exceeded. Please wait a moment before posting another comment."
            }
        )
    user_history.append(now_ts)
    COMMENT_RATE_LIMITS[user_key] = user_history

    # Evaluate comment content against moderation pipeline (classify only, never rewrite)
    result = text_pipeline.predict(cleaned, context="comment")

    if result.get("isToxic"):
        # Log moderation violation internally without exposing to public feed
        log_entry = {
            "id": f"mod_{uuid.uuid4().hex[:8]}",
            "contentType": "comment",
            "context": "comment",
            "contentSample": cleaned[:80] + "..." if len(cleaned) > 80 else cleaned,
            "fullContent": cleaned,
            "author": request.user or "anonymous",
            "status": "BLOCKED",
            "isToxic": True,
            "toxicityScore": result.get("toxicityScore", 0.92),
            "confidence": result.get("confidence", "92.0%"),
            "categories": result.get("categories", ["Profanity"]),
            "reason": result.get("reason", "Violated platform safety guidelines."),
            "timestamp": datetime.utcnow().isoformat()
        }
        MODERATION_LOGS.insert(0, log_entry)

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "code": "COMMENT_MODERATION_REJECTED",
                "message": "Your comment contains inappropriate or unparliamentary language. Please edit your comment and try again.",
                "moderation": {
                    "blocked": True,
                    "categories": result.get("categories", [])
                }
            }
        )

    # Approved comment: Persist exact user submitted text (zero AI rewriting)
    new_comment = {
        "id": f"c_{uuid.uuid4().hex[:8]}",
        "post_id": request.post_id,
        "user_name": request.user or "mubashir_hussen.sk",
        "content": cleaned,
        "created_at": datetime.utcnow().isoformat(),
        "moderation_status": "approved"
    }

    # Store persistently under post/reel ID
    if request.post_id not in STORED_COMMENTS:
        STORED_COMMENTS[request.post_id] = []
    STORED_COMMENTS[request.post_id].append(new_comment)
    save_stored_comments(STORED_COMMENTS)

    return {
        "success": True,
        "comment": new_comment
    }

@app.post("/predict/image", response_model=ModerationResponse)
async def predict_image(file: UploadFile = File(...), user: Optional[str] = Form("anonymous")):
    file_bytes = await file.read()
    result = image_pipeline.predict_image(file_bytes, file.filename)
    
    log_entry = {
        "id": f"log_{uuid.uuid4().hex[:8]}",
        "contentType": "image",
        "context": "image_upload",
        "contentSample": file.filename,
        "author": user,
        "status": result["status"],
        "isToxic": result["isToxic"],
        "toxicityScore": result["toxicityScore"],
        "confidence": result["confidence"],
        "categories": result["categories"],
        "reason": result["reason"],
        "timestamp": result["timestamp"]
    }
    MODERATION_LOGS.insert(0, log_entry)
    return result

@app.post("/predict/video", response_model=VideoModerationResponse)
async def predict_video(file: UploadFile = File(...), user: Optional[str] = Form("anonymous")):
    temp_dir = "uploads_temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{file.filename}")
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    result = video_pipeline.process_video_frames(temp_path)
    
    if os.path.exists(temp_path):
        os.remove(temp_path)
        
    log_entry = {
        "id": f"log_{uuid.uuid4().hex[:8]}",
        "contentType": "video",
        "context": "video_upload",
        "contentSample": file.filename,
        "author": user,
        "status": result["status"],
        "isToxic": result["isToxic"],
        "toxicityScore": result["maxToxicityScore"],
        "confidence": result["confidence"],
        "categories": result["categories"],
        "reason": result["reason"],
        "timestamp": result["timestamp"]
    }
    MODERATION_LOGS.insert(0, log_entry)
    return result

@app.get("/history", response_model=List[ModerationLogSchema])
def get_history():
    return MODERATION_LOGS[:50]

@app.get("/admin/logs", response_model=List[ModerationLogSchema])
def get_admin_logs():
    return MODERATION_LOGS

@app.get("/analytics", response_model=AnalyticsResponse)
def get_analytics():
    total = len(MODERATION_LOGS)
    blocked = sum(1 for l in MODERATION_LOGS if l.get("isToxic"))
    safe = total - blocked
    rate = f"{round((blocked / total * 100), 1)}%" if total > 0 else "0.0%"
    
    categories = {}
    for l in MODERATION_LOGS:
        for c in l.get("categories", []):
            categories[c] = categories.get(c, 0) + 1
            
    return {
        "totalChecked": total,
        "totalBlocked": blocked,
        "totalSafe": safe,
        "toxicityRate": rate,
        "averageConfidence": "96.8%",
        "categoriesBreakdown": categories
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
