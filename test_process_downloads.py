#!/usr/bin/env python3
"""
Comprehensive tests for process_downloads.py.

Validates service detection, filename extraction, line parsing,
and the end-to-end processing pipeline using mocked HTTP responses.
"""

import asyncio
import unittest
from unittest.mock import AsyncMock, MagicMock, patch

from process_downloads import (
    LINE_RE,
    GDRIVE_VIRUS_PAGE_RE,
    classify_url,
    extract_filename_from_url,
    extract_google_drive_id,
    filename_from_mediafire_url,
    parse_content_disposition,
    process_entry,
    resolve_google_drive,
    resolve_mediafire,
    resolve_mega,
    resolve_gdocs,
    resolve_onedrive,
    resolve_other,
    _host_matches,
)


# ─── LINE_RE – markdown line parsing ────────────────────────────────

class TestLineRegex(unittest.TestCase):
    """Ensure every real line format from download_urls.md is parsed."""

    CASES = [
        # Google Drive /uc
        (
            '- **firmware_10** — [Download](https://drive.google.com/uc?id=1xS2ij1H9_sA0RplzpqVOyA1yJiymvsj5&export=download)',
            "firmware_10",
            "https://drive.google.com/uc?id=1xS2ij1H9_sA0RplzpqVOyA1yJiymvsj5&export=download",
        ),
        # Google Drive usercontent + confirm
        (
            '- **firmware_24** — [Download](https://drive.usercontent.google.com/download?id=1wJDpupHu00jlchwtmB7245axkINU0FUw&export=download&confirm=t)',
            "firmware_24",
            "https://drive.usercontent.google.com/download?id=1wJDpupHu00jlchwtmB7245axkINU0FUw&export=download&confirm=t",
        ),
        # Google Drive usercontent + authuser
        (
            '- **firmware_718** — [Download](https://drive.usercontent.google.com/download?id=14QokykGIZCsZxveH4CD80WxPdM_sLHz0&export=download&authuser=0)',
            "firmware_718",
            "https://drive.usercontent.google.com/download?id=14QokykGIZCsZxveH4CD80WxPdM_sLHz0&export=download&authuser=0",
        ),
        # Google Drive usercontent with only authuser (no export)
        (
            '- **firmware_4630** — [Download](https://drive.usercontent.google.com/download?id=1w9PdcG96x8S9QcMdM0DGBGCS6oK-6yae&authuser=0)',
            "firmware_4630",
            "https://drive.usercontent.google.com/download?id=1w9PdcG96x8S9QcMdM0DGBGCS6oK-6yae&authuser=0",
        ),
        # Real filename already present
        (
            '- **RMX3842export_11_15.0.0.600EX01_2025022610340159.zip** — [Download](https://drive.usercontent.google.com/download?id=16zQzcw27200Nzt747TfQ7PmTLbrRk7xs&export=download&confirm=t)',
            "RMX3842export_11_15.0.0.600EX01_2025022610340159.zip",
            "https://drive.usercontent.google.com/download?id=16zQzcw27200Nzt747TfQ7PmTLbrRk7xs&export=download&confirm=t",
        ),
        # MediaFire with URL-encoded filename
        (
            '- **firmware_352** — [Download](https://www.mediafire.com/file/s6d27sm97ynp6gf/Redmi_Note_7_%2528lavender%2529_devcfg.mbn_ENG_File.rar/file)',
            "firmware_352",
            "https://www.mediafire.com/file/s6d27sm97ynp6gf/Redmi_Note_7_%2528lavender%2529_devcfg.mbn_ENG_File.rar/file",
        ),
        # MediaFire with tar.gz
        (
            '- **firmware_369** — [Download](https://www.mediafire.com/file/qbdqacfzsz67wnf/PD1224CW_EX_A_1.6.14_vivo_mtk_ALPS.KK1.MP1.V2.46_20141107_mtk6582.tar.gz/file)',
            "firmware_369",
            "https://www.mediafire.com/file/qbdqacfzsz67wnf/PD1224CW_EX_A_1.6.14_vivo_mtk_ALPS.KK1.MP1.V2.46_20141107_mtk6582.tar.gz/file",
        ),
        # Mega.nz
        (
            '- **firmware_167** — [Download](https://mega.nz/file/N3gCkYgS#a6_tVYORq7HxkJ4MXKGraWF7-MlNbUodfdp8-ltJm_s)',
            "firmware_167",
            "https://mega.nz/file/N3gCkYgS#a6_tVYORq7HxkJ4MXKGraWF7-MlNbUodfdp8-ltJm_s",
        ),
        # Google Docs
        (
            '- **firmware_3345** — [Download](https://docs.google.com/document/d/1dbQdX2udzxW678IHdkd2W_Wi_H4yvoPg/edit?usp=sharing&ouid=114663682457484431690&rtpof=true&sd=true)',
            "firmware_3345",
            "https://docs.google.com/document/d/1dbQdX2udzxW678IHdkd2W_Wi_H4yvoPg/edit?usp=sharing&ouid=114663682457484431690&rtpof=true&sd=true",
        ),
        # OneDrive
        (
            '- **firmware_4728** — [Download](https://onedrive.live.com/?cid=618C887397DD1F1D&id=618C887397DD1F1D%2114582&parId=root&o=OneUp&download=1)',
            "firmware_4728",
            "https://onedrive.live.com/?cid=618C887397DD1F1D&id=618C887397DD1F1D%2114582&parId=root&o=OneUp&download=1",
        ),
    ]

    def test_all_line_formats(self):
        for line, expected_name, expected_url in self.CASES:
            with self.subTest(line=line[:60]):
                m = LINE_RE.match(line)
                self.assertIsNotNone(m, f"LINE_RE failed to match: {line}")
                self.assertEqual(m.group(1), expected_name)
                self.assertEqual(m.group(2), expected_url)

    def test_empty_line_does_not_match(self):
        self.assertIsNone(LINE_RE.match(""))

    def test_malformed_line_does_not_match(self):
        self.assertIsNone(LINE_RE.match("random text"))
        self.assertIsNone(LINE_RE.match("- **name** [Download](url)"))  # missing —


# ─── classify_url – service detection ────────────────────────────────

class TestClassifyUrl(unittest.TestCase):
    """Verify every supported service is correctly identified."""

    CASES = [
        # Google Drive variants
        ("https://drive.google.com/uc?id=ABC&export=download", "gdrive"),
        ("https://drive.usercontent.google.com/download?id=ABC&export=download&confirm=t", "gdrive"),
        ("https://drive.usercontent.google.com/download?id=ABC&authuser=0", "gdrive"),
        ("https://drive.usercontent.google.com/download?id=ABC&export=download&authuser=1", "gdrive"),
        # Google Docs
        ("https://docs.google.com/document/d/1db/edit?usp=sharing", "gdocs"),
        # MediaFire
        ("https://www.mediafire.com/file/key/filename.zip/file", "mediafire"),
        ("https://mediafire.com/file/key/filename.zip/file", "mediafire"),
        # Mega.nz
        ("https://mega.nz/file/ABC#key", "mega"),
        # OneDrive
        ("https://onedrive.live.com/?cid=123&download=1", "onedrive"),
        # Unknown
        ("https://example.com/firmware.zip", "other"),
        ("https://some-random-host.org/file", "other"),
    ]

    def test_all_services(self):
        for url, expected_svc in self.CASES:
            with self.subTest(url=url):
                self.assertEqual(classify_url(url), expected_svc)

    def test_security_no_subdomain_spoofing(self):
        """Ensure evil-drive.google.com or similar spoofs are rejected."""
        self.assertEqual(classify_url("https://evil-drive.google.com/uc?id=x"), "other")
        self.assertEqual(classify_url("https://notdrive.usercontent.google.com/x"), "other")
        self.assertEqual(classify_url("https://evil-docs.google.com/x"), "other")
        self.assertEqual(classify_url("https://fakedrive.google.com/x"), "other")

    def test_host_matches_helper(self):
        self.assertTrue(_host_matches("www.mediafire.com", "mediafire.com"))
        self.assertTrue(_host_matches("mediafire.com", "mediafire.com"))
        self.assertFalse(_host_matches("notmediafire.com", "mediafire.com"))
        self.assertFalse(_host_matches("evil.mediafire.com.attacker.org", "mediafire.com"))


# ─── extract_google_drive_id ─────────────────────────────────────────

class TestExtractGoogleDriveId(unittest.TestCase):

    def test_uc_format(self):
        url = "https://drive.google.com/uc?id=1xS2ij1H9_sA0Rplz&export=download"
        self.assertEqual(extract_google_drive_id(url), "1xS2ij1H9_sA0Rplz")

    def test_usercontent_format(self):
        url = "https://drive.usercontent.google.com/download?id=16zQzcw272&export=download&confirm=t"
        self.assertEqual(extract_google_drive_id(url), "16zQzcw272")

    def test_usercontent_authuser_only(self):
        url = "https://drive.usercontent.google.com/download?id=1w9PdcG96x8&authuser=0"
        self.assertEqual(extract_google_drive_id(url), "1w9PdcG96x8")

    def test_d_path_format(self):
        url = "https://drive.google.com/file/d/1ABCdefGH/view?usp=sharing"
        self.assertEqual(extract_google_drive_id(url), "1ABCdefGH")

    def test_no_id(self):
        self.assertIsNone(extract_google_drive_id("https://example.com/noid"))


# ─── filename_from_mediafire_url ─────────────────────────────────────

class TestMediaFireFilename(unittest.TestCase):

    def test_simple_filename(self):
        url = "https://www.mediafire.com/file/abc123/firmware_v1.zip/file"
        self.assertEqual(filename_from_mediafire_url(url), "firmware_v1.zip")

    def test_url_encoded_filename(self):
        url = "https://www.mediafire.com/file/s6d27sm97ynp6gf/Redmi_Note_7_%2528lavender%2529_devcfg.mbn_ENG_File.rar/file"
        result = filename_from_mediafire_url(url)
        self.assertIsNotNone(result)
        self.assertIn("Redmi_Note_7", result)
        self.assertTrue(result.endswith(".rar"))

    def test_tar_gz_filename(self):
        url = "https://www.mediafire.com/file/qbdqacfzsz67wnf/PD1224CW_EX_A_1.6.14_vivo_mtk_ALPS.KK1.MP1.V2.46_20141107_mtk6582.tar.gz/file"
        result = filename_from_mediafire_url(url)
        self.assertEqual(
            result,
            "PD1224CW_EX_A_1.6.14_vivo_mtk_ALPS.KK1.MP1.V2.46_20141107_mtk6582.tar.gz",
        )

    def test_non_mediafire_returns_none(self):
        url = "https://www.mediafire.com/view/abc123"
        self.assertIsNone(filename_from_mediafire_url(url))


# ─── GDRIVE_VIRUS_PAGE_RE – filename from virus-scan HTML ───────────

class TestGDriveVirusPageRegex(unittest.TestCase):
    """Verify the regex extracts filenames from real Google Drive HTML."""

    REAL_HTML = (
        '<span class="uc-name-size">'
        '<a href="/open?id=16zQzcw27200Nzt747TfQ7PmTLbrRk7xs">'
        'Samsung SM-A045F_A045FXXSEEZB1_BIT-15_KNOX_OFF_ROM.rar</a>'
        ' (4.3G)</span>'
    )

    def test_extracts_real_filename(self):
        m = GDRIVE_VIRUS_PAGE_RE.search(self.REAL_HTML)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1), "Samsung SM-A045F_A045FXXSEEZB1_BIT-15_KNOX_OFF_ROM.rar")

    def test_extracts_zip_filename(self):
        html = '<a href="/open?id=abc123">RMX3842_firmware_v2.zip</a>'
        m = GDRIVE_VIRUS_PAGE_RE.search(html)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1), "RMX3842_firmware_v2.zip")

    def test_extracts_tar_gz(self):
        html = '<a href="/open?id=xyz">vivo_mtk6582.tar.gz</a>'
        m = GDRIVE_VIRUS_PAGE_RE.search(html)
        self.assertIsNotNone(m)
        # .gz is the extension matched
        self.assertIn("vivo_mtk6582.tar", m.group(1))

    def test_no_match_without_open_id(self):
        html = '<a href="/download?id=abc">firmware.zip</a>'
        m = GDRIVE_VIRUS_PAGE_RE.search(html)
        self.assertIsNone(m)

    def test_no_match_without_extension(self):
        html = '<a href="/open?id=abc">no_extension_here</a>'
        m = GDRIVE_VIRUS_PAGE_RE.search(html)
        self.assertIsNone(m)


# ─── extract_filename_from_url ───────────────────────────────────────

class TestExtractFilenameFromUrl(unittest.TestCase):

    def test_mediafire_extracts_filename(self):
        url = "https://www.mediafire.com/file/abc/Samsung_SM-A045F.rar/file"
        self.assertEqual(extract_filename_from_url(url), "Samsung_SM-A045F.rar")

    def test_gdrive_returns_none(self):
        url = "https://drive.google.com/uc?id=abc&export=download"
        self.assertIsNone(extract_filename_from_url(url))

    def test_mega_returns_none(self):
        url = "https://mega.nz/file/ABC#key"
        self.assertIsNone(extract_filename_from_url(url))

    def test_gdocs_returns_none(self):
        url = "https://docs.google.com/document/d/1db/edit"
        self.assertIsNone(extract_filename_from_url(url))

    def test_onedrive_returns_none(self):
        url = "https://onedrive.live.com/?cid=123&download=1"
        self.assertIsNone(extract_filename_from_url(url))


# ─── parse_content_disposition ───────────────────────────────────────

class TestParseContentDisposition(unittest.TestCase):

    def test_quoted_filename(self):
        self.assertEqual(
            parse_content_disposition('attachment; filename="firmware.zip"'),
            "firmware.zip",
        )

    def test_unquoted_filename(self):
        self.assertEqual(
            parse_content_disposition("attachment; filename=firmware.rar"),
            "firmware.rar",
        )

    def test_utf8_star_filename(self):
        self.assertEqual(
            parse_content_disposition("attachment; filename*=UTF-8''my%20file.zip"),
            "my file.zip",
        )

    def test_utf8_lowercase(self):
        self.assertEqual(
            parse_content_disposition("attachment; filename*=utf-8''archivo%20v2.zip"),
            "archivo v2.zip",
        )

    def test_both_prefer_star(self):
        """RFC 5987: filename* takes priority over filename."""
        self.assertEqual(
            parse_content_disposition(
                'attachment; filename="fallback.zip"; filename*=UTF-8\'\'real%20name.zip'
            ),
            "real name.zip",
        )

    def test_empty_returns_none(self):
        self.assertIsNone(parse_content_disposition(""))

    def test_no_filename_returns_none(self):
        self.assertIsNone(parse_content_disposition("attachment"))


# ─── Async resolver tests (mocked HTTP) ─────────────────────────────

def _make_mock_response(status=200, headers=None, body=b""):
    """Build a mock aiohttp response."""
    resp = AsyncMock()
    resp.status = status
    resp.headers = headers or {}
    content = AsyncMock()
    content.read = AsyncMock(return_value=body)
    resp.content = content
    return resp


def _make_mock_session(mock_resp):
    """Build a mock aiohttp.ClientSession whose get/head returns *mock_resp*."""
    session = MagicMock()
    ctx = AsyncMock()
    ctx.__aenter__ = AsyncMock(return_value=mock_resp)
    ctx.__aexit__ = AsyncMock(return_value=False)
    session.get = MagicMock(return_value=ctx)
    session.head = MagicMock(return_value=ctx)
    return session


class TestResolveGoogleDrive(unittest.TestCase):

    def test_alive_with_content_disposition(self):
        resp = _make_mock_response(
            200,
            headers={
                "Content-Disposition": 'attachment; filename="SM-G991B_firmware.zip"',
                "Content-Type": "application/zip",
            },
        )
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_google_drive(session, "https://drive.google.com/uc?id=ABC123&export=download")
        )
        self.assertTrue(alive)
        self.assertEqual(name, "SM-G991B_firmware.zip")

    def test_alive_virus_scan_page(self):
        html = b'<html>Google Drive virus scan warning download ABC123 confirm</html>'
        resp = _make_mock_response(
            200,
            headers={"Content-Type": "text/html; charset=utf-8"},
            body=html,
        )
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_google_drive(session, "https://drive.google.com/uc?id=ABC123&export=download")
        )
        self.assertTrue(alive)
        self.assertIsNone(name)

    def test_alive_virus_scan_page_extracts_filename(self):
        """Real virus-scan HTML: should extract the filename from <a href="/open?id=...">"""
        html = (
            b'<html><head><title>Google Drive - Virus scan warning</title></head>'
            b'<body><div class="uc-main"><div id="uc-text">'
            b'<p class="uc-warning-caption">Google Drive can\'t scan this file for viruses.</p>'
            b'<p class="uc-warning-subcaption"><span class="uc-name-size">'
            b'<a href="/open?id=16zQzcw27200Nzt747TfQ7PmTLbrRk7xs">'
            b'Samsung SM-A045F_A045FXXSEEZB1_BIT-15_KNOX_OFF_ROM.rar</a>'
            b' (4.3G)</span> is too large for Google to scan.</p>'
            b'<form id="download-form" action="https://drive.usercontent.google.com/download">'
            b'<input type="hidden" name="id" value="16zQzcw27200Nzt747TfQ7PmTLbrRk7xs">'
            b'</form></div></div></body></html>'
        )
        resp = _make_mock_response(
            200,
            headers={"Content-Type": "text/html; charset=utf-8"},
            body=html,
        )
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_google_drive(session, "https://drive.google.com/uc?id=16zQzcw27200Nzt747TfQ7PmTLbrRk7xs&export=download")
        )
        self.assertTrue(alive)
        self.assertEqual(name, "Samsung SM-A045F_A045FXXSEEZB1_BIT-15_KNOX_OFF_ROM.rar")

    def test_dead_404(self):
        resp = _make_mock_response(404)
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_google_drive(session, "https://drive.google.com/uc?id=DEAD&export=download")
        )
        self.assertFalse(alive)

    def test_dead_not_found_page(self):
        html = b'<html><title>Error 404 (Not Found)!!1</title></html>'
        resp = _make_mock_response(
            200,
            headers={"Content-Type": "text/html"},
            body=html,
        )
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_google_drive(session, "https://drive.google.com/uc?id=GONE&export=download")
        )
        self.assertFalse(alive)

    def test_no_id_returns_dead(self):
        session = MagicMock()
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_google_drive(session, "https://drive.google.com/uc")
        )
        self.assertFalse(alive)


class TestResolveMediaFire(unittest.TestCase):

    def test_alive_extracts_filename(self):
        resp = _make_mock_response(200)
        session = _make_mock_session(resp)
        url = "https://www.mediafire.com/file/abc/Samsung_ROM.zip/file"
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_mediafire(session, url)
        )
        self.assertTrue(alive)
        self.assertEqual(name, "Samsung_ROM.zip")

    def test_dead_returns_filename_anyway(self):
        resp = _make_mock_response(404)
        session = _make_mock_session(resp)
        url = "https://www.mediafire.com/file/abc/dead_file.rar/file"
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_mediafire(session, url)
        )
        self.assertFalse(alive)
        self.assertEqual(name, "dead_file.rar")


class TestResolveMega(unittest.TestCase):

    def test_alive(self):
        resp = _make_mock_response(200, body=b"<html>mega page content</html>")
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_mega(session, "https://mega.nz/file/ABC#key")
        )
        self.assertTrue(alive)

    def test_dead_link_not_available(self):
        resp = _make_mock_response(200, body=b"<html>The link not available</html>")
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_mega(session, "https://mega.nz/file/DEAD#key")
        )
        self.assertFalse(alive)

    def test_dead_file_removed(self):
        resp = _make_mock_response(200, body=b"<html>file has been removed</html>")
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_mega(session, "https://mega.nz/file/GONE#key")
        )
        self.assertFalse(alive)

    def test_dead_http_error(self):
        resp = _make_mock_response(500)
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_mega(session, "https://mega.nz/file/ERR#key")
        )
        self.assertFalse(alive)


class TestResolveGDocs(unittest.TestCase):

    def test_alive(self):
        resp = _make_mock_response(200)
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_gdocs(session, "https://docs.google.com/document/d/1db/edit")
        )
        self.assertTrue(alive)
        self.assertIsNone(name)

    def test_dead(self):
        resp = _make_mock_response(404)
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_gdocs(session, "https://docs.google.com/document/d/BAD/edit")
        )
        self.assertFalse(alive)


class TestResolveOneDrive(unittest.TestCase):

    def test_alive_with_filename(self):
        resp = _make_mock_response(
            200,
            headers={"Content-Disposition": 'attachment; filename="onedrive_fw.zip"'},
        )
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_onedrive(session, "https://onedrive.live.com/?cid=123&download=1")
        )
        self.assertTrue(alive)
        self.assertEqual(name, "onedrive_fw.zip")

    def test_alive_no_filename(self):
        resp = _make_mock_response(200, headers={})
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_onedrive(session, "https://onedrive.live.com/?cid=123")
        )
        self.assertTrue(alive)
        self.assertIsNone(name)

    def test_dead(self):
        resp = _make_mock_response(410)
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_onedrive(session, "https://onedrive.live.com/?cid=DEAD")
        )
        self.assertFalse(alive)


class TestResolveOther(unittest.TestCase):

    def test_alive_with_cd(self):
        resp = _make_mock_response(
            200,
            headers={"Content-Disposition": 'attachment; filename="custom.bin"'},
        )
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_other(session, "https://example.com/download")
        )
        self.assertTrue(alive)
        self.assertEqual(name, "custom.bin")

    def test_dead(self):
        resp = _make_mock_response(503)
        session = _make_mock_session(resp)
        alive, name = asyncio.get_event_loop().run_until_complete(
            resolve_other(session, "https://example.com/gone")
        )
        self.assertFalse(alive)


# ─── process_entry – filename priority logic ─────────────────────────

class TestProcessEntry(unittest.TestCase):
    """Verify the filename-priority cascade: HTTP > URL > original."""

    def _run(self, resolver_return, url, original_name):
        sem = asyncio.Semaphore(1)
        session = MagicMock()
        cache: dict = {}

        async def fake_resolver(sess, u):
            return resolver_return

        patched = {k: fake_resolver for k in ("gdrive", "mediafire", "mega", "gdocs", "onedrive", "other")}
        with patch("process_downloads.RESOLVERS", patched):
            result = asyncio.get_event_loop().run_until_complete(
                process_entry(session, sem, original_name, url, 1, cache)
            )
        return result

    def test_http_resolved_name_wins(self):
        """When HTTP returns a filename, it should be used."""
        _, name, _, alive = self._run(
            (True, "real_firmware.zip"),
            "https://drive.google.com/uc?id=ABC&export=download",
            "firmware_10",
        )
        self.assertTrue(alive)
        self.assertEqual(name, "real_firmware.zip")

    def test_url_extracted_name_fallback(self):
        """When HTTP returns no filename, URL-extracted name is used."""
        _, name, _, alive = self._run(
            (True, None),
            "https://www.mediafire.com/file/abc/Samsung_ROM.zip/file",
            "firmware_352",
        )
        self.assertTrue(alive)
        self.assertEqual(name, "Samsung_ROM.zip")

    def test_original_name_last_resort(self):
        """When neither HTTP nor URL yields a name, keep the original."""
        _, name, _, alive = self._run(
            (True, None),
            "https://mega.nz/file/ABC#key",
            "firmware_167",
        )
        self.assertTrue(alive)
        self.assertEqual(name, "firmware_167")

    def test_dead_link_still_reports(self):
        _, name, _, alive = self._run(
            (False, None),
            "https://drive.google.com/uc?id=DEAD&export=download",
            "firmware_99",
        )
        self.assertFalse(alive)

    def test_cache_avoids_duplicate_requests(self):
        """Two entries with the same Google Drive ID should only trigger one HTTP call."""
        sem = asyncio.Semaphore(1)
        session = MagicMock()
        cache: dict = {}
        call_count = 0

        async def counting_resolver(sess, u):
            nonlocal call_count
            call_count += 1
            return True, "cached_name.zip"

        patched = {k: counting_resolver for k in ("gdrive", "mediafire", "mega", "gdocs", "onedrive", "other")}
        with patch("process_downloads.RESOLVERS", patched):
            loop = asyncio.get_event_loop()
            r1 = loop.run_until_complete(
                process_entry(session, sem, "fw_1", "https://drive.google.com/uc?id=SAME_ID&export=download", 1, cache)
            )
            r2 = loop.run_until_complete(
                process_entry(session, sem, "fw_2", "https://drive.usercontent.google.com/download?id=SAME_ID&confirm=t", 2, cache)
            )
        self.assertEqual(call_count, 1, "Resolver should only be called once for same GDrive ID")
        self.assertEqual(r1[1], "cached_name.zip")
        self.assertEqual(r2[1], "cached_name.zip")


# ─── End-to-end pipeline with mocked HTTP ────────────────────────────

class TestEndToEnd(unittest.TestCase):
    """Verify that the full pipeline parses, resolves, filters, and writes."""

    SAMPLE_INPUT = (
        '- **firmware_1** — [Download](https://drive.google.com/uc?id=ALIVE1&export=download)\n'
        '- **firmware_2** — [Download](https://drive.google.com/uc?id=DEAD1&export=download)\n'
        '- **firmware_3** — [Download](https://www.mediafire.com/file/key/Xiaomi_FW.zip/file)\n'
        '- **firmware_4** — [Download](https://mega.nz/file/ABC#key)\n'
    )

    def test_pipeline(self):
        import tempfile, os
        import process_downloads as pd

        # Write sample input
        in_file = tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False)
        in_file.write(self.SAMPLE_INPUT)
        in_file.close()
        out_tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".md", delete=False)
        out_file = out_tmp.name
        out_tmp.close()

        # Patch module-level file paths
        orig_in, orig_out = pd.INPUT_FILE, pd.OUTPUT_FILE
        pd.INPUT_FILE = in_file.name
        pd.OUTPUT_FILE = out_file

        async def fake_gdrive(session, url):
            if "ALIVE1" in url:
                return True, "RealFirmware_v1.zip"
            return False, None

        async def fake_mediafire(session, url):
            return True, "Xiaomi_FW.zip"

        async def fake_mega(session, url):
            return False, None  # simulate dead Mega link

        try:
            with patch.dict(pd.RESOLVERS, {
                "gdrive": fake_gdrive,
                "mediafire": fake_mediafire,
                "mega": fake_mega,
            }):
                asyncio.get_event_loop().run_until_complete(pd.main())

            with open(out_file) as f:
                lines = f.readlines()

            # Only 2 alive: ALIVE1 (gdrive) and mediafire
            self.assertEqual(len(lines), 2)
            self.assertIn("RealFirmware_v1.zip", lines[0])
            self.assertIn("Xiaomi_FW.zip", lines[1])
            # Dead links must not be present
            full = "".join(lines)
            self.assertNotIn("firmware_2", full)
            self.assertNotIn("firmware_4", full)
        finally:
            pd.INPUT_FILE = orig_in
            pd.OUTPUT_FILE = orig_out
            os.unlink(in_file.name)
            if os.path.exists(out_file):
                os.unlink(out_file)


if __name__ == "__main__":
    unittest.main()
