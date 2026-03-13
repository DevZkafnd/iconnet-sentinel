import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.workers.social_worker import run_social_worker
from app.database import engine
from sqlalchemy import text

def run_migrations():
    print("Running migrations...")
    with engine.connect() as conn:
        # Social Comments Migrations
        try:
            conn.execute(text("ALTER TABLE social_comments ADD COLUMN external_ref VARCHAR NULL;"))
            conn.commit()
            print("Added external_ref to social_comments.")
        except Exception:
            pass
            
        try:
            conn.execute(text("ALTER TABLE social_comments ADD COLUMN external_url VARCHAR NULL;"))
            conn.commit()
            print("Added external_url to social_comments.")
        except Exception:
            pass

        # Social Posts Migrations
        try:
            conn.execute(text("ALTER TABLE social_posts ADD COLUMN director VARCHAR NULL;"))
            conn.commit()
            print("Added director to social_posts.")
        except Exception:
            pass
            
        try:
            conn.execute(text("ALTER TABLE social_posts ADD COLUMN product VARCHAR NULL;"))
            conn.commit()
            print("Added product to social_posts.")
        except Exception:
            pass

if __name__ == "__main__":
    print("Starting Manual Social Worker Run (TikTok included)...")
    run_migrations()
    run_social_worker()
    print("Manual Run Complete.")
