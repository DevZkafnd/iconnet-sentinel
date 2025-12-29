
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

def clean_text(text: str) -> str:
    """
    Basic text cleaning to remove extra whitespace and newlines.
    """
    if not text:
        return ""
    return " ".join(text.split())

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
    
    # Check for Company Context
    has_company_context = any(k in text_lower for k in company_keywords)
    
    # Check for Director Context
    has_director_context = any(n in text_lower for n in director_names)
    
    # Rule: Must have either Company Context OR Director Name
    # We don't want to rely solely on "Jaringan" or "Internet"
    return has_company_context or has_director_context
