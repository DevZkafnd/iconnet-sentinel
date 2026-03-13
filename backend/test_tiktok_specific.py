
import sys
import os
import asyncio
import logging

# Add the parent directory to sys.path to allow imports from app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.scrapers.tiktok import get_tiktok_comments, _scrape_comments

# Configure logging
logging.basicConfig(level=logging.INFO)

async def main():
    url = "https://www.tiktok.com/@gusbudii/video/7413756992717720840"
    print(f"Testing scraper on specific URL: {url}")
    
    # Run scraper
    # Note: get_tiktok_comments tries mobile first, then desktop if empty.
    results = await get_tiktok_comments(url)
    
    print("-" * 50)
    print(f"Total Comments Found: {len(results)}")
    print("-" * 50)
    
    for i, c in enumerate(results[:10]):
        print(f"{i+1}. [{c.get('username')}] {c.get('text')}")
        
    if len(results) == 0:
        print("No comments found. Check logs for errors.")

if __name__ == "__main__":
    asyncio.run(main())
