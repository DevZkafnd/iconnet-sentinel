import requests
import os
from ..database import SessionLocal
from ..models.models import SocialPost, SocialComment
from ..utils.ai_helper import analyze_sentiment
from ..utils.text_cleaner import is_garbage_content, is_relevant_content
from ..scrapers.instagram import get_instagram_comments, get_instagram_posts_by_hashtags, normalize_hashtag, get_latest_posts_from_profiles
from ..scrapers.youtube import search_videos_by_queries, get_youtube_comments
from ..scrapers.tiktok import search_videos as search_tiktok_videos, get_tiktok_comments
from ..scrapers.twitter import get_twitter_replies
from datetime import datetime
import re
import asyncio

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def classify_content(text: str, directors_data: list):
    """
    Classify content into Director and Product based on keywords.
    """
    if not text:
        return None, None
        
    text_lower = text.lower()
    
    # Priority 1: Director Name
    for d in directors_data:
        if d["name"].lower() in text_lower:
            return d["name"], d["product"]
            
    # Priority 2: Product Name
    for d in directors_data:
        if d["product"].lower() in text_lower:
            return d["name"], d["product"]
            
    # Priority 3: Keywords
    for d in directors_data:
        for k in d["keywords"]:
            if k.lower() in text_lower:
                return d["name"], d["product"]
                
    return None, None

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

    # Directors and Keywords (Updated to be more specific)
    directors = [
        {
            "name": "Chipta Perdana", 
            "role": "Direktur Utama",
            "product": "ICONNET",
            "keywords": ["Ekspansi Jaringan", "Strategi Korporat", "Jaringan Internet", "Broadband Rumah", "Transformasi Digital"]
        },
        {
            "name": "Aditya Syarief", 
            "role": "Direktur Perencanaan & Pengembangan",
            "product": "Konektivitas MPLS",
            "keywords": ["Perencanaan Strategis", "Pengembangan Bisnis", "Jaringan Serat Optik", "Infrastruktur Telekomunikasi", "Smart City"]
        },
        {
            "name": "Lintje Lumembang", 
            "role": "Direktur Pelayanan TI",
            "product": "PV Rooftop",
            "keywords": ["Pelayanan TI", "Solusi Digital", "Aplikasi PLN", "Digitalisasi Layanan", "Green Energy"]
        },
        {
            "name": "Joyce Lanny Wantannia", 
            "role": "Direktur Niaga & Pemasaran",
            "product": "Pemasaran Digital",
            "keywords": ["Strategi Niaga", "Penjualan ICONNET", "Layanan Pelanggan", "Customer Experience", "Bundling Internet"]
        },
        {
            "name": "Nyoman Ngurah Widyatnya", 
            "role": "Direktur Keuangan & Man Risk",
            "product": "Manajemen Aset",
            "keywords": ["Kinerja Keuangan", "Manajemen Risiko", "Efisiensi Biaya", "Aset Perusahaan", "Pendapatan Usaha", "Laba Perusahaan"]
        },
        {
            "name": "Soffin Hadi", 
            "role": "Direktur Operasi",
            "product": "Managed Service",
            "keywords": ["Operasional Jaringan", "Pemeliharaan Sistem", "Gangguan Layanan", "Service Level Agreement", "NOC"]
        },
        {
            "name": "Dedi Budi Utomo", 
            "role": "Direktur MHC",
            "product": "Talent Management",
            "keywords": ["Human Capital", "Pengembangan SDM", "Budaya Perusahaan", "Pelatihan Pegawai", "Rekrutmen"]
        }
    ]
    
    # Focus: YouTube Comments (Limit total 5 posts, min 3 comments each)
    db = SessionLocal()
    max_total_posts = 5
    collected = 0
    
    # Build YouTube queries: company + directors + products (Indonesia scope implied)
    base_queries = ["PLN Icon Plus", "ICONNET", "Icon Plus Indonesia", "PLN Icon Plus Indonesia"]
    director_queries = []
    for d in directors:
        k_str = " ".join(d["keywords"])
        director_queries.append(f'{d["name"]} {d["role"]} {d["product"]} {k_str}')
    final_queries = base_queries + director_queries
    
    print(f"Searching YouTube videos for queries: {final_queries[:4]} ...")
    videos = search_videos_by_queries(final_queries, max_results_total=50)
    print(f"Found {len(videos)} videos. Processing...")
    
    for v in videos:
        if collected >= max_total_posts:
            break
        
        link = v["url"]
        title = v.get("title", "") or ""
        username = v.get("channel", "Unknown")
        created_at = datetime.now()
        comments_raw = get_youtube_comments(link, max_comments=10)
        # Strict: require at least 3 comments
        comments = [c for c in comments_raw if c.get("content")][:10]
        
        print(f"Video: {title[:30]}... | Comments: {len(comments)}")

        if len(comments) < 3:
            continue
        
        # Duplicate check
        if db.query(SocialPost).filter(SocialPost.original_url == link).first():
            continue
        
        # Strict relevance
        context_text = f"{title} {username}"
        if not is_relevant_content(context_text):
            pass
            
        # Classify Director/Product
        director_name, product_name = classify_content(title, directors)

        # Create post (YouTube video title as content; komentar disimpan di bawah)
        ai_result = analyze_sentiment(title[:1000])
        post = SocialPost(
            platform="YouTube",
            author=username,
            content=title,
            original_url=link,
            post_date=created_at,
            sentiment_score=ai_result['sentiment_score'],
            sentiment_label=ai_result['sentiment_label'],
            confidence_level=ai_result['confidence_level'],
            highlighted_keywords=ai_result['highlighted_keywords'],
            director=director_name,
            product=product_name
        )
        
        db.add(post)
        db.commit()
        db.refresh(post)
        
        # Strict: keep only if comments exist
        if not comments:
            db.delete(post)
            db.commit()
            continue
        
        comment_sentiments = []
        for c in comments:
            c_content = c.get("content", "")
            if not c_content:
                continue
            c_ai = analyze_sentiment(c_content)
            comment_sentiments.append(c_ai['sentiment_score'])
            
            new_comment = SocialComment(
                social_post_id=post.id,
                author=c.get("author", "Unknown"),
                content=c_content,
                created_at=datetime.now(),
                sentiment_label=c_ai['sentiment_label'],
                sentiment_score=c_ai['sentiment_score']
            )
            # Attempt to set external reference (commentId) and URL if schema supports it
            try:
                setattr(new_comment, "external_ref", c.get("external_ref"))
                setattr(new_comment, "external_url", c.get("external_url"))
            except Exception:
                pass
            db.add(new_comment)
        
        if comment_sentiments:
            avg_score = sum(comment_sentiments) / len(comment_sentiments)
            post.sentiment_score = avg_score
            if avg_score >= 0.05:
                post.sentiment_label = "Positive"
            elif avg_score <= -0.05:
                post.sentiment_label = "Negative"
            else:
                post.sentiment_label = "Neutral"
        
        db.commit()
        collected += 1

    # --- TIKTOK SECTION ---
    print("--- [Social Worker] Starting TikTok Scraping ---")
    
    async def process_tiktok():
        tiktok_collected = 0
        tiktok_target = 3
        
        # Use broad queries
        queries = ["ICONNET", "PLN Icon Plus"]
        seen_urls = set()
        
        for query in queries:
            if tiktok_collected >= tiktok_target:
                break
                
            print(f"[TikTok Worker] Searching for: {query}")
            try:
                # Search videos (Get top 20 to find high engagement ones)
                video_urls = await search_tiktok_videos(query, max_results=20)
                
                for link in video_urls:
                    if tiktok_collected >= tiktok_target:
                        break
                    if link in seen_urls:
                        continue
                    seen_urls.add(link)
                    
                    # Duplicate check
                    if db.query(SocialPost).filter(SocialPost.original_url == link).first():
                        print(f"[TikTok Worker] Skipping duplicate: {link}")
                        continue
                        
                    # Get Comments (Check priority)
                    comments_data = await get_tiktok_comments(link, max_comments=20)
                    
                    if not comments_data:
                        print(f"[TikTok Worker] No comments for {link}, skipping (Priority Rule).")
                        continue
                        
                    print(f"[TikTok Worker] Found {len(comments_data)} comments for {link}. Processing...")
                    
                    title = f"TikTok Video: {query}" 
                    
                    # Classify based on comments content + query
                    full_text = f"{title} " + " ".join([c.get('text', '') for c in comments_data])
                    director_name, product_name = classify_content(full_text, directors)
                    
                    # Analyze Sentiment
                    ai_result = analyze_sentiment(full_text[:1000])
                    
                    post = SocialPost(
                        platform="TikTok",
                        author="Unknown", 
                        content=title,
                        original_url=link,
                        post_date=datetime.now(),
                        sentiment_score=ai_result['sentiment_score'],
                        sentiment_label=ai_result['sentiment_label'],
                        confidence_level=ai_result['confidence_level'],
                        highlighted_keywords=ai_result['highlighted_keywords'],
                        director=director_name,
                        product=product_name
                    )
                    
                    db.add(post)
                    db.commit()
                    db.refresh(post)
                    
                    # Save Comments
                    comment_sentiments = []
                    for c in comments_data:
                        c_text = c.get("text", "")
                        if not c_text: continue
                        
                        c_ai = analyze_sentiment(c_text)
                        comment_sentiments.append(c_ai['sentiment_score'])
                        
                        new_comment = SocialComment(
                            social_post_id=post.id,
                            author=c.get("username", "Unknown"),
                            content=c_text,
                            created_at=datetime.now(),
                            sentiment_label=c_ai['sentiment_label'],
                            sentiment_score=c_ai['sentiment_score']
                        )
                        db.add(new_comment)
                        
                    # Update Post Sentiment
                    if comment_sentiments:
                        avg = sum(comment_sentiments) / len(comment_sentiments)
                        post.sentiment_score = avg
                        if avg >= 0.05: post.sentiment_label = "Positive"
                        elif avg <= -0.05: post.sentiment_label = "Negative"
                        else: post.sentiment_label = "Neutral"
                        
                    db.commit()
                    tiktok_collected += 1
                    
            except Exception as e:
                print(f"[TikTok Worker] Error processing query {query}: {e}")
                
    try:
        asyncio.run(process_tiktok())
    except Exception as e:
        print(f"[TikTok Worker] Fatal error: {e}")
    
    db.close()
    print(f"--- [Social Worker] Finished (YouTube + TikTok) ---")
