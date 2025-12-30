from app.utils.text_cleaner import clean_text
from app.utils.sentiment_trainer import sentiment_analyzer

POSITIVE_KEYWORDS = ["cepat", "stabil", "bagus", "keren", "terima kasih", "mantap", "lancar", "puas", "hebat", "kencang", "murah", "ramah", "membantu", "solutif", "responsif", "terbaik", "suka", "love", "nyaman", "ok", "oke", "good", "nice", "top"]
NEGATIVE_KEYWORDS = ["lemot", "gangguan", "mati", "mahal", "lambat", "rusak", "kecewa", "putus", "lelet", "parah", "jelek", "down", "error", "ngadat", "bapuk", "sampah", "emosi", "lemah", "kacau", "buruk", "susah", "komplain", "rugi", "benci", "bad", "slow", "disconnect", "unstable", "RTO", "packet loss"]

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
    Analyze sentiment using Logistic Regression + TF-IDF model.
    Falls back to basic logic if prediction fails.
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

    # Use Model Prediction
    prediction = sentiment_analyzer.predict(cleaned)
    
    if prediction:
        result["sentiment_score"] = prediction["score"]
        result["sentiment_label"] = prediction["label"]
        result["confidence_level"] = prediction["confidence"]
    else:
        # --- Fallback: Keyword-Based Sentiment Analysis ---
        # Only used if model is not loaded or fails
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
            
            # Map to 0-1
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
            
    return result
