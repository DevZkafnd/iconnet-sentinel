
def is_garbage_content(text: str) -> bool:
    """
    Detects if the content is technical garbage (JavaScript errors, browser warnings, etc.)
    Returns True if the content is considered garbage.
    """
    if not text:
        return False

    junk_phrases = [
        "JavaScript is disabled",
        "enable JavaScript",
        "switch to a supported browser",
        "browser in our Help Center",
        "cookies",
        "Please enable JavaScript",
        "You can see a list of supported browsers",
        "Help Center Terms of Service Privacy Policy",
        "JavaScript is not available",
        "Please turn on JavaScript",
        "Your browser does not support",
        "Checking your browser",
        "Access denied",
        "Cloudflare",
        "Please complete the security check"
    ]

    # Check if a significant portion of the text is just junk
    # Or if the text starts with a strong junk indicator
    
    text_lower = text.lower()
    
    # Critical hits (if these exist, it's almost certainly a blocked page)
    critical_phrases = [
        "javascript is disabled",
        "enable javascript",
        "switch to a supported browser"
    ]
    
    for phrase in critical_phrases:
        if phrase in text_lower:
            return True
            
    # Secondary check (count occurrences of generic junk)
    junk_count = 0
    for phrase in junk_phrases:
        if phrase.lower() in text_lower:
            junk_count += 1
            
    if junk_count >= 2:
        return True
        
    return False

import html
import re

def clean_text(text: str) -> str:
    """
    TRANSFORM PHASE: Cleaning
    1. Decode HTML entities (&amp; -> &)
    2. Remove URLs
    3. Remove excessive emojis/repeating characters
    4. Normalize whitespace
    """
    if not text:
        return ""
        
    # 1. Decode HTML entities (e.g. &amp; -> &)
    text = html.unescape(text)
    
    # 2. Remove URLs
    text = re.sub(r'http\S+', '', text)
    
    # 3. Remove excessive repeating characters/emojis (e.g., "Mantap 👍👍👍" -> "Mantap 👍")
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    
    # 4. Remove multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def is_relevant_content(text: str) -> bool:
    """
    Strictly checks if the content is relevant to PLN Icon Plus / ICONNET.
    Must contain at least one Company Keyword OR a Director Name.
    """
    if not text:
        return False
        
    text_lower = text.lower()
    
    # 1. Company Context (Mandatory-ish)
    company_keywords = [
        "pln", "icon plus", "iconnet", "icon+", "pln icon plus", 
        "pt indonesia comnets plus", "kementerian bumn"
    ]
    
    # 2. Director Names (Strict full names)
    director_names = [
        "chipta perdana", "aditya syarief", "lintje lumembang", 
        "joyce lanny wantannia", "nyoman ngurah widyatnya", 
        "soffin hadi", "dedi budi utomo"
    ]

    # 3. Director Products (Must be paired with Company Context if generic)
    director_products = [
        "konektivitas mpls", "pv rooftop", "pemasaran digital", 
        "manajemen aset", "managed service", "talent management",
        "human capital", "green energy", "smart city"
    ]
    
    # Check for Company Context
    has_company_context = any(k in text_lower for k in company_keywords)
    
    # Check for Director Context
    has_director_context = any(n in text_lower for n in director_names)

    # Check for Product Context
    has_product_context = any(p in text_lower for p in director_products)
    
    # Rule: 
    # 1. Company Context is virtually mandatory for generic products.
    # 2. Director Name alone is enough (usually implies company context in this domain).
    # 3. Company + Product is valid.
    
    if has_director_context:
        return True
        
    if has_company_context:
        # If it has company context, it's relevant. 
        # But we can be stricter: Company AND (Product OR Director)? 
        # User said "Icon Plus" is the target. So any Icon Plus mention is technically relevant,
        # but to prioritize the dashboard focus, we might prefer those with product/director.
        # For now, let's keep it broad for Company, as "Iconnet" itself is a product.
        return True

    return False
