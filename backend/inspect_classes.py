import re

try:
    with open('tiktok_comments_debug.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all class names containing 'comment'
    matches = re.findall(r'class="([^"]*comment[^"]*)"', content, re.IGNORECASE)
    unique_matches = sorted(list(set(matches)))
    
    print(f"Found {len(unique_matches)} unique classes containing 'comment':")
    for m in unique_matches:
        print(f'- {m}')
        
except Exception as e:
    print(f"Error: {e}")
