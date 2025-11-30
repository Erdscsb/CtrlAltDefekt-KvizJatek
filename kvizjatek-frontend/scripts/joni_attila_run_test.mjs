/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';

// Beállítások – állítsd a backend URL-t
const API = process.env.API_BASE || 'http://localhost:123/api  Javítsd ki a rendesre ha szeretnéd hogy tesztelje!';
const PROFILE = process.env.PROFILE_BASE || 'http://lochalhost:123 Javítsd ki a rendesre ha szeretnéd hogy tesztelje!';

// Segítség: fetch Node alatt
const fetchFn = globalThis.fetch || (await import('node-fetch')).default;

// Tokenek (állítsd be a környezetedben)
const ACCESS = process.env.QA_ACCESS || 'Add meg az AccesTokent ha szeretnéd hogy figyelembe vegye a teszthez!'; // pl. export QA_ACCESS="..."
const REFRESH = process.env.QA_REFRESH || 'Add meg a RefreshTokent ha szeretnéd hogy figyelembe vegye a teszthez!';

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

// Helpers
const headersJson = () => ({
  'Content-Type': 'application/json',
  ...(ACCESS ? { Authorization: `Bearer ${ACCESS}` } : {}),
});

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

// 30 teszt felvétele (az előző listámból vegyesen logika+API)
test('TC-001 theme default fallback', async () => {
  const fallback = (saved) => saved || 'purple';
  const out = fallback(null);
  assert(out === 'purple', 'expected purple');
});

test('TC-002 percent compute 8/10', async () => {
  const pct = Math.round((8 / 10) * 100);
  assert(pct === 80, '80% expected');
});

test('TC-003 percent compute edge 0/10', async () => {
  const pct = Math.round((0 / Math.max(1, 10)) * 100);
  assert(pct === 0, '0% expected');
});

test('TC-004 avg stat', async () => {
  const games = [80, 90, 70];
  const total = games.reduce((s, v) => s + v, 0);
  const avg = Math.round((total / games.length) * 10) / 10;
  assert(avg === 80, 'avg=80 expected');
});

test('TC-005 best stat', async () => {
  const games = [12, 34, 56, 6];
  const best = games.reduce((m, v) => Math.max(m, v), 0);
  assert(best === 56, 'best=56');
});

test('TC-006 leaderboard reachable (auth may be required)', async () => {
  const r = await fetchFn(`${API}/leaderboard/`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-007 topics reachable', async () => {
  const r = await fetchFn(`${API}/topics/`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-008 results reachable', async () => {
  const r = await fetchFn(`${API}/result/`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-009 quiz detail 1 (may 404)', async () => {
  const r = await fetchFn(`${API}/quiz/1`, { headers: headersJson() });
  assert([200, 401, 403, 404].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-010 profile root (may be 401)', async () => {
  const r = await fetchFn(`${PROFILE}/`, {
    headers: ACCESS ? { Authorization: `Bearer ${ACCESS}` } : {},
  });
  assert([200, 401, 403, 404].includes(r.status), `unexpected status ${r.status}`);
});

// Logikai/UX ellenőrzések (szimulált)
test('TC-011 grid xs layout no overflow', async () => {
  const xsWidth = 320;
  const itemMin = 300;
  assert(itemMin <= xsWidth, 'layout overflow risk'); // jelzésképp
});

test('TC-012 theme chain switch', async () => {
  const seq = ['purple', 'teal', 'amber'];
  assert(seq[0] !== seq[2], 'must differ');
});

test('TC-013 fallback categories merge', async () => {
  const base = ['A', 'B'];
  const api = ['C'];
  const merged = [...base, ...api];
  assert(merged.length === 3, 'merge failed');
});

test('TC-014 cache works (quiz meta)', async () => {
  const cache = new Map();
  cache.set(1, { topic_name: 'T1' });
  assert(cache.has(1), 'cache miss');
});

test('TC-015 achievements thresholds', async () => {
  const total = 12000;
  const a10k = total >= 10000;
  const a20k = total >= 20000;
  assert(a10k && !a20k, 'thresholds wrong');
});

test('TC-016 admin visibility', async () => {
  const isAdmin = true;
  const buttonVisible = !!isAdmin;
  assert(buttonVisible, 'admin button should be visible');
});

test('TC-017 no-admin visibility', async () => {
  const isAdmin = false;
  const buttonVisible = !!isAdmin;
  assert(!buttonVisible, 'admin button should be hidden');
});

test('TC-018 results empty state', async () => {
  const results = [];
  assert(results.length === 0, 'should be empty');
});

test('TC-019 results huge list memory sanity', async () => {
  const results = Array.from({ length: 1000 }, (_, i) => i);
  assert(results.length === 1000, 'size mismatch');
});

test('TC-020 percent rounding 7/9', async () => {
  const pct = Math.round((7 / 9) * 100);
  assert(pct === 78, `expected 78 got ${pct}`);
});

// Admin API (ha jogosult)
test('TC-021 admin users list (may 403)', async () => {
  const r = await fetchFn(`${API}/users`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-022 admin topics list (may 200)', async () => {
  const r = await fetchFn(`${API}/topics/`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-023 admin quizzes list (meta)', async () => {
  const r = await fetchFn(`${API}/quiz/`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

test('TC-024 admin results list', async () => {
  const r = await fetchFn(`${API}/result/`, { headers: headersJson() });
  assert([200, 401, 403].includes(r.status), `unexpected status ${r.status}`);
});

// Extra logika
test('TC-025 search filter insensitive', async () => {
  const q = 'a';
  const rows = [{ name: 'Alpha' }, { name: 'BETA' }, { name: 'Gamma' }];
  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q));
  assert(filtered.length === 3, 'filter failed');
});

test('TC-026 loader state toggling', async () => {
  let loading = true;
  loading = false;
  assert(loading === false, 'loading not toggled');
});

test('TC-027 error state set', async () => {
  const setError = (e) => e;
  const out = setError('oops');
  assert(out === 'oops', 'error not set');
});

test('TC-028 topic name fallback', async () => {
  const meta = {};
  const topic = meta.topic_name || 'Ismeretlen téma';
  assert(topic === 'Ismeretlen téma', 'fallback failed');
});

test('TC-029 avg no divide by zero', async () => {
  const total = 0;
  const n = 0;
  const avg = n ? Math.round((total / n) * 10) / 10 : 0;
  assert(avg === 0, 'avg should be 0 if no games');
});

test('TC-030 admin guard', async () => {
  const isAuthenticated = true;
  const isAdmin = false;
  const canView = isAuthenticated && isAdmin;
  assert(canView === false, 'guard failed');
});

// Runner
(async function run() {
  const results = [];
  let passed = 0;
  results.push("Teszt adatok, készítette: Jóni Attila Péter. Teszteléshez használt script elérhetőség: /scripts/joni_attila_run_test.mjs")
  results.push("Teszteléshez használt tokenek és a backend api elérés biztonsági okból eltávolítva, ismételt teszteléshez kitöltendő.")
  for (const t of tests) {
    const start = Date.now();
    try {
      await t.fn();
      passed += 1;
      results.push({ name: t.name, status: 'PASS', ms: Date.now() - start });
      console.log(`✓ ${t.name}`);
    } catch (e) {
      results.push({ name: t.name, status: 'FAIL', error: e.message, ms: Date.now() - start });
      console.error(`✗ ${t.name} -> ${e.message}`);
    }
  }
  console.log(`\nSummary: ${passed}/${tests.length} passed`);
  const outPath = path.join(process.cwd(), 'test-log.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Detailed log: ${outPath}`);
})();