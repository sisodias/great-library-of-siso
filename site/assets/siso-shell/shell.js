(() => {
  const toggle = document.querySelector('.siso-rail-toggle');
  if (!toggle) return;
  let collapsed = matchMedia('(max-width:700px)').matches;
  try { const saved = localStorage.getItem('siso-rail-collapsed'); if (saved !== null) collapsed = saved === 'true'; } catch {}
  function render() {
    document.body.classList.toggle('siso-rail-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    toggle.firstElementChild.textContent = collapsed ? '›' : '‹';
  }
  function change() { collapsed = !collapsed; render(); try { localStorage.setItem('siso-rail-collapsed', String(collapsed)); } catch {} }
  toggle.hidden = false;
  toggle.addEventListener('click', change);
  document.addEventListener('keydown', (event) => {
    if (event.key !== '[' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    event.preventDefault(); toggle.focus(); change();
  });
  render();
})();
