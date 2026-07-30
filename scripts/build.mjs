import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'site');
const ASSETS = join(ROOT, 'src/site/assets');
const BASE = normalizeBase(process.env.SITE_BASE_PATH || '/');
const DIST_KEYS = [
  ['archive_downloadable', 'Downloadable'],
  ['manifest_resolvable', 'Resolvable'],
  ['installable', 'Installable'],
  ['forkable', 'Forkable'],
  ['portable', 'Portable'],
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
  for (const locator of provenance.locators || []) {
    const label = locator.type === 'source_repository' ? 'Source repository'
      : locator.type === 'homepage' ? 'Homepage'
      : locator.type === 'documentation' ? 'Documentation'
      : locator.type.replaceAll('_', ' ');
    add(locator.type, label, locator);
  }
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
  const license = raw.provenance?.license || raw.license || raw.redistribution?.license;
  return {
    raw,
    id,
    slug,
    name,
    summary: text(raw.summary || raw.description || raw.abstract),
    type: text(raw.work_type || raw.type || raw.kind, 'Unclassified'),
    maturity: text(raw.maturity || raw.status || raw.lifecycle_status || raw.lifecycle_state, 'Unknown'),
    section: text(raw.section || raw.category || raw.domain, 'Unassigned'),
    relationships,
    links: linkEntries(raw),
    provenance: raw.provenance || {},
    license: license && typeof license === 'object' ? `${text(license.spdx, 'NOASSERTION')} (${text(license.status || license.state, 'pending')})` : text(license, 'Pending'),
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
      <a ${active === 'research' ? 'aria-current="page"' : ''} href="${href('research/')}">Research</a>
      <a ${active === 'estate' ? 'aria-current="page"' : ''} href="${href('estate/')}">Repo estate</a>
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

function assemblyMembers(assembly, works) {
  const byId = new Map(works.map((work) => [work.id, work]));
  return (assembly?.components || []).map((component) => ({ component, work: byId.get(component.work_id) }));
}

function projectionMembers(sectionId, snapshot, works) {
  const byId = new Map(works.map((work) => [work.id, work]));
  return (snapshot?.projection?.edges || [])
    .filter((edge) => edge.from_work_id === sectionId)
    .map((edge) => ({ edge, work: byId.get(edge.to_work_id) }))
    .filter(({ work }) => work);
}

function homePage(works, releases, snapshots, assemblies, sections) {
  return page({
    title: 'A public index of SISO source',
    description: 'A human- and agent-readable registry of SISO works, releases, relationships, and named snapshots.',
    body: `<section class="hero shell">
      <div class="hero-copy">${eyebrow('Public registry · Permanent source map')}
        <h1>Source deserves a<br><em>permanent reading room.</em></h1>
        <p class="lede">The Great Library gives every cataloged Work a stable public detail page—even when its source repository has no site of its own.</p>
        <div class="hero-actions"><a class="button" href="${href('agents/')}">Enter the Agents section <span>→</span></a><a class="text-link" href="#sections">Browse sections</a></div>
      </div>
      <aside class="catalog-note" aria-label="Catalog model">
        <p>Catalog model</p>
        <ol><li><span>01</span><b>Library</b><small>The complete public registry</small></li><li><span>02</span><b>Sections</b><small>Curated views such as Agents</small></li><li><span>03</span><b>Works</b><small>Stable identities and detail URLs</small></li></ol>
        <div><span>Releases</span><span>Snapshots</span></div>
      </aside>
    </section>
    <section class="model-strip"><div class="shell"><p><b>Works stay stable.</b> Repositories and upstream docs remain optional, replaceable locators.</p><p><b>Relationships carry structure.</b> Hierarchy is a versioned view, never hidden in identity.</p></div></section>
    <section class="section shell agents-intro"><div class="section-heading">${eyebrow('New here?')}<h2>Enter with the map.</h2><p>The onboarding page gives humans and agents one cold-start route through identity, evidence, releases, snapshots, contribution, and safety.</p><p><a class="button" href="${href('docs/onboarding.html')}">Open onboarding <span>→</span></a></p></div></section>
    <section id="sections" class="section shell agents-intro">
      <div class="section-heading">${eyebrow('Versioned projections')}<h2>Library sections</h2><p>Sections are browsable views over stable Works. Moving a Work between sections never changes its identity or source history.</p></div>
      <div class="focus-list">${sections.map((section, index) => {
        return `<a class="focus-row" href="${href(`${section.slug}/`)}"><span>${String(index + 1).padStart(2, '0')}</span><b>${esc(section.name)}</b><small>${esc(section.summary)}</small><i aria-hidden="true">→</i></a>`;
      }).join('')}</div>
    </section>
    <section id="catalog" class="section catalog-section shell">
      <div class="section-heading compact">${eyebrow('Live index')}<h2>Browse the Works</h2><p><span data-result-count>${works.length}</span> accepted ${works.length === 1 ? 'record' : 'records'} in this build.</p></div>
      ${works.length ? catalogControls(works) : ''}
      <div class="work-grid" data-catalog>${works.length ? works.map(workCard).join('') : emptyCatalog('The public shell is ready; Work pages will appear as soon as accepted registry records land.')}</div>
      <p class="no-results" data-no-results hidden>No Works match those filters.</p>
    </section>
    <section class="ledger shell" aria-label="Registry counts"><div><strong>${String(works.length).padStart(2, '0')}</strong><span>Works</span></div><div><strong>${String(assemblies.length).padStart(2, '0')}</strong><span>Assemblies</span></div><div><strong>${String(snapshots.length).padStart(2, '0')}</strong><span>Snapshots</span></div><p>Counts reflect accepted registry files in this build.</p></section>`,
  });
}

function agentsPage(works, assemblies, snapshot, sectionWork) {
  const stack = assemblies.find((assembly) => assembly.slug === 'siso-agent-stack');
  const members = assemblyMembers(stack, works);
  const projected = projectionMembers(sectionWork?.id, snapshot, works).map(({ work }) => work);
  const related = [...new Map([...members.map(({ work }) => work).filter(Boolean), ...projected].map((work) => [work.id, work])).values()];
  return page({
    title: 'Agents', active: 'agents', rootClass: 'agents-page',
    description: 'The Agents section of The Great Library of SISO.',
    body: `<section class="subhero shell">${eyebrow('Library / Sections / Agents')}<div><h1>Agents</h1><p>${esc(stack?.name || 'SISO Agent Stack')} keeps the working stack together. Component roles describe responsibility inside this assembly; they are not global categories.</p></div><span class="folio">A—01</span></section>
    <section class="relationship-map shell" aria-labelledby="map-title"><div class="map-copy">${eyebrow(`Assembly / ${stack?.version || 'unversioned'}`)}<h2 id="map-title">One stack.<br>Four required components.</h2><p>${esc(stack?.outcome || 'The assembly connects intent, execution, coordination, project state, and proof.')}</p><p><a href="${href('docs/agent-stack-model.html')}">Read the source-backed stack model →</a><br><a href="${href('docs/agent-base-module-map.html')}">See the Agent Base module extraction map →</a><br><a href="${href('docs/skills-repository-map.html')}">Open the Skill repository map →</a><br><a href="${href('docs/task-state-system-map.html')}">See where task and state source belongs →</a></p></div><div class="map-stack">${members.map(({ component, work }, i) => {
      return `<div class="map-node ${work ? '' : 'is-pending'}"><span>0${i + 1}</span><div><b>${esc(work?.name || component.component_id)}</b><small>${esc(component.required ? `required · ${component.role}` : component.role)}</small></div></div>`;
    }).join('')}<p class="map-key"><i></i>Skills are reusable capabilities. Playbooks compose skills, tools, lanes, and verification for a scenario.</p></div></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Accepted records')}<h2>Works in Agents</h2><p><span data-result-count>${related.length}</span> Works available to read.</p></div>${related.length ? catalogControls(related) : ''}<div class="work-grid" data-catalog>${related.length ? related.map(workCard).join('') : emptyCatalog('This section will populate from accepted Work records; no provisional detail pages are published.')}</div><p class="no-results" data-no-results hidden>No Works match those filters.</p></section>`,
  });
}

function researchPage(works, snapshot, sectionWork) {
  const related = projectionMembers(sectionWork?.id, snapshot, works).map(({ work }) => work);
  return page({
    title: 'Research', active: 'research', rootClass: 'agents-page',
    description: 'The Research section of The Great Library of SISO.',
    body: `<section class="subhero shell">${eyebrow('Library / Sections / Research')}<div><h1>Research</h1><p>Source discovery, evidence pipelines, knowledge engines, and durable research artifacts live here. They may serve agents without being contained by the Agents section.</p></div><span class="folio">R—01</span></section>
    <section class="relationship-map shell" aria-labelledby="research-map-title"><div class="map-copy">${eyebrow(`Projection / ${snapshot?.version || 'unversioned'}`)}<h2 id="research-map-title">Research is its own domain.</h2><p>Foundry begins this section as the source-mining and reuse-knowledge platform. Evidence engines and research datasets can join as independently verified Works without becoming Agent Runtime modules.</p><p><a href="${href('docs/agent-base-module-map.html')}">See how Agent Base research material is reallocated →</a></p></div><div class="map-stack">${related.map((work, i) => `<div class="map-node"><span>${String(i + 1).padStart(2, '0')}</span><div><b>${esc(work.name)}</b><small>${esc(work.type)} · ${esc(work.maturity)}</small></div></div>`).join('') || '<p class="map-key">Accepted Research Works are being indexed.</p>'}</div></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Accepted records')}<h2>Works in Research</h2><p><span data-result-count>${related.length}</span> Works available to read.</p></div>${related.length ? catalogControls(related) : ''}<div class="work-grid" data-catalog>${related.length ? related.map(workCard).join('') : emptyCatalog('This section will populate only from accepted snapshot relationships.')}</div><p class="no-results" data-no-results hidden>No Works match those filters.</p></section>`,
  });
}

function detailList(title, items) {
  return `<section class="detail-block"><h2>${esc(title)}</h2>${items.length ? `<div class="detail-rows">${items.join('')}</div>` : '<p class="quiet">Nothing has been declared here yet.</p>'}</section>`;
}

function workPage(work, releases, byId, activeRelease) {
  const workReleases = releases.filter((release) => release.workId === work.id);
  const latest = activeRelease || workReleases.at(-1);
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
    active: work.section === 'Research' ? 'research' : /agent/i.test(`${work.section} ${work.type}`) ? 'agents' : 'library',
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

function githubRepository(locator) {
  const value = safeExternalUrl(locator?.url);
  if (!value) return null;
  const url = new URL(value);
  if (url.hostname.toLowerCase() !== 'github.com') return null;
  const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const repository = parts[1].replace(/\.git$/i, '');
  return { owner: parts[0], repository, url: `https://github.com/${parts[0]}/${repository}` };
}

function buildRepositoryEstate(works, releases, snapshot) {
  const releaseById = new Map(releases.map((release) => [release.id, release]));
  const activeByWork = new Map();
  for (const entry of snapshot?.releases || []) {
    const release = releaseById.get(entry.release_id);
    if (release) activeByWork.set(release.workId, release);
  }
  for (const work of works) {
    if (!activeByWork.has(work.id)) {
      const fallback = releases.filter((release) => release.workId === work.id).at(-1);
      if (fallback) activeByWork.set(work.id, fallback);
    }
  }

  const rows = [];
  for (const work of works) {
    const release = activeByWork.get(work.id);
    const artifacts = release?.raw?.artifacts || [];
    for (const locator of work.raw?.provenance?.locators || []) {
      const repository = githubRepository(locator);
      if (!repository) continue;
      const artifact = artifacts.find((candidate) => {
        const artifactUrl = safeExternalUrl(candidate.locator);
        return artifactUrl === repository.url || artifactUrl?.startsWith(`${repository.url}/archive/`);
      });
      rows.push({
        ...repository,
        work_id: work.id,
        work_name: work.name,
        work_slug: work.slug,
        work_type: work.type,
        lifecycle_status: work.maturity,
        library_url: href(`works/${work.slug}/`),
        locator_type: locator.type,
        locator_revision: locator.revision || null,
        visibility: locator.visibility || 'unknown',
        status: artifact ? 'released' : release?.raw?.artifacts?.length ? 'linked' : 'staging',
        active_release_id: release?.id || null,
        active_release_version: release?.version || null,
        artifact_revision: artifact?.revision || null,
      });
    }
  }
  return rows.sort((a, b) => `${a.status}:${a.owner}/${a.repository}`.localeCompare(`${b.status}:${b.owner}/${b.repository}`));
}

function estatePage(repositories, snapshot) {
  const released = repositories.filter((repository) => repository.status === 'released').length;
  const linked = repositories.filter((repository) => repository.status === 'linked').length;
  const staging = repositories.filter((repository) => repository.status === 'staging').length;
  const rows = repositories.map((repository) => `<article>
    <span>${esc(repository.status)}</span>
    <div><h2><a href="${esc(repository.url)}" rel="noopener noreferrer">${esc(`${repository.owner}/${repository.repository}`)}</a></h2>
      <p><a href="${esc(repository.library_url)}">${esc(repository.work_name)}</a> · ${esc(repository.work_type)} · ${esc(repository.visibility)}</p>
      <p>${repository.status === 'released'
        ? `Pinned source in ${esc(repository.active_release_version || repository.active_release_id)} at <code>${esc(repository.artifact_revision || repository.locator_revision || 'recorded revision')}</code>.`
        : repository.status === 'linked'
          ? 'Registered destination or companion repository; the active release is pinned to another source locator.'
          : 'Public staging home with no source artifact in the active named snapshot yet.'}</p>
    </div>
  </article>`).join('');
  return page({
    title: 'Repository estate', active: 'estate',
    description: 'Generated status of GitHub repositories registered by The Great Library of SISO.',
    body: `<section class="subhero shell">${eyebrow(`Library / Repository estate / Snapshot ${snapshot?.version || 'unversioned'}`)}<div><h1>Repository estate</h1><p>A generated operational view of GitHub homes. Works are permanent identities; repositories are movable source locators.</p></div><span class="folio">E—01</span></section>
    <section class="ledger shell" aria-label="Repository status counts"><div><strong>${String(released).padStart(2, '0')}</strong><span>Released source</span></div><div><strong>${String(linked).padStart(2, '0')}</strong><span>Linked homes</span></div><div><strong>${String(staging).padStart(2, '0')}</strong><span>Staging homes</span></div><p>Derived from the active Release selected by the latest immutable snapshot.</p></section>
    <section class="section shell release-index">${rows || emptyCatalog('No GitHub repository locators are present in this snapshot.')}</section>`,
  });
}

async function emit(path, contents) {
  const target = join(OUT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

const [rawWorks, rawReleases, assemblies, sourceInventories, snapshots] = await Promise.all([
  loadRecords('works'), loadRecords('releases'), loadRecords('assemblies'), loadRecords('source-inventories'), loadRecords('snapshots'),
]);
const sourceDates = [...rawWorks, ...rawReleases, ...assemblies, ...sourceInventories, ...snapshots]
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
const latestSnapshot = [...snapshots].sort((a, b) => String(a.version || '').localeCompare(String(b.version || ''), undefined, { numeric: true })).at(-1);
const releaseById = new Map(releases.map((release) => [release.id, release]));
const activeReleasesByWork = new Map((latestSnapshot?.releases || []).map((entry) => {
  const release = releaseById.get(entry.release_id);
  return release ? [release.workId, release] : null;
}).filter(Boolean));
const libraryWork = works.find((work) => work.type === 'library');
const sectionEdges = (latestSnapshot?.projection?.edges || []).filter((edge) => edge.from_work_id === libraryWork?.id && edge.contextual_role === 'section');
const sections = sectionEdges.map((edge) => worksById.get(edge.to_work_id)).filter(Boolean);
for (const work of works) work.section = work.type === 'library' ? 'Library' : 'Unassigned';
for (const section of sections) {
  section.section = section.name;
  for (const { work } of projectionMembers(section.id, latestSnapshot, works)) work.section = section.name;
}
const repositoryEstate = buildRepositoryEstate(works, releases, latestSnapshot);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(ASSETS, join(OUT, 'assets'), { recursive: true });
await emit('docs/agent-stack-model.html', await readFile(join(ROOT, 'docs', 'agent-stack-model.html'), 'utf8'));
await emit('docs/agent-base-decomposition.html', await readFile(join(ROOT, 'docs', 'agent-base-decomposition.html'), 'utf8'));
await emit('docs/agent-base-module-map.html', await readFile(join(ROOT, 'docs', 'agent-base-module-map.html'), 'utf8'));
await emit('docs/skills-repository-map.html', await readFile(join(ROOT, 'docs', 'skills-repository-map.html'), 'utf8'));
await emit('docs/task-state-system-map.html', await readFile(join(ROOT, 'docs', 'task-state-system-map.html'), 'utf8'));
await emit('docs/onboarding.html', await readFile(join(ROOT, 'docs', 'onboarding.html'), 'utf8'));
await emit('index.html', homePage(works, releases, snapshots, assemblies, sections));
const agentsSection = sections.find((section) => section.slug === 'agents');
const researchSection = sections.find((section) => section.slug === 'research');
await emit('agents/index.html', agentsPage(works, assemblies, latestSnapshot, agentsSection));
if (researchSection) await emit('research/index.html', researchPage(works, latestSnapshot, researchSection));
await emit('releases/index.html', releaseIndex(releases, worksById));
await emit('snapshots/index.html', snapshotIndex(snapshots));
await emit('estate/index.html', estatePage(repositoryEstate, latestSnapshot));
await emit('estate.json', `${JSON.stringify({ generated_at: generatedAt, snapshot_id: latestSnapshot?.id || null, snapshot_version: latestSnapshot?.version || null, repositories: repositoryEstate }, null, 2)}\n`);
for (const work of works) await emit(`works/${work.slug}/index.html`, workPage(work, releases, worksById, activeReleasesByWork.get(work.id)));
await emit('catalog.json', `${JSON.stringify({ generated_at: generatedAt, base_path: BASE, works: works.map((work) => ({ id: work.id, slug: work.slug, name: work.name, library_url: href(`works/${work.slug}/`), type: work.type, maturity: work.maturity, section: work.section })), repositories: repositoryEstate, assemblies: assemblies.map(({ __file, ...assembly }) => assembly), source_inventories: sourceInventories.map(({ __file, ...inventory }) => inventory) }, null, 2)}\n`);

console.log(`Built ${works.length} Works, ${releases.length} Releases, ${repositoryEstate.length} Repositories, ${assemblies.length} Assemblies, ${sourceInventories.length} Source Inventories, and ${snapshots.length} Snapshots at ${BASE}`);
