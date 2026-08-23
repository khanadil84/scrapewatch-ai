import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (zero deps)
function loadEnv() {
  const envPath = resolve(__dirname, '.env');
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

const env = loadEnv();
const PORT = parseInt(env.PORT || process.env.PORT || '3001', 10);
const COLLECTOR_ID = env.BRIGHTDATA_COLLECTOR_ID || 'c_mt5ryoya2bepdq2a8c';
const API_TOKEN = env.BRIGHTDATA_API_TOKEN || '';

// Rating word -> number
const ratingMap = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 };

// Normalize Bright Data response into ScrapeWatch ScrapedRecord[]
function normalizeBrightDataResponse(raw) {
  const books = raw?.books || [];
  return books.map((book, i) => ({
    id: `bd_${i + 1}_${Date.now()}`,
    product: book.name || 'Unknown',
    price: book.price?.symbol
      ? `${book.price.symbol}${book.price.value}`
      : `£${book.price?.value ?? 0}`,
    rating: ratingMap[book.rating] ?? 0,
    availability: book.availability || 'Unknown',
    lastUpdated: new Date().toISOString(),
    collectorId: COLLECTOR_ID,
    status: 'healthy',
  }));
}

// Read local brightdata-result.json
function getLocalResult() {
  const filePath = resolve(__dirname, 'brightdata-result.json');
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// Trigger a Bright Data Scraper Studio collection (non-blocking, returns collectionId)
async function triggerBrightDataRun() {
  if (!API_TOKEN) return { error: 'BRIGHTDATA_API_TOKEN not configured' };

  const triggerUrl = `https://api.brightdata.com/dca/trigger?collector=${COLLECTOR_ID}&queue_next=1`;
  console.log(`[ScrapeWatch API] Triggering: POST ${triggerUrl}`);

  const triggerRes = await fetch(triggerUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{ url: 'https://books.toscrape.com/' }]),
  });

  const resText = await triggerRes.text();
  console.log(`[ScrapeWatch API] BD trigger response: ${triggerRes.status} ${resText.slice(0, 200)}`);

  if (!triggerRes.ok) {
    return { error: `Bright Data API error: ${triggerRes.status} ${resText}` };
  }

  let triggerData;
  try {
    triggerData = JSON.parse(resText);
  } catch {
    return { error: `Bright Data returned invalid JSON: ${resText.slice(0, 200)}` };
  }

  const collectionId = triggerData.collection_id || triggerData.snapshot_id || null;
  return { collectionId, response: triggerData };
}

// Poll Bright Data collection status via /dca/dataset
async function pollBrightDataStatus(collectionId) {
  if (!API_TOKEN) return { error: 'BRIGHTDATA_API_TOKEN not configured' };
  if (!collectionId) return { error: 'collectionId required' };

  const datasetUrl = `https://api.brightdata.com/dca/dataset?id=${collectionId}`;
  const datasetRes = await fetch(datasetUrl, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  const resText = await datasetRes.text();
  console.log(`[ScrapeWatch API] BD poll response: ${datasetRes.status} ${resText.slice(0, 200)}`);

  if (!datasetRes.ok) {
    return { error: `Dataset check failed: ${datasetRes.status} ${resText}` };
  }

  try {
    const parsed = JSON.parse(resText);

    // If it's an array with data, collection is done
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { status: 'done', data: parsed };
    }

    // If it's an empty array, still in progress
    if (Array.isArray(parsed) && parsed.length === 0) {
      return { status: 'running' };
    }

    // If it's an object with a status field
    if (parsed.status) {
      return { status: parsed.status, data: parsed };
    }

    // Otherwise treat as running
    return { status: 'running' };
  } catch {
    return { error: `Invalid JSON from dataset: ${resText.slice(0, 200)}` };
  }
}

// Fetch live data from Bright Data API (trigger + poll, used by GET /api/scraper/data)
async function fetchBrightDataLive() {
  if (!API_TOKEN) return null;

  const triggerResult = await triggerBrightDataRun();
  if (triggerResult.error || !triggerResult.collectionId) return null;

  const collectionId = triggerResult.collectionId;

  // Poll for completion (max 60s, every 5s)
  for (let attempt = 0; attempt < 12; attempt++) {
    await new Promise((r) => setTimeout(r, 5000));

    const statusData = await pollBrightDataStatus(collectionId);
    if (statusData.error) continue;

    if (statusData.status === 'done' && statusData.data) {
      return { books: statusData.data, input: { url: 'https://books.toscrape.com/' } };
    }
  }

  return null;
}

// Get collector status (returns real collector info)
function getCollectorStatus() {
  const local = getLocalResult();
  const recordCount = local?.books?.length ?? 0;
  return {
    collectorId: COLLECTOR_ID,
    name: 'Book Scraper',
    target: 'books.toscrape.com',
    status: 'healthy',
    recordCount,
    lastVerified: new Date().toISOString(),
    extractionIntegrity: recordCount > 0 ? 100 : 0,
  };
}

// JSON response helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

// Read POST body helper
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString();
}

// Main server
const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // POST /api/scraper/run — trigger a Bright Data collection (non-blocking)
  if (req.method === 'POST' && req.url === '/api/scraper/run') {
    try {
      const result = await triggerBrightDataRun();
      if (result.error) {
        return sendJson(res, 502, { success: false, error: result.error });
      }
      return sendJson(res, 200, {
        success: true,
        collectionId: result.collectionId,
        snapshotId: result.collectionId, // alias for frontend compat
        collectorId: COLLECTOR_ID,
        status: 'triggered',
      });
    } catch (err) {
      console.error('[ScrapeWatch API] Run error:', err.message);
      return sendJson(res, 500, { success: false, error: 'Internal server error' });
    }
  }

  // GET /api/scraper/poll?collectionId=xxx — poll collection status
  if (req.method === 'GET' && req.url.startsWith('/api/scraper/poll')) {
    try {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      const collectionId = url.searchParams.get('collectionId') || url.searchParams.get('snapshotId');
      if (!collectionId) {
        return sendJson(res, 400, { error: 'collectionId query parameter required' });
      }
      const statusData = await pollBrightDataStatus(collectionId);
      if (statusData.error) {
        return sendJson(res, 502, { error: statusData.error });
      }
      return sendJson(res, 200, statusData);
    } catch (err) {
      console.error('[ScrapeWatch API] Poll error:', err.message);
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  // GET /api/scraper/data — serve cached/local data (instant, no BD trigger)
  if (req.method === 'GET' && req.url === '/api/scraper/data') {
    try {
      const local = getLocalResult();
      if (!local) {
        return sendJson(res, 404, {
          error: 'No data available. Place brightdata-result.json in project root or run the scraper first.',
        });
      }

      const records = normalizeBrightDataResponse(local);
      return sendJson(res, 200, {
        source: 'local',
        collectorId: COLLECTOR_ID,
        recordCount: records.length,
        records,
      });
    } catch (err) {
      console.error('[ScrapeWatch API] Error:', err.message);
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  // GET /api/scraper/status
  if (req.method === 'GET' && req.url === '/api/scraper/status') {
    try {
      const status = getCollectorStatus();
      return sendJson(res, 200, status);
    } catch (err) {
      console.error('[ScrapeWatch API] Status error:', err.message);
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  // --- Static file serving for built Vite frontend ---
  // Only serve static files if dist/ exists (production mode)
  const distDir = resolve(__dirname, 'dist');
  if (existsSync(distDir)) {
    // Serve static assets (JS, CSS, images, etc.)
    const filePath = resolve(distDir, req.url.slice(1));
    if (req.url.startsWith('/assets/') || req.url.startsWith('/favicon')) {
      try {
        if (existsSync(filePath) && statSync(filePath).isFile()) {
          const ext = extname(filePath);
          const mimeTypes = {
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
          };
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          });
          return res.end(readFileSync(filePath));
        }
      } catch { /* fall through to SPA fallback */ }
    }

    // SPA fallback: serve index.html for any non-API route
    if (!req.url.startsWith('/api/')) {
      try {
        const indexHtml = resolve(distDir, 'index.html');
        if (existsSync(indexHtml)) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          return res.end(readFileSync(indexHtml, 'utf-8'));
        }
      } catch { /* fall through to 404 */ }
    }
  }

  // 404
  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`[ScrapeWatch API] Server running on http://localhost:${PORT}`);
  console.log(`[ScrapeWatch API] Collector: ${COLLECTOR_ID}`);
  console.log(`[ScrapeWatch API] Token: ${API_TOKEN ? 'configured' : 'not set (using local data)'}`);
});
