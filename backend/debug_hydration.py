
import json
from bs4 import BeautifulSoup
import os

def find_comments_recursive(obj, found_comments, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            current_path = f"{path}.{k}" if path else k
            if k == 'comments' and isinstance(v, list):
                print(f"Found 'comments' list at {current_path} with length {len(v)}")
                found_comments.extend(v)
            elif isinstance(v, (dict, list)):
                find_comments_recursive(v, found_comments, current_path)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            current_path = f"{path}[{i}]"
            find_comments_recursive(item, found_comments, current_path)

def analyze_file(filename):
    if not os.path.exists(filename):
        print(f"File {filename} not found.")
        return

    print(f"Analyzing {filename}...")
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")
    
    # 1. Check scripts
    scripts = soup.find_all("script", type="application/json")
    print(f"Found {len(scripts)} JSON scripts.")
    
    for i, s in enumerate(scripts):
        if "UNIVERSAL_DATA" in s.get("id", "") or "SIGI_STATE" in s.get("id", "") or "comments" in s.text:
            print(f"Script {i} (id={s.get('id')}) contains potential data.")
            try:
                data = json.loads(s.text)
                found = []
                find_comments_recursive(data, found)
                if not found:
                    print("  No comments found in this script.")
                else:
                    print(f"  Extracted {len(found)} comments.")
                    # Print first comment sample
                    print("  Sample:", found[0])
            except Exception as e:
                print(f"  Error parsing JSON: {e}")

    # 2. Check SIGI_STATE variable if defined in JS
    # (Not easily done with BS4, but we can search for the string)
    
if __name__ == "__main__":
    analyze_file("tiktok_desktop_debug_final.html")
    # analyze_file("tiktok_mobile_debug_final.html")
