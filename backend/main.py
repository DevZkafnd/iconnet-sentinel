from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import text, func
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
    try:
        with engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE social_comments ADD COLUMN external_ref VARCHAR NULL;"))
                conn.commit()
            except Exception:
                pass
            try:
                conn.execute(text("ALTER TABLE social_comments ADD COLUMN external_url VARCHAR NULL;"))
                conn.commit()
            except Exception:
                pass
            try:
                conn.execute(text("ALTER TABLE social_posts ADD COLUMN director VARCHAR NULL;"))
                conn.commit()
            except Exception:
                pass
            try:
                conn.execute(text("ALTER TABLE social_posts ADD COLUMN product VARCHAR NULL;"))
                conn.commit()
            except Exception:
                pass
    except Exception as e:
        print(f"Schema migration skipped/failed: {e}")

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
    Get paginated social media posts with their comments.
    """
    query = db.query(models.SocialPost).options(joinedload(models.SocialPost.comments))
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
    
    # Director Breakdown (Social Only for now)
    director_stats = {}
    directors_query = db.query(models.SocialPost.director, func.count(models.SocialPost.id)).group_by(models.SocialPost.director).all()
    for d, count in directors_query:
        if d:
            director_stats[d] = count
            
    # Product Breakdown (Social Only for now)
    product_stats = {}
    products_query = db.query(models.SocialPost.product, func.count(models.SocialPost.id)).group_by(models.SocialPost.product).all()
    for p, count in products_query:
        if p:
            product_stats[p] = count

    return {
        "total_mentions": total_news + total_social,
        "total_news": total_news,
        "total_social": total_social,
        "sentiment_breakdown": {
            "positive": pos_news,
            "negative": neg_news,
            "neutral": total_news - (pos_news + neg_news)
        },
        "director_breakdown": director_stats,
        "product_breakdown": product_stats
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
