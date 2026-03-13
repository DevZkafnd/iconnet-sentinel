
import re

with open("tiktok_mobile_debug_final.html", "r", encoding="utf-8") as f:
    content = f.read()

print(f"File size: {len(content)}")

# Find all occurrences of comment-item
items = re.findall(r'data-e2e="comment-item"', content)
print(f"Total 'comment-item' found: {len(items)}")

# Find all comment text
texts = re.findall(r'data-e2e="comment-level-1"', content)
print(f"Total 'comment-level-1' found: {len(texts)}")

# Print a snippet of where the first comment item is
idx = content.find('data-e2e="comment-item"')
if idx != -1:
    print(f"Snippet: {content[idx:idx+200]}")
