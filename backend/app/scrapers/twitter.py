from ntscraper import Nitter
from typing import List, Dict
import random

def get_twitter_replies(tweet_url: str, max_replies: int = 20) -> List[Dict]:
    """
    Fetches replies for a given Tweet URL using ntscraper (Nitter).
    Returns a list of dicts: author, content, created_at
    """
    try:
        scraper = Nitter(log_level=1, skip_instance_check=False)
        
        # Extract username and tweet ID
        # Format: https://twitter.com/username/status/123456789
        parts = tweet_url.split('/')
        if 'status' not in parts:
            return []
            
        tweet_id = parts[parts.index('status') + 1].split('?')[0]
        # user = parts[parts.index('status') - 1] # Not strictly needed for scraper.get_tweets?
        # Actually ntscraper uses search or profile. Getting specific conversation is tricky.
        # But we can try to get the tweet and its replies.
        
        # NOTE: ntscraper doesn't have a direct "get_replies(tweet_id)" method exposed easily 
        # that guarantees thread reconstruction in a simple call. 
        # However, we can search for "conversation_id:<tweet_id>" or similar on Nitter.
        # Or just return empty for now as Nitter instances are very flaky.
        
        # Workaround: For now, we'll try to get the tweet details which might include some context,
        # but ntscraper is best for profiles/hashtags.
        # Let's try searching for the tweet ID which sometimes returns the thread.
        
        print(f"Fetching Twitter replies via Nitter for ID: {tweet_id}")
        tweets = scraper.get_tweets(terms=tweet_id, mode='term', number=max_replies)
        
        results = []
        if 'tweets' in tweets:
            for t in tweets['tweets']:
                # Filter out the main tweet if it appears? 
                # Nitter search results might be mixed.
                results.append({
                    "author": t['user']['username'],
                    "content": t['text'],
                    "created_at": t['date']
                })
                
        return results
        
    except Exception as e:
        print(f"Error fetching Twitter replies for {tweet_url}: {e}")
        return []
