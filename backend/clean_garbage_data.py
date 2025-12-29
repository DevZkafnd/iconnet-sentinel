from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import models
from app.utils.text_cleaner import is_garbage_content

def clean_database():
    db = SessionLocal()
    print("--- Starting Database Cleanup ---")
    
    # 1. Clean News Articles
    news_items = db.query(models.NewsArticle).all()
    deleted_news = 0
    updated_news = 0
    
    for item in news_items:
        # Check if content is garbage
        if is_garbage_content(item.content):
            print(f"Found garbage in News: {item.id} - {item.original_url}")
            # If the content is garbage, we can try to "repair" it by setting content = title
            # OR delete it if it's useless. 
            # Strategy: If title is okay, keep it but clear content.
            
            if not is_garbage_content(item.title):
                item.content = item.title # Fallback to title
                updated_news += 1
            else:
                db.delete(item)
                deleted_news += 1
                
    # 2. Clean Social Posts
    social_items = db.query(models.SocialPost).all()
    deleted_social = 0
    updated_social = 0
    
    for item in social_items:
        if is_garbage_content(item.content):
            print(f"Found garbage in Social: {item.id} - {item.original_url}")
            # Social posts usually have content=title in our new worker, so if it's garbage, it's likely all garbage
            # But let's check if we can salvage
            if item.platform == "Instagram" or item.platform == "Twitter":
                 # If it's the specific JS error, just delete it because we probably missed the real post
                 db.delete(item)
                 deleted_social += 1
            else:
                 db.delete(item)
                 deleted_social += 1

    db.commit()
    db.close()
    
    print(f"--- Cleanup Finished ---")
    print(f"News: {deleted_news} deleted, {updated_news} repaired")
    print(f"Social: {deleted_social} deleted")

if __name__ == "__main__":
    clean_database()
