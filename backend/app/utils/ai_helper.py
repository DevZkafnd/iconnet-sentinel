# from transformers import re
import html
import re

# from transformers import pipeline # Uncomment on VPS (4GB RAM+)

# ... (Model loading code commented out for local dev) ...
sentiment_pipeline = None 

POSITIVE_KEYWORDS = ["cepat", "stabil", "bagus", "keren", "terima kasih", "mantap", "lancar", "puas", "hebat", "kencang", "murah", "ramah", "membantu", "solutif", "responsif", "terbaik", "suka", "love", "nyaman", "ok", "oke", "good", "nice", "top"]
NEGATIVE_KEYWORDS = ["lemot", "gangguan", "mati", "mahal", "lambat", "rusak", "kecewa", "putus", "lelet", "parah", "jelek", "down", "error", "ngadat", "bapuk", "sampah", "emosi", "lemah", "kacau", "buruk", "susah", "komplain", "rugi", "benci", "bad", "slow", "disconnect", "unstable", "RTO", "packet loss"]

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
    # This regex looks for a character repeated more than 2 times and replaces it with 1 occurrence
    text = re.sub(r'(.)\1{2,}', r'\1', text)
    
    # 4. Remove multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def extract_keywords(text: str):
    """
    Simple keyword extraction based on dictionary matching.
    """
    text_lower = text.lower()
    found_keywords = []
    
    for word in POSITIVE_KEYWORDS:
        if word in text_lower:
            found_keywords.append(word)
            
    for word in NEGATIVE_KEYWORDS:
        if word in text_lower:
            found_keywords.append(word)
            
    return list(set(found_keywords)) # Unique keywords

def analyze_sentiment(text: str):
    """
    Analyze sentiment using AI model and calculate confidence.
    Fallback to Keyword-Based if model is not loaded.
    """
    if not text:
        return {
            "sentiment_score": 0.5,
            "sentiment_label": "Neutral",
            "confidence_level": "Low",
            "highlighted_keywords": []
        }
        
    cleaned = clean_text(text)
    keywords = extract_keywords(cleaned)
    
    # Default Result
    result = {
        "sentiment_score": 0.5,
        "sentiment_label": "Neutral",
        "confidence_level": "Low",
        "highlighted_keywords": keywords
    }

    if sentiment_pipeline:
        try:
            # Pipeline returns list of dicts: [{'label': 'positive', 'score': 0.99}]
            # The model w11wo/indonesian-roberta-base-sentiment-classifier uses labels: positive, neutral, negative
            prediction = sentiment_pipeline(cleaned[:512])[0] # Truncate to 512 tokens
            
            label_map = {
                "positive": "Positive",
                "neutral": "Neutral",
                "negative": "Negative"
            }
            
            score = prediction['score']
            raw_label = prediction['label']
            
            result["sentiment_score"] = score
            result["sentiment_label"] = label_map.get(raw_label, "Neutral")
            
            # Confidence Logic
            if score > 0.8:
                result["confidence_level"] = "High"
            elif score > 0.6:
                result["confidence_level"] = "Medium"
            else:
                result["confidence_level"] = "Low"
                
        except Exception as e:
            print(f"Error in AI inference: {e}")
            
    else:
        # --- Fallback: Keyword-Based Sentiment Analysis ---
        text_lower = cleaned.lower()
        pos_score = 0
        neg_score = 0
        
        for word in POSITIVE_KEYWORDS:
            if word in text_lower:
                pos_score += 1
                
        for word in NEGATIVE_KEYWORDS:
            if word in text_lower:
                neg_score += 1
        
        # Simple Scoring Logic
        total_hits = pos_score + neg_score
        
        if total_hits > 0:
            final_score = (pos_score - neg_score) / total_hits # Range -1 to 1
            
            # Map to 0-1 for consistency with model output (roughly)
            # 0.5 is Neutral. >0.5 Positive, <0.5 Negative.
            normalized_score = (final_score + 1) / 2 
            result["sentiment_score"] = normalized_score
            
            if final_score > 0.2:
                result["sentiment_label"] = "Positive"
                result["confidence_level"] = "Medium"
            elif final_score < -0.2:
                result["sentiment_label"] = "Negative"
                result["confidence_level"] = "Medium"
            else:
                result["sentiment_label"] = "Neutral"
                result["confidence_level"] = "Low"
        else:
            # No keywords found -> Neutral
            pass
            
    return result
            
    return result
