import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv()

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.scrapers.tiktok import get_tiktok_comments, search_videos

# Example Keywords (Company, Director, Product)
TEST_KEYWORDS = ["Iconnet", "PLN Icon Plus", "Internet Iconnet"]

async def main():
    print("Testing TikTok Scraper...")
    
    # Check if PROXY is set (optional, just for debug info)
    proxy = os.getenv("PROXY_STRING")
    print(f"Environment Proxy: {proxy if proxy else 'Not Set'}")

    # 1. Search for videos
    query = TEST_KEYWORDS[0]
    print(f"\nStep 1: Searching for videos with keyword '{query}'...")
    video_urls = await search_videos(query, max_results=3)
    
    if not video_urls:
        print("No videos found. Exiting.")
        return

    print(f"Found {len(video_urls)} videos: {video_urls}")

    # 2. Scrape comments from the first video
    target_url = video_urls[0]
    print(f"\nStep 2: Scraping comments from {target_url}...")
    
    comments = await get_tiktok_comments(target_url, max_comments=10)
    
    print(f"\nFound {len(comments)} comments:")
    for i, c in enumerate(comments, 1):
        print(f"{i}. [{c['timestamp']}] {c['username']}: {c['text']} (Likes: {c['likes']})")

if __name__ == "__main__":
    asyncio.run(main())
