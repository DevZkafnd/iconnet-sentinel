from youtubesearchpython import VideosSearch
print("Testing YouTube Search...")
try:
    search = VideosSearch('PLN Icon Plus', limit=5)
    res = search.result()
    print("Result keys:", res.keys())
    items = res.get("result", [])
    print(f"Found {len(items)} items")
    for item in items:
        print(f"- {item.get('title')} ({item.get('link')})")
except Exception as e:
    print(f"Error: {e}")
