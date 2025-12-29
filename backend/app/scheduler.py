from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.workers.news_worker import run_news_worker
from app.workers.social_worker import run_social_worker
import atexit

# Scheduler Instance
scheduler = BackgroundScheduler()

def start_scheduler():
    if not scheduler.running:
        # Schedule News Worker (Every 6 hours)
        # Quota Calculation:
        # - 11 queries (Base + Directors) per run
        # - Every 6 hours = 4 runs/day
        # - Total: 11 * 4 = 44 queries/day
        scheduler.add_job(
            run_news_worker,
            trigger=IntervalTrigger(hours=6),
            id="news_worker",
            name="Fetch Google News",
            replace_existing=True
        )
        
        # Schedule Social Worker (Every 6 hours)
        # Quota Calculation:
        # - 9 queries (Base + Directors) per run
        # - Every 6 hours = 4 runs/day
        # - Total: 9 * 4 = 36 queries/day
        # Grand Total: 44 + 36 = 80 queries/day (Safe below 100 limit)
        scheduler.add_job(
            run_social_worker,
            trigger=IntervalTrigger(hours=6),
            id="social_worker",
            name="Scrape Social Media",
            replace_existing=True
        )
        
        scheduler.start()
        print("Scheduler started: News(6h), Social(6h) - Daily Est. Queries: 80")

    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())
