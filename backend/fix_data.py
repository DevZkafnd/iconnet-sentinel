from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import models
from app.utils.ai_helper import analyze_sentiment
from app.workers.social_worker import is_valid_post_url

def fix_data():
    db = SessionLocal()
    print("--- Starting Data Fix & Purge ---")
    
    # 1. Purge Invalid Social Posts
    social_posts = db.query(models.SocialPost).all()
    deleted_social = 0
    updated_social = 0
    
    for post in social_posts:
        platform = post.platform
        # Validate URL
        if not is_valid_post_url(post.original_url, platform):
            print(f"Deleting invalid Social URL: {post.original_url}")
            db.delete(post)
            deleted_social += 1
            continue
            
        # Re-analyze Sentiment
        new_analysis = analyze_sentiment(post.content)
        if new_analysis['sentiment_score'] != post.sentiment_score:
            post.sentiment_score = new_analysis['sentiment_score']
            post.sentiment_label = new_analysis['sentiment_label']
            post.confidence_level = new_analysis['confidence_level']
            post.highlighted_keywords = new_analysis['highlighted_keywords']
            updated_social += 1
            
    # 2. Purge/Fix News Articles
    # News might contain social links too if Google indexed them
    news_articles = db.query(models.NewsArticle).all()
    deleted_news = 0
    updated_news = 0
    
    for article in news_articles:
        url = article.original_url.lower()
        
        # Check if it's actually a social profile disguised as news
        is_social_profile = False
        if "instagram.com" in url and "/p/" not in url and "/reel/" not in url: is_social_profile = True
        if "facebook.com" in url and "/posts/" not in url and "permalink" not in url: is_social_profile = True
        if "twitter.com" in url and "/status/" not in url: is_social_profile = True
        
        if is_social_profile:
             print(f"Deleting News item that is Social Profile: {article.original_url}")
             db.delete(article)
             deleted_news += 1
             continue
             
        # Re-analyze Sentiment
        # Combine title + content for better context if content is short
        text_to_analyze = f"{article.title}. {article.content[:500]}"
        new_analysis = analyze_sentiment(text_to_analyze)
        
        if new_analysis['sentiment_score'] != article.sentiment_score:
            article.sentiment_score = new_analysis['sentiment_score']
            article.sentiment_label = new_analysis['sentiment_label']
            article.confidence_level = new_analysis['confidence_level']
            article.highlighted_keywords = new_analysis['highlighted_keywords']
            updated_news += 1

    db.commit()
    db.close()
    
    print(f"--- Fix Finished ---")
    print(f"Social: {deleted_social} deleted, {updated_social} re-analyzed")
    print(f"News: {deleted_news} deleted, {updated_news} re-analyzed")

if __name__ == "__main__":
    fix_data()
