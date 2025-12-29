import asyncio
from playwright.async_api import async_playwright
import os
import random
from ..database import SessionLocal
from ..models.models import SocialPost
from ..utils.ai_helper import analyze_sentiment

# Direct connection (No Proxy) logic as requested
# If proxy is needed later, load from os.getenv("PROXY_STRING")

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
]

async def scrape_social_media(url: str, platform: str):
    print(f"Scraping {platform}: {url}")
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={'width': 1280, 'height': 720}
        )
        
        page = await context.new_page()
        
        try:
            await page.goto(url, timeout=60000)
            await asyncio.sleep(random.uniform(3, 5)) # Human-like delay
            
            content = ""
            username = "Unknown"
            
            if platform.lower() == "instagram":
                # Very basic Instagram scraping logic (highly fragile without login)
                # Trying to get the meta description or title as fallback
                title = await page.title()
                try:
                    # Try to find the first post caption if it's a post URL
                    # This selector is subject to change by Instagram
                    content = await page.title() # Fallback
                except:
                    pass
            else:
                content = await page.title()
                
            # Basic content validation
            if not content:
                content = "No content extracted"

            # Check duplicate
            db = SessionLocal()
            existing = db.query(SocialPost).filter(SocialPost.original_url == url).first()
            if existing:
                print(f"URL already exists: {url}")
                await browser.close()
                return

            # AI Analysis
            ai_result = analyze_sentiment(content)
            
            post = SocialPost(
                platform=platform,
                username=username,
                content=content,
                original_url=url,
                sentiment_score=ai_result['sentiment_score'],
                sentiment_label=ai_result['sentiment_label'],
                confidence_level=ai_result['confidence_level'],
                highlighted_keywords=ai_result['highlighted_keywords']
            )
            
            db.add(post)
            db.commit()
            print(f"Saved social post from {url}")
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            
        finally:
            await browser.close()
            db.close()

async def run_social_scraper():
    # Example targets - in production this would come from a queue or search results
    targets = [
        {"url": "https://www.instagram.com/pln.iconplus/", "platform": "Instagram"},
        # Add more target URLs here
    ]
    
    for target in targets:
        await scrape_social_media(target['url'], target['platform'])
