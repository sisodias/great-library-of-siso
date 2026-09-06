import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const manifest = await read('research/industries/manifest.json');
const index = await read('site/industries/index.json');
assert.equal(index.count, 17);
assert.equal(index.canonical_work_id, manifest.canonical_work_id);
assert.equal(index.release_id, manifest.release_id);
assert.equal(index.source_commit, manifest.source_commit);
for (const row of index.records) {
  const bytes = await fs.readFile(`site/industries/${row.industry_id}/index.json`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), row.sha256);
  assert(row.source_url.includes(`/${manifest.source_commit}/`));
  const record = JSON.parse(bytes);
  assert.equal(record.status, 'research_only_not_admitted');
  assert.equal(record.observed_business_value.annual_net_cash, null);
  const html = await fs.readFile(`site/industries/${row.industry_id}/index.html`, 'utf8');
  assert(html.includes('<h1>'));
  assert(html.includes('Canonical source and machine access'));
  assert(html.includes(row.sha256));
}
const value = await read('site/valuation/index.json');
assert.equal(value.count, 10);
assert.equal(value.measured_values, false);
for (const [name, entry] of [['model', value.model], ['inputs', value.inputs]]) {
  assert.equal(createHash('sha256').update(await fs.readFile(`site/valuation/${name}.json`)).digest('hex'), entry.sha256);
}
const dossier = await read('site/works/siso-foundry/index.json');
const headers = await fs.readFile('site/_headers', 'utf8');
for (const route of ['/industries/*', '/valuation/*', '/works/siso-foundry/index.json', '/catalog.json']) assert(headers.includes(`${route}\n  Access-Control-Allow-Origin: *`));
assert.equal(dossier.work_id, manifest.canonical_work_id);
assert.equal(dossier.selected_release.id, manifest.release_id);
for (const route of ['/industries/', '/valuation/']) {
  assert((await fs.readFile('site/index.html', 'utf8')).includes(`href="${route}"`));
  assert(dossier.reading.highlights.some(h => new URL(h.url).pathname === route));
}
const old = await read('registry/snapshots/whole-library-v39.json');
const next = await read('registry/snapshots/whole-library-v40.json');
assert.deepEqual(next.projection, old.projection);
assert.deepEqual(next.assemblies, old.assemblies);
assert.deepEqual(next.releases.filter(r => r.release_id !== manifest.release_id), old.releases.filter(r => r.release_id !== 'gls:release:2c6e1a70-2b53-4e8b-9fb1-66a4f4d6871b'));
console.log('PASS Foundry readers: 17 exact JSON mirrors, 10 value examples, canonical dossier/home links and preserved V39 selections');
