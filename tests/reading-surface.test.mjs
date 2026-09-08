import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const root = await read('site/index.html');
const foundry = await read('site/works/siso-foundry/index.html');
const dossier = JSON.parse(await read('site/works/siso-foundry/index.json'));
const source = JSON.parse(await read('registry/works/siso-foundry.json'));
assert.deepEqual(dossier.reading, source.reading);
assert.equal(dossier.relationships.length, source.relationships.length);
assert.equal((root.match(/<a href="[^"]+" aria-label="(?:Client outcomes|Owners \+ compute|Packs \+ code|The Library|People \+ repositories|Foundry|God Questions|Better systems)">/g) || []).length, 8);
assert.equal((root.match(/<h1>/g) || []).length, 1);
for (const heading of ['Why it matters', 'How it links', 'Sauce', 'For agents', 'Evidence &amp; receipts']) assert.ok(foundry.includes(heading), heading);
for (const relation of dossier.relationships) assert.ok(foundry.includes(relation.target_library_url));
assert.ok(dossier.selected_release.id, 'Existing selected Release remains present');
assert.ok(root.includes('data-catalog'), 'Existing search and filter consumer preserved');

async function htmlFiles(path) {
  const files = [];
  for (const entry of await readdir(new URL(`../${path}/`, import.meta.url), { withFileTypes: true })) {
    const child = `${path}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await htmlFiles(child));
    else if (entry.name.endsWith('.html')) files.push(child);
  }
  return files;
}
const pages = await htmlFiles('site');
for (const path of pages) {
  const html = await read(path);
  assert.equal((html.match(/<nav\b/g) || []).length, 1, `${path}: one navigation landmark`);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${path}: one main landmark`);
  assert.equal((html.match(/class="siso-sidebar /g) || []).length, 1, `${path}: shared CRM rail`);
  assert.equal((html.match(/aria-current="page"/g) || []).length, 2, `${path}: current destination in labelled and compact navigation`);
  assert.match(html, /href="#library-content"/, `${path}: skip link`);
  assert.match(html, /id="library-content" tabindex="-1"/, `${path}: focusable skip target`);
  assert.doesNotMatch(html, /class="(?:site-header|siso-rail)"/, `${path}: no legacy frame`);
  for (const asset of ['tokens.css', 'rail.css', 'rail.js']) assert.ok(html.includes(`assets/siso-shell/${asset}`), `${path}: ${asset}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique IDs`);
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor), `${path}: #${anchor} resolves`);
}

// Source readers are wrapped, not rewritten or replaced with short summaries.
const bodyText = html => html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const documentPages = pages.filter(path => path.startsWith('site/docs/'));
for (const path of documentPages) {
  const original = await read(path.replace(/^site\//, ''));
  const generated = await read(path);
  const body = original.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)[1];
  const reader = generated.match(/<div class="library-document"[^>]*>([\s\S]*)<\/div><\/div><\/body>/i)?.[1];
  assert.ok(reader, `${path}: scoped original reader`);
  assert.equal(bodyText(reader), bodyText(body), `${path}: all authored body text preserved`);
  for (const [, id] of body.matchAll(/\bid="([^"]+)"/g)) assert.ok(reader.includes(`id="${id}"`), `${path}: source anchor ${id}`);
  for (const [, url] of body.matchAll(/(?:href|src)="([^"]+)"/g)) assert.ok(reader.includes(`="${url}"`), `${path}: source link ${url}`);
}
for (const asset of ['tokens.css', 'rail.css', 'rail.js', 'icons.mjs']) {
  assert.equal(await read(`site/assets/siso-shell/${asset}`), await read(`node_modules/siso-shell/shell/${asset}`), `Pinned ${asset} copied without alteration`);
}
const harness = JSON.parse(await read('site/works/siso-harness-lab/index.json'));
assert.equal(harness.work_id, 'gls:work:1cc4c944-9351-466e-a442-9fe16ad145d1');
assert.equal(harness.selected_release, null, 'Harness metadata is not a selected payload');
assert.ok(harness.source_links.some(link => link.visibility === 'private'), 'Private source remains explicit');
assert.ok((await read('site/works/siso-harness-lab/index.html')).includes('Registered · not selected'));
console.log(`PASS reading surface: ${pages.length} framed HTML routes, ${documentPages.length} preserved documents, exact shell assets, source/dossier parity, eight linked loop nodes and Harness metadata boundary`);
