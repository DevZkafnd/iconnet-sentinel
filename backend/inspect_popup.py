from bs4 import BeautifulSoup
import re

try:
    with open('tiktok_comments_loaded_debug.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # Find container by class regex
    container = soup.find('div', class_=re.compile(r'DivCommentListContainer'))
    
    if container:
        print("Container found!")
        print(f"Classes: {container.get('class')}")
        
        # Find children divs
        children = container.find_all('div', recursive=False)
        print(f"Found {len(children)} direct children.")
        
        for i, child in enumerate(children[:5]):
            print(f"Child {i} classes: {child.get('class')}")
            # Check if Skeleton
            if child.get('class') and any('Skeleton' in c for c in child.get('class')):
                print(f"Child {i} is SKELETON")
            else:
                print(f"Child {i} is NOT SKELETON")
                print(f"Child {i} text: {child.get_text()[:50]}...")
            
    else:
        print("Container not found.")
        
except Exception as e:
    print(f"Error: {e}")
