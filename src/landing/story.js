import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { RESULTS } from './data';

gsap.registerPlugin(ScrollTrigger);
// En celulares, mostrar/ocultar la barra del navegador no debe re-medir todo
ScrollTrigger.config({ ignoreMobileResize: true });

const fmt = n => n.toLocaleString('es-AR');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Monta toda la narrativa por scroll sobre `root`. Devuelve una función que la desarma
 * (pins, listeners, Lenis y el loop del canvas) para que React pueda desmontar sin residuos.
 */
export function initStory(root) {
  const $ = s => root.querySelector(s);
  const $$ = s => Array.from(root.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanups = [];

  if (reduce) root.classList.add('is-static');

  // ─── Scroll suave + anclas ───
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = t => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); });
  }
  const onAnchor = e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const target = a.getAttribute('href');
    lenis ? lenis.scrollTo(target, { duration: 1.6 }) : root.querySelector(target)?.scrollIntoView();
  };
  root.addEventListener('click', onAnchor);
  cleanups.push(() => root.removeEventListener('click', onAnchor));

  const ctx = gsap.context(() => {
    const machine = setupMachine(root, reduce);
    cleanups.push(machine.destroy);
    if (reduce) return;

    // ─── Reloj: el scroll es el paso del día (09:00 → 18:30) ───
    const clock = $('.clock-time'), bar = $('.story-progress i');
    let pageProgress = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const m = 9 * 60 + Math.round(self.progress * 570 / 5) * 5;
        clock.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
        bar.style.transform = `scaleX(${self.progress})`;
        pageProgress = self.progress;
      },
    });
    cleanups.push(setupScrollHint(root, () => pageProgress));

    // ─── 0 · Hero ───
    gsap.from('#s-hero .intro', { y: 40, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out' });
    gsap.timeline({ scrollTrigger: { trigger: '#s-hero', start: 'top top', end: '+=120%', pin: true, scrub: true } })
      .to('.scroll-cue', { opacity: 0, duration: 0.1 })
      .to('.hero-time', { scale: 0.35, opacity: 0, filter: 'blur(12px)', duration: 1 }, 0)
      .to('.hero-line', { y: -80, opacity: 0, duration: 0.6 }, 0.2)
      .to('.hero-k, .phone-ring', { opacity: 0, duration: 0.4 }, 0);

    // ─── 1 · Problema: la agenda se llena de obra social ───
    {
      const osCells = $$('#agenda-hoy .front.os');
      const emptyCells = $$('#agenda-hoy .front.empty');
      const cOs = $('.cnt-os'), cEm = $('.cnt-empty');
      const counter = { os: 0, em: 0 };
      gsap.set(osCells, { scale: 0.85 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: '#s-problema', start: 'top top', end: '+=260%', pin: true, scrub: 1 } });
      tl.from('#agenda-hoy', { y: 60, opacity: 0, duration: 0.5 })
        .to(osCells, { opacity: 1, scale: 1, duration: 0.3, stagger: { each: 0.05, from: 'random' } }, 0.3)
        .to(counter, { os: osCells.length, duration: 1.1, ease: 'none', onUpdate: () => (cOs.textContent = Math.round(counter.os)) }, 0.3)
        .to(emptyCells, { opacity: 1, duration: 0.2, stagger: 0.08 }, 1.4)
        .to(counter, { em: emptyCells.length, duration: 0.6, ease: 'none', onUpdate: () => (cEm.textContent = Math.round(counter.em)) }, 1.4)
        .to(emptyCells, { x: () => gsap.utils.random(-4, 4), rotation: () => gsap.utils.random(-3, 3), duration: 0.1, repeat: 5, yoyo: true }, 2.1)
        .to('#agenda-hoy', { filter: 'saturate(0) brightness(.7)', scale: 0.96, duration: 0.6 }, 2.8);
      $$('.pain').forEach((p, i, all) => {
        tl.fromTo(p, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.2 + i * 1.1);
        if (i < all.length - 1) tl.to(p, { opacity: 0, y: -40, duration: 0.3 }, 1.0 + i * 1.1);
      });
    }

    // ─── 2 · Búsqueda: el paciente que no te encuentra ───
    {
      const q = $('.q'), query = 'implantes dentales córdoba';
      const typed = { p: 0 };
      gsap.set('.res:not(.ghost)', { y: 20 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: '#s-busqueda', start: 'top top', end: '+=280%', pin: true, scrub: 1 } });
      tl.from('.phone', { y: 120, rotation: 6, opacity: 0, duration: 0.6 })
        .to(typed, { p: 1, duration: 1, ease: 'none', onUpdate: () => (q.textContent = query.slice(0, Math.round(typed.p * query.length))) }, 0.4)
        .to('.res:not(.ghost)', { opacity: 1, y: 0, duration: 0.3, stagger: 0.25 }, 1.5)
        .fromTo('.ghost', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }, 2.6)
        .to('.ghost', { x: 6, duration: 0.05, repeat: 7, yoyo: true }, 2.95)
        .to('.phone', { scale: 0.94, filter: 'brightness(.6)', duration: 0.5 }, 3.4);
      $$('.lines p').forEach((l, i, all) => {
        tl.fromTo(l, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.2 + i * 0.95);
        if (i < all.length - 1) tl.to(l, { opacity: 0, y: -40, duration: 0.3 }, 0.9 + i * 0.95);
      });
    }

    // ─── 3 · La máquina: copy y nodos (las partículas viven en setupMachine) ───
    {
      const steps = $$('.m-copy .step');
      const node = k => $(`.m-node[data-k="${k}"]`);
      gsap.set('.m-node', { scale: 0.6 });
      gsap.set(steps, { y: 20 });
      gsap.timeline({ scrollTrigger: {
        trigger: '#s-maquina', start: 'top top', end: '+=420%', pin: true, scrub: true,
        onUpdate: s => machine.setProgress(s.progress),
      } })
        .to(steps[0], { opacity: 1, y: 0, duration: 0.05 }, 0)
        .to([node('gads'), node('meta'), node('gmb')], { opacity: 1, scale: 1, duration: 0.04, stagger: 0.015 }, 0.03)
        .to(node('web'), { opacity: 1, scale: 1, duration: 0.04 }, 0.09)
        .to(node('wa'), { opacity: 1, scale: 1, duration: 0.04 }, 0.12)
        .to(node('turno'), { opacity: 1, scale: 1, duration: 0.04 }, 0.15)
        .to('.m-measure', { opacity: 1, duration: 0.04 }, 0.17)
        .to(steps[0], { opacity: 0, y: -20, duration: 0.04 }, 0.19)
        .to('.m-hud', { opacity: 1, duration: 0.04 }, 0.19)
        .to(steps[1], { opacity: 1, y: 0, duration: 0.04 }, 0.22)
        .to(steps[1], { opacity: 0, y: -20, duration: 0.04 }, 0.8)
        .to(steps[2], { opacity: 1, y: 0, duration: 0.04 }, 0.86)
        .to({}, { duration: 0.1 }, 0.9);
    }

    // ─── 3b · Más que campañas ───
    gsap.from('.extra', { y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: '.extras', start: 'top 80%' } });
    gsap.from('#s-cierre .big, #s-cierre .lead', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '#s-cierre', start: 'top 75%' } });

    // ─── 4 · Objeción: las palabras se encienden con el scroll ───
    gsap.to('.quote .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top 80%', end: 'bottom 40%', scrub: true } });
    gsap.from('.calc', { y: 80, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.calc', start: 'top 85%' } });

    // ─── 5 · 90 días: scroll horizontal ───
    {
      const track = $('.d-track');
      const dist = () => track.scrollWidth - innerWidth;
      const num = $('.d-num');
      const st = { trigger: '#s-dias', start: 'top top', end: () => '+=' + dist() * 1.4, scrub: 1, invalidateOnRefresh: true };
      const slide = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { ...st, pin: true,
        onUpdate: s => (num.textContent = String(Math.max(1, Math.round(s.progress * 90))).padStart(2, '0')) } });
      gsap.to('.d-bar', { scaleX: 1, ease: 'none', scrollTrigger: st });
      // cada tarjeta se enciende al cruzar la pantalla
      $$('.d-card').forEach(card => gsap.fromTo(card, { opacity: 0.3, y: 30 }, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left 100%', end: 'left 72%', scrub: true },
      }));
    }

    // ─── 6 · Garantía ───
    setupGuarantee(root);

    // ─── 7 · La agenda, ahora llena ───
    gsap.set('.f-cta', { y: 30 });
    gsap.timeline({ scrollTrigger: { trigger: '#s-final', start: 'top top', end: '+=200%', pin: true, scrub: 1 } })
      .from('.f-head', { y: 40, opacity: 0, duration: 0.3 })
      .to('#agenda-liga .in', { rotationX: 180, duration: 0.4, stagger: { each: 0.04, grid: [6, 5] }, ease: 'back.out(1.6)' }, 0.2)
      .to('.f-cta', { opacity: 1, y: 0, duration: 0.3 }, 1.6);

    gsap.from('.contact > *', { y: 50, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 80%' } });

    // ─── Cierre: la frase se enciende palabra por palabra ───
    gsap.to('.closing-q .w', { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.closing-q', start: 'top 85%', end: 'bottom 45%', scrub: true } });
    gsap.from('.closing .btn-wa', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.closing .btn-wa', start: 'top 92%' } });

    // ─── Capítulos (después de los pins, para que midan bien) ───
    const nav = $('.chapters');
    $$('section[data-chapter]').forEach(sec => {
      const a = document.createElement('a');
      a.href = '#' + sec.id;
      a.innerHTML = `<i></i><span>${sec.dataset.chapter}</span>`;
      nav.appendChild(a);
      ScrollTrigger.create({ trigger: sec, start: 'top center', end: 'bottom center', onToggle: s => a.classList.toggle('on', s.isActive) });
    });
    cleanups.push(() => (nav.innerHTML = ''));
  }, root);

  // Fuentes y logos cambian medidas: re-medir cuando estén listos
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    ctx.revert();
    cleanups.forEach(fn => fn());
    root.classList.remove('is-static');
  };
}

/** Canvas de partículas: cada lead tiene su momento de salida, así el scrub es reversible. */
function setupMachine(root, reduce) {
  const sec = root.querySelector('#s-maquina');
  const cv = sec.querySelector('.machine-canvas'), ctx = cv.getContext('2d');
  const nodes = {};
  sec.querySelectorAll('.m-node').forEach(n => (nodes[n.dataset.k] = { el: n, x: 0, y: 0 }));
  const miniCells = sec.querySelector('.mini').children;
  const hL = sec.querySelector('.h-leads'), hT = sec.querySelector('.h-turnos'), hI = sec.querySelector('.h-inv'), hC = sec.querySelector('.cpt');
  let W = 0, H = 0, P = reduce ? 1 : 0, lastP = -1, dirty = true;

  function layout() {
    const DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth || innerWidth; H = cv.clientHeight || innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // En celular el recorrido es vertical y se acomoda entre el texto de arriba y los contadores de abajo,
    // midiéndolos: con porcentajes fijos los íconos chocaban con el título en pantallas bajas.
    let pos;
    if (W < 860) {
      const copy = sec.querySelector('.m-copy'), hud = sec.querySelector('.m-hud');
      const copyBottom = copy.offsetTop + Math.max(...Array.from(copy.children, c => c.offsetHeight));
      const top = (copyBottom + 52) / H, bottom = (hud.offsetTop - 64) / H, span = bottom - top;
      pos = { gads: [0.2, top], meta: [0.5, top], gmb: [0.8, top], web: [0.5, top + span * 0.36], wa: [0.5, top + span * 0.68], turno: [0.5, bottom] };
    } else {
      pos = { gads: [0.18, 0.36], meta: [0.18, 0.54], gmb: [0.18, 0.72], web: [0.44, 0.54], wa: [0.65, 0.54], turno: [0.86, 0.54] };
    }
    for (const k in pos) {
      nodes[k].x = pos[k][0] * W; nodes[k].y = pos[k][1] * H;
      nodes[k].el.style.left = nodes[k].x + 'px'; nodes[k].el.style.top = nodes[k].y + 'px';
    }
    dirty = true;
  }

  let seed = 1234567;
  const rnd = () => ((seed = Math.imul(seed ^ (seed >>> 15), 2246822507) ^ Math.imul(seed ^ (seed >>> 13), 3266489909)) >>> 0) / 4294967296;
  const SRC = ['gads', 'meta', 'gmb'];
  const A0 = 0.2, SPAN = 0.55, D = 0.12, D2 = 0.06, FADE = 0.05;
  const { leads: N, turnos: T, inversion } = RESULTS;
  const parts = Array.from({ length: N }, (_, i) => ({
    L: A0 + SPAN * (i / N) + rnd() * 0.01,
    src: SRC[rnd() < 0.45 ? 0 : rnd() < 0.75 ? 1 : 2],
    o1: (rnd() - 0.5) * 2, o2: (rnd() - 0.5) * 2, o3: (rnd() - 0.5) * 2,
    drift: rnd() * Math.PI * 2,
    gold: false,
  }));
  // T dorados repartidos de forma pareja a lo largo del recorrido
  for (let j = 0; j < Math.min(T, N); j++) parts[Math.floor((j + 0.5) * N / T)].gold = true;

  function seg(a, b, s, off, spread) {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const bend = Math.sin(Math.PI * s) * off * spread;
    return [a.x + dx * s - (dy / len) * bend, a.y + dy * s + (dx / len) * bend];
  }
  function pathPos(p, t) { // t 0..1 : fuente → web → whatsapp
    const spread = Math.min(W, H) * 0.08;
    return t < 0.55 ? seg(nodes[p.src], nodes.web, t / 0.55, p.o1, spread) : seg(nodes.web, nodes.wa, (t - 0.55) / 0.45, p.o2, spread * 0.6);
  }

  const LINKS = [['gads', 'web'], ['meta', 'web'], ['gmb', 'web'], ['web', 'wa'], ['wa', 'turno']];
  function draw() {
    if (P === lastP && !dirty) return;
    lastP = P; dirty = false;
    ctx.clearRect(0, 0, W, H);
    LINKS.forEach(([a, b], i) => {
      const k = clamp((P - 0.05 - i * 0.025) / 0.06);
      if (!k) return;
      const A = nodes[a], B = nodes[b];
      ctx.strokeStyle = 'rgba(207,125,202,.22)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.globalCompositeOperation = 'lighter';
    let leads = 0, turnos = 0;
    for (const p of parts) {
      const t = (P - p.L) / D;
      if (t < 0) continue;
      if (t < 1) {
        const [x, y] = pathPos(p, t), [tx, ty] = pathPos(p, Math.max(0, t - 0.06));
        ctx.strokeStyle = p.gold ? 'rgba(253,205,33,.5)' : 'rgba(207,125,202,.35)';
        ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.fillStyle = p.gold ? '#FDCD21' : '#E7A6E3';
        ctx.beginPath(); ctx.arc(x, y, p.gold ? 2.6 : 1.7, 0, 7); ctx.fill();
        continue;
      }
      leads++;
      if (p.gold) {
        const t2 = clamp((P - p.L - D) / D2);
        if (t2 >= 1) { turnos++; continue; }
        const [x, y] = seg(nodes.wa, nodes.turno, t2, p.o3, Math.min(W, H) * 0.05);
        ctx.fillStyle = '#FDCD21'; ctx.shadowColor = '#FDCD21'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      } else {
        const t3 = (P - p.L - D) / FADE;
        if (t3 >= 1) continue;
        const r = 20 + t3 * 70;
        ctx.fillStyle = `rgba(167,148,182,${0.55 * (1 - t3)})`;
        ctx.beginPath(); ctx.arc(nodes.wa.x + Math.cos(p.drift) * r, nodes.wa.y + Math.sin(p.drift) * r + t3 * 30, 1.3, 0, 7); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    hL.textContent = fmt(leads);
    hT.textContent = turnos;
    hI.textContent = '$' + fmt(Math.round(inversion * clamp((P - A0) / (SPAN + D + D2))));
    hC.classList.toggle('on', P > 0.88);
    for (let i = 0; i < miniCells.length; i++) miniCells[i].classList.toggle('on', i < turnos);
    nodes.wa.el.firstElementChild.style.boxShadow = P > A0 + D && P < 0.9 ? '0 0 30px rgba(37,211,102,.35)' : 'none';
  }

  layout();
  ScrollTrigger.addEventListener('refresh', layout);
  addEventListener('resize', layout);
  gsap.ticker.add(draw);
  return {
    setProgress: p => (P = p),
    destroy: () => {
      gsap.ticker.remove(draw);
      ScrollTrigger.removeEventListener('refresh', layout);
      removeEventListener('resize', layout);
    },
  };
}

/** Si la persona deja de scrollear en medio de la historia, le recordamos que sigue. */
function setupScrollHint(root) {
  const hint = root.querySelector('.scroll-hint');
  const contact = root.querySelector('#contacto');
  let idle;
  const arm = () => {
    hint.classList.remove('show');
    clearTimeout(idle);
    idle = setTimeout(() => {
      // en el hero ya está la indicación propia; el aviso es para quien se frena a mitad de la historia
      if (scrollY > innerHeight * 0.5 && contact.getBoundingClientRect().top > innerHeight * 0.6) hint.classList.add('show');
    }, 2200);
  };
  addEventListener('scroll', arm, { passive: true });
  return () => { removeEventListener('scroll', arm); clearTimeout(idle); };
}

/** Garantía: 3 meses de barras; el 3º no llega a la meta → el mes 4 se da vuelta y queda en $0. */
function setupGuarantee(root) {
  const scene = root.querySelector('.g-scene');
  const q = s => scene.querySelector(s), qa = s => Array.from(scene.querySelectorAll(s));
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#s-garantia', start: 'top top', end: '+=200%', pin: true, scrub: 1 } });
  const bars = qa('.g-bar');
  // el título entra antes del pin (al acercarse la sección); recién después aparecen los meses
  gsap.from(qa('.g-text > *'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '#s-garantia', start: 'top 75%' } });
  tl.from(q('.g-months'), { y: 50, opacity: 0, duration: 0.3 });
  bars.forEach((b, i) => {
    const v = +b.dataset.v, c = { n: 0 }, label = b.querySelector('b');
    tl.fromTo(b.querySelector('i'), { height: '0%' }, { height: b.dataset.h, duration: 0.35, ease: 'none' }, 0.3 + i * 0.35)
      .to(c, { n: v, duration: 0.35, ease: 'none', onUpdate: () => (label.textContent = Math.round(c.n)) }, '<');
  });
  tl.to(bars[2].querySelector('i'), { backgroundImage: 'linear-gradient(180deg, #ff8a98, #b8394f)', duration: 0.1 }, 1.45)
    .to(q('.g-cond .a'), { opacity: 1, duration: 0.15 }, 1.45)
    .to(q('.g-bill'), { rotationY: 180, duration: 0.4, ease: 'power2.inOut' }, 1.7)
    .to(q('.g-cond .a'), { opacity: 0, duration: 0.1 }, 2.15)
    .to(q('.g-cond .b'), { opacity: 1, duration: 0.15 }, 2.2)
    .to({}, { duration: 0.3 });
}
