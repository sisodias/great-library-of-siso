import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'site');
const ASSETS = join(ROOT, 'src/site/assets');
const BASE = normalizeBase(process.env.SITE_BASE_PATH || '/');
const DIST_KEYS = [
  ['downloadable', 'Downloadable'],
  ['resolvable', 'Resolvable'],
  ['installable', 'Installable'],
  ['forkable', 'Forkable'],
  ['portable', 'Portable'],
  ['redistributable', 'Redistributable'],
];
const AGENT_FOCUS = [
  'SISO Project OS',
  'SISO Agent Base',
  'Herdr',
  'Agent Zero Coordination Playbook',
];

function normalizeBase(value) {
  const clean = `/${String(value).replace(/^\/+|\/+$/g, '')}/`;
  return clean === '//' ? '/' : clean;
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function text(value, fallback = 'Not yet recorded') {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  return fallback;
}

function slugify(value) {
  return String(value || 'work')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'work';
}

function href(path = '') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE}${String(path).replace(/^\/+/, '')}`;
}

function safeExternalUrl(value) {
  try {
    const url = new URL(String(value));
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

async function jsonFiles(dir) {
  const found = [];
  async function walk(current) {
    let entries = [];
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      if (entry.isFile() && entry.name.endsWith('.json')) found.push(full);
    }
  }
  await walk(dir);
  return found.sort();
}

async function loadRecords(kind) {
  const dir = join(ROOT, 'registry', kind);
  const records = [];
  for (const file of await jsonFiles(dir)) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    const values = Array.isArray(parsed) ? parsed : [parsed];
    for (const value of values) records.push({ ...value, __file: relative(ROOT, file) });
  }
  return records;
}

function linkEntries(raw) {
  const links = [];
  const add = (kind, label, value) => {
    const url = safeExternalUrl(typeof value === 'object' ? value?.url || value?.href : value);
    if (url && !links.some((link) => link.url === url)) links.push({ kind, label, url });
  };
  const source = raw.links || raw.urls || raw.locators || {};
  if (Array.isArray(source)) {
    for (const item of source) {
      const kind = text(item.rel || item.kind || item.type, 'reference').toLowerCase();
      add(kind, text(item.label, kind === 'docs' ? 'Documentation' : kind), item);
    }
  } else {
    for (const [kind, value] of Object.entries(source)) {
      add(kind.toLowerCase(), kind.replaceAll('_', ' '), value);
    }
  }
  add('source', 'Source repository', raw.source_url || raw.repository_url || raw.repository);
  add('docs', 'Upstream documentation', raw.docs_url || raw.documentation_url);
  add('demo', 'Upstream demo', raw.demo_url || raw.website_url || raw.homepage);
  const provenance = raw.provenance || {};
  add('source', 'Source repository', provenance.source_url || provenance.repository_url || provenance.repository);
  return links;
}

function normalizeWork(raw) {
  const id = text(raw.work_id || raw.id || raw.stable_id, 'unassigned');
  const name = text(raw.name || raw.title || raw.display_name, id);
  const explicitSlug = raw.slug || raw.library_slug || raw.library_path;
  const slug = slugify(explicitSlug || (id !== 'unassigned' ? id : name));
  const relationships = (raw.relationships || raw.relations || []).map((item) => ({
    type: text(item.type || item.relation || item.predicate || item.kind, 'related to'),
    target: text(item.target_work_id || item.target_id || item.target?.work_id || item.target?.id || item.target, 'Unresolved target'),
    label: text(item.target_name || item.target?.name || item.label, ''),
  }));
  return {
    raw,
    id,
    slug,
    name,
    summary: text(raw.summary || raw.description || raw.abstract),
    type: text(raw.work_type || raw.type || raw.kind, 'Unclassified'),
    maturity: text(raw.maturity || raw.status || raw.lifecycle_state, 'Unknown'),
    section: text(raw.section || raw.category || raw.domain, 'Agents'),
    relationships,
    links: linkEntries(raw),
    provenance: raw.provenance || {},
    license: text(raw.license?.state || raw.license?.spdx || raw.license || raw.redistribution?.license, 'Pending'),
    sourceFile: raw.__file,
  };
}

function normalizeRelease(raw) {
  return {
    raw,
    id: text(raw.release_id || raw.id, 'unassigned-release'),
    workId: text(raw.work_id || raw.work?.id || raw.for_work, ''),
    version: text(raw.version || raw.tag || raw.name, 'Unversioned'),
    date: text(raw.released_at || raw.published_at || raw.date, 'Date pending'),
    distribution: raw.distribution || raw.distribution_states || raw.states || {},
  };
}

function stateFor(release, key) {
  if (!release) return { label: 'No release', tone: 'unknown', note: 'No accepted Release Manifest is connected.' };
  const value = release.distribution?.[key];
  if (value == null) return { label: 'Unknown', tone: 'unknown', note: 'This state is not declared by the release.' };
  const state = typeof value === 'object' ? value.state || value.status : value;
  const evidence = typeof value === 'object' ? value.evidence || value.receipt || value.url : null;
  const normalized = String(state).toLowerCase();
  if (['false', 'no', 'unavailable', 'blocked', 'not_available'].includes(normalized)) {
    return { label: 'Unavailable', tone: 'negative', note: 'Explicitly unavailable in this release.' };
  }
  if (['pending', 'review', 'unknown', 'undetermined'].includes(normalized)) {
    return { label: 'Pending', tone: 'pending', note: 'Awaiting evidence or review.' };
  }
  if (['true', 'yes', 'available', 'verified', 'confirmed'].includes(normalized)) {
    return evidence
      ? { label: 'Confirmed', tone: 'positive', note: 'Declared with release evidence.' }
      : { label: 'Unverified', tone: 'pending', note: 'Declared, but no evidence is attached.' };
  }
  return { label: text(state, 'Unknown'), tone: evidence ? 'positive' : 'pending', note: evidence ? 'Evidence attached.' : 'No evidence attached.' };
}

function nav(active) {
  return `<a class="skip-link" href="#content">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="${href('')}" aria-label="The Great Library of SISO home">
      <span class="brand-mark" aria-hidden="true">GL</span>
      <span><b>The Great Library</b><small>of SISO</small></span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" aria-label="Primary">
      <a ${active === 'library' ? 'aria-current="page"' : ''} href="${href('')}">Library</a>
      <a ${active === 'agents' ? 'aria-current="page"' : ''} href="${href('agents/')}">Agents</a>
      <a ${active === 'releases' ? 'aria-current="page"' : ''} href="${href('releases/')}">Releases</a>
      <a ${active === 'snapshots' ? 'aria-current="page"' : ''} href="${href('snapshots/')}">Snapshots</a>
    </nav>
  </header>`;
}

function page({ title, description, active = 'library', body, rootClass = '' }) {
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(description)}">
  <meta name="color-scheme" content="light">
  <title>${esc(title)} · The Great Library of SISO</title>
  <link rel="stylesheet" href="${href('assets/styles.css')}">
  <script>document.documentElement.className='js'</script>
  <script defer src="${href('assets/app.js')}"></script>
</head>
<body class="${esc(rootClass)}">
  ${nav(active)}
  <main id="content">${body}</main>
  <footer>The Great Library of SISO — Built by the SISO Open Source Foundation · Funded by SISO Agency.</footer>
</body>
</html>`;
}

function eyebrow(textValue) {
  return `<p class="eyebrow"><span aria-hidden="true"></span>${esc(textValue)}</p>`;
}

function workCard(work) {
  return `<article class="work-card" data-search="${esc(`${work.name} ${work.summary} ${work.type} ${work.maturity}`.toLowerCase())}" data-type="${esc(slugify(work.type))}" data-maturity="${esc(slugify(work.maturity))}">
    <div class="card-topline"><span>${esc(work.type)}</span><span class="maturity">${esc(work.maturity)}</span></div>
    <h3><a href="${href(`works/${work.slug}/`)}">${esc(work.name)}</a></h3>
    <p>${esc(work.summary)}</p>
    <div class="card-foot"><code>${esc(work.id)}</code><span aria-hidden="true">↗</span></div>
  </article>`;
}

function emptyCatalog(message) {
  return `<div class="empty-state"><span class="index-number">00</span><div><h3>Records in transit</h3><p>${esc(message)}</p></div></div>`;
}

function catalogControls(works) {
  const options = (values) => [...new Set(values)].sort().map((value) => `<option value="${esc(slugify(value))}">${esc(value)}</option>`).join('');
  return `<div class="catalog-controls" data-catalog-controls>
    <label class="search-field"><span>Search the catalog</span><input type="search" placeholder="Name, purpose, type…" autocomplete="off" data-catalog-search></label>
    <label><span>Type</span><select data-catalog-type><option value="">All types</option>${options(works.map((work) => work.type))}</select></label>
    <label><span>Maturity</span><select data-catalog-maturity><option value="">All states</option>${options(works.map((work) => work.maturity))}</select></label>
  </div>`;
}

function homePage(works, releases, snapshots) {
  const agentWorks = works.filter((work) => /agent/i.test(`${work.section} ${work.type} ${work.name}`));
  const visible = agentWorks.length ? agentWorks : works;
  return page({
    title: 'A public index of SISO source',
    description: 'A human- and agent-readable registry of SISO works, releases, relationships, and named snapshots.',
    body: `<section class="hero shell">
      <div class="hero-copy">${eyebrow('Public registry · Agents first')}
        <h1>Source deserves a<br><em>permanent reading room.</em></h1>
        <p class="lede">The Great Library gives every cataloged Work a stable public detail page—even when its source repository has no site of its own.</p>
        <div class="hero-actions"><a class="button" href="${href('agents/')}">Enter the Agents section <span>→</span></a><a class="text-link" href="#catalog">Browse the index</a></div>
      </div>
      <aside class="catalog-note" aria-label="Catalog model">
        <p>Catalog model</p>
        <ol><li><span>01</span><b>Library</b><small>The complete public registry</small></li><li><span>02</span><b>Sections</b><small>Curated views such as Agents</small></li><li><span>03</span><b>Works</b><small>Stable identities and detail URLs</small></li></ol>
        <div><span>Releases</span><span>Snapshots</span></div>
      </aside>
    </section>
    <section class="model-strip"><div class="shell"><p><b>Works stay stable.</b> Repositories and upstream docs remain optional, replaceable locators.</p><p><b>Relationships carry structure.</b> Hierarchy is a versioned view, never hidden in identity.</p></div></section>
    <section class="section shell agents-intro">
      <div class="section-heading">${eyebrow('Section 01')}<h2>Agents</h2><p>Systems and playbooks for building, operating, and coordinating agent work.</p></div>
      <div class="focus-list">${AGENT_FOCUS.map((name, index) => {
        const match = works.find((work) => work.name.toLowerCase() === name.toLowerCase());
        return `<a class="focus-row ${match ? '' : 'is-pending'}" href="${match ? href(`works/${match.slug}/`) : href('agents/')}"><span>0${index + 1}</span><b>${esc(name)}</b><small>${match ? esc(match.type) : 'Awaiting accepted Work record'}</small><i aria-hidden="true">→</i></a>`;
      }).join('')}</div>
    </section>
    <section id="catalog" class="section catalog-section shell">
      <div class="section-heading compact">${eyebrow('Live index')}<h2>Browse the Works</h2><p><span data-result-count>${works.length}</span> accepted ${works.length === 1 ? 'record' : 'records'} in this build.</p></div>
      ${works.length ? catalogControls(works) : ''}
      <div class="work-grid" data-catalog>${works.length ? visible.map(workCard).join('') : emptyCatalog('The public shell is ready; Work pages will appear as soon as accepted registry records land.')}</div>
      <p class="no-results" data-no-results hidden>No Works match those filters.</p>
    </section>
    <section class="ledger shell" aria-label="Registry counts"><div><strong>${String(works.length).padStart(2, '0')}</strong><span>Works</span></div><div><strong>${String(releases.length).padStart(2, '0')}</strong><span>Releases</span></div><div><strong>${String(snapshots.length).padStart(2, '0')}</strong><span>Snapshots</span></div><p>Counts reflect accepted registry files in this build.</p></section>`,
  });
}

function agentsPage(works) {
  const agentWorks = works.filter((work) => /agent/i.test(`${work.section} ${work.type} ${work.name}`));
  const related = agentWorks.length ? agentWorks : works;
  return page({
    title: 'Agents', active: 'agents', rootClass: 'agents-page',
    description: 'The Agents section of The Great Library of SISO.',
    body: `<section class="subhero shell">${eyebrow('Library / Sections / Agents')}<div><h1>Agents</h1><p>Four focal Works. One public reading surface. Relationships describe how projects adopt agent systems and how coordination playbooks connect them.</p></div><span class="folio">A—01</span></section>
    <section class="relationship-map shell" aria-labelledby="map-title"><div class="map-copy">${eyebrow('Relationship view')}<h2 id="map-title">Connected by use,<br>not contained by rank.</h2><p>The catalog keeps each Work independent. Typed relationships supply context without turning a current composition into a permanent hierarchy.</p></div><div class="map-stack">${AGENT_FOCUS.map((name, i) => {
      const work = works.find((item) => item.name.toLowerCase() === name.toLowerCase());
      return `<div class="map-node ${work ? '' : 'is-pending'}"><span>0${i + 1}</span><div><b>${esc(name)}</b><small>${work ? `${esc(work.type)} · ${esc(work.maturity)}` : 'Record pending'}</small></div></div>`;
    }).join('')}<p class="map-key"><i></i>Registry status is explicit; missing records are never inferred.</p></div></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Accepted records')}<h2>Works in Agents</h2><p><span data-result-count>${related.length}</span> Works available to read.</p></div>${related.length ? catalogControls(related) : ''}<div class="work-grid" data-catalog>${related.length ? related.map(workCard).join('') : emptyCatalog('This section will populate from accepted Work records; no provisional detail pages are published.')}</div><p class="no-results" data-no-results hidden>No Works match those filters.</p></section>`,
  });
}

function detailList(title, items) {
  return `<section class="detail-block"><h2>${esc(title)}</h2>${items.length ? `<div class="detail-rows">${items.join('')}</div>` : '<p class="quiet">Nothing has been declared here yet.</p>'}</section>`;
}

function workPage(work, releases, byId) {
  const workReleases = releases.filter((release) => release.workId === work.id);
  const latest = workReleases.at(-1);
  const provenance = [
    ['Registry source', work.sourceFile],
    ['Steward', work.provenance.steward || work.provenance.owner || work.raw.steward],
    ['Origin', work.provenance.origin || work.provenance.upstream || work.raw.origin],
    ['License / redistribution', work.license],
  ].filter(([, value]) => value).map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(typeof value === 'object' ? value.name || value.state || 'Recorded' : value)}</dd></div>`);
  const relationshipRows = work.relationships.map((relation) => {
    const target = byId.get(relation.target);
    const targetLabel = relation.label || target?.name || relation.target;
    return `<div><span>${esc(relation.type)}</span><p>${target ? `<a href="${href(`works/${target.slug}/`)}">${esc(targetLabel)}</a>` : esc(targetLabel)}${target ? '' : '<small> Unresolved in this build</small>'}</p></div>`;
  });
  const linkRows = work.links.map((link) => `<a href="${esc(link.url)}" rel="noopener noreferrer"><span>${esc(link.kind)}</span><b>${esc(link.label)}</b><i aria-hidden="true">↗</i></a>`);
  const libraryUrl = href(`works/${work.slug}/`);
  return page({
    title: work.name,
    active: /agent/i.test(`${work.section} ${work.type}`) ? 'agents' : 'library',
    description: work.summary,
    rootClass: 'work-page',
    body: `<article>
      <header class="work-hero shell">${eyebrow(`Work / ${work.id}`)}<div class="work-title"><h1>${esc(work.name)}</h1><p>${esc(work.summary)}</p></div><dl class="work-meta"><div><dt>Type</dt><dd>${esc(work.type)}</dd></div><div><dt>Maturity</dt><dd>${esc(work.maturity)}</dd></div><div><dt>Section</dt><dd>${esc(work.section)}</dd></div></dl></header>
      <div class="permalink-bar"><div class="shell"><span>Permanent Library detail URL</span><code>${esc(libraryUrl)}</code></div></div>
      <div class="detail-layout shell"><div>
        ${detailList('Relationships', relationshipRows)}
        ${detailList('Provenance', provenance.length ? [`<dl class="provenance-list">${provenance.join('')}</dl>`] : [])}
        ${detailList('Source & upstream links', linkRows)}
      </div><aside class="release-panel"><div class="release-heading"><div>${eyebrow('Latest release')}<h2>${esc(latest?.version || 'No accepted release')}</h2></div><span>${esc(latest?.date || 'Manifest pending')}</span></div><div class="state-list">${DIST_KEYS.map(([key, label]) => {
          const state = stateFor(latest, key);
          return `<div><span class="state-dot ${state.tone}" aria-hidden="true"></span><p><b>${esc(label)}</b><small>${esc(state.note)}</small></p><strong>${esc(state.label)}</strong></div>`;
        }).join('')}</div><p class="uncertainty-note">Availability is never inferred. Positive states require an explicit release declaration and evidence.</p></aside></div>
    </article>`,
  });
}

function releaseIndex(releases, worksById) {
  const rows = releases.map((release) => `<article><span>${esc(release.version)}</span><div><h2>${esc(worksById.get(release.workId)?.name || release.workId || 'Unresolved Work')}</h2><p>${esc(release.id)} · ${esc(release.date)}</p></div></article>`).join('');
  return page({ title: 'Releases', active: 'releases', description: 'Immutable Release Manifests.', body: `<section class="subhero shell">${eyebrow('Library / Releases')}<div><h1>Releases</h1><p>Immutable manifests connect a Work to a version and make distribution claims explicit.</p></div><span class="folio">R—01</span></section><section class="section shell release-index">${rows || emptyCatalog('No accepted Release Manifests are present in this build.')}</section>` });
}

function snapshotIndex(snapshots) {
  const rows = snapshots.map((snapshot) => `<article><span>${esc(text(snapshot.name || snapshot.title, 'Named snapshot'))}</span><div><h2>${esc(text(snapshot.snapshot_id || snapshot.id, 'Unassigned'))}</h2><p>${esc(text(snapshot.summary || snapshot.description, 'Metadata-complete recursive view.'))}</p></div></article>`).join('');
  return page({ title: 'Snapshots', active: 'snapshots', description: 'Named recursive views of the Library.', body: `<section class="subhero shell">${eyebrow('Library / Snapshots')}<div><h1>Snapshots</h1><p>Named recursive views pin Library metadata. Payload materialization remains a separate, receipted operation.</p></div><span class="folio">S—01</span></section><section class="section shell release-index">${rows || emptyCatalog('No accepted named snapshots are present in this build.')}</section>` });
}

async function emit(path, contents) {
  const target = join(OUT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

const [rawWorks, rawReleases, snapshots] = await Promise.all([
  loadRecords('works'), loadRecords('releases'), loadRecords('snapshots'),
]);
const sourceDates = [...rawWorks, ...rawReleases, ...snapshots]
  .flatMap((record) => [record.updated_at, record.released_at, record.created_at, record.observed_at])
  .filter(Boolean)
  .sort();
const latestSourceDate = sourceDates.at(-1) || '1970-01-01';
const generatedAt = /^\d{4}-\d{2}-\d{2}$/.test(latestSourceDate)
  ? `${latestSourceDate}T00:00:00.000Z`
  : new Date(latestSourceDate).toISOString();
const works = rawWorks.map(normalizeWork).sort((a, b) => a.name.localeCompare(b.name));
const releases = rawReleases.map(normalizeRelease).sort((a, b) => `${a.date}${a.version}`.localeCompare(`${b.date}${b.version}`));
const worksById = new Map(works.map((work) => [work.id, work]));

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(ASSETS, join(OUT, 'assets'), { recursive: true });
await emit('index.html', homePage(works, releases, snapshots));
await emit('agents/index.html', agentsPage(works));
await emit('releases/index.html', releaseIndex(releases, worksById));
await emit('snapshots/index.html', snapshotIndex(snapshots));
for (const work of works) await emit(`works/${work.slug}/index.html`, workPage(work, releases, worksById));
await emit('catalog.json', `${JSON.stringify({ generated_at: generatedAt, base_path: BASE, works: works.map((work) => ({ id: work.id, slug: work.slug, name: work.name, library_url: href(`works/${work.slug}/`), type: work.type, maturity: work.maturity })) }, null, 2)}\n`);

console.log(`Built ${works.length} Works, ${releases.length} Releases, and ${snapshots.length} Snapshots at ${BASE}`);
