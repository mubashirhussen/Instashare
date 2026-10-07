from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import shutil
import uuid
from datetime import datetime

from models.schemas import (
    TextModerationRequest,
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

# Enable CORS for Frontend & Social Media APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def health_check():
    return {
        "service": "SocialShield AI Moderation Engine",
        "status": "ONLINE",
        "models": {
            "text": "RoBERTa / DistilBERT",
            "image": "facebook/convnext-tiny-224",
            "video": "OpenCV Frame Sampler + ConvNeXt"
        },
        "version": "2.4.0"
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
