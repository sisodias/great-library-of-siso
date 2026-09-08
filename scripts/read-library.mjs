import { createHash } from 'node:crypto';
import { lstat, readdir, readFile, realpath } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const MAX_FILE = 2 * 1024 * 1024;
const MAX_TOTAL = 64 * 1024 * 1024;
const MAX_COUNT = 5000;
const OPEN_STATUSES = new Set(['backlog', 'queued', 'in_progress', 'blocked']);
const ALLOWED = /^(registry\/.+\.json|scripts\/(?:build|build-industries)\.mjs|package(?:-lock)?\.json)$/;

function fail(message) { throw new Error(message); }
function output(value) { console.log(JSON.stringify({ projection: "this checkout's projection", deployment: 'not verified', ...value })); }
function safePath(root, pathname) {
  if (typeof pathname !== 'string' || !pathname || pathname.includes('\\') || pathname.startsWith('/') || pathname.split('/').includes('..') || !ALLOWED.test(pathname)) fail('Projection source inputs are malformed');
  const absolute = resolve(root, pathname);
  if (relative(root, absolute).startsWith(`..${sep}`) || relative(root, absolute) === '..') fail('Projection source inputs are malformed');
  return absolute;
}
async function regular(path, message = 'Projection input is malformed') {
  const st = await lstat(path).catch(() => null);
  if (!st || !st.isFile()) fail(message);
  if (await realpath(path).catch(() => null) !== path) fail(message);
  if (st.size > MAX_FILE) fail('Projection input exceeds the file size bound');
  return st;
}
async function bytes(path) {
  const st = await regular(path);
  const data = await readFile(path);
  if (data.length > MAX_FILE || data.length !== st.size) fail('Projection input exceeds the file size bound');
  return data;
}
function sha(bytes) { return createHash('sha256').update(bytes).digest('hex'); }

async function registryFiles(root) {
  const found = [];
  const registryRoot = join(root, 'registry');
  if (await realpath(registryRoot).catch(() => null) !== registryRoot) fail('Projection source inputs contain a symlink');
  async function walk(dir, prefix) {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => fail('Projection registry is missing'));
    for (const entry of entries) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const path = join(dir, entry.name);
      if (entry.isSymbolicLink()) fail('Projection source inputs contain a symlink');
      if (entry.isDirectory()) {
        if (await realpath(path).catch(() => null) !== path) fail('Projection source inputs contain a symlink');
        await walk(path, rel);
      }
      else if (entry.isFile() && rel.endsWith('.json')) {
        found.push(`registry/${rel}`);
        if (found.length > MAX_COUNT) fail('Projection input count exceeds the bound');
      }
    }
  }
  await walk(registryRoot, '');
  if (found.length > MAX_COUNT) fail('Projection input count exceeds the bound');
  return found.sort();
}

async function load(root) {
  const catalogPath = join(root, 'site', 'catalog.json');
  let catalog;
  try { catalog = JSON.parse((await bytes(catalogPath)).toString('utf8')); }
  catch (error) { if (error.message?.includes('Projection')) throw error; fail('Generated projection is missing or malformed; run npm run build'); }
  if (!catalog || !Array.isArray(catalog.works) || !Array.isArray(catalog.source_inputs)) fail('Generated projection is missing or malformed; run npm run build');
  const ids = new Set(), slugs = new Set();
  for (const work of catalog.works) {
    if (!work || typeof work.id !== 'string' || typeof work.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.slug) || ids.has(work.id) || slugs.has(work.slug)) fail('Generated projection is malformed; run npm run build');
    ids.add(work.id); slugs.add(work.slug);
  }
  if (catalog.source_inputs.length > MAX_COUNT) fail('Projection input count exceeds the bound');
  let total = 0;
  const seen = new Set();
  for (const input of catalog.source_inputs) {
    if (!input || typeof input.path !== 'string' || typeof input.sha256 !== 'string' || seen.has(input.path)) fail('Projection source inputs are malformed');
    seen.add(input.path);
    const path = safePath(root, input.path);
    const raw = await bytes(path);
    total += raw.length;
    if (total > MAX_TOTAL || sha(raw) !== input.sha256) fail('Generated projection is stale; run npm run build');
  }
  const actualRegistry = await registryFiles(root);
  const expectedRegistry = [...seen].filter(path => path.startsWith('registry/')).sort();
  if (actualRegistry.length !== expectedRegistry.length || actualRegistry.some((path, i) => path !== expectedRegistry[i])) fail('Generated projection is stale; run npm run build');
  return catalog;
}

function options(args, start) {
  const out = { root: process.cwd(), limit: 10 };
  for (let i = start; i < args.length; i++) {
    if (args[i] === '--root' && args[i + 1]) out.root = args[++i];
    else if (args[i] === '--limit' && args[i + 1]) out.limit = Number(args[++i]);
    else fail('Unknown or incomplete argument');
  }
  if (!Number.isInteger(out.limit) || out.limit < 1 || out.limit > 50) fail('--limit must be an integer from 1 to 50');
  return out;
}
async function verifyRoot(root) {
  let packageData;
  try { packageData = JSON.parse((await bytes(join(root, 'package.json'))).toString('utf8')); }
  catch { fail('--root must identify the intended Great Library checkout'); }
  if (packageData.name !== 'great-library-of-siso') fail('--root must identify the intended Great Library checkout');
}
function selectedRelease(work) {
  const release = work.selected_release;
  return release ? { id: release.id, version: release.version } : null;
}
function compact(work) {
  return { id: work.id, slug: work.slug, name: work.name, summary: work.summary, selection: work.selection, selected_release: selectedRelease(work), owner_entry: work.owner_entry, dossier_url: work.agent_context_url };
}

export async function readTasks(root) {
  const base = join(root, '.agents', 'tasks');
  if (await realpath(base).catch(() => null) !== base) fail('Task records are malformed');
  const all = [];
  const ids = new Set();
  let total = 0;
  for (const status of ['backlog', 'queued', 'in_progress', 'blocked', 'completed', 'cancelled']) {
    const dir = join(base, status);
    if (await realpath(dir).catch(() => null) !== dir && await lstat(dir).catch(() => null)) fail('Task records are malformed');
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) fail('Task records are malformed');
      const file = join(dir, entry.name, 'task.json');
      let data;
      try {
        const raw = await bytes(file);
        total += raw.length;
        if (total > MAX_TOTAL) fail('Task input exceeds the total size bound');
        data = JSON.parse(raw.toString('utf8'));
      }
      catch { fail('Task records are malformed'); }
      if (!data || !/^TASK-\d{4}$/.test(data.id) || data.id !== entry.name || data.status !== status || ids.has(data.id)) fail('Task records are malformed');
      ids.add(data.id); all.push({ ...data, source_file: `.agents/tasks/${status}/${entry.name}/task.json` });
      if (all.length > MAX_COUNT) fail('Task count exceeds the bound');
    }
  }
  if (all.length > MAX_COUNT) fail('Task count exceeds the bound');
  return all;
}

export async function runRead(args) {
  const action = args[0];
  const opts = options(args, action === 'search' || action === 'inspect' || action === 'task' ? 2 : 1);
  const root = await realpath(resolve(opts.root));
  await verifyRoot(root);
  if (action === 'tasks' || action === 'task') {
    const tasks = await readTasks(root);
    if (action === 'tasks') { output({ command: 'tasks', tasks: tasks.filter(task => OPEN_STATUSES.has(task.status)).map(({ id, title, status, priority, source_file }) => ({ id, title, status, priority, source_file })) }); return; }
    const task = tasks.find(item => item.id === args[1]); if (!task) fail('Task not found'); output({ command: 'task', task }); return;
  }
  const catalog = await load(root);
  if (action === 'search') {
    const query = args[1];
    if (!query) fail('search requires QUERY');
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matches = catalog.works.filter(work => terms.every(term => [work.name, work.slug, work.summary, work.type, work.section].some(value => String(value ?? '').toLocaleLowerCase().includes(term)))).slice(0, opts.limit).map(compact);
    output({ command: 'search', query, matches }); return;
  }
  if (action === 'inspect') {
    const key = args[1]; if (!key || key.includes('/') || key.includes('\\')) fail('inspect requires an exact Work ID or slug');
    const work = catalog.works.find(item => item.slug === key || item.id === key); if (!work) fail('Work not found');
    const dossierPath = join(root, 'site', 'works', work.slug, 'index.json');
    const dossier = JSON.parse((await bytes(dossierPath)).toString('utf8'));
    if (!dossier || dossier.work_id !== work.id || dossier.slug !== work.slug) fail('Dossier identity does not match catalog');
    for (const field of ['selection', 'selected_release', 'owner_entry']) {
      if (JSON.stringify(dossier[field] ?? null) !== JSON.stringify(work[field] ?? null)) fail('Dossier metadata does not match catalog');
    }
    output({ command: 'inspect', dossier }); return;
  }
  fail('Unknown read command');
}
