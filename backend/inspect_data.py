from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import models

def inspect_db():
    db = SessionLocal()
    print("--- Database Inspection ---")
    
    print("\n[Latest News Articles]")
    news = db.query(models.NewsArticle).order_by(models.NewsArticle.id.desc()).limit(5).all()
    for n in news:
        print(f"ID: {n.id}")
        print(f"Title: {n.title}")
        print(f"URL: {n.original_url}")
        print(f"Sentiment: {n.sentiment_label} ({n.sentiment_score})")
        print("-" * 20)

    print("\n[Latest Social Posts]")
    social = db.query(models.SocialPost).order_by(models.SocialPost.id.desc()).limit(5).all()
    for s in social:
        print(f"ID: {s.id}")
        print(f"Platform: {s.platform}")
        print(f"Content: {s.content[:50]}...")
        print(f"URL: {s.original_url}")
        print(f"Sentiment: {s.sentiment_label} ({s.sentiment_score})")
        print("-" * 20)

    db.close()

if __name__ == "__main__":
    inspect_db()
