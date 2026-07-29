const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav?.toggleAttribute('data-open', !open);
});

const controls = document.querySelector('[data-catalog-controls]');
if (controls) {
  const search = controls.querySelector('[data-catalog-search]');
  const type = controls.querySelector('[data-catalog-type]');
  const maturity = controls.querySelector('[data-catalog-maturity]');
  const cards = [...document.querySelectorAll('[data-catalog] .work-card')];
  const count = document.querySelector('[data-result-count]');
  const empty = document.querySelector('[data-no-results]');

  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const show = (!query || card.dataset.search.includes(query))
        && (!type.value || card.dataset.type === type.value)
        && (!maturity.value || card.dataset.maturity === maturity.value);
      card.hidden = !show;
      visible += Number(show);
    }
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };

  controls.addEventListener('input', filter);
  controls.addEventListener('change', filter);
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      event.preventDefault();
      search.focus();
    }
    if (event.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      filter();
    }
  });
}
