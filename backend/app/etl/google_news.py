import requests
import os
import time
from ..database import SessionLocal
from ..models.models import NewsArticle
from ..utils.ai_helper import analyze_sentiment

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID")

def fetch_google_news(query: str, num_results: int = 10):
    if not GOOGLE_API_KEY or not SEARCH_ENGINE_ID:
        print("Google API credentials missing.")
        return

    url = "https://www.googleapis.com/customsearch/v1"
    
    # Simple loop to fetch results (handling pagination if needed, but keeping it simple for now)
    params = {
        'key': GOOGLE_API_KEY,
        'cx': SEARCH_ENGINE_ID,
        'q': query,
        'num': min(num_results, 10), # Max 10 per request
        'sort': 'date'
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'items' not in data:
            print("No items found or API error:", data)
            return

        db = SessionLocal()
        count = 0
        
        for item in data['items']:
            link = item.get('link')
            
            # Check for duplicates
            existing = db.query(NewsArticle).filter(NewsArticle.original_url == link).first()
            if existing:
                continue
                
            title = item.get('title')
            snippet = item.get('snippet')
            
            # AI Analysis
            ai_result = analyze_sentiment(f"{title}. {snippet}")
            
            article = NewsArticle(
                title=title,
                content=snippet,
                original_url=link,
                source=item.get('displayLink'),
                sentiment_score=ai_result['sentiment_score'],
                sentiment_label=ai_result['sentiment_label'],
                confidence_level=ai_result['confidence_level'],
                highlighted_keywords=ai_result['highlighted_keywords']
            )
            
            db.add(article)
            count += 1
            
        db.commit()
        db.close()
        print(f"Successfully added {count} news articles for query: {query}")
        
    except Exception as e:
        print(f"Error fetching Google News: {e}")

