const THEMES = ['t-dark', 't-light', 't-violet'];

/** Marca en body[data-top] el tema de la sección que está debajo de la barra fija, para que la barra lo copie. */
export function watchTheme(root) {
  const sections = [...root.querySelectorAll(THEMES.map(t => '.' + t).join(','))];
  let frame = 0;
  const update = () => {
    frame = 0;
    const y = 40;
    const s = sections.find(el => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    const theme = s && THEMES.find(t => s.classList.contains(t));
    if (theme) document.body.dataset.top = theme.slice(2);
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    delete document.body.dataset.top;
  };
}
