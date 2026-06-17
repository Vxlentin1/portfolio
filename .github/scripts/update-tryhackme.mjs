// Fetch TryHackMe public stats and write data/tryhackme.json
// Robust against Cloudflare bot protection: browser-like headers + retries + multiple endpoints.
// Fails loudly (exit 1) on error WITHOUT overwriting existing good data.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const USERNAME = process.env.THM_USERNAME || 'vxlms3';
const OUT_FILE = 'data/tryhackme.json';

// Ordered by reliability — first success wins
const ENDPOINTS = [
  `https://tryhackme.com/api/discord/user/${USERNAME}`,
  `https://tryhackme.com/api/user/rank/${USERNAME}`,
  `https://tryhackme.com/api/v2/hacktivities?username=${USERNAME}&limit=1`,
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  Referer: `https://tryhackme.com/p/${USERNAME}`,
  Origin: 'https://tryhackme.com',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempts = 3) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const text = await res.text();
      // Guard against HTML responses (Cloudflare challenge page)
      if (text.trimStart().startsWith('<')) {
        throw new Error('Got HTML instead of JSON (likely Cloudflare block)');
      }
      return JSON.parse(text);
    } catch (err) {
      lastErr = err;
      console.warn(`  attempt ${i}/${attempts} failed for ${url}: ${err.message}`);
      if (i < attempts) await sleep(3000 * i);
    }
  }
  throw lastErr;
}

// Normalize different API response shapes into { points, rankPercentile, avatar, subscribed }
function parseResponse(data) {
  if (!data || typeof data !== 'object') return null;

  // Shape from /api/discord/user/{user} and /api/user/rank/{user}
  const points = Number(data.points ?? data.globalPoints ?? data.userScore);
  if (!Number.isFinite(points)) return null;

  const rankRaw = data.userRank ?? data.rank;
  let rankPercentile = null;
  if (typeof rankRaw === 'object' && rankRaw !== null) {
    rankPercentile = Number(rankRaw.approximate ?? rankRaw.percentile) || null;
  } else {
    rankPercentile = Number(rankRaw) || null;
  }

  return {
    points,
    rankPercentile,
    avatar: data.avatar || data.userAvatar || '',
    subscribed: Boolean(data.subscribed),
  };
}

async function fetchStats() {
  for (const url of ENDPOINTS) {
    try {
      console.log(`Fetching ${url} …`);
      const data = await fetchJson(url);
      const parsed = parseResponse(data);
      if (parsed) {
        console.log(`  OK — points: ${parsed.points}, top ${parsed.rankPercentile}%`);
        return parsed;
      }
      console.warn(`  Response shape unrecognised for ${url}, trying next…`);
    } catch (err) {
      console.warn(`  Endpoint failed: ${err.message}`);
    }
  }
  throw new Error('All endpoints failed or returned unrecognised data');
}

function readExisting() {
  try {
    return JSON.parse(readFileSync(OUT_FILE, 'utf8'));
  } catch {
    return null;
  }
}

(async () => {
  const stats = await fetchStats();
  const existing = readExisting();

  const payload = {
    username: USERNAME,
    profileUrl: `https://tryhackme.com/p/${USERNAME}`,
    points: stats.points,
    rankPercentile: stats.rankPercentile,
    avatar: stats.avatar || existing?.avatar || '',
    subscribed: stats.subscribed,
    updatedAt: new Date().toISOString(),
  };

  mkdirSync('data', { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + '\n');
  console.log(`Wrote ${OUT_FILE}: ${payload.points} points, top ${payload.rankPercentile}%`);
})().catch((err) => {
  console.error(`::error::TryHackMe fetch failed: ${err.message}`);
  console.error('Existing data left untouched.');
  process.exit(1);
});
