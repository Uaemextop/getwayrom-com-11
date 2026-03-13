#!/usr/bin/env python3
"""
Process download_urls.md: extract real filenames from download links,
remove dead/expired links, and save results to firmware_ok.md.

Supports: Google Drive, MediaFire, Mega.nz, Google Docs, OneDrive.

Requires Python 3.10+.
Dependencies: aiohttp, cryptography, playwright
"""

import base64
import gc
import json
import os
import re
import struct
import sys
import asyncio
import time
from urllib.parse import urlparse, parse_qs, unquote

import aiohttp
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

INPUT_FILE = "download_urls.md"
OUTPUT_FILE = "firmware_ok.md"
CONCURRENCY = 100
REQUEST_TIMEOUT = 20
BATCH_SIZE = 500
PLAYWRIGHT_TIMEOUT = 20_000  # ms
PLAYWRIGHT_CONCURRENCY = 3  # max concurrent browser pages (avoid EPIPE)
GDRIVE_RETRIES = 2  # retries for rate-limited Google Drive requests
ONEDRIVE_RETRIES = 2  # Playwright attempts before HTTP HEAD fallback

# ── GitHub Actions log helpers ───────────────────────────────────────
_CI = os.environ.get("CI") == "true" or os.environ.get("GITHUB_ACTIONS") == "true"

_GREEN = "\033[32m"
_RED = "\033[31m"
_YELLOW = "\033[33m"
_CYAN = "\033[36m"
_BOLD = "\033[1m"
_RESET = "\033[0m"
_DIM = "\033[2m"


def gh_group(title: str) -> None:
    if _CI:
        print(f"::group::{title}", flush=True)
    else:
        print(f"\n{'─'*60}\n{_BOLD}{title}{_RESET}", flush=True)


def gh_endgroup() -> None:
    if _CI:
        print("::endgroup::", flush=True)
    else:
        print(f"{'─'*60}", flush=True)


def gh_info(msg: str) -> None:
    print(msg, flush=True)


def gh_notice(msg: str) -> None:
    if _CI:
        print(f"::notice::{msg}", flush=True)
    else:
        print(f"  {_CYAN}ℹ{_RESET} {msg}", flush=True)


def gh_warning(msg: str) -> None:
    if _CI:
        print(f"::warning::{msg}", flush=True)
    else:
        print(f"  {_YELLOW}⚠{_RESET} {msg}", flush=True)


def gh_error(msg: str) -> None:
    if _CI:
        print(f"::error::{msg}", flush=True)
    else:
        print(f"  {_RED}✖{_RESET} {msg}", flush=True)


# ── Regex patterns ───────────────────────────────────────────────────

LINE_RE = re.compile(
    r"^-\s+\*\*(.+?)\*\*\s*—\s*\[Download\]\((.+?)\)\s*$"
)

GDRIVE_VIRUS_PAGE_RE = re.compile(
    r'<a\s[^>]*href="/open\?id=[^"]*"[^>]*>([^<]+\.[a-zA-Z0-9]{1,10})</a>',
    re.I,
)

# Matches the virus-scan confirmation page filename in the "uc-name-size" span
GDRIVE_UC_NAME_RE = re.compile(
    r'<span\s+class="uc-name-size"[^>]*>\s*<a[^>]*>([^<]+)</a>',
    re.I,
)

MEDIAFIRE_FILENAME_RE = re.compile(
    r'class="filename">([^<]+)',
    re.I,
)

MEDIAFIRE_CDN_HOST_RE = re.compile(r"^download\d+\.mediafire\.com$")

# OneDrive page: file info embedded in JS as JSON
ONEDRIVE_FILENAME_RE = re.compile(
    r'"fileName"\s*:\s*"([^"]+)"',
)

# OneDrive page: "name":"file.ext" pattern (broader match for shared link previews)
ONEDRIVE_NAME_RE = re.compile(
    r'"name"\s*:\s*"([^"]+\.\w{2,7})"',
)

FIRMWARE_PLACEHOLDER_RE = re.compile(r"^firmware_\d+$")

# Sentinel returned by resolve_google_drive for login-restricted files
_RESTRICTED = "__LOGIN_RESTRICTED__"


# ── Playwright singleton ─────────────────────────────────────────────

_pw = None
_pw_browser = None
_pw_context = None
_pw_sem = None  # Semaphore to limit concurrent browser pages


async def _get_playwright_page():
    """Return a new Playwright page from a shared browser instance."""
    global _pw, _pw_browser, _pw_context, _pw_sem
    if _pw_browser is None:
        from playwright.async_api import async_playwright
        _pw = await async_playwright().start()
        _pw_browser = await _pw.chromium.launch(headless=True)
        _pw_context = await _pw_browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 720},
            locale="en-US",
        )
        _pw_sem = asyncio.Semaphore(PLAYWRIGHT_CONCURRENCY)
    return await _pw_context.new_page()


async def _close_playwright():
    global _pw, _pw_browser, _pw_context, _pw_sem
    try:
        if _pw_browser:
            await _pw_browser.close()
    except Exception:
        pass
    try:
        if _pw:
            await _pw.stop()
    except Exception:
        pass
    _pw = None
    _pw_browser = None
    _pw_context = None
    _pw_sem = None


# ── Filename extraction helpers ──────────────────────────────────────

def extract_google_drive_id(url: str) -> str | None:
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    if "id" in qs:
        return qs["id"][0]
    m = re.search(r"/d/([a-zA-Z0-9_-]+)", parsed.path)
    if m:
        return m.group(1)
    return None


def filename_from_mediafire_url(url: str) -> str | None:
    parsed = urlparse(url)
    parts = [p for p in parsed.path.split("/") if p]
    # MediaFire URL format: /file/{hash}/{filename}/file or /file_premium/{hash}/{filename}/file
    # The filename is always at index 2; parts[-1] may be "file" (trailing segment)
    if len(parts) >= 3 and parts[0] in ("file", "file_premium"):
        candidate = unquote(parts[2])
        if "." in candidate:
            return candidate
    return None


def _host_matches(host: str, domain: str) -> bool:
    return host == domain or host.endswith("." + domain)


def classify_url(url: str) -> str:
    host = (urlparse(url).hostname or "").lower()
    if host == "drive.google.com" or host == "drive.usercontent.google.com":
        return "gdrive"
    if host == "docs.google.com":
        return "gdocs"
    if _host_matches(host, "mediafire.com"):
        return "mediafire"
    if host == "mega.nz":
        return "mega"
    if _host_matches(host, "onedrive.live.com") or _host_matches(host, "1drv.ms"):
        return "onedrive"
    return "other"


def extract_filename_from_url(url: str) -> str | None:
    svc = classify_url(url)
    if svc == "mediafire":
        return filename_from_mediafire_url(url)
    return None


def parse_content_disposition(header: str) -> str | None:
    m = re.search(r"filename\*\s*=\s*(?:UTF-8''|utf-8'')(.+?)(?:;|$)", header, re.I)
    if m:
        return unquote(m.group(1).strip().strip('"'))
    m = re.search(r'filename\s*=\s*"?([^";]+)"?', header, re.I)
    if m:
        return unquote(m.group(1).strip())
    return None


def _onedrive_extract_resid(url: str) -> tuple[str | None, str | None]:
    """Extract (cid, resid) from a OneDrive URL query string."""
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    cid = qs.get("cid", [None])[0]
    resid = qs.get("id", qs.get("resid", [None]))[0]
    return cid, resid


# ── Mega.nz crypto helpers ───────────────────────────────────────────

def _mega_base64_decode(s: str) -> bytes:
    s = s.replace("-", "+").replace("_", "/")
    s += "=" * ((4 - len(s) % 4) % 4)
    return base64.b64decode(s)


def _mega_parse_url(url: str) -> tuple[str | None, str | None]:
    parsed = urlparse(url)
    parts = [p for p in parsed.path.split("/") if p]
    fragment = parsed.fragment
    if len(parts) >= 2 and parts[0] == "file" and fragment:
        return parts[1], fragment
    return None, None


def mega_decrypt_attrs(at_b64: str, key_b64: str) -> str | None:
    try:
        key_bytes = _mega_base64_decode(key_b64)
        if len(key_bytes) < 32:
            return None
        k = struct.unpack(">4I", key_bytes[:16])
        k2 = struct.unpack(">4I", key_bytes[16:32])
        aes_key = struct.pack(
            ">4I", k[0] ^ k2[0], k[1] ^ k2[1], k[2] ^ k2[2], k[3] ^ k2[3]
        )
        at_bytes = _mega_base64_decode(at_b64)
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(b"\x00" * 16))
        dec = cipher.decryptor()
        plaintext = dec.update(at_bytes) + dec.finalize()
        text = plaintext.decode("utf-8", errors="replace")
        if text.startswith("MEGA{"):
            text = text[4:]
            depth, end = 0, 0
            for i, c in enumerate(text):
                if c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                if depth == 0:
                    end = i + 1
                    break
            if end:
                attrs = json.loads(text[:end])
                return attrs.get("n")
    except Exception:
        pass
    return None


def _extract_gdrive_filename_from_html(html: str, file_id: str) -> str | None:
    """Extract filename from a Google Drive virus-scan or interstitial HTML page."""
    # Method 1: link with href="/open?id=..." whose text is the filename
    m = GDRIVE_VIRUS_PAGE_RE.search(html)
    if m:
        return m.group(1).strip()

    # Method 2: <span class="uc-name-size"><a ...>filename</a> ...
    m = GDRIVE_UC_NAME_RE.search(html)
    if m:
        return m.group(1).strip()

    # Method 3: page <title> sometimes contains the filename
    m = re.search(r"<title>([^<]+)</title>", html, re.I)
    if m:
        title = m.group(1).strip()
        for remove in ("Google Drive - ", "- Google Drive"):
            title = title.replace(remove, "").strip()
        if title and title.lower() not in (
            "quota exceeded", "not found", "google drive", ""
        ):
            # Only use title if it looks like a filename (has a dot for extension)
            if "." in title:
                return title

    # Detect quota-exceeded or "too many" pages as alive (file exists)
    lower = html.lower()
    if "quota exceeded" in lower or "too many users" in lower:
        return None

    # Detect "not found" pages
    if "not found" in lower and file_id not in html:
        return None

    return None


# ── Async resolvers ──────────────────────────────────────────────────

async def resolve_google_drive(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    file_id = extract_google_drive_id(url)
    if not file_id:
        return False, None

    direct_url = (
        f"https://drive.usercontent.google.com/download"
        f"?id={file_id}&export=download&confirm=t"
    )

    alive = False

    # Strategy 1: HEAD the direct usercontent download URL (with confirm=t).
    # This returns Content-Disposition with the real filename and avoids
    # the virus-scan HTML page entirely.
    for attempt in range(GDRIVE_RETRIES + 1):
        try:
            async with session.head(
                direct_url,
                allow_redirects=True,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as resp:
                if resp.status == 429 or resp.status == 503:
                    if attempt < GDRIVE_RETRIES:
                        await asyncio.sleep(2 ** attempt)
                        continue
                # Detect login redirect — file requires authentication
                if resp.url.host == "accounts.google.com":
                    return True, _RESTRICTED
                if resp.status < 400:
                    cd = resp.headers.get("Content-Disposition", "")
                    fname = parse_content_disposition(cd) if cd else None
                    if fname:
                        return True, fname
                    # HEAD returned 200 but no Content-Disposition: file exists,
                    # continue to GET strategies to extract the filename.
                    alive = True
                    break
                if resp.status >= 400:
                    break
        except Exception:
            if attempt < GDRIVE_RETRIES:
                await asyncio.sleep(2 ** attempt)
                continue
            break

    # Strategy 2: GET the usercontent URL — parses HTML virus-scan page for
    # the filename link.  Also handles quota-exceeded pages as alive.
    for attempt in range(GDRIVE_RETRIES + 1):
        try:
            async with session.get(
                direct_url,
                allow_redirects=True,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as resp:
                if resp.status == 429 or resp.status == 503:
                    if attempt < GDRIVE_RETRIES:
                        await asyncio.sleep(2 ** attempt)
                        continue
                if resp.status >= 400:
                    break
                # Detect login redirect — file requires authentication
                if resp.url.host == "accounts.google.com":
                    return True, _RESTRICTED

                alive = True
                cd = resp.headers.get("Content-Disposition", "")
                fname = parse_content_disposition(cd) if cd else None
                if fname:
                    return True, fname

                ct = resp.headers.get("Content-Type", "")
                if "text/html" in ct:
                    body = await resp.content.read(16384)
                    text = body.decode("utf-8", errors="replace")
                    fname = _extract_gdrive_filename_from_html(text, file_id)
                    if fname:
                        return True, fname
                break
        except Exception:
            if attempt < GDRIVE_RETRIES:
                await asyncio.sleep(2 ** attempt)
                continue
            break

    # Strategy 3: GET the file view page — the <title> tag contains the
    # filename even when the download quota is exceeded.  This is the most
    # reliable fallback for filename extraction.
    view_url = f"https://drive.google.com/file/d/{file_id}/view"
    for attempt in range(GDRIVE_RETRIES + 1):
        try:
            async with session.get(
                view_url,
                allow_redirects=True,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as resp:
                if resp.status == 429 or resp.status == 503:
                    if attempt < GDRIVE_RETRIES:
                        await asyncio.sleep(2 ** attempt)
                        continue
                if resp.status >= 400:
                    if not alive:
                        return False, None
                    break

                alive = True
                body = await resp.content.read(16384)
                text = body.decode("utf-8", errors="replace")
                m = re.search(r"<title>([^<]+)</title>", text, re.I)
                if m:
                    title = m.group(1).strip()
                    suffix = " - Google Drive"
                    if title.endswith(suffix):
                        title = title[: -len(suffix)].strip()
                    if title and title.lower() not in (
                        "google drive", "error", "sign in",
                    ):
                        return True, title
                break
        except Exception:
            if attempt < GDRIVE_RETRIES:
                await asyncio.sleep(2 ** attempt)
                continue
            break

    # If we know the file is alive from earlier strategies, return that.
    if alive:
        return True, None

    return False, None


async def resolve_mediafire(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    is_direct_cdn = bool(MEDIAFIRE_CDN_HOST_RE.match(host))

    # For direct CDN download URLs, try HEAD for Content-Disposition first
    if is_direct_cdn:
        try:
            async with session.head(
                url,
                allow_redirects=True,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as resp:
                if resp.status < 400:
                    cd = resp.headers.get("Content-Disposition", "")
                    fname = parse_content_disposition(cd) if cd else None
                    if fname:
                        return True, fname
                    return True, filename_from_mediafire_url(url)
                return False, filename_from_mediafire_url(url)
        except Exception:
            return False, filename_from_mediafire_url(url)

    try:
        async with session.get(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            final_url = str(resp.url)
            if resp.status >= 400 or "error.php" in final_url:
                return False, filename_from_mediafire_url(url)

            body = await resp.content.read(262144)
            text = body.decode("utf-8", errors="replace")

            if "invalid or deleted" in text.lower():
                return False, filename_from_mediafire_url(url)

            m = MEDIAFIRE_FILENAME_RE.search(text)
            if m:
                return True, m.group(1).strip()

            return True, filename_from_mediafire_url(url)
    except Exception:
        return False, filename_from_mediafire_url(url)


async def resolve_mega(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    handle, key_b64 = _mega_parse_url(url)
    if not handle:
        return False, None

    try:
        async with session.post(
            "https://g.api.mega.co.nz/cs",
            json=[{"a": "g", "g": 1, "p": handle}],
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            data = await resp.json(content_type=None)

            if not isinstance(data, list) or len(data) == 0:
                return False, None

            item = data[0]

            if isinstance(item, int):
                if item == -9:
                    return False, None
                if item == -16:
                    return False, None
                if item in (-11, -17):
                    return True, None
                return False, None

            if isinstance(item, dict):
                at_b64 = item.get("at", "")
                fname = None
                if at_b64 and key_b64:
                    fname = mega_decrypt_attrs(at_b64, key_b64)
                return True, fname

            return False, None
    except Exception:
        return False, None


async def resolve_gdocs(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    # Google Docs/Slides/Sheets pages return the real filename in the <title>
    # tag when accessed via GET (format: "filename.ext - Google Docs").
    try:
        async with session.get(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as resp:
            if resp.status >= 400:
                return False, None
            # Detect login redirect
            if resp.url.host == "accounts.google.com":
                return True, _RESTRICTED
            body = await resp.content.read(16384)
            text = body.decode("utf-8", errors="replace")
            m = re.search(r"<title>([^<]+)</title>", text, re.I)
            if m:
                title = m.group(1).strip()
                for suffix in (
                    " - Google Docs",
                    " - Google Slides",
                    " - Google Sheets",
                    " - Google Drive",
                ):
                    if title.endswith(suffix):
                        title = title[: -len(suffix)].strip()
                        break
                if title and title.lower() not in (
                    "google docs", "google slides", "google sheets",
                    "error", "sign in", "loading",
                ):
                    return True, title
            return True, None
    except Exception:
        return False, None


async def resolve_onedrive(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
    """
    Resolve OneDrive links using Playwright (headless Chrome) to bypass
    bot detection.  OneDrive SPAs require JS to render file information.

    Uses a dedicated semaphore (_pw_sem) to limit concurrent browser pages
    and avoid EPIPE crashes from too many simultaneous Chromium connections.
    Retries once on Playwright failure before falling back to HTTP HEAD.
    """
    global _pw_sem
    if _pw_sem is None:
        _pw_sem = asyncio.Semaphore(PLAYWRIGHT_CONCURRENCY)

    for attempt in range(ONEDRIVE_RETRIES):  # try Playwright before HTTP fallback
        async with _pw_sem:
            page = None
            try:
                page = await _get_playwright_page()
                resp = await page.goto(url, wait_until="domcontentloaded",
                                       timeout=PLAYWRIGHT_TIMEOUT)
                final_url = page.url

                # If redirected to login → requires auth, assume alive (private share)
                final_host = urlparse(final_url).hostname or ""
                if final_host == "login.live.com" or final_host == "login.microsoftonline.com":
                    await page.close()
                    return True, None

                # Wait for SPA JS to render — prefer networkidle for reliability,
                # fall back to fixed timeout if it takes too long.
                try:
                    await page.wait_for_load_state("networkidle", timeout=12000)
                except Exception:
                    await page.wait_for_timeout(6000)

                # Check for error indicators
                content = await page.content()
                title = await page.title()

                if any(s in content.lower() for s in [
                    "item might not exist",
                    "this item might have been deleted",
                    "isn't available",
                    "doesn't exist",
                    "item not found",
                ]):
                    await page.close()
                    return False, None

                # Extract filename from page content
                fname = None

                # Method 1: JS variable / JSON in page source — "fileName":"..."
                m = ONEDRIVE_FILENAME_RE.search(content)
                if m:
                    fname = m.group(1)

                # Method 2: Broader JSON pattern — "name":"file.ext"
                if not fname:
                    m = ONEDRIVE_NAME_RE.search(content)
                    if m:
                        fname = m.group(1)

                # Method 3: "Previewing filename.ext" in visible body text
                if not fname:
                    try:
                        body_text = await page.inner_text("body")
                        m = re.search(r"Previewing\s+(.+\.\w{2,7})\s*$", body_text, re.M)
                        if m:
                            fname = m.group(1).strip()
                    except Exception:
                        pass

                # Method 4: Try to read the visible filename from the rendered DOM
                if not fname:
                    try:
                        for sel in (
                            '[data-automationid="FieldRenderer-name"]',
                            '[data-automationid="FileNameCell"]',
                        ):
                            el = await page.query_selector(sel)
                            if el:
                                t = (await el.inner_text()).strip()
                                if t and len(t) > 3 and "." in t:
                                    fname = t
                                    break
                    except Exception:
                        pass

                # Method 5: Title often contains "filename - OneDrive"
                if not fname and title and " - " in title:
                    candidate = title.rsplit(" - ", 1)[0].strip()
                    if candidate and candidate.lower() != "onedrive":
                        fname = candidate

                try:
                    await page.close()
                except Exception:
                    pass

                # Determine liveness
                if resp and resp.status >= 400:
                    return False, fname
                if fname:
                    return True, fname
                # If alive but no filename, retry once to catch SPA timing issues
                if attempt == 0:
                    continue
                return True, fname
            except Exception:
                if page:
                    try:
                        await page.close()
                    except Exception:
                        pass
                if attempt == 0:
                    await asyncio.sleep(1)
                    continue
                # On final Playwright error, fall back to HTTP HEAD check
                try:
                    async with session.head(
                        url,
                        allow_redirects=True,
                        timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
                    ) as resp:
                        return resp.status < 400, None
                except Exception:
                    return False, None
    return False, None


async def resolve_other(
    session: aiohttp.ClientSession, url: str
) -> tuple[bool, str | None]:
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


# ── Entry processor ──────────────────────────────────────────────────

async def process_entry(
    session: aiohttp.ClientSession,
    semaphore: asyncio.Semaphore,
    original_name: str,
    url: str,
    line_num: int,
    cache: dict[str, tuple[bool, str | None]],
) -> tuple[int, str, str, str, bool]:
    svc = classify_url(url)
    resolver = RESOLVERS.get(svc, resolve_other)

    if svc == "gdrive":
        cache_key = extract_google_drive_id(url) or url
    elif svc == "mega":
        handle, _ = _mega_parse_url(url)
        cache_key = handle or url
    else:
        cache_key = url

    if cache_key in cache:
        alive, resolved_name = cache[cache_key]
    else:
        async with semaphore:
            alive, resolved_name = await resolver(session, url)
        cache[cache_key] = (alive, resolved_name)

    # Handle login-restricted sentinel: keep original name, don't use as filename
    if resolved_name == _RESTRICTED:
        resolved_name = None

    url_name = extract_filename_from_url(url)
    final_name = resolved_name or url_name or original_name

    return line_num, final_name, url, svc, alive


# ── Main ─────────────────────────────────────────────────────────────

async def main() -> None:
    wall_start = time.time()

    # ── Read input ────────────────────────────────────────────────
    gh_group("📂 Reading input file")
    try:
        with open(INPUT_FILE, encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        gh_error(f"Input file '{INPUT_FILE}' not found.")
        sys.exit(1)

    entries: list[tuple[int, str, str]] = []
    skipped = 0

    for i, raw_line in enumerate(lines, start=1):
        line = raw_line.strip()
        if not line:
            continue
        m = LINE_RE.match(line)
        if not m:
            skipped += 1
            continue
        entries.append((i, m.group(1), m.group(2)))

    svc_counts: dict[str, int] = {}
    for _, _, url in entries:
        svc = classify_url(url)
        svc_counts[svc] = svc_counts.get(svc, 0) + 1

    gh_info(f"  {_BOLD}Total entries:{_RESET} {len(entries)}")
    gh_info(f"  {_DIM}Unparseable lines skipped:{_RESET} {skipped}")
    for svc, cnt in sorted(svc_counts.items(), key=lambda x: -x[1]):
        gh_info(f"    {svc:<12} {cnt:>6}")
    gh_endgroup()

    # ── Process in parallel batches ───────────────────────────────
    sem = asyncio.Semaphore(CONCURRENCY)
    timeout = aiohttp.ClientTimeout(total=REQUEST_TIMEOUT, connect=10)
    connector = aiohttp.TCPConnector(
        limit=CONCURRENCY,
        limit_per_host=30,
        ttl_dns_cache=600,
        enable_cleanup_closed=True,
    )

    alive_entries: list[tuple[int, str, str]] = []
    dead_count = 0
    restricted_count = 0
    svc_alive: dict[str, int] = {}
    svc_dead: dict[str, int] = {}
    renamed_count = 0

    total = len(entries)
    num_batches = (total + BATCH_SIZE - 1) // BATCH_SIZE

    async with aiohttp.ClientSession(
        connector=connector,
        timeout=timeout,
        headers={"User-Agent": "Mozilla/5.0"},
    ) as session:
        # NOTE: Cookies are NOT injected into the aiohttp session or the
        # Playwright browser context.  Sending account cookies to Google
        # Drive causes Google to serve account-specific pages for ALL
        # requests, which breaks filename extraction for publicly-shared
        # files.  OneDrive shared links work without cookies too — the
        # Playwright extraction (networkidle wait + multiple regex
        # patterns) handles the SPA rendering reliably.

        cache: dict[str, tuple[bool, str | None]] = {}

        try:
            for batch_idx in range(num_batches):
                start = batch_idx * BATCH_SIZE
                end = min(start + BATCH_SIZE, total)
                batch = entries[start:end]

                pct_start = start * 100 // total
                pct_end = end * 100 // total
                gh_group(
                    f"🔍 Batch {batch_idx + 1}/{num_batches}  "
                    f"[{start + 1}–{end} of {total}]  ({pct_start}%–{pct_end}%)"
                )

                tasks = [
                    process_entry(session, sem, name, url, ln, cache)
                    for ln, name, url in batch
                ]
                results = await asyncio.gather(*tasks, return_exceptions=True)

                for res in results:
                    if isinstance(res, Exception):
                        dead_count += 1
                        continue

                    ln, final_name, url, svc, alive = res

                    if alive:
                        alive_entries.append((ln, final_name, url))
                        svc_alive[svc] = svc_alive.get(svc, 0) + 1

                        original = None
                        for _ln, _name, _url in batch:
                            if _ln == ln:
                                original = _name
                                break

                        # Check if this entry was login-restricted
                        is_restricted = False
                        if svc in ("gdrive", "gdocs"):
                            if svc == "gdrive":
                                ck = extract_google_drive_id(url) or url
                            else:
                                ck = url
                            cached = cache.get(ck)
                            if cached and cached[1] == _RESTRICTED:
                                is_restricted = True
                                restricted_count += 1

                        if original and final_name != original:
                            renamed_count += 1
                            gh_info(
                                f"  {_GREEN}✔{_RESET} {_BOLD}{final_name}{_RESET}"
                                f"  {_DIM}← {original}{_RESET}"
                            )
                        elif is_restricted:
                            gh_info(
                                f"  {_YELLOW}🔒{_RESET} {final_name}"
                                f"  {_DIM}(login-restricted){_RESET}"
                            )
                        else:
                            gh_info(
                                f"  {_GREEN}✔{_RESET} {final_name}"
                            )
                    else:
                        dead_count += 1
                        svc_dead[svc] = svc_dead.get(svc, 0) + 1
                        gh_info(f"  {_RED}✖{_RESET} {_DIM}DEAD{_RESET} {url[:80]}")

                gh_info(
                    f"  {_CYAN}Batch done:{_RESET} "
                    f"{_GREEN}{sum(1 for r in results if not isinstance(r, Exception) and r[4])} alive{_RESET}, "
                    f"{_RED}{sum(1 for r in results if isinstance(r, Exception) or not r[4])} dead{_RESET}"
                )
                gh_endgroup()
        finally:
            # Always close Playwright even if an error occurred
            await _close_playwright()

    alive_entries.sort(key=lambda x: x[0])

    # ── Write output ──────────────────────────────────────────────
    gh_group("💾 Writing output")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        for _, name, url in alive_entries:
            out.write(f"- **{name}** — [Download]({url})\n")
    gh_info(f"  Wrote {len(alive_entries)} entries to {_BOLD}{OUTPUT_FILE}{_RESET}")
    gh_endgroup()

    # ── Summary ───────────────────────────────────────────────────
    unresolved = sum(1 for _, name, _ in alive_entries if FIRMWARE_PLACEHOLDER_RE.match(name))
    elapsed = time.time() - wall_start
    gh_group("📊 Summary")
    gh_info(f"  {_BOLD}Total processed:{_RESET}  {total}")
    gh_info(f"  {_GREEN}Alive:{_RESET}             {len(alive_entries)}")
    gh_info(f"  {_RED}Dead/expired:{_RESET}      {dead_count}")
    gh_info(f"  {_CYAN}Renamed:{_RESET}           {renamed_count}")
    gh_info(f"  {_YELLOW}Unresolved:{_RESET}        {unresolved}")
    gh_info(f"  {_YELLOW}  🔒 Login-restricted:{_RESET} {restricted_count}")
    gh_info(f"  {_DIM}Cache hits:{_RESET}        {total - len(cache)}")
    gh_info(f"  {_DIM}Wall time:{_RESET}         {elapsed:.1f}s")
    gh_info("")
    gh_info(f"  {_BOLD}Per service (alive / dead):{_RESET}")
    all_svcs = sorted(set(list(svc_alive.keys()) + list(svc_dead.keys())))
    for svc in all_svcs:
        a = svc_alive.get(svc, 0)
        d = svc_dead.get(svc, 0)
        gh_info(f"    {svc:<12} {_GREEN}{a:>6} ✔{_RESET}  {_RED}{d:>6} ✖{_RESET}")
    gh_endgroup()

    gh_notice(
        f"Done: {len(alive_entries)} alive, {dead_count} dead, "
        f"{renamed_count} renamed, {unresolved} unresolved "
        f"({restricted_count} login-restricted) in {elapsed:.1f}s"
    )

    # Brief sleep so aiohttp/Playwright transports can finalize cleanly,
    # then force a GC pass while the event loop is still open.  This
    # prevents "Exception ignored in:" messages from __del__ methods that
    # would otherwise fire after asyncio.run() closes the loop.
    await asyncio.sleep(0.25)
    gc.collect()


if __name__ == "__main__":
    # ── Suppress "Event loop is closed" noise ────────────────────
    # After asyncio.run() completes, CPython's GC may finalize leftover
    # SSL transports whose __del__ calls loop.call_soon() on the now-
    # closed loop.  This surfaces as either a raised RuntimeError *or*
    # an "Exception ignored in:" message via sys.unraisablehook.
    # We suppress both.
    _orig_unraisablehook = sys.unraisablehook

    def _quiet_event_loop_closed(unraisable):
        if (isinstance(unraisable.exc_value, RuntimeError)
                and "Event loop is closed" in str(unraisable.exc_value)):
            return
        _orig_unraisablehook(unraisable)

    sys.unraisablehook = _quiet_event_loop_closed
    try:
        asyncio.run(main())
    except RuntimeError as exc:
        if "Event loop is closed" not in str(exc):
            raise
    finally:
        sys.unraisablehook = _orig_unraisablehook
