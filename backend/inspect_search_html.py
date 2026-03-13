from bs4 import BeautifulSoup
import re

def parse_count(text):
    if not text: return 0
    text = text.upper().replace('VIEWS', '').strip()
    multiplier = 1
    if 'K' in text:
        multiplier = 1000
        text = text.replace('K', '')
    elif 'M' in text:
        multiplier = 1000000
        text = text.replace('M', '')
    elif 'B' in text:
        multiplier = 1000000000
        text = text.replace('B', '')
    
    try:
        return int(float(text) * multiplier)
    except:
        return 0

try:
    with open('tiktok_search_debug.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Try to find video containers
    # Usually they are divs with specific classes or data attributes
    # Look for elements containing "views" or numbers followed by K/M
    
    print("Scanning for potential video items...")
    
    # Strategy: Find ALL links first
    links = soup.find_all('a')
    print(f"Found {len(links)} total links.")
    
    video_links = [l for l in links if 'video' in (l.get('href') or '')]
    print(f"Found {len(video_links)} video links (simple check).")
    
    for i, link in enumerate(video_links[:5]):
        print(f"\nLink {i}: {link['href']}")
        
        # Traverse parents to find container
        card = link
        found_views = False
        
        # Try to find a sibling or parent sibling with numbers
        # Common structure: 
        # div (container) -> div (video) -> a (link)
        #                 -> div (stats) -> strong (views)
        
        for _ in range(5):
            if not card.parent: break
            card = card.parent
            text = card.get_text(separator=' ', strip=True)
            
            # Look for pattern like "1.2M" or "500K"
            # Regex: Digit + (optional .Digit) + K/M/B
            import re
            view_matches = re.findall(r'(\d+(?:\.\d+)?[KMB]?)', text)
            
            if view_matches:
                 # Filter likely candidates (e.g. not '2024')
                 candidates = [m for m in view_matches if 'K' in m or 'M' in m or 'B' in m]
                 if candidates:
                     print(f"  Possible View Counts found in parent level {_}: {candidates}")
                     found_views = True
                     break
        
        if not found_views:
            print("  No view count found nearby.")
                
except Exception as e:
    print(f"Error: {e}")
