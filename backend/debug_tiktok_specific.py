import asyncio
from playwright.async_api import async_playwright
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        url = "https://www.tiktok.com/@gusbudii/video/7413756992717720840"
        print(f"Opening {url}...")
        await page.goto(url, timeout=60000)
        await page.wait_for_load_state("networkidle")
        
        # Coba scroll sedikit untuk memicu loading komentar
        await page.evaluate("window.scrollBy(0, 500)")
        await asyncio.sleep(5)
        
        # Coba klik ikon komentar jika ada (untuk mode modal)
        try:
            # Mencari tombol yang mungkin membuka komentar (span dengan class ikon atau atribut data)
            # Seringkali tombol komentar memiliki testid 'comment-icon' atau semacamnya
            print("Mencoba mencari tombol komentar...")
            await page.evaluate("""() => {
                const buttons = Array.from(document.querySelectorAll('button, span[role="button"]'));
                const commentBtn = buttons.find(b => b.innerHTML.includes('comment') || b.getAttribute('data-e2e') === 'comment-icon');
                if (commentBtn) commentBtn.click();
            }""")
            await asyncio.sleep(3)
        except Exception as e:
            print(f"Error clicking comment icon: {e}")

        # Dump HTML untuk analisis
        content = await page.content()
        with open("tiktok_specific_debug.html", "w", encoding="utf-8") as f:
            f.write(content)
        
        print("HTML saved to tiktok_specific_debug.html")

        # Coba cari elemen komentar dengan berbagai strategi
        print("\n--- Analisis Elemen Komentar ---")
        
        # 1. Cari berdasarkan text umum di komentar (jika ada komentar yang kita tahu, tapi kita tidak tahu)
        # Jadi kita cari container yang umum
        
        # Evaluasi JS untuk mencari elemen yang mirip komentar
        comments_info = await page.evaluate("""() => {
            const divs = Array.from(document.querySelectorAll('div'));
            const potentialComments = divs.filter(d => {
                const cls = d.className || "";
                return (cls.includes("Comment") || cls.includes("comment")) && 
                       (cls.includes("Item") || cls.includes("item") || cls.includes("Content"));
            });
            
            return potentialComments.map(d => ({
                class: d.className,
                text_preview: d.innerText.substring(0, 50),
                attributes: Array.from(d.attributes).map(a => `${a.name}="${a.value}"`)
            }));
        }""")
        
        print(f"Ditemukan {len(comments_info)} elemen potensial komentar:")
        for info in comments_info[:10]:
            print(json.dumps(info, indent=2))
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
