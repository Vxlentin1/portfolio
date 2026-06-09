// Fetch TryHackMe public stats and write data/tryhackme.json
// Robust against Cloudflare bot protection: browser-like headers + retries.
// Fails loudly (exit 1) on error WITHOUT overwriting existing good data.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const USERNAME = process.env.THM_USERNAME || 'vxlms3';
const OUT_FILE = 'data/tryhackme.json';

const ENDPOINTS = [
  `https://tryhackme.com/api/discord/user/${USERNAME}`,
  `https://tryhackme.com/api/user/rank/${USERNAME}`,
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: `https://tryhackme.com/p/${USERNAME}`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      console.warn(`  attempt ${i}/${attempts} failed for ${url}: ${err.message}`);
      if (i < attempts) await sleep(2000 * i);
    }
  }
  throw lastErr;
}

async function fetchStats() {
  let lastErr;
  for (const url of ENDPOINTS) {
    try {
      console.log(`Fetching ${url} …`);
      const data = await fetchJson(url);
      if (data && typeof data === 'object') return data;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('All endpoints failed');
}

function readExisting() {
  try {
    return JSON.parse(readFileSync(OUT_FILE, 'utf8'));
  } catch {
    return null;
  }
}

(async () => {
  const raw = await fetchStats();

  const rank = raw.userRank;
  const percentile = typeof rank === 'object' && rank ? rank.approximate : rank;
  const points = Number(raw.points);

  // Validate before trusting the response (avoid writing garbage / blank data).
  if (!Number.isFinite(points)) {
    throw new Error(`Invalid response: points is not a number (got ${JSON.stringify(raw.points)})`);
  }

  const existing = readExisting();
  const payload = {
    username: USERNAME,
    profileUrl: `https://tryhackme.com/p/${USERNAME}`,
    points,
    rankPercentile: Number(percentile) || null,
    avatar: raw.avatar || existing?.avatar || '',
    subscribed: Boolean(raw.subscribed),
    updatedAt: new Date().toISOString(),
  };

  mkdirSync('data', { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${OUT_FILE}: ${points} points, top ${payload.rankPercentile}%`);
})().catch((err) => {
  console.error(`::error::TryHackMe fetch failed: ${err.message}`);
  console.error('Existing data left untouched.');
  process.exit(1);
});
