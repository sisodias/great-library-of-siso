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
    researchContract: raw.research_contract || null,
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
      <a ${active === 'promotion' ? 'aria-current="page"' : ''} href="${href('promotion/')}">Promotion</a>
      <a ${active === 'intelligence' ? 'aria-current="page"' : ''} href="${href('intelligence/')}">Intelligence</a>
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

function promotionCounts(units, field) {
  const counts = new Map();
  for (const unit of units) {
    const value = text(unit[field], 'Not recorded');
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value));
}

function buildPromotionProjection(sourceInventories, works) {
  const worksById = new Map(works.map((work) => [work.id, work]));
  const candidates = sourceInventories.filter((inventory) => inventory.inventory_kind === 'agent_capabilities');
  const supersededInventoryIds = new Set(candidates.map((inventory) => inventory.supersedes_inventory_id).filter(Boolean));
  const campaigns = candidates
    .filter((inventory) => !supersededInventoryIds.has(inventory.id))
    .map((inventory) => {
      const campaign = inventory.campaign || {};
      const units = (inventory.units || []).map((unit) => {
        const promotion = unit.promotion || {};
        const evidence = (Array.isArray(unit.evidence) ? unit.evidence : []).map((entry) => ({
          kind: text(entry.kind),
          reference: text(entry.reference),
          observed_at: text(entry.observed_at),
          summary: text(entry.summary),
        }));
        const targetWorkIds = Array.isArray(promotion.target_work_ids) ? promotion.target_work_ids : [];
        return {
          id: text(unit.unit_id || unit.id, 'unassigned-unit'),
          name: text(unit.name, unit.unit_id || 'Unnamed candidate'),
          source_scope_id: text(unit.source_scope_id),
          classification: text(unit.classification),
          disposition: text(unit.disposition),
          stage: text(promotion.stage),
          priority: text(promotion.priority),
          confidence: text(promotion.confidence),
          portability: text(promotion.portability),
          target: text(unit.target),
          next_gate: text(promotion.next_gate),
          blockers: Array.isArray(promotion.blockers) ? promotion.blockers.map((blocker) => text(blocker)).filter(Boolean) : [],
          rationale: text(unit.rationale),
          evidence_count: evidence.length,
          evidence,
          target_works: targetWorkIds.map((id) => {
            const work = worksById.get(id);
            return {
              id,
              name: work?.name || null,
              library_url: work ? href(`works/${work.slug}/`) : null,
              resolved: Boolean(work),
            };
          }),
        };
      });
      return {
        inventory_id: text(inventory.id, 'unassigned-inventory'),
        inventory_name: text(inventory.name, 'Agent capability promotion campaign'),
        inventory_state: text(inventory.inventory_state),
        observed_at: text(inventory.observed_at),
        campaign_id: text(campaign.campaign_id, inventory.id),
        objective: text(campaign.objective),
        lifecycle: Array.isArray(campaign.lifecycle) ? campaign.lifecycle.map((stage) => text(stage)).filter(Boolean) : [],
        units,
      };
    });
  const units = campaigns.flatMap((campaign) => campaign.units);
  return {
    inventory_count: campaigns.length,
    unit_count: units.length,
    counts: {
      stage: promotionCounts(units, 'stage'),
      priority: promotionCounts(units, 'priority'),
      target: promotionCounts(units, 'target'),
    },
    campaigns,
  };
}

function promotionCountGroup(title, rows) {
  return `<section><h3>${esc(title)}</h3><div>${rows.map((row) => `<p><span>${esc(row.value.replaceAll('_', ' '))}</span><strong>${esc(row.count)}</strong></p>`).join('') || '<p><span>None recorded</span><strong>0</strong></p>'}</div></section>`;
}

function promotionPage(projection) {
  const campaignSections = projection.campaigns.map((campaign) => `<article class="promotion-campaign">
    <div>${eyebrow(`Campaign / ${campaign.campaign_id}`)}<h2>${esc(campaign.inventory_name)}</h2><p>${esc(campaign.objective)}</p><small>${esc(campaign.inventory_state)} · observed ${esc(campaign.observed_at)}</small></div>
    <ol aria-label="Promotion lifecycle">${campaign.lifecycle.map((stage, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${esc(stage.replaceAll('_', ' '))}</li>`).join('')}</ol>
  </article>`).join('');
  const unitCards = projection.campaigns.flatMap((campaign) => campaign.units).map((unit) => {
    const blockers = unit.blockers.length ? `<ul>${unit.blockers.map((blocker) => `<li>${esc(blocker)}</li>`).join('')}</ul>` : '<p>None recorded.</p>';
    const evidence = unit.evidence.length ? `<ul>${unit.evidence.map((entry) => `<li><code>${esc(entry.reference)}</code><br><small>${esc(entry.kind)} · ${esc(entry.observed_at)}</small></li>`).join('')}</ul>` : '<p>None recorded.</p>';
    const targetWorks = unit.target_works.length ? unit.target_works.map((target) => target.resolved
      ? `<a href="${esc(target.library_url)}"><span>${esc(target.name)}</span><code>${esc(target.id)}</code></a>`
      : `<span><span>${esc(target.id)}</span><small>Unresolved in this build</small></span>`).join('') : '<span><span>No target Work ID recorded</span></span>';
    return `<article class="promotion-unit">
      <header><div><span>${esc(unit.stage.replaceAll('_', ' '))}</span><span>${esc(unit.priority)} priority</span><span>${esc(unit.confidence)} confidence</span><span>${esc(unit.portability.replaceAll('_', ' '))}</span></div><h3>${esc(unit.name)}</h3></header>
      <dl><div><dt>Classification</dt><dd>${esc(unit.classification.replaceAll('_', ' '))}</dd></div><div><dt>Disposition</dt><dd>${esc(unit.disposition.replaceAll('_', ' '))}</dd></div><div><dt>Source scope</dt><dd>${esc(unit.source_scope_id)}</dd></div><div><dt>Target</dt><dd>${esc(unit.target)}</dd></div><div><dt>Target Works</dt><dd class="promotion-targets">${targetWorks}</dd></div><div><dt>Next gate</dt><dd>${esc(unit.next_gate)}</dd></div><div><dt>Blockers</dt><dd>${blockers}</dd></div><div><dt>Rationale</dt><dd>${esc(unit.rationale)}</dd></div><div><dt>Evidence · ${esc(unit.evidence_count)} ${unit.evidence_count === 1 ? 'record' : 'records'}</dt><dd>${evidence}</dd></div></dl>
    </article>`;
  }).join('');
  return page({
    title: 'Promotion', active: 'promotion', rootClass: 'promotion-page',
    description: 'Public campaign view of evidenced agent capability candidates and their next promotion gates.',
    body: `<section class="subhero shell">${eyebrow('Library / Agents / Promotion')}<div><h1>Promotion</h1><p>Evidenced agent mechanisms moving through explicit ownership, portability, verification, release, and Library gates.</p></div><span class="folio">P—01</span></section>
    <aside class="promotion-boundary shell"><b>Candidates are not catalog claims.</b><p>These units are source-inventory candidates. They are not accepted Works, Releases, downloadable artifacts, portability claims, or distribution promises. Those states require their own accepted registry records and evidence.</p><a href="${esc(href('docs/agent-capability-promotion.html'))}">Read the source-backed promotion brief →</a></aside>
    <section class="section shell promotion-campaigns">${campaignSections || emptyCatalog('No accepted agent capability promotion inventories are present in this build.')}</section>
    <section class="section shell"><div class="section-heading compact">${eyebrow('Campaign totals')}<h2>${esc(projection.unit_count)} candidates</h2><p>Across ${esc(projection.inventory_count)} accepted ${projection.inventory_count === 1 ? 'inventory' : 'inventories'}.</p></div><div class="promotion-counts">${promotionCountGroup('Stage', projection.counts.stage)}${promotionCountGroup('Priority', projection.counts.priority)}${promotionCountGroup('Target', projection.counts.target)}</div></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Promotion units')}<h2>Candidate gates</h2><p>Evidence-led status, not release status.</p></div><div class="promotion-units">${unitCards || emptyCatalog('Promotion candidates will appear only from accepted agent capability source inventories.')}</div></section>`,
  });
}

function buildIntelligenceProjection(rawEvents, rawDecisions, releases, snapshots, worksById) {
  const predecessorIds = new Set(rawEvents.map((event) => event.predecessor_event_id).filter(Boolean));
  const supersededDecisionIds = new Set(rawDecisions.map((decision) => decision.supersedes_decision_id).filter(Boolean));
  const eventHeads = rawEvents.filter((event) => !predecessorIds.has(event.id));
  const liveStatuses = new Set(['planned', 'active', 'blocked']);
  const resolveScope = (scope = {}) => ({
    ...scope,
    works: (scope.work_ids || []).map((id) => {
      const work = worksById.get(id);
      return { id, name: work?.name || id, library_url: work ? href(`works/${work.slug}/`) : null };
    }),
  });
  const events = [...rawEvents].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at)).map(({ __file, ...event }) => ({ ...event, resolved_scope: resolveScope(event.scope) }));
  const decisions = [...rawDecisions].sort((a, b) => b.decided_at.localeCompare(a.decided_at)).map(({ __file, ...decision }) => ({ ...decision, active: decision.status === 'accepted' && !supersededDecisionIds.has(decision.id), resolved_scope: resolveScope(decision.scope) }));
  const activeInitiatives = eventHeads.filter((event) => liveStatuses.has(event.status)).sort((a, b) => b.occurred_at.localeCompare(a.occurred_at)).map((event) => ({
    event_id: event.id,
    thread_id: event.thread.id,
    name: event.thread.name,
    status: event.status,
    title: event.title,
    intent: event.intent,
    occurred_at: event.occurred_at,
    owner: event.coordination.owner,
    branch: event.coordination.branch,
    reserved_paths: event.coordination.reserved_paths,
    next_actions: event.next_actions,
  }));
  const registryChanges = [
    ...releases.map((release) => ({
      kind: 'release', occurred_at: release.date, id: release.id, version: release.version,
      title: release.raw.title || `${worksById.get(release.workId)?.name || release.workId} ${release.version}`,
      work_id: release.workId, work_name: worksById.get(release.workId)?.name || release.workId,
    })),
    ...snapshots.map((snapshot) => ({
      kind: 'snapshot', occurred_at: snapshot.created_at, id: snapshot.id, version: snapshot.version,
      title: snapshot.name, work_count: snapshot.metadata_completeness?.work_count,
      release_count: snapshot.metadata_completeness?.release_count,
    })),
  ].sort((a, b) => String(b.occurred_at).localeCompare(String(a.occurred_at)));
  return {
    counts: {
      events: events.length,
      decisions: decisions.length,
      active_initiatives: activeInitiatives.length,
      registry_changes: registryChanges.length,
    },
    active_initiatives: activeInitiatives,
    decisions,
    events,
    registry_changes: registryChanges,
  };
}

function intelligencePage(projection) {
  const active = projection.active_initiatives.map((initiative) => `<article>
    <span>${esc(initiative.status)}</span><div><h2>${esc(initiative.name)}</h2><p>${esc(initiative.intent)}</p><p><code>${esc(initiative.branch)}</code> · ${esc(initiative.owner)}</p><p><b>Reserved:</b> ${initiative.reserved_paths.map((value) => `<code>${esc(value)}</code>`).join(' · ')}</p>${initiative.next_actions.length ? `<ul>${initiative.next_actions.map((action) => `<li>${esc(action)}</li>`).join('')}</ul>` : ''}</div>
  </article>`).join('');
  const decisions = projection.decisions.map((decision) => `<article id="${esc(decision.decision_key)}">
    <span>${esc(decision.decision_key)} · ${decision.active ? 'active' : esc(decision.status)}</span><div><h2>${esc(decision.title)}</h2><p>${esc(decision.decision)}</p><details><summary>Context, reasoning, and consequences</summary><p><b>Context:</b> ${esc(decision.context)}</p><h3>Rationale</h3><ul>${decision.rationale.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h3>Alternatives</h3><ul>${decision.alternatives.map((item) => `<li><b>${esc(item.option)}</b> · ${esc(item.disposition)} — ${esc(item.reason)}</li>`).join('')}</ul><h3>Consequences</h3><ul>${[...decision.consequences.positive, ...decision.consequences.negative, ...decision.consequences.follow_ups].map((item) => `<li>${esc(item)}</li>`).join('')}</ul></details></div>
  </article>`).join('');
  const authoredEvents = projection.events.map((event) => {
    const workLinks = event.resolved_scope.works.map((work) => work.library_url ? `<a href="${esc(work.library_url)}">${esc(work.name)}</a>` : `<code>${esc(work.id)}</code>`).join(' · ');
    return `<article id="${esc(event.id)}"><span>${esc(event.occurred_at)} · ${esc(event.entry_type.replaceAll('_', ' '))} · ${esc(event.status)}</span><div><h2>${esc(event.title)}</h2><p>${esc(event.summary)}</p><p><b>Intent:</b> ${esc(event.intent)}</p><details><summary>Reasoning, changes, evidence, and handoff</summary><h3>Reasoning</h3><ul>${event.reasoning.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h3>Changes</h3><ul>${event.changes.map((item) => `<li><code>${esc(item.kind)}</code> · ${esc(item.reference)} — ${esc(item.summary)}</li>`).join('')}</ul>${workLinks ? `<p><b>Works:</b> ${workLinks}</p>` : ''}<p><b>Coordination:</b> ${esc(event.coordination.owner)} · <code>${esc(event.coordination.branch)}</code></p><h3>Evidence</h3><ul>${event.evidence.map((item) => `<li><code>${esc(item.reference)}</code> — ${esc(item.summary)}</li>`).join('')}</ul>${event.next_actions.length ? `<h3>Next actions</h3><ul>${event.next_actions.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}</details></div></article>`;
  }).join('');
  const registryChanges = projection.registry_changes.map((change) => `<article><span>${esc(change.occurred_at)} · ${esc(change.kind)}</span><div><h2>${esc(change.title)}</h2><p><code>${esc(change.id)}</code> · version ${esc(change.version)}</p>${change.kind === 'snapshot' ? `<p>${esc(change.work_count)} Works · ${esc(change.release_count)} Releases selected</p>` : `<p>${esc(change.work_name)}</p>`}</div></article>`).join('');
  return page({
    title: 'Ecosystem Intelligence', active: 'intelligence', rootClass: 'intelligence-page',
    description: 'Append-only events, active initiatives, architectural decisions, releases, and snapshots across The Great Library of SISO.',
    body: `<section class="subhero shell">${eyebrow('Library / Ecosystem Intelligence')}<div><h1>Ecosystem Intelligence</h1><p>What is moving, what changed, why it changed, who owns the lane, and where the authoritative evidence lives.</p></div><span class="folio">I—01</span></section>
    <aside class="promotion-boundary shell"><b>Data first.</b><p><a href="${href('intelligence.json')}">intelligence.json</a> is the agent interface. This HTML is one generated chronological reading surface. Git remains the audit trail; registry records remain public truth.</p></aside>
    <section class="section shell release-index"><div class="section-heading compact">${eyebrow('Live coordination')}<h2>${esc(projection.counts.active_initiatives)} active initiatives</h2><p>Thread-head state with explicit branch and path reservations.</p></div>${active || emptyCatalog('No active initiative is currently reserved.')}</section>
    <section class="section shell release-index"><div class="section-heading compact">${eyebrow('Architecture decisions')}<h2>${esc(projection.counts.decisions)} ADRs</h2><p>Immutable decisions with context, alternatives, consequences, and evidence.</p></div>${decisions}</section>
    <section class="section shell release-index"><div class="section-heading compact">${eyebrow('Authored event ledger')}<h2>${esc(projection.counts.events)} reasoned events</h2><p>Close-of-block intelligence, not transcript dumps.</p></div>${authoredEvents}</section>
    <section class="section shell release-index"><div class="section-heading compact">${eyebrow('Automatic registry changelog')}<h2>${esc(projection.counts.registry_changes)} immutable changes</h2><p>Every accepted Release and Snapshot, derived directly from registry records.</p></div>${registryChanges}</section>`,
  });
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
    <section class="relationship-map shell" aria-labelledby="map-title"><div class="map-copy">${eyebrow(`Assembly / ${stack?.version || 'unversioned'}`)}<h2 id="map-title">One stack.<br>Four required components.</h2><p>${esc(stack?.outcome || 'The assembly connects intent, execution, coordination, project state, and proof.')}</p><p><a href="${href('promotion/')}">Explore promotion candidates →</a><br><a href="${href('docs/agent-stack-model.html')}">Read the source-backed stack model →</a><br><a href="${href('docs/agents-workspace-layout.html')}">See the executed workspace layout →</a><br><a href="${href('docs/agent-base-module-map.html')}">See the Agent Base module extraction map →</a><br><a href="${href('docs/skills-repository-map.html')}">Open the Skill repository map →</a><br><a href="${href('docs/task-state-system-map.html')}">See where task and state source belongs →</a></p></div><div class="map-stack">${members.map(({ component, work }, i) => {
      return `<div class="map-node ${work ? '' : 'is-pending'}"><span>0${i + 1}</span><div><b>${esc(work?.name || component.component_id)}</b><small>${esc(component.required ? `required · ${component.role}` : component.role)}</small></div></div>`;
    }).join('')}<p class="map-key"><i></i>Skills are reusable capabilities. Playbooks compose skills, tools, lanes, and verification for a scenario.</p></div></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Accepted records')}<h2>Works in Agents</h2><p><span data-result-count>${related.length}</span> Works available to read.</p></div>${related.length ? catalogControls(related) : ''}<div class="work-grid" data-catalog>${related.length ? related.map(workCard).join('') : emptyCatalog('This section will populate from accepted Work records; no provisional detail pages are published.')}</div><p class="no-results" data-no-results hidden>No Works match those filters.</p></section>`,
  });
}

function researchPage(works, snapshot, sectionWork) {
  const related = projectionMembers(sectionWork?.id, snapshot, works).map(({ work }) => work);
  const questions = related.filter((work) => work.type === 'research_question');
  const systems = related.filter((work) => work.type !== 'research_question');
  return page({
    title: 'Research', active: 'research', rootClass: 'agents-page',
    description: 'The Research section of The Great Library of SISO.',
    body: `<section class="subhero shell">${eyebrow('Library / Sections / Research')}<div><h1>Research</h1><p>Foundry discovers the evidence universe. SISO Knowledge preserves it. Evidence Engines turn it into traceable claims. Frontier Questions keep the highest-leverage questions and their answer lineage alive.</p></div><span class="folio">R—01</span></section>
    <section class="relationship-map shell" aria-labelledby="research-map-title"><div class="map-copy">${eyebrow(`Projection / ${snapshot?.version || 'unversioned'}`)}<h2 id="research-map-title">One evidence loop.<br>Clear ownership.</h2><p>The Library owns stable question and answer identities, not the corpus payload. Each Research system remains independently addressable and releasable.</p><p><a href="${href('docs/siso-mission.html')}">Read the SISO mission →</a><br><a href="${href('docs/question-driven-research.html')}">Open the question-driven research architecture →</a><br><a href="${href('docs/frontier-question-template.html')}">Use the Frontier Question template + CRM example →</a><br><a href="${href('docs/research-question-model.html')}">Read the Frontier Question identity model →</a><br><a href="${href('docs/siso-knowledge-model.html')}">Read the SISO Knowledge boundary →</a></p></div><div class="map-stack">${systems.map((work, i) => `<div class="map-node"><span>${String(i + 1).padStart(2, '0')}</span><div><b>${esc(work.name)}</b><small>${esc(work.type)} · ${esc(work.maturity)}</small></div></div>`).join('') || '<p class="map-key">Accepted Research systems are being indexed.</p>'}</div></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Frontier Questions · God Questions')}<h2>Questions worth answering again.</h2><p><span data-result-count>${questions.length}</span> standing questions with stable identities, explicit evidence scopes, and versioned answers.</p></div>${questions.length ? catalogControls(questions) : ''}<div class="work-grid" data-catalog>${questions.length ? questions.map(workCard).join('') : emptyCatalog('Questions appear only after a publication-safe research contract is accepted.')}</div><p class="no-results" data-no-results hidden>No questions match those filters.</p></section>
    <section class="section shell catalog-section"><div class="section-heading compact">${eyebrow('Research systems')}<h2>The machinery behind the answers.</h2><p>${systems.length} independently owned Works.</p></div><div class="work-grid">${systems.map(workCard).join('')}</div></section>`,
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
  const researchContract = work.researchContract;
  const researchRows = researchContract ? [
    ['Question', researchContract.question],
    ['State', researchContract.state],
    ['Evidence mode', researchContract.evidence_mode.replaceAll('_', ' ')],
    ['Source scopes', researchContract.source_scopes.join(' · ')],
    ['Answer shape', researchContract.answer_shape],
    ['Refresh policy', researchContract.refresh_policy],
    ['Publication boundary', researchContract.publication_boundary.replaceAll('_', ' ')],
  ].map(([label, value]) => `<div><span>${esc(label)}</span><p>${esc(value)}</p></div>`) : [];
  return page({
    title: work.name,
    active: work.section === 'Research' ? 'research' : /agent/i.test(`${work.section} ${work.type}`) ? 'agents' : 'library',
    description: work.summary,
    rootClass: 'work-page',
    body: `<article>
      <header class="work-hero shell">${eyebrow(`Work / ${work.id}`)}<div class="work-title"><h1>${esc(work.name)}</h1><p>${esc(work.summary)}</p></div><dl class="work-meta"><div><dt>Type</dt><dd>${esc(work.type)}</dd></div><div><dt>Maturity</dt><dd>${esc(work.maturity)}</dd></div><div><dt>Section</dt><dd>${esc(work.section)}</dd></div></dl></header>
      <div class="permalink-bar"><div class="shell"><span>Permanent Library detail URL</span><code>${esc(libraryUrl)}</code></div></div>${researchRows.length ? `
      <div class="shell">${detailList(`Research contract · ${researchContract.question_id}`, researchRows)}</div>` : ''}
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

const [rawWorks, rawReleases, assemblies, sourceInventories, snapshots, decisions, events] = await Promise.all([
  loadRecords('works'), loadRecords('releases'), loadRecords('assemblies'), loadRecords('source-inventories'), loadRecords('snapshots'), loadRecords('decisions'), loadRecords('events'),
]);
const sourceDates = [...rawWorks, ...rawReleases, ...assemblies, ...sourceInventories, ...snapshots, ...decisions, ...events]
  .flatMap((record) => [record.updated_at, record.released_at, record.created_at, record.observed_at, record.decided_at, record.occurred_at, record.recorded_at])
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
const promotion = buildPromotionProjection(sourceInventories, works);
const intelligence = buildIntelligenceProjection(events, decisions, releases, snapshots, worksById);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(ASSETS, join(OUT, 'assets'), { recursive: true });
await emit('docs/agent-stack-model.html', await readFile(join(ROOT, 'docs', 'agent-stack-model.html'), 'utf8'));
await emit('docs/agent-base-decomposition.html', await readFile(join(ROOT, 'docs', 'agent-base-decomposition.html'), 'utf8'));
await emit('docs/agent-base-module-map.html', await readFile(join(ROOT, 'docs', 'agent-base-module-map.html'), 'utf8'));
await emit('docs/agents-workspace-layout.html', await readFile(join(ROOT, 'docs', 'agents-workspace-layout.html'), 'utf8'));
await emit('docs/skills-repository-map.html', await readFile(join(ROOT, 'docs', 'skills-repository-map.html'), 'utf8'));
await emit('docs/task-state-system-map.html', await readFile(join(ROOT, 'docs', 'task-state-system-map.html'), 'utf8'));
await emit('docs/siso-knowledge-model.html', await readFile(join(ROOT, 'docs', 'siso-knowledge-model.html'), 'utf8'));
await emit('docs/research-question-model.html', await readFile(join(ROOT, 'docs', 'research-question-model.html'), 'utf8'));
await emit('docs/siso-mission.html', await readFile(join(ROOT, 'docs', 'siso-mission.html'), 'utf8'));
await emit('docs/question-driven-research.html', await readFile(join(ROOT, 'docs', 'question-driven-research.html'), 'utf8'));
await emit('docs/frontier-question-template.html', await readFile(join(ROOT, 'docs', 'frontier-question-template.html'), 'utf8'));
await emit('docs/onboarding.html', await readFile(join(ROOT, 'docs', 'onboarding.html'), 'utf8'));
await emit('docs/agent-capability-promotion.html', await readFile(join(ROOT, 'docs', 'agent-capability-promotion.html'), 'utf8'));
await emit('docs/ecosystem-intelligence.html', await readFile(join(ROOT, 'docs', 'ecosystem-intelligence.html'), 'utf8'));
await emit('docs/registry-model.md', await readFile(join(ROOT, 'docs', 'registry-model.md'), 'utf8'));
await emit('docs/using-the-library.md', await readFile(join(ROOT, 'docs', 'using-the-library.md'), 'utf8'));
await emit('index.html', homePage(works, releases, snapshots, assemblies, sections));
const agentsSection = sections.find((section) => section.slug === 'agents');
const researchSection = sections.find((section) => section.slug === 'research');
await emit('agents/index.html', agentsPage(works, assemblies, latestSnapshot, agentsSection));
await emit('promotion/index.html', promotionPage(promotion));
await emit('intelligence/index.html', intelligencePage(intelligence));
if (researchSection) await emit('research/index.html', researchPage(works, latestSnapshot, researchSection));
await emit('releases/index.html', releaseIndex(releases, worksById));
await emit('snapshots/index.html', snapshotIndex(snapshots));
await emit('estate/index.html', estatePage(repositoryEstate, latestSnapshot));
await emit('estate.json', `${JSON.stringify({ generated_at: generatedAt, snapshot_id: latestSnapshot?.id || null, snapshot_version: latestSnapshot?.version || null, repositories: repositoryEstate }, null, 2)}\n`);
await emit('promotion.json', `${JSON.stringify({ generated_at: generatedAt, base_path: BASE, ...promotion }, null, 2)}\n`);
await emit('intelligence.json', `${JSON.stringify({ generated_at: generatedAt, base_path: BASE, ...intelligence }, null, 2)}\n`);
for (const work of works) await emit(`works/${work.slug}/index.html`, workPage(work, releases, worksById, activeReleasesByWork.get(work.id)));
await emit('catalog.json', `${JSON.stringify({ generated_at: generatedAt, base_path: BASE, works: works.map((work) => ({ id: work.id, slug: work.slug, name: work.name, library_url: href(`works/${work.slug}/`), type: work.type, maturity: work.maturity, section: work.section })), repositories: repositoryEstate, assemblies: assemblies.map(({ __file, ...assembly }) => assembly), source_inventories: sourceInventories.map(({ __file, ...inventory }) => inventory), promotion, intelligence: { counts: intelligence.counts, active_initiatives: intelligence.active_initiatives } }, null, 2)}\n`);

console.log(`Built ${works.length} Works, ${releases.length} Releases, ${repositoryEstate.length} Repositories, ${assemblies.length} Assemblies, ${sourceInventories.length} Source Inventories, ${snapshots.length} Snapshots, ${decisions.length} Decisions, and ${events.length} Events at ${BASE}`);
