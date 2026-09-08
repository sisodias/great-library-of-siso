/* shell/rail.js — behaviour of the static GroupedRail. Mirrors SISOCRM App.tsx useRailState (localStorage key
 * "siso.crm.rail.collapsed", body class rail-collapsed / rail-expanded) and its Cmd/Ctrl-K search shortcut, plus the
 * Library adaptation `[` toggles. Expanded shows the labelled groups; collapsed shows the same destinations as icons
 * with tooltips (CompactNavigation). Groups never fold on click; the search filters destinations by label. */
(() => {
  const KEY = 'siso.crm.rail.collapsed';
  const rail = document.querySelector('[data-siso-rail]');
  if (!rail) return;
  document.documentElement.classList.remove('no-js');
  const toggle = rail.querySelector('.siso-sidebar__toggle');
  const search = rail.querySelector('.siso-sidebar__search');
  const input = rail.querySelector('.siso-sidebar__search-input');
  const labelled = rail.querySelector('.siso-sidebar__navigation');
  const compact = rail.querySelector('.siso-sidebar__compact-navigation');
  const identity = rail.querySelector('.siso-sidebar__identity');
  const shortcut = rail.querySelector('.siso-sidebar__search-shortcut');
  const utilities = rail.querySelector('.siso-sidebar__global-row');
  const profileCopy = rail.querySelector('.siso-sidebar__profile-copy');
  const empty = rail.querySelector('.siso-sidebar__empty');

  let collapsed = false;
  try { const saved = localStorage.getItem(KEY); if (saved !== null) collapsed = saved === 'true'; else collapsed = matchMedia('(max-width: 980px)').matches; } catch { }

  function render() {
    rail.classList.toggle('is-collapsed', collapsed);
    rail.classList.toggle('is-expanded', !collapsed);
    rail.setAttribute('data-verify-collapsed', String(collapsed));
    document.body.classList.toggle('rail-collapsed', collapsed);
    document.body.classList.toggle('rail-expanded', !collapsed);
    toggle.setAttribute('aria-label', collapsed ? 'Expand rail' : 'Collapse rail');
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.title = (collapsed ? 'Expand navigation' : 'Collapse navigation') + ' ([)';
    // SVGElement has no .hidden property; set the attribute so [hidden] applies.
    toggle.querySelector('.siso-sidebar__toggle-close').toggleAttribute('hidden', collapsed);
    toggle.querySelector('.siso-sidebar__toggle-open').toggleAttribute('hidden', !collapsed);
    // CRM: collapsed ⇒ CompactNavigation replaces LabeledNavigation; identity, search label/kbd, global row and profile copy leave.
    labelled.hidden = collapsed;
    compact.hidden = !collapsed;
    identity.hidden = collapsed;
    if (input) input.hidden = collapsed;
    if (shortcut) shortcut.hidden = collapsed;
    if (utilities) utilities.hidden = collapsed;
    if (profileCopy) profileCopy.hidden = collapsed;
  }
  function setCollapsed(next) {
    collapsed = next; render();
    try { localStorage.setItem(KEY, String(collapsed)); } catch { }
  }
  toggle.addEventListener('click', () => setCollapsed(!collapsed));

  function openSearch() { if (collapsed) setCollapsed(false); if (input) { input.focus(); input.select(); } }
  if (search) search.addEventListener('click', (e) => { if (collapsed) { e.preventDefault(); openSearch(); } });

  function filter() {
    const q = (input.value || '').trim().toLowerCase();
    let any = false;
    labelled.querySelectorAll('.siso-sidebar__nav-group').forEach((group) => {
      let visible = false;
      group.querySelectorAll('.siso-sidebar__nav-link').forEach((a) => {
        const show = !q || (a.getAttribute('data-label') || '').includes(q) || (group.getAttribute('data-group-label') || '').includes(q);
        a.hidden = !show; if (show) visible = true;
      });
      group.hidden = !visible;
      if (visible) any = true;
      if (q && visible && group.tagName === 'DETAILS') group.open = true;
    });
    if (empty) empty.hidden = any || !q;
  }
  if (input) {
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { input.value = ''; filter(); input.blur(); }
      if (e.key === 'Enter') { const first = labelled.querySelector('.siso-sidebar__nav-link:not([hidden])'); if (first) first.click(); }
    });
  }

  const editable = (t) => !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
    if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey && !editable(e.target)) { e.preventDefault(); setCollapsed(!collapsed); }
  });

  // Current-section marker for "On this page" anchors as the reader scrolls.
  const anchors = [...rail.querySelectorAll('.siso-sidebar__page-group .siso-sidebar__nav-link')];
  if (anchors.length && 'IntersectionObserver' in window) {
    const byId = new Map(anchors.map((a) => [a.getAttribute('href').slice(1), a]));
    const obs = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { anchors.forEach((a) => a.classList.remove('is-active')); const a = byId.get(en.target.id); if (a) a.classList.add('is-active'); }
    }, { rootMargin: '-10% 0px -70% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
  }
  render();
})();
