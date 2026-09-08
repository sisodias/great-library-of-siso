// Library focus/viewport integration; collapse, filtering and persistence remain
// owned by the pinned shell controller.
(() => {
  const rail = document.querySelector('[data-siso-rail]');
  const workspace = document.querySelector('.siso-shell-page');
  if (!rail || !workspace) return;
  const search = rail.querySelector('.siso-sidebar__search-input');
  const toggle = rail.querySelector('.siso-sidebar__toggle');
  let returnFocus = toggle;
  search.addEventListener('focus', event => { returnFocus = event.relatedTarget || toggle; });
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (narrow.matches && rail.classList.contains('is-expanded')) toggle.click();
      update();
      returnFocus?.focus();
    }
  });
  const narrow = matchMedia('(max-width: 980px)');
  const update = () => { workspace.inert = narrow.matches && rail.classList.contains('is-expanded'); };
  new MutationObserver(update).observe(rail, { attributes: true, attributeFilter: ['class'] });
  narrow.addEventListener('change', update);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && narrow.matches && rail.classList.contains('is-expanded')) {
      toggle.click(); update(); toggle.focus();
    }
  });
  document.querySelector('.skip-link').addEventListener('click', () => {
    if (narrow.matches && rail.classList.contains('is-expanded')) toggle.click();
    update();
  });
  update();
})();
