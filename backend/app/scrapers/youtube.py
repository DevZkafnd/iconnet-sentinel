from typing import List, Dict
from youtubesearchpython import VideosSearch
from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_POPULAR

def search_videos_by_queries(queries: List[str], max_results_total: int = 20) -> List[Dict]:
    results: List[Dict] = []
    seen = set()
    for q in queries:
        try:
            search = VideosSearch(q, limit=10)
            data = search.result().get("result", [])
            for v in data:
                url = v.get("link")
                if not url or url in seen:
                    continue
                title = v.get("title") or ""
                ch = v.get("channel") or {}
                channel_name = ch.get("name") if isinstance(ch, dict) else (ch or "")
                results.append({
                    "url": url,
                    "title": title,
                    "channel": channel_name
                })
                seen.add(url)
                if len(results) >= max_results_total:
                    return results
        except Exception:
            continue
    return results

def get_youtube_comments(video_url: str, max_comments: int = 20) -> List[Dict]:
    out: List[Dict] = []
    try:
        downloader = YoutubeCommentDownloader()
        comments = downloader.get_comments_from_url(video_url, sort_by=SORT_BY_POPULAR)
        for c in comments:
            if len(out) >= max_comments:
                break
            cid = c.get("cid") or c.get("commentId")
            link = f"{video_url}&lc={cid}" if cid else video_url
            out.append({
                "author": c.get("author") or "",
                "content": c.get("text") or "",
                "external_ref": cid or "",
                "external_url": link
            })
    except Exception:
        return out
    return out
