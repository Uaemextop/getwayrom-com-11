/**
 * Build script: Parses firmware_ok.md from the latest GitHub release
 * and generates a JSON data file for the file explorer.
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OWNER = 'Uaemextop';
const REPO = 'getwayrom-com-11';
const OUTPUT_DIR = path.join(__dirname, '..', 'explorer', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'files.json');
const FIRMWARE_OK_FILE = path.join(__dirname, '..', 'explorer', 'data', 'firmware_ok.md');
const FALLBACK_FILE = path.join(__dirname, '..', 'download_urls.md');

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'GetwayROM-Explorer/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const BRAND_PATTERNS = [
  { pattern: /\bSM-[A-Z]\d/i, brand: 'Samsung' },
  { pattern: /\bSamsung\b/i, brand: 'Samsung' },
  { pattern: /\bGalaxy\b/i, brand: 'Samsung' },
  { pattern: /\bRMX\d/i, brand: 'Realme' },
  { pattern: /\bRealme\b/i, brand: 'Realme' },
  { pattern: /\bRedmi\b/i, brand: 'Xiaomi' },
  { pattern: /\bMi\s/i, brand: 'Xiaomi' },
  { pattern: /\bXiaomi\b/i, brand: 'Xiaomi' },
  { pattern: /\bPOCO\b/i, brand: 'Xiaomi' },
  { pattern: /\bOPPO\b/i, brand: 'OPPO' },
  { pattern: /\bCPH\d/i, brand: 'OPPO' },
  { pattern: /\bVivo\b/i, brand: 'Vivo' },
  { pattern: /\bPD\d{4}/i, brand: 'Vivo' },
  { pattern: /\bHuawei\b/i, brand: 'Huawei' },
  { pattern: /\bHonor\b/i, brand: 'Honor' },
  { pattern: /\bNokia\b/i, brand: 'Nokia' },
  { pattern: /\bLG-/i, brand: 'LG' },
  { pattern: /\bMotorola\b/i, brand: 'Motorola' },
  { pattern: /\bMoto\s/i, brand: 'Motorola' },
  { pattern: /\bSony\b/i, brand: 'Sony' },
  { pattern: /\bLenovo\b/i, brand: 'Lenovo' },
  { pattern: /\bZTE\b/i, brand: 'ZTE' },
  { pattern: /\bAlcatel\b/i, brand: 'Alcatel' },
  { pattern: /\bTecno\b/i, brand: 'Tecno' },
  { pattern: /\bInfinix\b/i, brand: 'Infinix' },
  { pattern: /\bitel\b/i, brand: 'Itel' },
  { pattern: /\bJio\b/i, brand: 'Jio' },
  { pattern: /\bOnePlus\b/i, brand: 'OnePlus' },
  { pattern: /\bASUS\b/i, brand: 'ASUS' },
  { pattern: /\bHTC\b/i, brand: 'HTC' },
  { pattern: /\bLC[0-9]|KE[0-9]|KC[0-9]/i, brand: 'LG' },
];

function detectBrand(filename) {
  for (const { pattern, brand } of BRAND_PATTERNS) {
    if (pattern.test(filename)) return brand;
  }
  return 'Other';
}

function detectExtension(filename) {
  const match = filename.match(/\.(\w+)$/);
  return match ? match[1].toLowerCase() : 'unknown';
}

function detectFileType(extension) {
  const types = {
    zip: 'archive', rar: 'archive', '7z': 'archive', gz: 'archive',
    'tar.gz': 'archive', tgz: 'archive',
    apk: 'android', img: 'image', iso: 'disk',
    exe: 'executable', msi: 'executable', bat: 'executable',
    bin: 'binary', mbn: 'binary', dat: 'binary', elf: 'binary',
    md: 'document', txt: 'document', pdf: 'document',
    scatter: 'scatter',
    xml: 'config', json: 'config', cfg: 'config', ini: 'config',
    pac: 'flash', ozip: 'archive', ofp: 'flash', ops: 'flash',
  };
  return types[extension] || 'file';
}

function detectSource(url) {
  if (/drive\.google\.com|drive\.usercontent\.google\.com/i.test(url)) return 'Google Drive';
  if (/mediafire\.com/i.test(url)) return 'MediaFire';
  if (/onedrive\.live\.com|1drv\.ms/i.test(url)) return 'OneDrive';
  if (/mega\.nz|mega\.co\.nz/i.test(url)) return 'MEGA';
  if (/dropbox\.com/i.test(url)) return 'Dropbox';
  if (/github\.com|githubusercontent\.com/i.test(url)) return 'GitHub';
  if (/androidfilehost\.com/i.test(url)) return 'AFH';
  return 'Direct';
}

function parseLine(line) {
  const match = line.match(/^-\s+\*\*(.+?)\*\*\s+—\s+\[Download\]\((.+?)\)/);
  if (!match) return null;

  const name = match[1].trim();
  const url = match[2].trim();
  const extension = detectExtension(name);
  const brand = detectBrand(name);
  const fileType = detectFileType(extension);
  const source = detectSource(url);

  return { name, url, extension, brand, fileType, source };
}

async function fetchFirmwareData() {
  console.log('Fetching latest release info...');
  try {
    const releaseUrl = `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`;
    const releaseData = JSON.parse(await httpsGet(releaseUrl));
    const asset = releaseData.assets && releaseData.assets.find(a => a.name === 'firmware_ok.md');

    if (asset) {
      console.log(`Found firmware_ok.md in release: ${releaseData.tag_name}`);
      const content = await httpsGet(asset.browser_download_url);
      return content;
    }
  } catch (err) {
    console.warn('Could not fetch from releases:', err.message);
  }

  console.log('Falling back to local download_urls.md...');
  if (fs.existsSync(FALLBACK_FILE)) {
    return fs.readFileSync(FALLBACK_FILE, 'utf-8');
  }

  throw new Error('No firmware data source available');
}

async function main() {
  const isTest = process.argv.includes('--test');

  let content;
  if (isTest) {
    console.log('Running in test mode with local file...');
    if (fs.existsSync(FIRMWARE_OK_FILE)) {
      console.log('Using local firmware_ok.md');
      content = fs.readFileSync(FIRMWARE_OK_FILE, 'utf-8');
    } else if (fs.existsSync(FALLBACK_FILE)) {
      console.log('Using local download_urls.md');
      content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    } else {
      console.error('No local data file found for testing');
      process.exit(1);
    }
  } else {
    content = await fetchFirmwareData();
  }

  const lines = content.split('\n').filter(l => l.trim().startsWith('- **'));
  console.log(`Found ${lines.length} entries to parse...`);

  const files = [];
  const seen = new Set();

  for (const line of lines) {
    const parsed = parseLine(line);
    if (parsed && !seen.has(parsed.url)) {
      seen.add(parsed.url);
      files.push(parsed);
    }
  }

  console.log(`Parsed ${files.length} unique files`);

  // Sort files alphabetically by name
  files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  // Collect stats
  const brands = {};
  const extensions = {};
  const sources = {};
  for (const f of files) {
    brands[f.brand] = (brands[f.brand] || 0) + 1;
    extensions[f.extension] = (extensions[f.extension] || 0) + 1;
    sources[f.source] = (sources[f.source] || 0) + 1;
  }

  const output = {
    generated: new Date().toISOString(),
    totalFiles: files.length,
    brands,
    extensions,
    sources,
    files
  };

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output));
  console.log(`Data written to ${OUTPUT_FILE} (${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB)`);

  if (isTest) {
    console.log('\nBrand distribution:');
    Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count}`);
    });
    console.log('\nTop extensions:');
    Object.entries(extensions).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([ext, count]) => {
      console.log(`  .${ext}: ${count}`);
    });
  }
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
