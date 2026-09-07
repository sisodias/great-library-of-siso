#!/usr/bin/env node
/** Read-only UI integration diagnostic. The registry remains authoritative.
 * Sources: docs/library-ui-spec.md §§3,4,7,8 and docs/gls.md.
 * No network, install, generated-site writes, promotion or deployment occurs.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const digest = raw => createHash('sha256').update(raw).digest('hex');
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_FILE = 2 * 1024 * 1024;
const MAX_TOTAL = 64 * 1024 * 1024;

export function shellRevision(locator) {
  if (typeof locator !== 'string') return null;
  const patterns = [
    /^https:\/\/codeload\.github\.com\/sisodias\/siso-shell\/tar\.gz\/([a-f0-9]{40})$/i,
    /^https:\/\/github\.com\/sisodias\/siso-shell\/archive\/([a-f0-9]{40})\.(?:tar\.gz|zip)$/i,
    /^git\+https:\/\/github\.com\/sisodias\/siso-shell(?:\.git)?#([a-f0-9]{40})$/i,
  ];
  return patterns.map(pattern => locator.match(pattern)?.[1]?.toLowerCase()).find(Boolean) || null;
}

function reader(root) {
  let total = 0;
  const evidence = [];
  const read = path => {
    let raw;
    try {
      const full = resolve(root, path);
      const local = relative(root, full);
      if (local.startsWith('..') || statSync(full).size > MAX_FILE) throw new Error();
      raw = readFileSync(full);
      total += raw.length;
      if (total > MAX_TOTAL) throw new Error();
    } catch { throw new Error(`Cannot read bounded input: ${path}`); }
    evidence.push({ path, sha256: digest(raw) });
    return raw;
  };
  const json = path => {
    const raw = read(path);
    let data;
    try { data = JSON.parse(raw.toString('utf8')); }
    catch { throw new Error(`Invalid JSON input: ${path}`); }
    if (!object(data)) throw new Error(`Expected object input: ${path}`);
    return { path, data, sha256: digest(raw) };
  };
  const records = directory => {
    let names;
    try { names = readdirSync(resolve(root, directory)).filter(name => name.endsWith('.json')).sort(); }
    catch { throw new Error(`Cannot read input directory: ${directory}`); }
    if (names.length > 5000) throw new Error(`Too many records: ${directory}`);
    return names.map(name => json(`${directory}/${name}`));
  };
  return { read, json, records, evidence };
}

function byId(records, kind) {
  const result = new Map();
  for (const record of records) {
    const id = record.data.id;
    if (typeof id !== 'string' || !id || result.has(id)) {
      throw new Error(`Missing or duplicate ${kind} identity: ${record.path}`);
    }
    result.set(id, record);
  }
  return result;
}

const revisionOf = release => {
  const revisions = [...new Set((release?.artifacts || [])
    .filter(artifact => artifact.kind === 'source_archive' && /^[a-f0-9]{40}$/i.test(artifact.revision || ''))
    .map(artifact => artifact.revision.toLowerCase()))];
  return revisions.length === 1 ? revisions[0] : null;
};
const releaseSummary = record => record ? {
  id: record.data.id, version: record.data.version, path: record.path,
  source_revision: revisionOf(record.data), manifest_sha256: record.sha256,
} : null;

export function auditUiIntegration(root = DEFAULT_ROOT) {
  const input = reader(resolve(root));
  const works = input.records('registry/works');
  const releases = input.records('registry/releases');
  const snapshots = input.records('registry/snapshots');
  byId(works, 'Work');
  const releaseMap = byId(releases, 'Release');
  byId(snapshots, 'Snapshot');
  const ordered = snapshots.map(record => ({ record,
    number: basename(record.path).match(/^whole-library-v([1-9]\d*)\.json$/)?.[1],
  })).filter(item => item.number).sort((a, b) => BigInt(a.number) > BigInt(b.number) ? -1 : 1);
  if (!ordered.length) throw new Error('No numeric whole-Library Snapshot found');
  const snapshot = ordered[0].record;
  if (!Array.isArray(snapshot.data.releases)) throw new Error(`Invalid release selection: ${snapshot.path}`);
  const pkg = input.json('package.json');
  const lock = input.json('package-lock.json');
  const generator = input.read('scripts/build.mjs').toString('utf8');
  const pilotTest = input.read('tests/reading-surface.test.mjs').toString('utf8');
  const findings = [];
  const add = (id, status, message, paths) => findings.push({ id, status, message, paths });
  const seenWorks = new Set();
  const seenReleases = new Set();
  const invalidSelection = [];
  for (const pin of snapshot.data.releases) {
    const selected = releaseMap.get(pin?.release_id);
    if (!selected || selected.sha256 !== pin?.manifest_sha256 ||
        seenReleases.has(pin.release_id) || seenWorks.has(selected.data.work_id)) {
      invalidSelection.push(pin?.release_id || '(missing identity)');
    }
    if (selected) seenWorks.add(selected.data.work_id);
    seenReleases.add(pin?.release_id);
  }
  add('snapshot-selection-integrity', invalidSelection.length ? 'fail' : 'pass',
    invalidSelection.length ? 'Missing, hash-mismatched or repeated selections exist.' : 'Selected Release bytes match their Snapshot digests; no duplicate Work selections.',
    [snapshot.path]);
  const shells = works.filter(record => record.data.slug === 'siso-shell');
  add('shell-identity', shells.length === 1 ? 'pass' : 'fail',
    shells.length === 1 ? 'One stable shell Work found.' : 'Expected exactly one shell Work.', shells.map(record => record.path));
  const shell = shells.length === 1 ? shells[0] : null;
  const registered = shell ? releases.filter(record => record.data.work_id === shell.data.id) : [];
  const selectedShells = registered.filter(record => seenReleases.has(record.data.id));
  const selected = selectedShells.length === 1 ? selectedShells[0] : null;
  add('shell-selection', selected ? 'pass' : 'fail',
    selected ? 'Snapshot selects exactly one registered shell Release.' : 'Snapshot does not select exactly one registered shell Release.', [snapshot.path]);
  const pins = {
    selected: revisionOf(selected?.data),
    package: shellRevision(pkg.data.dependencies?.['siso-shell']),
    lock_declaration: shellRevision(lock.data.packages?.['']?.dependencies?.['siso-shell']),
    lock_resolution: shellRevision(lock.data.packages?.['node_modules/siso-shell']?.resolved),
  };
  const aligned = Object.values(pins).every(value => value && value === pins.selected);
  add('selected-consumer-pin-alignment', aligned ? 'pass' : 'fail',
    aligned ? 'Selected source, package declaration and both lock entries agree on one exact commit.' : 'Exact selected source and consumer pins are missing or disagree.',
    [snapshot.path, 'package.json', 'package-lock.json']);
  const unselected = registered.filter(record => !seenReleases.has(record.data.id));
  add('registered-not-selected', unselected.length ? 'info' : 'pass',
    `${unselected.length} registered shell Release(s) are outside the selection; this is not an instruction to upgrade.`,
    unselected.map(record => record.path));
  const authored = works.filter(record => object(record.data.reading));
  const missing = works.filter(record => !object(record.data.reading));
  add('authored-reading-coverage', missing.length ? 'info' : 'pass',
    `${authored.length} of ${works.length} Work records carry a reading object. Content quality and schema validity are separate checks.`,
    ['registry/works']);
  const isolation = /Only the opted-in Work gets the pilot/.test(pilotTest);
  add('pilot-isolation-assertion', isolation ? 'fail' : 'pass',
    isolation ? 'The old pilot-isolation assertion remains; replace it with expanded route-family coverage.' : 'The known pilot-isolation assertion is absent; this alone does not prove route coverage.',
    ['tests/reading-surface.test.mjs']);
  const gated = /rootClass\.includes\(['"]reading-page['"]\)/.test(generator);
  add('known-pilot-gate', gated ? 'info' : 'unknown',
    gated ? 'The known reading-page gate is present in the generator.' : 'The known gate pattern is absent; review the generator rather than infer universal coverage.',
    ['scripts/build.mjs']);
  return {
    report_type: 'ui_integration_diagnostic', schema_version: '1.0.0',
    authority: 'Derived diagnostic only; not a registry, reservation or acceptance record.',
    snapshot: { path: snapshot.path, id: snapshot.data.id, version: snapshot.data.version,
      selected_release_count: snapshot.data.releases.length },
    shell: { work_id: shell?.data.id || null, registered: registered.map(releaseSummary),
      selected: releaseSummary(selected), registered_not_selected: unselected.map(releaseSummary), pins },
    reading: { work_count: works.length, authored_count: authored.length,
      missing: missing.map(record => record.path) },
    findings, invalid_selection_ids: invalidSelection,
    unverified: ['installed', 'deployed', 'rendered_route_coverage', 'crm_fidelity', 'visual_acceptance', 'live_owner_presence'],
    source_evidence: input.evidence,
    limits: ['Reads local source bytes only; does not verify GitHub HEAD or a deployed host.',
      'Pattern checks are diagnostics, not JavaScript execution or complete UI tests.',
      'Does not replace npm ci && npm run verify, owner recovery or visual review.'],
  };
}

export function runCli(args, io = process) {
  try {
    if (args.includes('--help')) {
      io.stdout.write('Usage: node scripts/audit-ui-integration.mjs [--root DIR] [--strict]\nRead-only JSON diagnostic. Exit: 0 reported; 1 strict findings; 2 invalid inputs.\n');
      return 0;
    }
    let root = DEFAULT_ROOT, strict = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--strict') strict = true;
      else if (args[i] === '--root' && args[i + 1] && !args[i + 1].startsWith('--')) root = args[++i];
      else throw new Error('Unknown argument or missing --root value');
    }
    const report = auditUiIntegration(root);
    io.stdout.write(JSON.stringify(report, null, 2) + '\n');
    return strict && report.findings.some(finding => finding.status === 'fail') ? 1 : 0;
  } catch (error) {
    io.stderr.write(`UI integration audit: ${error.message}\n`);
    return 2;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = runCli(process.argv.slice(2));
}
