import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Movimiento de las páginas de contenido: scroll suave, apariciones y la línea del proceso. */
export function initPageMotion(root) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = t => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  const ctx = gsap.context(() => {
    // hero: entrada escalonada
    gsap.from('.ph-hero > *', { y: 50, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' });
    gsap.fromTo('.stepper .line i', { scaleX: 0 }, { scaleX: 1, duration: 1.4, delay: 0.5, ease: 'power3.inOut' });

    // apariciones al entrar en pantalla
    gsap.utils.toArray('.rv').forEach(el => gsap.from(el, {
      y: 46, opacity: 0, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    }));
    gsap.utils.toArray('.rv-stagger').forEach(group => gsap.from(group.children, {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'expo.out', clearProps: 'transform',
      scrollTrigger: { trigger: group, start: 'top 85%' },
    }));

    // proceso: la línea se completa con el scroll y cada paso se enciende al alcanzarlo
    const proc = root.querySelector('.ph-steps');
    if (proc) {
      gsap.fromTo(proc.querySelector('.ph-line i'), { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: proc, start: 'top 70%', end: 'bottom 60%', scrub: true },
      });
      proc.querySelectorAll('.ph-step').forEach(step => ScrollTrigger.create({
        trigger: step, start: 'top 65%',
        onEnter: () => step.classList.add('on'),
        onLeaveBack: () => step.classList.remove('on'),
      }));
    }

    // números de resultados que cuentan al aparecer
    root.querySelectorAll('[data-count]').forEach(el => {
      const target = el.dataset.count, num = parseFloat(target.replace(/[^\d]/g, '')), prefix = target.startsWith('$') ? '$' : '';
      const o = { v: 0 };
      el.textContent = prefix + '0';
      gsap.to(o, {
        v: num, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => (el.textContent = prefix + Math.round(o.v).toLocaleString('es-AR')),
        onComplete: () => (el.textContent = target),
      });
    });
  }, root);

  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => { ctx.revert(); gsap.ticker.remove(raf); lenis.destroy(); };
}
