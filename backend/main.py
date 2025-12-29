from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import threading

from app.database import engine, get_db
from app.models import models
from app.scheduler import start_scheduler
from app.workers.news_worker import run_news_worker
from app.workers.social_worker import run_social_worker

# Initialize DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Iconnet Sentinel API", description="Backend for Reputation Monitoring System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Start Scheduler on App Startup
@app.on_event("startup")
def on_startup():
    start_scheduler()

@app.get("/")
def read_root():
    return {"message": "Iconnet Sentinel Backend API (Scheduler Active)"}

# --- PRESENTATION LAYER: API Endpoints ---

@app.get("/api/news")
def get_news(
    skip: int = 0, 
    limit: int = 20, 
    sentiment: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get paginated news articles with optional sentiment filter.
    """
    query = db.query(models.NewsArticle)
    if sentiment:
        query = query.filter(models.NewsArticle.sentiment_label == sentiment)
    
    results = query.order_by(models.NewsArticle.published_date.desc()).offset(skip).limit(limit).all()
    return results

@app.get("/api/social")
def get_social_posts(
    skip: int = 0, 
    limit: int = 20, 
    platform: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get paginated social media posts.
    """
    query = db.query(models.SocialPost)
    if platform:
        query = query.filter(models.SocialPost.platform == platform)
        
    results = query.order_by(models.SocialPost.post_date.desc()).offset(skip).limit(limit).all()
    return results

@app.get("/api/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Aggregate statistics for the Dashboard KPI cards.
    """
    total_news = db.query(models.NewsArticle).count()
    total_social = db.query(models.SocialPost).count()
    
    # Simple sentiment aggregation (Example)
    pos_news = db.query(models.NewsArticle).filter(models.NewsArticle.sentiment_label == "Positive").count()
    neg_news = db.query(models.NewsArticle).filter(models.NewsArticle.sentiment_label == "Negative").count()
    
    return {
        "total_mentions": total_news + total_social,
        "total_news": total_news,
        "total_social": total_social,
        "sentiment_breakdown": {
            "positive": pos_news,
            "negative": neg_news,
            "neutral": total_news - (pos_news + neg_news)
        }
    }

# --- TRIGGER ENDPOINTS (For Manual Testing) ---

@app.post("/force-run/news")
def force_news():
    thread = threading.Thread(target=run_news_worker)
    thread.start()
    return {"message": "News Worker started manually"}

@app.post("/force-run/social")
def force_social():
    thread = threading.Thread(target=run_social_worker)
    thread.start()
    return {"message": "Social Worker started manually"}
