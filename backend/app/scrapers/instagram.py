import os
import instaloader
from instagrapi import Client
import time
import random
import asyncio
from typing import List, Dict, Optional
from playwright.async_api import async_playwright

# Try to get credentials from env
# Support both legacy (IG_*) and new (INSTAGRAM_*) variable names
IG_USERNAME = os.getenv("INSTAGRAM_USERNAME") or os.getenv("IG_USERNAME", "")
IG_PASSWORD = os.getenv("INSTAGRAM_PASSWORD") or os.getenv("IG_PASSWORD", "")
PROXY_STRING = os.getenv("PROXY_STRING", "")
PROXY_LIST_RAW = os.getenv("PROXY_LIST", "")
INSTAGRAM_DISABLE_PROXY = (os.getenv("INSTAGRAM_DISABLE_PROXY", "true").lower() in ["1", "true", "yes"])

_client = None

def get_client():
    global _client
    if _client:
        return _client
    
    cl = Client()
    # Optional Proxy Support (from .env)
    proxy_string = choose_proxy() if not INSTAGRAM_DISABLE_PROXY else None
    if proxy_string:
        try:
            cl.set_proxy(proxy_string)
            print(f"Instagram Proxy set: {proxy_string.split('@')[-1]}")
        except Exception as pe:
            print(f"Failed to set Instagram proxy: {pe}")
    try:
        if IG_USERNAME and IG_PASSWORD:
            print(f"Logging in to Instagram as {IG_USERNAME}...")
            cl.login(IG_USERNAME, IG_PASSWORD)
            print("Instagram Login Success.")
        else:
            print("No Instagram credentials found. Using anonymous/guest mode (limited).")
            # Note: Anonymous mode is severely limited/broken in recent versions
    except Exception as e:
        print(f"Instagram Login Failed: {e}")
        try:
            cl = Client()
            print("Retrying Instagram login without proxy...")
            cl.login(IG_USERNAME, IG_PASSWORD)
            print("Instagram Login Success (no proxy).")
        except Exception as ee:
            print(f"Instagram Login Failed (no proxy): {ee}")
        
    _client = cl
    return _client

def get_instagram_comments(post_url: str, max_comments: int = 20) -> List[Dict]:
    """
    Fetches comments for a given Instagram post URL using instagrapi first, then instaloader as fallback.
    Returns a list of dicts with keys: author, content, created_at
    """
    results = []
    
    # Method 1: Instagrapi
    try:
        print(f"Attempting to fetch Instagram comments via Instagrapi for {post_url}")
        cl = get_client()
        media_pk = cl.media_pk_from_url(post_url)
        media_id = cl.media_id(media_pk)
        
        comments = cl.media_comments(media_id, amount=max_comments)
        
        for c in comments:
            results.append({
                "author": c.user.username,
                "content": c.text,
                "created_at": c.created_at_utc
            })
            
        if results:
            return results
            
    except Exception as e:
        print(f"Instagrapi failed: {e}")

    # Method 2: Instaloader (Fallback)
    try:
        print(f"Attempting to fetch Instagram comments via Instaloader for {post_url}")
        L = instaloader.Instaloader()
        # Also set proxy for instaloader via environment if available
        proxy = choose_proxy()
        if proxy:
            os.environ["HTTP_PROXY"] = proxy
            os.environ["HTTPS_PROXY"] = proxy
        
        # Extract shortcode from URL
        # URL format: https://www.instagram.com/p/SHORTCODE/
        if "/p/" in post_url:
            shortcode = post_url.split("/p/")[1].split("/")[0]
        elif "/reel/" in post_url:
            shortcode = post_url.split("/reel/")[1].split("/")[0]
        else:
            print("Could not extract shortcode for Instaloader")
            return []

        post = instaloader.Post.from_shortcode(L.context, shortcode)
        
        count = 0
        for comment in post.get_comments():
            results.append({
                "author": comment.owner.username,
                "content": comment.text,
                "created_at": comment.created_at_utc
            })
            count += 1
            if count >= max_comments:
                break
                
        if results:
            print(f"Successfully fetched {len(results)} comments via Instaloader")
            
    except Exception as e:
        print(f"Instaloader failed: {e}")

    if results:
        return results
    # Method 3: Playwright (DOM scraping, last resort)
    print(f"Attempting to fetch Instagram comments via Playwright for {post_url}")
    results = get_instagram_comments_via_playwright(post_url, max_comments)
    return results

def normalize_hashtag(text: str) -> Optional[str]:
    """
    Converts a keyword/product string into a safe hashtag token.
    Example: 'Konektivitas MPLS' -> 'mpls'
    """
    if not text:
        return None
    t = "".join(ch for ch in text.lower() if ch.isalnum() or ch == " ")
    t = t.strip().replace(" ", "")
    if not t:
        return None
    return t

def parse_proxy_list() -> List[str]:
    if not PROXY_LIST_RAW:
        return []
    parts = [p.strip() for p in PROXY_LIST_RAW.split(",") if p.strip()]
    return parts

def choose_proxy() -> Optional[str]:
    proxies = parse_proxy_list()
    if proxies:
        return random.choice(proxies)
    return PROXY_STRING or None

def playwright_proxy_config(proxy_str: Optional[str]) -> Optional[Dict]:
    """
    Convert proxy string 'http://user:pass@host:port' to playwright proxy dict.
    """
    if not proxy_str:
        return None
    try:
        scheme_sep = "://"
        if scheme_sep in proxy_str:
            scheme, rest = proxy_str.split(scheme_sep, 1)
        else:
            scheme = "http"
            rest = proxy_str
        if "@" in rest:
            creds, hostport = rest.split("@", 1)
            user, password = creds.split(":")
            server = f"{scheme}://{hostport}"
            return {"server": server, "username": user, "password": password}
        else:
            return {"server": f"{scheme}://{rest}"}
    except Exception:
        return None

async def _get_comments_via_playwright(post_url: str, max_comments: int = 20, proxy_str: Optional[str] = None) -> List[Dict]:
    results: List[Dict] = []
    proxy_cfg = playwright_proxy_config(proxy_str)
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; OnePlus 6T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
    ]
    ua = random.choice(user_agents)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, proxy=proxy_cfg)
        context = await browser.new_context(user_agent=ua, viewport={"width": 1280, "height": 900})
        page = await context.new_page()
        try:
            await page.goto(post_url, timeout=60000, wait_until="domcontentloaded")
            await asyncio.sleep(random.uniform(2, 4))
            # Attempt to click "View all comments" if present
            try:
                btns = await page.query_selector_all("a, button")
                for b in btns:
                    txt = (await b.inner_text()).lower()
                    if "comment" in txt and ("view" in txt or "lihat" in txt or "all" in txt or "semua" in txt):
                        await b.click()
                        await asyncio.sleep(random.uniform(2, 3))
                        break
            except:
                pass
            # Collect visible comment texts; Instagram DOM is dynamic, so use a broad selector
            # We avoid including the caption by skipping the first large text block if needed.
            spans = await page.query_selector_all("article span")
            count = 0
            for s in spans:
                try:
                    t = await s.inner_text()
                except:
                    continue
                t = (t or "").strip()
                if not t:
                    continue
                # Basic filters to reduce non-comment noise
                if len(t) < 3:
                    continue
                if t.lower().startswith("liked by") or t.lower().startswith("follow"):
                    continue
                # Heuristic: treat as a comment body
                results.append({
                    "author": "Unknown",
                    "content": t,
                    "created_at": None
                })
                count += 1
                if count >= max_comments:
                    break
        finally:
            await browser.close()
    return results

def get_instagram_comments_via_playwright(post_url: str, max_comments: int = 20) -> List[Dict]:
    """
    Synchronous wrapper to fetch comments via Playwright with proxy rotation.
    """
    proxy = choose_proxy()
    try:
        return asyncio.run(_get_comments_via_playwright(post_url, max_comments, proxy))
    except Exception as e:
        print(f"Playwright comments scraping failed: {e}")
        return []

async def _get_post_urls_by_hashtag_playwright(tag: str, max_posts: int = 5, proxy_str: Optional[str] = None) -> List[str]:
    urls: List[str] = []
    proxy_cfg = playwright_proxy_config(proxy_str)
    ua_pool = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 10; OnePlus 6T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
    ]
    ua = random.choice(ua_pool)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, proxy=proxy_cfg)
        context = await browser.new_context(user_agent=ua, viewport={"width": 1280, "height": 900})
        page = await context.new_page()
        try:
            await page.goto(f"https://www.instagram.com/explore/tags/{tag}/", timeout=60000, wait_until="domcontentloaded")
            await asyncio.sleep(random.uniform(2, 4))
            anchors = await page.query_selector_all("a")
            for a in anchors:
                try:
                    href = await a.get_attribute("href")
                except:
                    href = None
                if not href:
                    continue
                if "/p/" in href or "/reel/" in href:
                    if href.startswith("/"):
                        url = f"https://www.instagram.com{href}"
                    else:
                        url = href
                    if url not in urls:
                        urls.append(url)
                    if len(urls) >= max_posts:
                        break
        finally:
            await browser.close()
    return urls

def get_instagram_post_urls_by_hashtags_via_playwright(hashtags: List[str], max_posts: int = 5) -> List[str]:
    proxy = choose_proxy()
    collected: List[str] = []
    for tag in hashtags:
        if len(collected) >= max_posts:
            break
        try:
            urls = asyncio.run(_get_post_urls_by_hashtag_playwright(tag, max_posts - len(collected), proxy))
            for u in urls:
                if u not in collected:
                    collected.append(u)
                if len(collected) >= max_posts:
                    break
        except Exception as e:
            print(f"Playwright hashtag scraping failed for #{tag}: {e}")
            continue
    return collected

def get_instagram_posts_by_hashtags(hashtags: List[str], max_posts: int = 5, max_comments_per_post: int = 50) -> List[Dict]:
    """
    Fetch recent Instagram posts by a set of hashtags and return only posts that have comments.
    Each item includes: url, caption, username, created_at, comments(list[{author,content,created_at}])
    """
    cl = get_client()
    results: List[Dict] = []
    seen_urls = set()
    
    for tag in hashtags:
        if not tag:
            continue
        medias = []
        try:
            medias = cl.hashtag_medias_recent(tag, amount=30)
        except Exception as e:
            print(f"Error fetching medias for hashtag #{tag}: {e}")
            # Fallback: try Instaloader without login for public hashtag posts
            try:
                L = instaloader.Instaloader()
                proxy = choose_proxy()
                if proxy:
                    os.environ["HTTP_PROXY"] = proxy
                    os.environ["HTTPS_PROXY"] = proxy
                hashtag = instaloader.Hashtag.from_name(L.context, tag)
                medias = []
                count_posts = 0
                for post in hashtag.get_top_posts():
                    class Obj:
                        pass
                    m = Obj()
                    m.code = post.shortcode
                    m.pk = post.mediaid
                    m.caption_text = post.caption or ""
                    m.user = Obj()
                    m.user.username = post.owner_username
                    m.taken_at = post.date_utc
                    medias.append(m)
                    count_posts += 1
                    if count_posts >= 30:
                        break
            except Exception as ee:
                print(f"Instaloader hashtag fallback failed for #{tag}: {ee}")
                urls = get_instagram_post_urls_by_hashtags_via_playwright([tag], max_posts=5)
                medias = []
                for url in urls:
                    class Obj:
                        pass
                    m = Obj()
                    m.code = url.split("/p/")[-1].split("/")[0] if "/p/" in url else url.split("/reel/")[-1].split("/")[0] if "/reel/" in url else None
                    m.pk = None
                    m.caption_text = ""
                    m.user = Obj()
                    m.user.username = "Unknown"
                    m.taken_at = None
                    medias.append(m)

        for m in medias:
            try:
                code = getattr(m, "code", None)
                pk = getattr(m, "pk", None)
                caption = getattr(m, "caption_text", "") or ""
                user = getattr(m, "user", None)
                username = getattr(user, "username", "Unknown") if user else "Unknown"
                taken_at = getattr(m, "taken_at", None)
                
                if not code or not pk:
                    pk = pk or 0
                    if not code:
                        continue
                
                url = f"https://www.instagram.com/p/{code}/"
                if url in seen_urls:
                    continue
                
                comments_raw = get_instagram_comments(url, max_comments=max_comments_per_post)
                
                comments = []
                for c in comments_raw:
                    author = c.get("author") or "Unknown"
                    content = c.get("content")
                    created_at = c.get("created_at")
                    if content:
                        comments.append({
                            "author": author,
                            "content": content,
                            "created_at": created_at
                        })
                
                if not comments:
                    continue
                
                results.append({
                    "url": url,
                    "caption": caption,
                    "username": username,
                    "created_at": taken_at,
                    "comments": comments
                })
                seen_urls.add(url)
                
                if len(results) >= max_posts:
                    return results
            
            except Exception as e:
                print(f"Error processing media for hashtag #{tag}: {e}")
                continue
    
    return results

def get_latest_posts_from_profiles(usernames: List[str], max_posts_per_profile: int = 3, max_comments_per_post: int = 50) -> List[Dict]:
    """
    Fetch latest posts from specified public profiles and return only posts that have comments.
    Each item includes: url, caption, username, created_at, comments(list[{author,content,created_at}])
    """
    cl = get_client()
    results: List[Dict] = []
    seen_urls = set()
    
    for uname in usernames:
        try:
            user_id = cl.user_id_from_username(uname)
            medias = cl.user_medias(user_id, amount=max_posts_per_profile)
        except Exception as e:
            print(f"Error fetching medias for profile @{uname}: {e}")
            # Fallback: try Playwright to collect post URLs from profile page
            try:
                # Reuse hashtag page collector but target profile page
                proxy = choose_proxy()
                async def _collect():
                    urls: List[str] = []
                    proxy_cfg = playwright_proxy_config(proxy)
                    ua = random.choice([
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 10; OnePlus 6T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
                    ])
                    async with async_playwright() as p:
                        browser = await p.chromium.launch(headless=True, proxy=proxy_cfg)
                        ctx = await browser.new_context(user_agent=ua, viewport={"width": 1280, "height": 900})
                        page = await ctx.new_page()
                        await page.goto(f"https://www.instagram.com/{uname}/", timeout=60000, wait_until="domcontentloaded")
                        await asyncio.sleep(random.uniform(2, 4))
                        anchors = await page.query_selector_all("a")
                        for a in anchors:
                            href = await a.get_attribute("href")
                            if not href:
                                continue
                            if "/p/" in href or "/reel/" in href:
                                if href.startswith("/"):
                                    url = f"https://www.instagram.com{href}"
                                else:
                                    url = href
                                if url not in urls:
                                    urls.append(url)
                                if len(urls) >= max_posts_per_profile:
                                    break
                        await browser.close()
                    return urls
                urls = asyncio.run(_collect())
                medias = []
                for url in urls:
                    class Obj:
                        pass
                    m = Obj()
                    m.code = url.split("/p/")[-1].split("/")[0] if "/p/" in url else url.split("/reel/")[-1].split("/")[0] if "/reel/" in url else None
                    m.pk = None
                    m.caption_text = ""
                    m.user = type("U", (), {"username": uname})
                    m.taken_at = None
                    medias.append(m)
            except Exception as ee:
                print(f"Playwright profile fallback failed for @{uname}: {ee}")
                continue
        
        for m in medias:
            try:
                code = getattr(m, "code", None)
                caption = getattr(m, "caption_text", "") or ""
                username = getattr(getattr(m, "user", None), "username", uname) or uname
                taken_at = getattr(m, "taken_at", None)
                
                if not code:
                    continue
                url = f"https://www.instagram.com/p/{code}/"
                if url in seen_urls:
                    continue
                
                comments_raw = get_instagram_comments(url, max_comments=max_comments_per_post)
                comments = []
                for c in comments_raw:
                    author = c.get("author") or "Unknown"
                    content = c.get("content")
                    created_at = c.get("created_at")
                    if content:
                        comments.append({
                            "author": author,
                            "content": content,
                            "created_at": created_at
                        })
                
                if not comments:
                    continue
                
                results.append({
                    "url": url,
                    "caption": caption,
                    "username": username,
                    "created_at": taken_at,
                    "comments": comments
                })
                seen_urls.add(url)
            
            except Exception as e:
                print(f"Error processing media for profile @{uname}: {e}")
                continue
    
    return results
