import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { cp, mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const source = dirname(dirname(fileURLToPath(import.meta.url)));
let passed = 0;
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'gls-contract-'));
  for (const folder of ['schemas', 'registry']) await cp(join(source, folder), join(root, folder), { recursive: true });
  for (const folder of ['bin', 'scripts', 'drafts', 'site']) await mkdir(join(root, folder));
  for (const file of ['bin/gls', 'scripts/validate.mjs', 'scripts/scan-publication.mjs', 'scripts/check-immutable-history.mjs']) await cp(join(source, file), join(root, file));
  await writeFile(join(root, 'package.json'), '{"name":"great-library-of-siso","type":"module"}\n');
  // The real registry validators are used; a replaceable fixture gate exercises
  // rollback without recursively running this test through the full verifier.
  await writeFile(join(root, 'scripts/verify.mjs'), 'import {spawnSync} from "node:child_process"; for (const s of ["validate.mjs","scan-publication.mjs"]) { const r=spawnSync(process.execPath,["scripts/"+s],{stdio:"inherit"}); if(r.status) process.exit(r.status); }\n');
  await writeFile(join(root, 'scripts/build.mjs'), 'import{writeFile}from"node:fs/promises";await writeFile("site/rebuilt.txt","restored");\n');
  return root;
}

async function candidate(root, kind, suffix = '') {
  let record;
  if (kind === 'work' || kind === 'question') {
    record = JSON.parse(await readFile(join(root, 'registry/works', kind === 'work' ? 'siso-foundry.json' : 'frontier-question-gq-004.json')));
    record.id = `gls:work:${randomUUID()}`;
    record.slug = `gls-fixture-${kind}${suffix}`;
    record.name = `CLI fixture ${kind}${suffix}`;
    if (kind === 'question') record.research_contract.question_id = `GQ-${suffix ? '998' : '999'}`;
  } else {
    const folder = kind === 'release' ? 'releases' : 'source-inventories';
    const filename = kind === 'inventory' ? 'siso-knowledge-2026-07-30.json' : (await readdir(join(root, 'registry', folder))).filter(file => file.endsWith('.json')).sort()[0];
    record = JSON.parse(await readFile(join(root, 'registry', folder, filename)));
    record.id = `gls:${kind === 'release' ? 'release' : 'source-inventory'}:${randomUUID()}`;
    if (kind === 'release') { record.version = 'gls-fixture'; record.artifacts.forEach(artifact => { artifact.id = `gls:artifact:${randomUUID()}`; }); }
    else record.name = `CLI fixture inventory${suffix}`;
  }
  const file = join(root, 'drafts', `fixture-${kind}${suffix}.json`);
  const bytes = `${JSON.stringify(record, null, 2)}\n`;
  await writeFile(file, bytes);
  return { file, bytes, record, destination: join(root, 'registry', kind === 'release' ? 'releases' : kind === 'inventory' ? 'source-inventories' : 'works', `fixture-${kind}${suffix}.json`) };
}

function run(root, kind, files, extra = [], reviewed = true) {
  return spawnSync(process.execPath, [join(root, 'bin/gls'), 'add', kind, ...files.flatMap(file => ['--file', file]), '--root', root, ...(reviewed ? ['--reviewed-public'] : []), ...extra], { cwd: root, encoding: 'utf8', env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=256' } });
}

async function registryDigest(root) {
  const hash = createHash('sha256');
  for (const folder of (await readdir(join(root, 'registry'))).sort()) {
    for (const file of (await readdir(join(root, 'registry', folder))).sort()) hash.update(folder).update(file).update(await readFile(join(root, 'registry', folder, file)));
  }
  return hash.digest('hex');
}

async function check(name, execute) {
  const root = await fixture();
  try { await execute(root); passed++; }
  catch (error) { console.error(`FAIL gls: ${name}`); throw error; }
  finally { await rm(root, { recursive: true, force: true }); }
}

for (const kind of ['work', 'release', 'inventory', 'question']) await check(`adds valid ${kind}`, async root => {
  const input = await candidate(root, kind);
  const result = run(root, kind, [input.file]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'added');
  assert.equal(await readFile(input.destination, 'utf8'), input.bytes, 'exact input bytes are preserved');
});

await check('dry run is read-only and rejects unreviewed input', async root => {
  const input = await candidate(root, 'work');
  const before = await registryDigest(root);
  assert.equal(run(root, 'work', [input.file], ['--dry-run']).status, 0);
  assert.equal(await registryDigest(root), before);
  await assert.rejects(readFile(join(root, '.local/gls-add.lock')), { code: 'ENOENT' });
  assert.notEqual(run(root, 'work', [input.file], [], false).status, 0);
});

await check('batch questions and filename collisions', async root => {
  const one = await candidate(root, 'question'), two = await candidate(root, 'question', '-two');
  const result = run(root, 'question', [one.file, two.file]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).records.length, 2);
  const before = await registryDigest(root);
  assert.notEqual(run(root, 'question', [one.file]).status, 0);
  assert.equal(await registryDigest(root), before);
});

await check('duplicate identity, wrong question type and unsafe filename are refused', async root => {
  const input = await candidate(root, 'work');
  assert.notEqual(run(root, 'question', [input.file]).status, 0);
  assert.notEqual(run(root, 'work', [input.file], ['--name', '../escape']).status, 0);
  input.record.id = 'gls:work:ec664d93-df93-48c5-be40-5d0165886c01';
  await writeFile(input.file, JSON.stringify(input.record));
  assert.notEqual(run(root, 'work', [input.file]).status, 0);
  await assert.rejects(readFile(input.destination), { code: 'ENOENT' });
});

await check('private paths, malformed JSON and symlinked input are refused before writes', async root => {
  const input = await candidate(root, 'work');
  const before = await registryDigest(root);
  input.record.summary = '/' + 'Users/' + 'fixture/private-notes';
  await writeFile(input.file, JSON.stringify(input.record));
  assert.notEqual(run(root, 'work', [input.file]).status, 0);
  await writeFile(input.file, '{broken');
  assert.notEqual(run(root, 'work', [input.file]).status, 0);
  await rm(input.file); await symlink(join(root, 'registry/works/siso-foundry.json'), input.file);
  assert.notEqual(run(root, 'work', [input.file]).status, 0);
  assert.equal(await registryDigest(root), before);
});

await check('failed full gate removes only new bytes and rebuilds the previous site', async root => {
  const input = await candidate(root, 'work');
  const before = await registryDigest(root);
  await writeFile(join(root, 'scripts/verify.mjs'), 'process.exit(7);\n');
  assert.notEqual(run(root, 'work', [input.file]).status, 0);
  assert.equal(await registryDigest(root), before);
  assert.equal(await readFile(input.file, 'utf8'), input.bytes);
  assert.equal(await readFile(join(root, 'site/rebuilt.txt'), 'utf8'), 'restored');
});

await check('an existing lock is retained and never stolen', async root => {
  const input = await candidate(root, 'work');
  await mkdir(join(root, '.local'));
  const bytes = '{"pid":123,"started_at":"2026-09-06T00:00:00Z"}\n';
  const path = join(root, '.local/gls-add.lock');
  await writeFile(path, bytes);
  assert.notEqual(run(root, 'work', [input.file]).status, 0);
  assert.equal(await readFile(path, 'utf8'), bytes);
  await assert.rejects(readFile(input.destination), { code: 'ENOENT' });
});

await check('failed gate retains an unexpected concurrent edit', async root => {
  const input = await candidate(root, 'work');
  await writeFile(join(root, 'scripts/verify.mjs'), 'import{writeFile}from"node:fs/promises";await writeFile("registry/works/fixture-work.json","peer edit");process.exit(7);\n');
  const result = run(root, 'work', [input.file]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /edits preserved/);
  assert.equal(await readFile(input.destination, 'utf8'), 'peer edit');
});

console.log(`PASS gls contract: ${passed} cases`);
