
import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

# We need to connect to localhost since the script runs outside Docker
# The DATABASE_URL in .env might be 'db:5432' (inside docker) or 'localhost:5432'
# Let's override it for this script.
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/sentinel_db"

def migrate():
    print(f"Connecting to {DATABASE_URL}...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cur = conn.cursor()
        
        columns_to_add = [
            ("social_posts", "director", "VARCHAR"),
            ("social_posts", "product", "VARCHAR"),
            ("social_comments", "external_ref", "VARCHAR"),
            ("social_comments", "external_url", "VARCHAR"),
        ]
        
        for table, col, col_type in columns_to_add:
            try:
                print(f"Checking {table}.{col}...")
                cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table}' AND column_name='{col}';")
                if not cur.fetchone():
                    print(f"Adding {col} to {table}...")
                    cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type} NULL;")
                else:
                    print(f"Column {col} already exists in {table}.")
            except Exception as e:
                print(f"Error migrating {table}.{col}: {e}")
        
        cur.close()
        conn.close()
        print("Migration completed.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
