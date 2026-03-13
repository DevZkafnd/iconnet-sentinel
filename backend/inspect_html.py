with open("tiktok_debug_final.html", "r", encoding="utf-8") as f:
    content = f.read()

idx = content.find('data-e2e="comment-item"')
if idx != -1:
    # Print PREVIOUS 1000 chars to see parent
    print(content[max(0, idx-1000):idx])
else:
    print("Not found")
