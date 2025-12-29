import requests
import os
from ..database import SessionLocal
from ..models.models import SocialPost
from ..utils.ai_helper import analyze_sentiment
from ..utils.text_cleaner import is_garbage_content, is_relevant_content
from datetime import datetime
import re

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def is_valid_post_url(url: str, platform: str) -> bool:
    """
    Validates if the URL is a specific post, not a profile or generic page.
    """
    url_lower = url.lower()
    
    if platform == "Instagram":
        # Matches /p/ (post), /reel/, /tv/
        # Excludes profile root (instagram.com/username) or /explore/
        if "/p/" in url_lower or "/reel/" in url_lower or "/tv/" in url_lower:
            return True
        return False
        
    elif platform == "Facebook":
        # Matches /posts/, /permalink.php, /videos/, /watch/, /photos/
        # Excludes facebook.com/groups/ID (without post ID) or facebook.com/username
        if any(x in url_lower for x in ["/posts/", "/permalink.php", "/videos/", "/watch/", "/photo", "/story.php"]):
            return True
        # Allow specific group posts (groups/ID/posts/ID)
        if "/groups/" in url_lower and "/user/" not in url_lower and "/permalink/" in url_lower:
            return True
        return False
        
    elif platform == "Twitter":
        # Matches /status/
        if "/status/" in url_lower:
            return True
        return False
        
    elif platform == "LinkedIn":
        # Matches /posts/, /activity/, /pulse/
        if any(x in url_lower for x in ["/posts/", "/activity/", "/pulse/"]):
            return True
        return False
        
    return False # Unknown platform or invalid URL structure
SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID")

def run_social_worker():
    print("--- [Social Worker] Started ---")
    
    if not GOOGLE_API_KEY or not SEARCH_ENGINE_ID:
        print("Google API credentials missing.")
        return

    # Directors and Keywords (Updated to be more specific)
    directors = [
        {"name": "Chipta Perdana", "keywords": ["ICONNET", "Ekspansi Jaringan", "Strategi Korporat", "Jaringan Internet", "Broadband Rumah", "Transformasi Digital"]},
        {"name": "Aditya Syarief", "keywords": ["Perencanaan Strategis", "Pengembangan Bisnis", "Konektivitas MPLS", "Jaringan Serat Optik", "Infrastruktur Telekomunikasi", "Smart City"]},
        {"name": "Lintje Lumembang", "keywords": ["Pelayanan TI", "Solusi Digital", "Aplikasi PLN", "Digitalisasi Layanan", "PV Rooftop", "Green Energy"]},
        {"name": "Joyce Lanny Wantannia", "keywords": ["Pemasaran Digital", "Strategi Niaga", "Penjualan ICONNET", "Layanan Pelanggan", "Customer Experience", "Bundling Internet"]},
        {"name": "Nyoman Ngurah Widyatnya", "keywords": ["Kinerja Keuangan", "Manajemen Risiko", "Efisiensi Biaya", "Aset Perusahaan", "Pendapatan Usaha", "Laba Perusahaan"]},
        {"name": "Soffin Hadi", "keywords": ["Operasional Jaringan", "Managed Service", "Pemeliharaan Sistem", "Gangguan Layanan", "Service Level Agreement", "NOC"]},
        {"name": "Dedi Budi Utomo", "keywords": ["Human Capital", "Pengembangan SDM", "Budaya Perusahaan", "Pelatihan Pegawai", "Talent Management", "Rekrutmen"]}
    ]
    
    # Base queries
    base_queries = ["PLN Icon Plus", "ICONNET"]
    
    queries = []
    # Add base queries targeted at social media
    for q in base_queries:
        queries.append(f'site:instagram.com OR site:facebook.com OR site:twitter.com OR site:linkedin.com "{q}"')
        
    # Add director queries
    for d in directors:
        k_str = " OR ".join([f'"{k}"' for k in d["keywords"]])
        # site:instagram.com ... "Chipta Perdana" (Ekspansi OR ...)
        queries.append(f'site:instagram.com OR site:facebook.com OR site:twitter.com OR site:linkedin.com "{d["name"]}" ({k_str})')

    url = "https://www.googleapis.com/customsearch/v1"
    db = SessionLocal()
    
    for query in queries:
        print(f"Social Search for: {query}")
        params = {
            'key': GOOGLE_API_KEY,
            'cx': SEARCH_ENGINE_ID,
            'q': query,
            'num': 5,
            'sort': 'date'
        }
        
        try:
            response = requests.get(url, params=params)
            data = response.json()
            
            if 'items' not in data:
                continue

            for item in data['items']:
                link = item.get('link')
                
                # Check duplicates
                if db.query(SocialPost).filter(SocialPost.original_url == link).first():
                    continue
                
                title = item.get('title')
                snippet = item.get('snippet')
                
                # Determine platform
                platform = "Unknown"
                if "instagram.com" in link: platform = "Instagram"
                elif "facebook.com" in link: platform = "Facebook"
                elif "twitter.com" in link or "x.com" in link: platform = "Twitter"
                elif "linkedin.com" in link: platform = "LinkedIn"
                
                # Filter out profile/generic links
                if not is_valid_post_url(link, platform):
                    print(f"Skipping generic/profile URL: {link}")
                    continue

                # Use snippet as content since scraping social media is hard without auth
                content = f"{title}. {snippet}"
                
                # Check for garbage content (e.g. JS errors)
                if is_garbage_content(content):
                    print(f"Skipping garbage content: {link}")
                    continue
                    
                # Strict Relevance Check
                if not is_relevant_content(content):
                    print(f"Skipping irrelevant social content: {content[:30]}...")
                    continue
                
                # AI Analysis
                ai_result = analyze_sentiment(content)
                
                post = SocialPost(
                    platform=platform,
                    author="Unknown", # Hard to extract from search result reliably
                    content=content,
                    original_url=link,
                    post_date=datetime.now(), # Default to collection time
                    sentiment_score=ai_result['sentiment_score'],
                    sentiment_label=ai_result['sentiment_label'],
                    confidence_level=ai_result['confidence_level'],
                    highlighted_keywords=ai_result['highlighted_keywords']
                )
                
                db.add(post)
                db.commit()
                print(f"Saved Social Post: {link}")
                
        except Exception as e:
            print(f"Error in Social Worker for {query}: {e}")
            
    db.close()
    print("--- [Social Worker] Finished ---")
