
import os

filename = "tiktok_mobile_debug_final.html"
if os.path.exists(filename):
    content = open(filename, encoding='utf-8').read()
    count = content.count('data-e2e="comment-item"')
    print(f"Count of 'data-e2e=\"comment-item\"': {count}")
    
    # Also check for other potential classes
    print(f"Count of 'comment-item-': {content.count('comment-item-')}")
    print(f"Count of 'div class=\"': {content.count('div class=\"')}")
else:
    print(f"{filename} does not exist.")
