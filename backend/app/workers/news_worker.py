import requests
import os
import trafilatura
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.models import NewsArticle
from ..utils.ai_helper import analyze_sentiment
from ..utils.text_cleaner import is_garbage_content, clean_text, is_relevant_content
from datetime import datetime

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SEARCH_ENGINE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID")

def fetch_full_content(url: str) -> str:
    """
    Uses Trafilatura to extract main text from a news URL.
    """
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded:
            result = trafilatura.extract(downloaded)
            return result if result else ""
    except Exception as e:
        print(f"Error extracting content from {url}: {e}")
    return ""

def run_news_worker():
    print("--- [News Worker] Started ---")
    if not GOOGLE_API_KEY or not SEARCH_ENGINE_ID:
        print("Google API credentials missing.")
        return

    # Set Proxy for Trafilatura/Requests if available
    proxy_string = os.getenv("PROXY_STRING")
    if proxy_string:
        os.environ["HTTP_PROXY"] = proxy_string
        os.environ["HTTPS_PROXY"] = proxy_string
        print(f"Using Proxy: {proxy_string.split('@')[-1]}") # Log host:port only

    keywords = ["PLN Icon Plus", "ICONNET", "Direktur PLN Icon Plus", "Gangguan Iconnet"]
    
    # Whitelist of trusted Indonesian news domains
    # Using 'site:' operator to restrict results
    trusted_sites = [
        "detik.com", "kompas.com", "tribunnews.com", "cnnindonesia.com", 
        "cnbcindonesia.com", "liputan6.com", "tempo.co", "antaranews.com", 
        "suara.com", "jawapos.com", "bisnis.com", "kumparan.com",
        "okezone.com", "sindonews.com", "merdeka.com", "republika.co.id"
    ]
    
    # Construct the site filter string: (site:A OR site:B OR ...)
    site_filter = "(" + " OR ".join([f"site:{site}" for site in trusted_sites]) + ")"
    
    final_keywords = []
    
    # Add base keywords with site filter
    for k in keywords:
        final_keywords.append(f'{k} {site_filter}')
        
    # Director specific keywords (Updated to be more specific)
    directors = [
        {"name": "Chipta Perdana", "keywords": ["ICONNET", "Ekspansi Jaringan", "Strategi Korporat", "Jaringan Internet", "Broadband Rumah", "Transformasi Digital"]},
        {"name": "Aditya Syarief", "keywords": ["Perencanaan Strategis", "Pengembangan Bisnis", "Konektivitas MPLS", "Jaringan Serat Optik", "Infrastruktur Telekomunikasi", "Smart City"]},
        {"name": "Lintje Lumembang", "keywords": ["Pelayanan TI", "Solusi Digital", "Aplikasi PLN", "Digitalisasi Layanan", "PV Rooftop", "Green Energy"]},
        {"name": "Joyce Lanny Wantannia", "keywords": ["Pemasaran Digital", "Strategi Niaga", "Penjualan ICONNET", "Layanan Pelanggan", "Customer Experience", "Bundling Internet"]},
        {"name": "Nyoman Ngurah Widyatnya", "keywords": ["Kinerja Keuangan", "Manajemen Risiko", "Efisiensi Biaya", "Aset Perusahaan", "Pendapatan Usaha", "Laba Perusahaan"]},
        {"name": "Soffin Hadi", "keywords": ["Operasional Jaringan", "Managed Service", "Pemeliharaan Sistem", "Gangguan Layanan", "Service Level Agreement", "NOC"]},
        {"name": "Dedi Budi Utomo", "keywords": ["Human Capital", "Pengembangan SDM", "Budaya Perusahaan", "Pelatihan Pegawai", "Talent Management", "Rekrutmen"]}
    ]

    # Add director queries with site filter
    for d in directors:
        # Construct query: "Name" AND (Keyword1 OR Keyword2 ...) AND (site:...)
        k_str = " OR ".join([f'"{k}"' for k in d["keywords"]])
        query = f'"{d["name"]}" ({k_str}) {site_filter}'
        final_keywords.append(query)

    # Quota Safety: 11 queries/run.
    
    url = "https://www.googleapis.com/customsearch/v1"
    
    db: Session = SessionLocal()
    
    for query in final_keywords:
        print(f"Searching for: {query}")
        params = {
            'key': GOOGLE_API_KEY,
            'cx': SEARCH_ENGINE_ID,
            'q': query,
            'num': 5, # Limit to save quota/storage
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
                if db.query(NewsArticle).filter(NewsArticle.original_url == link).first():
                    continue
                    
                title = item.get('title')
                snippet = item.get('snippet')
                
                # Extract Full Content (Trafilatura)
                full_content = fetch_full_content(link)
                
                # Validate content quality
                if is_garbage_content(full_content):
                    print(f"Garbage content detected for {link}, falling back to snippet.")
                    full_content = "" 
                else:
                    full_content = clean_text(full_content)
                
                # Strict Relevance Check
                # Combine title, snippet, and content to check if it's actually about our company/directors
                combined_text_for_check = f"{title} {snippet} {full_content}"
                if not is_relevant_content(combined_text_for_check):
                    print(f"Skipping irrelevant content: {title}")
                    continue

                content_to_analyze = f"{title}. {snippet} {full_content[:1000]}" # Limit context
                
                # AI Analysis (Sentiment & Keywords)
                ai_result = analyze_sentiment(content_to_analyze)
                
                article = NewsArticle(
                    title=title,
                    content=full_content if full_content else snippet,
                    source=item.get('displayLink'),
                    original_url=link,
                    published_date=datetime.now(), # Default to collection time
                    sentiment_score=ai_result['sentiment_score'],
                    sentiment_label=ai_result['sentiment_label'],
                    confidence_level=ai_result['confidence_level'],
                    highlighted_keywords=ai_result['highlighted_keywords']
                )
                
                db.add(article)
                db.commit()
                print(f"Saved: {title[:30]}...")
                
        except Exception as e:
            print(f"Error in News Worker for {query}: {e}")
            
    db.close()
    print("--- [News Worker] Finished ---")
