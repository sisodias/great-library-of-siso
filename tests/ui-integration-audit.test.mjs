import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { auditUiIntegration, shellRevision, runCli } from '../scripts/audit-ui-integration.mjs';

// Synthetic fixtures exercise the real filesystem reader. No production-state
// claim follows from these fixture counts, identities or source revisions.
const A = 'a'.repeat(40), B = 'b'.repeat(40);
const locator = revision => `https://codeload.github.com/sisodias/siso-shell/tar.gz/${revision}`;
const hash = value => createHash('sha256').update(value).digest('hex');
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'glos-ui-audit-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, value) => {
    const full = join(root, path); mkdirSync(dirname(full), { recursive: true });
    const raw = typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n';
    writeFileSync(full, raw); return raw;
  };
  const release = { id: 'release:shell-a', work_id: 'work:shell', version: '0.1.0',
    artifacts: [{ kind: 'source_archive', revision: A }] };
  const raw = write('registry/releases/shell-a.json', release);
  write('registry/works/shell.json', { id: 'work:shell', slug: 'siso-shell' });
  write('registry/works/example.json', { id: 'work:example', slug: 'example', reading: { why: 'Synthetic prose' } });
  const snapshot = { id: 'snapshot:40', version: '40.0.0', releases: [
    { release_id: release.id, manifest_sha256: hash(raw) },
  ] };
  write('registry/snapshots/whole-library-v40.json', snapshot);
  write('package.json', { dependencies: { 'siso-shell': locator(A) } });
  const lock = { packages: {
    '': { dependencies: { 'siso-shell': locator(A) } },
    'node_modules/siso-shell': { resolved: locator(A) },
  } };
  write('package-lock.json', lock);
  write('scripts/build.mjs', 'const shellOnEveryPage = true;\n');
  write('tests/reading-surface.test.mjs', '// New route-family tests would live here.\n');
  return { root, write, release, snapshot, lock };
}
const status = (report, id) => report.findings.find(finding => finding.id === id)?.status;

for (const pin of [locator(A), `https://github.com/sisodias/siso-shell/archive/${A}.tar.gz`,
  `https://github.com/sisodias/siso-shell/archive/${A}.zip`, `git+https://github.com/sisodias/siso-shell.git#${A}`]) {
  test(`accept exact commit pin: ${pin.split('/').at(-1)}`, () => assert.equal(shellRevision(pin), A));
}
for (const pin of [null, 42, '0.2.0', locator('main'), locator('abcdef0'),
  locator(A).replace('sisodias', 'someone-else'), locator(A) + '?token=not-a-real-token',
  locator(A).replace('https://', 'http://')]) {
  test(`reject non-exact or unrelated pin: ${String(pin).slice(0, 65)}`, () => assert.equal(shellRevision(pin), null));
}

test('aligned source remains distinct from runtime and visual acceptance', t => {
  const f = fixture(t), report = auditUiIntegration(f.root);
  assert.equal(status(report, 'selected-consumer-pin-alignment'), 'pass');
  assert.equal(status(report, 'snapshot-selection-integrity'), 'pass');
  assert.equal(report.reading.work_count, 2);
  assert.equal(report.reading.authored_count, 1);
  assert.ok(report.unverified.includes('installed'));
  assert.ok(report.unverified.includes('deployed'));
  assert.ok(report.unverified.includes('visual_acceptance'));
  assert.equal(report.source_evidence.every(entry => /^[a-f0-9]{64}$/.test(entry.sha256)), true);
  assert.equal(JSON.stringify(report).includes(f.root), false);
});
test('numeric Snapshot ordering beats lexical ordering', t => {
  const f = fixture(t);
  f.write('registry/snapshots/whole-library-v9.json', { ...f.snapshot, id: 'snapshot:9', version: '9.0.0' });
  f.write('registry/snapshots/whole-library-v100.json', { ...f.snapshot, id: 'snapshot:100', version: '100.0.0' });
  assert.equal(auditUiIntegration(f.root).snapshot.version, '100.0.0');
});
test('a registered successor does not silently become selected', t => {
  const f = fixture(t);
  f.write('registry/releases/shell-b.json', { ...f.release, id: 'release:shell-b', version: '0.2.0',
    artifacts: [{ kind: 'source_archive', revision: B }] });
  const report = auditUiIntegration(f.root);
  assert.equal(report.shell.selected.source_revision, A);
  assert.equal(report.shell.registered_not_selected[0].source_revision, B);
  assert.equal(status(report, 'selected-consumer-pin-alignment'), 'pass');
});
test('changed immutable manifest bytes are detected', t => {
  const f = fixture(t);
  f.write('registry/releases/shell-a.json', { ...f.release, version: 'rewritten' });
  assert.equal(status(auditUiIntegration(f.root), 'snapshot-selection-integrity'), 'fail');
});
test('missing selected manifest is not treated as a clean empty state', t => {
  const f = fixture(t);
  f.write('registry/snapshots/whole-library-v40.json', { ...f.snapshot,
    releases: [{ release_id: 'release:absent', manifest_sha256: '0'.repeat(64) }] });
  const report = auditUiIntegration(f.root);
  assert.equal(status(report, 'snapshot-selection-integrity'), 'fail');
  assert.equal(status(report, 'shell-selection'), 'fail');
});
test('duplicate selection is rejected', t => {
  const f = fixture(t);
  f.write('registry/snapshots/whole-library-v40.json', { ...f.snapshot,
    releases: [...f.snapshot.releases, ...f.snapshot.releases] });
  assert.equal(status(auditUiIntegration(f.root), 'snapshot-selection-integrity'), 'fail');
});
test('two releases of one Work cannot masquerade as a valid selection', t => {
  const f = fixture(t);
  const raw = f.write('registry/releases/shell-b.json', { ...f.release, id: 'release:shell-b' });
  f.write('registry/snapshots/whole-library-v40.json', { ...f.snapshot,
    releases: [...f.snapshot.releases, { release_id: 'release:shell-b', manifest_sha256: hash(raw) }] });
  const report = auditUiIntegration(f.root);
  assert.equal(status(report, 'snapshot-selection-integrity'), 'fail');
  assert.equal(status(report, 'shell-selection'), 'fail');
});
test('duplicate record identities fail rather than overwriting a Map entry', t => {
  const f = fixture(t);
  f.write('registry/releases/duplicate.json', f.release);
  assert.throws(() => auditUiIntegration(f.root), /duplicate Release identity/);
});
test('lock artifact resolution is checked, not just the root declaration', t => {
  const f = fixture(t);
  f.lock.packages['node_modules/siso-shell'].resolved = locator(B);
  f.write('package-lock.json', f.lock);
  assert.equal(status(auditUiIntegration(f.root), 'selected-consumer-pin-alignment'), 'fail');
});
test('a floating package reference cannot pass pin alignment', t => {
  const f = fixture(t);
  f.write('package.json', { dependencies: { 'siso-shell': locator('main') } });
  assert.equal(status(auditUiIntegration(f.root), 'selected-consumer-pin-alignment'), 'fail');
});
test('a missing lock resolution cannot imply an installed package', t => {
  const f = fixture(t);
  delete f.lock.packages['node_modules/siso-shell']; f.write('package-lock.json', f.lock);
  const report = auditUiIntegration(f.root);
  assert.equal(status(report, 'selected-consumer-pin-alignment'), 'fail');
  assert.ok(report.unverified.includes('installed'));
});
test('null and array reading fields are not authored reading objects', t => {
  const f = fixture(t);
  f.write('registry/works/null.json', { id: 'work:null', reading: null });
  f.write('registry/works/array.json', { id: 'work:array', reading: [] });
  const report = auditUiIntegration(f.root);
  assert.equal(report.reading.work_count, 4); assert.equal(report.reading.authored_count, 1);
});
test('known isolation assertion and generator gate remain visible', t => {
  const f = fixture(t);
  f.write('tests/reading-surface.test.mjs', "assert.ok(true, 'Only the opted-in Work gets the pilot');\n");
  f.write('scripts/build.mjs', "const pilot = rootClass.includes('reading-page');\n");
  const report = auditUiIntegration(f.root);
  assert.equal(status(report, 'pilot-isolation-assertion'), 'fail');
  assert.equal(status(report, 'known-pilot-gate'), 'info');
});
test('audit leaves every input byte and file path unchanged', t => {
  const f = fixture(t);
  const inventory = path => readdirSync(path, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory() ? inventory(join(path, entry.name)) :
      [[join(path, entry.name), hash(readFileSync(join(path, entry.name)))]]);
  const before = inventory(f.root); auditUiIntegration(f.root);
  assert.deepEqual(inventory(f.root), before);
});
function captured() {
  const result = { out: '', err: '' };
  result.io = { stdout: { write: text => { result.out += text; } }, stderr: { write: text => { result.err += text; } } };
  return result;
}
test('CLI strict mode fails on findings without suppressing the report', t => {
  const f = fixture(t), output = captured();
  f.write('tests/reading-surface.test.mjs', 'Only the opted-in Work gets the pilot');
  assert.equal(runCli(['--root', f.root, '--strict'], output.io), 1);
  assert.equal(JSON.parse(output.out).report_type, 'ui_integration_diagnostic');
});
test('CLI report mode succeeds without implying acceptance', t => {
  const f = fixture(t), output = captured();
  assert.equal(runCli(['--root', f.root], output.io), 0);
  assert.ok(JSON.parse(output.out).unverified.includes('visual_acceptance'));
});
test('CLI rejects malformed input with sanitized diagnostics', t => {
  const f = fixture(t), output = captured(); f.write('package.json', '{bad-json');
  assert.equal(runCli(['--root', f.root], output.io), 2);
  assert.match(output.err, /Invalid JSON input: package.json/);
  assert.equal(output.err.includes(f.root), false);
});
test('CLI rejects incomplete or unknown arguments', () => {
  for (const args of [['--root'], ['--root', '--strict'], ['--deploy']]) {
    assert.equal(runCli(args, captured().io), 2);
  }
});
