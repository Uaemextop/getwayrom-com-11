#!/usr/bin/env python3
"""
Process download_urls.md: extract real filenames from download links,
remove dead/expired links, and save results to firmware_ok.md.

Supports: Google Drive, MediaFire, Mega.nz, Google Docs, OneDrive.

Requires Python 3.10+ (uses X | Y union type syntax).
"""

import re
import sys
import asyncio
import logging
from urllib.parse import urlparse, parse_qs, unquote

import aiohttp

INPUT_FILE = "download_urls.md"
OUTPUT_FILE = "firmware_ok.md"
CONCURRENCY = 20
REQUEST_TIMEOUT = 30
PROGRESS_INTERVAL = 500

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ── Regex to parse each markdown line ────────────────────────────────
LINE_RE = re.compile(
    r"^-\s+\*\*(.+?)\*\*\s*—\s*\[Download\]\((.+?)\)\s*$"
)


# ── Filename extraction helpers ──────────────────────────────────────

def extract_google_drive_id(url: str) -> str | None:
    """Return the Google Drive file ID from various URL forms."""
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    if "id" in qs:
        return qs["id"][0]
    # /d/FILE_ID/ pattern
    m = re.search(r"/d/([a-zA-Z0-9_-]+)", parsed.path)
    if m:
        return m.group(1)
    return None


def filename_from_mediafire_url(url: str) -> str | None:
    """
    MediaFire URLs look like:
      https://www.mediafire.com/file/<key>/<filename>/file
    The filename is the second-to-last path segment (URL-encoded).
    """
    parsed = urlparse(url)
    parts = [p for p in parsed.path.split("/") if p]
    # Expected: ['file', '<key>', '<filename>', 'file']
    if len(parts) >= 4 and parts[0] == "file" and parts[-1] == "file":
        return unquote(parts[-2])
    return None


def filename_from_mega_url(url: str) -> str | None:
    """
    Mega.nz URLs:  https://mega.nz/file/<handle>#<key>
    We cannot resolve the real filename without the Mega SDK,
    so we return None and will rely on the HTTP check later.
    """
    return None


def _host_matches(host: str, domain: str) -> bool:
    """Check that *host* is exactly *domain* or a subdomain of it."""
    return host == domain or host.endswith("." + domain)


def classify_url(url: str) -> str:
    """Return a service tag for the URL."""
    host = (urlparse(url).hostname or "").lower()
    if host == "drive.google.com" or host == "drive.usercontent.google.com":
        return "gdrive"
    if host == "docs.google.com":
        return "gdocs"
    if _host_matches(host, "mediafire.com"):
        return "mediafire"
    if host == "mega.nz":
        return "mega"
    if host == "onedrive.live.com":
        return "onedrive"
    return "other"


def extract_filename_from_url(url: str) -> str | None:
    """Try to extract a real filename from the URL alone (no HTTP)."""
    svc = classify_url(url)
    if svc == "mediafire":
        return filename_from_mediafire_url(url)
    # For other services the filename is not embedded in the URL
    return None


def parse_content_disposition(header: str) -> str | None:
    """Extract filename from a Content-Disposition header value."""
    # Try filename*= (RFC 5987)
    m = re.search(r"filename\*\s*=\s*(?:UTF-8''|utf-8'')(.+?)(?:;|$)", header, re.I)
    if m:
        return unquote(m.group(1).strip().strip('"'))
    # Try plain filename=
    m = re.search(r'filename\s*=\s*"?([^";]+)"?', header, re.I)
    if m:
        return unquote(m.group(1).strip())
    return None


# ── Async link-checking / filename resolution ────────────────────────

async def resolve_google_drive(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """
    Check a Google Drive link.
    Returns (is_alive, resolved_filename_or_None).
    """
    file_id = extract_google_drive_id(url)
    if not file_id:
        return False, None

    check_url = (
        f"https://drive.google.com/uc?id={file_id}&export=download"
    )
    try:
        async with session.get(
            check_url, allow_redirects=True, timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
        ) as resp:
            if resp.status >= 400:
                return False, None

            # Check Content-Disposition first
            cd = resp.headers.get("Content-Disposition", "")
            fname = parse_content_disposition(cd) if cd else None

            # Google may serve an HTML "virus scan" warning page for big files.
            # In that case Content-Type will be text/html and there is no
            # Content-Disposition.  The file is still alive.
            ct = resp.headers.get("Content-Type", "")
            if fname:
                return True, fname
            if "text/html" in ct:
                # Read a snippet to see if it's the download-warning page
                body = await resp.content.read(4096)
                text = body.decode("utf-8", errors="replace")
                if "download" in text.lower() and file_id in text:
                    # Still alive, just needs confirmation
                    return True, None
                # Could be an error page
                if "not found" in text.lower() or "sorry" in text.lower():
                    return False, None
                return True, None
            # Non-HTML, non-CD (shouldn't happen, but treat as alive)
            return True, fname
    except Exception:
        return False, None


async def resolve_mediafire(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """Check MediaFire link liveness via HEAD."""
    fname = filename_from_mediafire_url(url)
    try:
        async with session.head(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            if resp.status >= 400:
                return False, fname
            return True, fname
    except Exception:
        return False, fname


async def resolve_mega(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """
    Check Mega.nz link.  Without the Mega SDK we do a simple GET
    to see if the page returns a valid response or an error/expired page.
    """
    try:
        async with session.get(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            if resp.status >= 400:
                return False, None
            body = await resp.content.read(8192)
            text = body.decode("utf-8", errors="replace")
            # Mega shows specific error strings for expired/removed files
            if any(
                s in text.lower()
                for s in [
                    "the file you are trying to download is no longer available",
                    "link not available",
                    "file has been removed",
                    "taken down",
                ]
            ):
                return False, None
            return True, None
    except Exception:
        return False, None


async def resolve_gdocs(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """
    Google Docs links are documents, not firmware files.
    We check if they are accessible but cannot extract a firmware filename.
    """
    try:
        async with session.head(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            return resp.status < 400, None
    except Exception:
        return False, None


async def resolve_onedrive(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """Check OneDrive link liveness."""
    try:
        async with session.head(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            if resp.status >= 400:
                return False, None
            cd = resp.headers.get("Content-Disposition", "")
            fname = parse_content_disposition(cd) if cd else None
            return True, fname
    except Exception:
        return False, None


async def resolve_other(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """Generic HEAD check for unknown services."""
    try:
        async with session.head(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            if resp.status >= 400:
                return False, None
            cd = resp.headers.get("Content-Disposition", "")
            fname = parse_content_disposition(cd) if cd else None
            return True, fname
    except Exception:
        return False, None


RESOLVERS = {
    "gdrive": resolve_google_drive,
    "mediafire": resolve_mediafire,
    "mega": resolve_mega,
    "gdocs": resolve_gdocs,
    "onedrive": resolve_onedrive,
    "other": resolve_other,
}


# ── Main processing ──────────────────────────────────────────────────

async def process_entry(
    session: aiohttp.ClientSession,
    semaphore: asyncio.Semaphore,
    original_name: str,
    url: str,
    line_num: int,
) -> tuple[int, str, str, bool] | None:
    """
    Process one entry: resolve filename, check liveness.
    Returns (line_num, final_name, url, alive) or None on parse error.
    """
    svc = classify_url(url)
    resolver = RESOLVERS.get(svc, resolve_other)

    async with semaphore:
        alive, resolved_name = await resolver(session, url)

    # Determine final filename:
    #   1. Use HTTP-resolved name if available
    #   2. Use URL-extracted name (e.g. MediaFire) if available
    #   3. Fall back to original name from the markdown
    url_name = extract_filename_from_url(url)
    final_name = resolved_name or url_name or original_name

    return line_num, final_name, url, alive


async def main() -> None:
    # ── Read input ────────────────────────────────────────────────────
    try:
        with open(INPUT_FILE, encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        log.error("Input file '%s' not found.", INPUT_FILE)
        sys.exit(1)

    entries: list[tuple[int, str, str]] = []  # (line_num, name, url)
    skipped = 0

    for i, raw_line in enumerate(lines, start=1):
        line = raw_line.strip()
        if not line:
            continue
        m = LINE_RE.match(line)
        if not m:
            log.warning("Line %d: cannot parse – skipped.", i)
            skipped += 1
            continue
        entries.append((i, m.group(1), m.group(2)))

    log.info(
        "Parsed %d entries from %s (%d unparseable lines skipped).",
        len(entries),
        INPUT_FILE,
        skipped,
    )

    # ── Resolve & check ──────────────────────────────────────────────
    sem = asyncio.Semaphore(CONCURRENCY)
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, force_close=True)

    async with aiohttp.ClientSession(
        connector=connector,
        headers={"User-Agent": "Mozilla/5.0"},
    ) as session:
        tasks = [
            process_entry(session, sem, name, url, ln)
            for ln, name, url in entries
        ]

        alive_entries: list[tuple[int, str, str]] = []
        dead_count = 0
        done = 0
        total = len(tasks)

        for coro in asyncio.as_completed(tasks):
            result = await coro
            done += 1
            if done % PROGRESS_INTERVAL == 0 or done == total:
                log.info("Progress: %d / %d checked.", done, total)
            if result is None:
                continue
            ln, final_name, url, alive = result
            if alive:
                alive_entries.append((ln, final_name, url))
            else:
                dead_count += 1

    # Sort by original line number to preserve order
    alive_entries.sort(key=lambda x: x[0])

    # ── Write output ─────────────────────────────────────────────────
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for idx, (_, name, url) in enumerate(alive_entries, start=1):
            out.write(f"- **{name}** — [Download]({url})\n")

    log.info(
        "Done. %d alive entries written to %s. %d dead/expired links removed.",
        len(alive_entries),
        OUTPUT_FILE,
        dead_count,
    )


if __name__ == "__main__":
    asyncio.run(main())
