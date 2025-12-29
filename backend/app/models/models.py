from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from sqlalchemy.sql import func
from ..database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    source = Column(String)
    published_date = Column(DateTime(timezone=True))
    original_url = Column(String, unique=True, index=True)
    
    # Explainability columns
    sentiment_score = Column(Float) # 0.0 to 1.0
    sentiment_label = Column(String) # Positive, Negative, Neutral
    confidence_level = Column(String) # High, Medium, Low
    highlighted_keywords = Column(JSON) # List of keywords
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SocialPost(Base):
    __tablename__ = "social_posts"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String) # Instagram, Twitter, etc.
    content = Column(Text)
    author = Column(String)
    post_date = Column(DateTime(timezone=True))
    original_url = Column(String, unique=True, index=True)
    
    # Explainability columns
    sentiment_score = Column(Float)
    sentiment_label = Column(String)
    confidence_level = Column(String)
    highlighted_keywords = Column(JSON)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
