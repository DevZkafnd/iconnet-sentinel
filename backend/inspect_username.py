from bs4 import BeautifulSoup

def inspect():
    with open("tiktok_comments_debug.html", "r", encoding="utf-8") as f:
        html = f.read()
    
    soup = BeautifulSoup(html, "html.parser")
    
    # Cari komentar yang mengandung "metrotv"
    # Karena kita tidak tahu tag pastinya, cari text node
    target_text = "metrotv"
    
    # Cari elemen yang mengandung text tersebut
    elements = soup.find_all(string=lambda text: target_text in text if text else False)
    
    print(f"Found {len(elements)} elements with text '{target_text}'")
    
    for el in elements:
        parent = el.parent
        print(f"\n--- Comment Element ---")
        print(f"Tag: {parent.name}")
        print(f"Classes: {parent.get('class')}")
        print(f"Text: {parent.get_text().strip()}")
        
        # Traverse up to find container and username
        container = parent.find_parent('div')
        if container:
            print(f"Parent Div Classes: {container.get('class')}")
            # Try to find username nearby
            # Usually sibling or cousin
            
            # Print sibling texts
            siblings = list(container.parent.descendants)
            # Limit output
            # print(f"Context: {[s.name for s in siblings if s.name]}")
            
            # Cari elemen 'a' di sekitar container item (naik 2-3 level)
            grandparent = container.parent
            if grandparent:
                print(f"Grandparent Tag: {grandparent.name} Class: {grandparent.get('class')}")
                links = grandparent.find_all('a')
                for l in links:
                    href = l.get('href', '')
                    if '/@' in href:
                        print(f"Potential Username Link: {href} -> Text: {l.get_text()}")

if __name__ == "__main__":
    inspect()
