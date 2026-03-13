import asyncio
from playwright.async_api import async_playwright, Error as PlaywrightError
import json
import os

async def run():
    async with async_playwright() as p:
        # Gunakan Mobile Emulation seperti saran user
        device = p.devices['iPhone 13']
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(**device)
        page = await context.new_page()

        print("Listening for network responses...")
        
        # Store captured responses
        captured_data = []

        async def handle_response(response):
            try:
                url = response.url
                # Log interesting URLs
                if "tiktok" in url or "mcs-sg" in url:
                    if "api" in url or "list" in url or "comment" in url:
                        print(f"API REQUEST: {url.split('?')[0]}")
                
                # Special debug for comment API
                if "api/comment/list" in url:
                    print(f"*** DEBUG: HIT COMMENT API: {url} ***")
                    print(f"Content-Type: {response.headers.get('content-type')}")
                    try:
                        text = await response.text()
                        print(f"Response Length: {len(text)}")
                        print(f"Response Preview: {text[:500]}")
                        
                        captured_data.append({
                            "url": url,
                            "data": json.loads(text) if len(text) > 0 else "EMPTY"
                        })
                    except Exception as e:
                        print(f"Error reading comment API: {e}")

                # Check ALL JSON responses for comments, regardless of URL
                if "tiktok" in url or "tiktokv" in url:
                    try:
                        # Only try to parse if content-type is json or text (skip images/media)
                        content_type = response.headers.get('content-type', '')
                        if 'application/json' in content_type or 'text/' in content_type:
                             text = await response.text()
                             if len(text) > 0 and (text.startswith('{') or text.startswith('[')):
                                try:
                                    data = json.loads(text)
                                    # Check for comments structure
                                    found_comments = False
                                    if isinstance(data, dict):
                                        if "comments" in data and isinstance(data["comments"], list):
                                            found_comments = True
                                        elif "data" in data and isinstance(data["data"], dict) and "comments" in data["data"]:
                                            found_comments = True
                                    
                                    if found_comments:
                                        print(f"!!! FOUND COMMENTS IN RESPONSE !!!")
                                        print(f"URL: {url}")
                                        captured_data.append({
                                            "url": url,
                                            "data": data
                                        })
                                        print(f"Found comments data structure!")
                                    elif "mcs-sg" in url:
                                         # Keep logging MCS for reference but don't clutter too much
                                         pass
                                    else:
                                        # Log other interesting APIs
                                        if "api" in url:
                                            print(f"API (no comments): {url.split('?')[0]}")
                                            
                                except:
                                    pass
                    except:
                        pass

            except Exception as e:
                pass
        
        page.on("response", handle_response)
        
        url = "https://www.tiktok.com/@gusbudii/video/7413756992717720840"
        print(f"Navigating to {url}...")
        try:
            await page.goto(url, timeout=60000)
            await page.wait_for_load_state("networkidle", timeout=10000)
        except PlaywrightError as e:
            print(f"Navigation error (continuing): {e}")
        except Exception as e:
            print(f"General error during nav: {e}")
        
        # Save HTML for inspection
        try:
            content = await page.content()
            with open("tiktok_mobile_debug.html", "w", encoding="utf-8") as f:
                f.write(content)
            print("Saved HTML to tiktok_mobile_debug.html")
        except:
            pass

        await page.wait_for_timeout(3000)
        
        # Try to close "Get App" banner safely
        print("Closing banners...")
        try:
            # Use Playwright's click for better reliability
            banner_selectors = [
                '[data-e2e="launch-popup-close"]',
                'button[class*="Close"]',
                '[data-e2e="banner-close"]', 
                '#neptune_tiktok_web_banner_close',
                '.tiktok-cookie-banner button',
                'button:has-text("Decline all")',
                'button:has-text("Allow all")'
            ]
            
            for selector in banner_selectors:
                if await page.query_selector(selector):
                    try:
                        print(f"Clicking banner: {selector}")
                        await page.click(selector, timeout=2000)
                        await page.wait_for_timeout(1000)
                    except:
                        pass
        except:
            pass
            
        await page.wait_for_timeout(2000)

        # Scroll trigger as suggested
        print("Scrolling to trigger loading...")
        await page.mouse.wheel(0, 500)
        await page.wait_for_timeout(2000)

        # Click comment button
        print("Clicking comment button...")
        comment_clicked = False
        
        # Primary selector from inspection
        primary_selector = '[data-e2e="play-side-comment"]'
        
        try:
            if await page.query_selector(primary_selector):
                print(f"Clicking primary comment selector: {primary_selector}")
                await page.click(primary_selector, timeout=3000)
                comment_clicked = True
                await page.wait_for_timeout(2000)
        except Exception as e:
            print(f"Error clicking primary selector: {e}")

        if not comment_clicked:
            comment_selectors = [
                '[data-e2e="comment-icon"]', 
                'span[class*="icon"]',
                'div[class*="action-item"]'
            ]
            
            for selector in comment_selectors:
                try:
                    elements = await page.query_selector_all(selector)
                    for el in elements:
                        # Check if it looks like a comment button
                        html = await el.evaluate("el => el.outerHTML")
                        if "comment" in html.lower():
                            print(f"Clicking comment element: {selector}")
                            await el.click(timeout=2000)
                            comment_clicked = True
                            await page.wait_for_timeout(1000)
                            break
                    if comment_clicked:
                        break
                except Exception as e:
                    print(f"Error clicking {selector}: {e}")

        if not comment_clicked:
            print("Could not find/click comment button via Playwright. Trying JS fallback...")
            await page.evaluate("""() => {
                 const selectors = [
                    '[data-e2e="play-side-comment"]',
                    '[data-e2e="comment-icon"]', 
                    'button'
                 ];
                 for (let s of selectors) {
                     const els = document.querySelectorAll(s);
                     for (let el of els) {
                         if (el.innerHTML.includes('comment') || el.getAttribute('data-e2e')?.includes('comment')) {
                             el.click();
                         }
                     }
                 }
            }""")
                 
        # Scroll down more
        await page.mouse.wheel(0, 500)
        
        # Wait longer for network requests
        print("Waiting for network activity...")
        await page.wait_for_timeout(15000)
        
        # Take a screenshot to verify state
        try:
            await page.screenshot(path="debug_screenshot.png")
            print("Saved screenshot to debug_screenshot.png")
        except:
            print("Failed to take screenshot")

        print(f"Captured {len(captured_data)} API responses.")
        
        # Save captured data
        if captured_data:
            with open("tiktok_comments_found.json", "w", encoding="utf-8") as f:
                json.dump(captured_data, f, indent=2, ensure_ascii=False)
            print("Saved captured comments to tiktok_comments_found.json")
        else:
            print("No comment API responses captured.")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
