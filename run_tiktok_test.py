import asyncio
import sys
import os

# Disable proxy for testing
os.environ["PROXY_STRING"] = ""
os.environ["PROXY_LIST"] = ""

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.scrapers.tiktok import get_tiktok_comments

async def main():
    url = "https://www.tiktok.com/@gusbudii/video/7413756992717720840"
    print(f"Testing scraper on: {url}")
    
    comments = await get_tiktok_comments(url, max_comments=10)
    
    print(f"\n--- Result ({len(comments)} comments) ---")
    for i, c in enumerate(comments):
        print(f"{i+1}. [{c['username']}] {c['text'][:50]}...")

    # Inspect debug file
    debug_file = "tiktok_comments_debug.html"
    if os.path.exists(debug_file):
        print(f"\nInspecting {debug_file}...")
        with open(debug_file, "r", encoding="utf-8") as f:
            content = f.read()
            print(f"File size: {len(content)} bytes")
            if "DivCommentItemWrapper" in content:
                print("FOUND: DivCommentItemWrapper")
            else:
                print("NOT FOUND: DivCommentItemWrapper")
            
            if "comment-item" in content:
                print("FOUND: comment-item")
            
            # Print classes found
            import re
            classes = re.findall(r'class="([^"]+)"', content)
            print(f"Sample classes: {classes[:5]}")

if __name__ == "__main__":
    asyncio.run(main())
