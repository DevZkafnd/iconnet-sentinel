import os
import random
import asyncio
from typing import List, Dict, Optional
from datetime import datetime
from urllib.parse import quote
from playwright.async_api import async_playwright, Browser, BrowserContext, Error as PlaywrightError
from dotenv import load_dotenv

load_dotenv()

# Environment variables for Proxy
PROXY_STRING = os.getenv("PROXY_STRING", "")
PROXY_LIST_RAW = os.getenv("PROXY_LIST", "")

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

async def search_videos(query: str, max_results: int = 5) -> List[str]:
    """
    Search for videos on TikTok by keyword and return a list of video URLs.
    """
    video_urls = []
    # proxy_str = choose_proxy()
    proxy_str = None # Force no proxy for debugging to rule out proxy issues
    proxy_cfg = playwright_proxy_config(proxy_str)
    
    print(f"[TikTok] Searching for: {query}")
    
    async with async_playwright() as p:
        # Setup Browser (Same as get_tiktok_comments)
        device_name = 'iPhone 13'
        if device_name not in p.devices:
            device_name = 'iPhone 12'
        device = p.devices[device_name]
        
        browser = await p.chromium.launch(
            headless=True, 
            proxy=proxy_cfg,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-infobars",
                "--window-position=0,0",
                "--ignore-certificate-errors",
                "--ignore-certificate-errors-spki-list",
            ]
        )
        
        context = await browser.new_context(
            **device,
            locale='id-ID',
            timezone_id='Asia/Jakarta',
        )
        
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        
        page = await context.new_page()
        
        try:
            # TikTok Search URL format
            # Try Hashtag search as it is often more accessible on mobile web
            tag_query = query.replace(" ", "")
            search_url = f"https://www.tiktok.com/tag/{tag_query}"
            print(f"[TikTok] Navigating to tag page: {search_url}")
            
            await page.goto(search_url, timeout=60000, wait_until="domcontentloaded")
            await asyncio.sleep(random.uniform(3, 5))

            # Handle Login/App Modals (Copied from get_tiktok_comments)
            try:
                close_buttons = await page.query_selector_all('button, div[role="button"], a[role="button"]')
                for btn in close_buttons:
                    text = await btn.inner_text()
                    if any(x in text for x in ["Not now", "Lain kali", "Close", "Buka aplikasi", "Open App"]):
                        print(f"[TikTok] Closing modal with text: {text}")
                        await btn.click()
                        await asyncio.sleep(1)
            except Exception as e:
                print(f"[TikTok] Error handling modals in search: {e}")
            
            # Screenshot for debug
            await page.screenshot(path="tiktok_search_debug.png")
            print("[TikTok] Saved search screenshot to tiktok_search_debug.png")
            
            # Save HTML for debugging
            content = await page.content()
            with open("tiktok_search_debug.html", "w", encoding="utf-8") as f:
                f.write(content)
            print("[TikTok] Saved search HTML to tiktok_search_debug.html")

            # Scroll to trigger lazy load
            for _ in range(3):
                await page.mouse.wheel(0, 500)
                await asyncio.sleep(1)
            
            # Extract video links with View Counts for sorting
            # We use evaluate to parse the DOM directly
            video_data = await page.evaluate("""() => {
                const items = [];
                // Try to find video cards
                // Selector might need adjustment based on current TikTok layout
                const anchors = Array.from(document.querySelectorAll('a'));
                
                anchors.forEach(a => {
                    const href = a.href;
                    if (href.includes('/video/') || href.includes('/v/')) {
                        // Attempt to find view count in the card
                        // Usually up a few levels in the container
                        let container = a;
                        let viewCount = 0;
                        let foundViews = false;
                        
                        // Traverse up to find a container that might have the view count
                        for (let i = 0; i < 5; i++) {
                            if (!container.parentElement) break;
                            container = container.parentElement;
                            
                            // Look for text ending in K, M, B or "views"
                            // This is a heuristic
                            const text = container.innerText || "";
                            // Regex for 1.2M, 500K, etc.
                            const matches = text.match(/(\\d+(\\.\\d+)?[KMB])/);
                            if (matches) {
                                const valStr = matches[0];
                                let multiplier = 1;
                                if (valStr.includes('K')) multiplier = 1000;
                                if (valStr.includes('M')) multiplier = 1000000;
                                if (valStr.includes('B')) multiplier = 1000000000;
                                
                                viewCount = parseFloat(valStr.replace(/[KMB]/, '')) * multiplier;
                                foundViews = true;
                                break; 
                            }
                        }
                        
                        items.push({
                            url: href,
                            views: viewCount
                        });
                    }
                });
                return items;
            }""")
            
            print(f"[TikTok] Found {len(video_data)} total video links.")
            
            # Deduplicate by URL
            seen_urls = set()
            unique_videos = []
            for v in video_data:
                if v['url'] not in seen_urls:
                    seen_urls.add(v['url'])
                    unique_videos.append(v)
            
            # Sort by Views Descending (FYP Logic)
            unique_videos.sort(key=lambda x: x['views'], reverse=True)
            
            print(f"[TikTok] Top 5 videos by views:")
            for v in unique_videos[:5]:
                print(f"- {v['views']} views: {v['url']}")

            # Return just URLs for compatibility, but sorted
            # Or better, update return type? 
            # The worker expects URLs. Let's return URLs but sorted.
            video_urls = [v['url'] for v in unique_videos[:max_results]]
            
        except Exception as e:
            print(f"[TikTok] Search failed: {e}")
            await page.screenshot(path="tiktok_search_error.png")
        finally:
            await context.close()
            await browser.close()
    
    return video_urls

async def get_tiktok_comments(video_url: str, max_comments: int = 20) -> List[Dict]:
    """
    Scrape TikTok comments using Playwright.
    Tries Mobile Emulation first (as per user request).
    If that fails (0 comments due to anti-bot), falls back to Desktop mode.
    """
    results = await _scrape_comments(video_url, max_comments, mobile=True)
    
    # Retry with Desktop if Mobile yields too few results (likely blocked or limited)
    if len(results) < 5:
        print(f"[TikTok] Mobile scraping yielded only {len(results)} results. Retrying with Desktop mode...")
        desktop_results = await _scrape_comments(video_url, max_comments, mobile=False)
        if len(desktop_results) > len(results):
            results = desktop_results
        
    return results

async def _scrape_comments(video_url: str, max_comments: int, mobile: bool = True) -> List[Dict]:
    results = []
    # proxy_str = choose_proxy()
    proxy_str = None # Force no proxy for debugging
    proxy_cfg = playwright_proxy_config(proxy_str)

    mode_str = "Mobile" if mobile else "Desktop"
    print(f"[TikTok] Starting {mode_str} scrape for: {video_url}")
    
    try:
        async with async_playwright() as p:
            # Setup Browser
            browser = await p.chromium.launch(
                headless=True, 
                proxy=proxy_cfg,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-infobars",
                    "--window-position=0,0",
                    "--ignore-certificate-errors",
                    "--ignore-certificate-errors-spki-list",
                    "--disable-web-security",
                ]
            )

            context_options = {
                "locale": 'id-ID',
                "timezone_id": 'Asia/Jakarta',
            }
            
            if mobile:
                device_name = 'iPhone 13'
                if device_name not in p.devices:
                    device_name = 'iPhone 12'
                context_options.update(p.devices[device_name])
            else:
                context_options.update({
                    "viewport": {"width": 1280, "height": 720},
                    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                })
            
            context = await browser.new_context(**context_options)
            
            await context.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });
            """)
            
            page = await context.new_page()

            # Capture API responses
            captured_comments = []
            
            async def handle_response(response):
                url = response.url
                ct = response.headers.get("content-type", "")
                if ("tiktokv.com" in url or "tiktok.com/api" in url or "comment" in url) and "json" in ct:
                    try:
                        body = await response.json()
                        keys = list(body.keys()) if isinstance(body, dict) else []
                        print(f"[TikTok] JSON Keys for {url}: {keys}")
                        found_comments = []
                        if isinstance(body, dict):
                            if "comments" in body and isinstance(body["comments"], list):
                                found_comments = body["comments"]
                            elif "data" in body and isinstance(body["data"], dict):
                                d = body["data"]
                                if "comments" in d and isinstance(d["comments"], list):
                                    found_comments = d["comments"]
                                elif "list" in d and isinstance(d["list"], list):
                                    found_comments = d["list"]
                            elif "item_module" in body and isinstance(body["item_module"], dict):
                                for _, v in body["item_module"].items():
                                    if isinstance(v, dict) and "comments" in v and isinstance(v["comments"], list):
                                        found_comments.extend(v["comments"])
                            else:
                                # Deep search for arrays of comment-like objects
                                def collect(obj, acc):
                                    if isinstance(obj, dict):
                                        for k, v in obj.items():
                                            if k == "comments" and isinstance(v, list):
                                                acc.extend(v)
                                            elif isinstance(v, (dict, list)):
                                                collect(v, acc)
                                    elif isinstance(obj, list):
                                        for it in obj:
                                            collect(it, acc)
                                tmp = []
                                collect(body, tmp)
                                if tmp:
                                    found_comments = tmp
                        if found_comments:
                            print(f"[TikTok] Intercepted {len(found_comments)} comments from {url}")
                            for c in found_comments:
                                user = c.get('user', {})
                                text = c.get('text') or c.get('share_info', {}).get('desc') or c.get('content', "")
                                username = user.get('nickname') or user.get('unique_id') or user.get('name') or "Unknown"
                                timestamp = c.get('create_time') or c.get('create_time_str')
                                captured_comments.append({
                                    "username": username,
                                    "text": text,
                                    "timestamp": datetime.fromtimestamp(timestamp).isoformat() if isinstance(timestamp, (int, float)) else datetime.now().isoformat(),
                                    "likes": c.get('digg_count', 0)
                                })
                    except Exception:
                        pass
            
            page.on("response", handle_response)
            page.on("console", lambda msg: print(f"[Browser Console] {msg.text}"))
                
            # Trigger loading
            try:
                await page.goto(video_url, timeout=60000, wait_until="domcontentloaded")
                await asyncio.sleep(random.uniform(3, 5)) # Wait for initial load
            except PlaywrightError as e:
                print(f"[TikTok] Navigation error (ignored): {e}")
            
            print(f"[TikTok] Current URL: {page.url}")
            title = await page.title()
            print(f"[TikTok] Page Title: {title}")
            
            # Handle Login Wall / Captcha (Basic mitigation)
            try:
                # Check for "launch-popup-close" based on debug inspection
                launch_close = await page.query_selector('[data-e2e="launch-popup-close"]')
                if launch_close:
                    print("[TikTok] Closing launch popup...")
                    await launch_close.click()
                    await asyncio.sleep(1)

                # Close "Open TikTok App" modal if it appears (common on mobile)
                close_buttons = await page.query_selector_all('button, div[role="button"]')
                for btn in close_buttons:
                    text_content = await btn.inner_text()
                    if any(x in text_content for x in ["Not now", "Lain kali", "Close", "Buka aplikasi", "Open App"]):
                        print(f"[TikTok] Closing modal with text: {text_content}")
                        await btn.click()
                        await asyncio.sleep(1)
            except Exception as e:
                print(f"[TikTok] Error handling modals: {e}")

            # Trigger Comment Section
            try:
                    # Remove annoying overlays that block interaction
                # Remove annoying overlays that block interaction
                await page.evaluate("""() => {
                    const selectors = [
                        '#tiktok-verify-ele', 
                        '[class*="modal"]',
                        '[class*="overlay"]',
                        '[class*="banner"]',
                        '.tiktok-cookie-banner',
                        '[data-e2e="browser-landing-page"]'
                    ];
                    selectors.forEach(sel => {
                        document.querySelectorAll(sel).forEach(el => el.remove());
                    });
                }""")
                
                # Click comment icon if comments are not visible
                comment_icon = await page.query_selector('[data-e2e="play-side-comment"]')
                if not comment_icon:
                     comment_icon = await page.query_selector('[data-e2e="comment-icon"]')
                
                if comment_icon:
                    print("[TikTok] Clicking comment icon to trigger API...")
                    try:
                        await page.locator('[data-e2e="play-side-comment"]').click(force=True)
                    except Exception:
                        await comment_icon.click()
                    await asyncio.sleep(3) # Wait for drawer to open
                    try:
                        await page.wait_for_selector('[data-e2e="comment-item"]', timeout=5000)
                    except Exception:
                        pass
                else:
                    print("[TikTok] Comment icon not found, trying scroll-only strategy...")
                
                # Also try clicking bottom comment button if available
                try:
                    bottom_btn = await page.query_selector('[data-e2e="comment-bottom-btn"]')
                    if bottom_btn:
                        print("[TikTok] Clicking bottom comment button...")
                        try:
                            await page.locator('[data-e2e="comment-bottom-btn"]').click(force=True)
                        except Exception:
                            await bottom_btn.click()
                        await asyncio.sleep(2)
                        try:
                            await page.wait_for_selector('[data-e2e="comment-item"]', timeout=5000)
                        except Exception:
                            pass
                except Exception:
                    pass
            except Exception as e:
                print(f"[TikTok] Error clicking comment icon: {e}")

            # ------------------------------------------------------------------
            # NEW STRATEGY: Extract Hydration Data (Script Tags)
            # ------------------------------------------------------------------
            print("[TikTok] Checking for hydration data (script tags)...")
            try:
                hydration_data = await page.evaluate("""() => {
                    const scripts = Array.from(document.querySelectorAll('script[type="application/json"]'));
                    for (const s of scripts) {
                        if (s.id.includes('UNIVERSAL_DATA') || s.textContent.includes('"comments":')) {
                            return s.textContent;
                        }
                    }
                    // Also check SIGI_STATE
                    if (window['SIGI_STATE']) {
                        return JSON.stringify(window['SIGI_STATE']);
                    }
                    return null;
                }""")

                if hydration_data:
                    print(f"[TikTok] Found hydration data (len={len(hydration_data)}). Parsing...")
                    import json
                    try:
                        data = json.loads(hydration_data)
                        # Traverse to find 'comments' list
                        # Common paths: 
                        # 1. default: { ... "comments": [...] }
                        # 2. ItemModule: { <video_id>: { "comments": ... } }
                        # 3. Comment: { "comments": ... }
                        
                        def find_comments_recursive(obj, found_comments):
                            if isinstance(obj, dict):
                                for k, v in obj.items():
                                    if k == 'comments' and isinstance(v, list):
                                        found_comments.extend(v)
                                    elif isinstance(v, (dict, list)):
                                        find_comments_recursive(v, found_comments)
                            elif isinstance(obj, list):
                                for item in obj:
                                    find_comments_recursive(item, found_comments)

                        extracted_comments = []
                        find_comments_recursive(data, extracted_comments)
                        
                        if extracted_comments:
                            print(f"[TikTok] Extracted {len(extracted_comments)} comments from hydration data!")
                            for c in extracted_comments:
                                # Map fields
                                try:
                                    # Adjust based on actual structure
                                    user = c.get('user', {})
                                    text = c.get('text') or c.get('share_info', {}).get('desc') or ""
                                    username = user.get('nickname') or user.get('unique_id') or "Unknown"
                                    timestamp = c.get('create_time')
                                    
                                    captured_comments.append({
                                        "username": username,
                                        "text": text,
                                        "timestamp": timestamp, # Need conversion?
                                        "likes": c.get('digg_count', 0)
                                    })
                                except:
                                    pass
                    except Exception as e:
                        print(f"[TikTok] Error parsing hydration data: {e}")
            except Exception as e:
                print(f"[TikTok] Error extracting hydration data: {e}")

            # Wait for comments to be captured (via Network)
            print("[TikTok] Waiting for comments to be captured...")
            
            # Scroll / Click "Load More" Loop
            for i in range(30): 
                if len(captured_comments) >= max_comments:
                    break
                
                print(f"[TikTok] Scroll/Load Loop {i+1}...")

                # 0. Remove blocking modals/overlays AGAIN
                try:
                    await page.evaluate("""() => {
                        const selectors = [
                            '#tiktok-verify-ele', 
                            '[class*="modal"]',
                            '[class*="overlay"]',
                            '[class*="login"]',
                            '[id*="login"]',
                            '.tiktok-cookie-banner'
                        ];
                        selectors.forEach(sel => {
                            document.querySelectorAll(sel).forEach(el => el.remove());
                        });
                    }""")
                except:
                    pass

                # 1. Try clicking "Load more comments" button (common in Mobile)
                try:
                    load_more = await page.query_selector('text="View more comments"')
                    if not load_more:
                        load_more = await page.query_selector('text="Lihat komentar lainnya"')
                    if not load_more:
                        load_more = await page.query_selector('text="Lihat lainnya"')
                    if not load_more:
                        load_more = await page.query_selector('button:has-text("Lihat lainnya")')
                    if not load_more:
                        load_more = await page.query_selector('text="Lihat balasan"')
                    if not load_more:
                        load_more = await page.query_selector('text="View replies"')
                    if not load_more:
                        load_more = await page.query_selector('[data-e2e="comment-bottom-btn"]')
                    if not load_more:
                        # Generic button at the bottom of list
                        load_more = await page.query_selector('.comment-list-container button')
                    
                    if load_more and await load_more.is_visible():
                        print("[TikTok] Found 'Load more' button, clicking (forced)...")
                        # Use JS click to bypass overlays/interceptors
                        await load_more.evaluate("el => el.click()")
                        await asyncio.sleep(4)
                        # allow DOM parse below
                except Exception as e:
                    print(f"[TikTok] Error clicking load more: {e}")

                # 2. Scroll main page
                try:
                    await page.mouse.wheel(0, 1000) # Scroll more
                    await page.evaluate("window.scrollBy(0, 1000)")
                except Exception:
                    pass
                
                # 3. JS Scroll specific container
                try:
                    await page.evaluate("""() => {
                        // Strategy 1: Scroll parent of comment-list-container
                        const listContainer = document.querySelector('.comment-list-container');
                        if (listContainer && listContainer.parentElement) {
                            listContainer.parentElement.scrollTop += 500;
                        }

                        // Strategy 2: Scroll last item into view
                        const items = document.querySelectorAll('[data-e2e="comment-item"]');
                        if (items.length > 0) {
                            const lastItem = items[items.length - 1];
                            lastItem.scrollIntoView({ behavior: "smooth", block: "end" });
                        }

                        // Strategy 3: Scroll window (sometimes needed for mobile view)
                        window.scrollBy(0, 500);
                    }""")
                except Exception:
                    pass
                
                # 4. Parse DOM incrementally to collect newly loaded comments
                try:
                    dom_items = await page.query_selector_all('[data-e2e="comment-item"]')
                    for item in dom_items:
                        try:
                            username = "Unknown"
                            user_els = await item.query_selector_all('a[href^="/@"]')
                            for u in user_els:
                                t = await u.inner_text()
                                if t.strip():
                                    username = t.strip()
                                    break
                            text_el = await item.query_selector('[data-e2e="comment-level-1"]')
                            text = ""
                            if not text_el:
                                ps = await item.query_selector_all('p')
                                for p in ps:
                                    t = await p.inner_text()
                                    if len(t) > 2 and t != username:
                                        text = t
                                        break
                            else:
                                text = await text_el.inner_text()
                            # Deduplicate by (username, text)
                            key = f"{username}|{text}"
                            # Initialize seen set outside loop
                            # We'll attach to page state via JS if needed; in Python keep a local set
                            # For simplicity, only append if not already present in captured_comments
                            if text and not any(c.get("username")==username and c.get("text")==text for c in captured_comments):
                                captured_comments.append({
                                    "username": username,
                                    "text": text,
                                    "timestamp": datetime.now().isoformat(),
                                    "likes": 0
                                })
                        except Exception:
                            pass
                except Exception as e:
                    print(f"[TikTok] Error parsing DOM incrementally: {e}")
                
                # Wait longer for network
                await asyncio.sleep(5)
            
            # Wait a bit more if needed
            if len(captured_comments) == 0:
                print("[TikTok] No comments captured yet, waiting longer (3s)...")
                await asyncio.sleep(3)

            # FALLBACK: If network interception failed, try DOM
            if not captured_comments:
                print("[TikTok] Network interception yielded 0 comments. Checking DOM...")
                comment_items = await page.query_selector_all('[data-e2e="comment-item"]')
                if comment_items:
                    print(f"[TikTok] Found {len(comment_items)} comments in DOM. Extracting...")
                    for item in comment_items:
                        try:
                            # Extract Username
                            username = "Unknown"
                            user_els = await item.query_selector_all('a[href^="/@"]')
                            for u in user_els:
                                t = await u.inner_text()
                                if t.strip():
                                    username = t.strip()
                                    break
                            
                            # Extract Text
                            text_el = await item.query_selector('[data-e2e="comment-level-1"]')
                            if not text_el:
                                # Try generic p tags inside
                                ps = await item.query_selector_all('p')
                                for p in ps:
                                    t = await p.inner_text()
                                    if len(t) > 2 and t != username:
                                        text_el = p
                                        break
                            
                            if not text_el:
                                # Fallback: Get all text and remove username and common UI text
                                all_text = await item.inner_text()
                                text = all_text.replace(username, "").replace("Reply", "").replace("Jawab", "").strip()
                                # Remove timestamps like 2024-9-15 or 1d ago (simplified)
                                import re
                                text = re.sub(r'\d{4}-\d{1,2}-\d{1,2}', '', text)
                                text = re.sub(r'\d+[wmhd] ago', '', text).strip()
                            else:
                                text = await text_el.inner_text()

                            if text:
                                captured_comments.append({
                                    "username": username,
                                    "text": text,
                                    "timestamp": datetime.now().isoformat(), # Fallback
                                    "likes": 0
                                })
                            else:
                                print(f"[TikTok] Found comment item but no text. Username: {username}")
                        except Exception as e:
                            print(f"Error parsing DOM comment: {e}")
                            pass
            
            results = captured_comments

            # Save Final HTML for debugging
            content = await page.content()
            with open(f"tiktok_{mode_str.lower()}_debug_final.html", "w", encoding="utf-8") as f:
                f.write(content)
            print(f"[TikTok] Saved Final HTML to tiktok_{mode_str.lower()}_debug_final.html")

    except Exception as e:
        print(f"[TikTok] Scrape failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        try:
            if 'context' in locals():
                await context.close()
        except:
            pass
        try:
            if 'browser' in locals():
                await browser.close()
        except:
            pass

    print(f"[TikTok] Total comments scraped ({mode_str}): {len(results)}")
    return results

if __name__ == "__main__":
    # Test
    # url = "https://www.tiktok.com/@gusbudii/video/7413756992717720840"
    url = "https://www.tiktok.com/@gusbudii/video/7413756992717720840"
    print(f"Testing scraper on {url}")
    # Standard flow (Mobile First)
    res = asyncio.run(get_tiktok_comments(url))
    print(res)
