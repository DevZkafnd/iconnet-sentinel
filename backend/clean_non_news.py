from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import models

def clean_non_news():
    db = SessionLocal()
    print("--- Cleaning Non-News Data ---")
    
    trusted_sites = [
        "detik.com", "kompas.com", "tribunnews.com", "cnnindonesia.com", 
        "cnbcindonesia.com", "liputan6.com", "tempo.co", "antaranews.com", 
        "suara.com", "jawapos.com", "bisnis.com", "kumparan.com",
        "okezone.com", "sindonews.com", "merdeka.com", "republika.co.id"
    ]
    
    # 1. Clean News Articles
    news_items = db.query(models.NewsArticle).all()
    deleted_news = 0
    
    for item in news_items:
        url = item.original_url.lower()
        is_trusted = False
        
        for site in trusted_sites:
            if site in url:
                is_trusted = True
                break
        
        # Also allow subdomains/variations if clearly news
        # But user requested "berita seperti detik, kompas dll", so strict is better for now
        # to ensure "bukan web yang lainnya"
        
        if not is_trusted:
            print(f"Deleting Non-News/Untrusted URL: {item.original_url}")
            db.delete(item)
            deleted_news += 1
            
    db.commit()
    db.close()
    
    print(f"--- Cleanup Finished ---")
    print(f"News Deleted: {deleted_news}")

if __name__ == "__main__":
    clean_non_news()
