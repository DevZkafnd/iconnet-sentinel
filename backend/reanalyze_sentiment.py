import os
import sys
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import NewsArticle, SocialPost, SocialComment
from app.utils.sentiment_trainer import sentiment_analyzer
from app.utils.ai_helper import extract_keywords

def reanalyze_all():
    print("Starting sentiment re-analysis for all existing data...")
    
    # Ensure model is loaded
    if not sentiment_analyzer.is_loaded:
        sentiment_analyzer.load_model()
        
    db: Session = SessionLocal()
    
    try:
        # 1. Update News Articles
        articles = db.query(NewsArticle).all()
        print(f"Found {len(articles)} news articles.")
        for article in articles:
            if article.content:
                result = sentiment_analyzer.predict(article.content)
                if result:
                    article.sentiment_label = result['label']
                    article.sentiment_score = result['score']
                    article.confidence_level = result['confidence']
                    # Also refresh keywords if needed, but let's stick to sentiment for now
                    # article.highlighted_keywords = extract_keywords(article.content)
        
        # 2. Update Social Posts
        posts = db.query(SocialPost).all()
        print(f"Found {len(posts)} social posts.")
        for post in posts:
            if post.content:
                result = sentiment_analyzer.predict(post.content)
                if result:
                    post.sentiment_label = result['label']
                    post.sentiment_score = result['score']
                    post.confidence_level = result['confidence']

        # 3. Update Social Comments
        comments = db.query(SocialComment).all()
        print(f"Found {len(comments)} social comments.")
        for comment in comments:
            if comment.content:
                result = sentiment_analyzer.predict(comment.content)
                if result:
                    comment.sentiment_label = result['label']
                    comment.sentiment_score = result['score']
                    # SocialComment schema might not have confidence_level, based on previous check
                    
        db.commit()
        print("Successfully updated sentiment for all records.")
        
    except Exception as e:
        print(f"Error during re-analysis: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reanalyze_all()
