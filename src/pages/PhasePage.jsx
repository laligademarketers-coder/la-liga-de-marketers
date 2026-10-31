import React, { useRef } from 'react';
import { PHASES } from '../shared/phases';
import { SiteHeader, SiteFooter, WaLink, ContactForm, useIsoLayoutEffect } from '../shared/ui';
import { PHASE_CONTENT, EVALUACION } from './phase-content';
import { initPageMotion } from './motion';
import '../landing/landing.css';
import '../shared/site.css';
import '../shared/themes.css';
import { watchTheme } from '../shared/theme';

/** Indicador 1 · 2 · 3: muestra en qué fase está la página y enlaza a las otras. */
export function PhaseStepper({ current }) {
  return (
    <nav className="stepper" aria-label="Las 3 fases">
      <div className="line" aria-hidden="true"><i style={{ '--to': `${((current - 1) / (PHASES.length - 1)) * 100}%` }} /></div>
      {PHASES.map(p => (
        <a key={p.n} href={p.path} className={p.n === current ? 'on' : p.n < current ? 'done' : ''}
          aria-current={p.n === current ? 'page' : undefined}>
          <b>{p.n}</b><span>{p.name}</span>
        </a>
      ))}
    </nav>
  );
}

export default function PhasePage({ n }) {
  const root = useRef(null);
  const phase = PHASES[n - 1];
  const c = PHASE_CONTENT[n];
  const next = PHASES[n] || null;
  // fondos alternados blanco / negro entre bloques (ver shared/themes.css)
  let k = 0;
  const alt = () => (k++ % 2 ? 't-dark' : 't-light');

  useIsoLayoutEffect(() => {
    document.body.classList.add('is-landing');
    const destroy = initPageMotion(root.current);
    const unwatch = watchTheme(root.current);
    return () => { destroy(); unwatch(); document.body.classList.remove('is-landing'); };
  }, []);

  return (
    <div className="site phase-page" ref={root}>
      <SiteHeader current={phase.path} />
      <main>
        <section className="ph-hero t-dark">
          <p className="kicker">Fase {n} de 3 · {phase.name}</p>
          <h1 className="display ph-title">{c.h1}</h1>
          <p className="lead">{c.lead}</p>
          <div className="ph-ctas">
            <WaLink location={`fase${n}_hero`} className="btn-wa lg">Pedir mi evaluación inicial</WaLink>
            <a className="btn-ghost" href="#contacto">Prefiero que me escriban</a>
          </div>
          <PhaseStepper current={n} />
        </section>

        <section className="ph-block ph-why t-violet">
          <h2 className="display rv">{c.why.title}</h2>
          <p className="rv">{c.why.text}</p>
        </section>

        <section className={`ph-block ${alt()}`}>
          <h2 className="display rv">Es para tu clínica si…</h2>
          <ul className="ph-checks rv-stagger">{c.forWho.map(t => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className={`ph-block ${alt()}`}>
          <p className="kicker rv">Qué hacemos</p>
          <h2 className="display rv">{phase.title}</h2>
          <div className="ph-cards rv-stagger">
            {c.deliverables.map((d, i) => (
              <article className="ph-card" key={d.title}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </article>
            ))}
          </div>
        </section>

        {c.results && (
          <section className={`ph-block ph-results ${alt()}`}>
            <p className="kicker rv">{c.results.title}</p>
            <div className="ph-nums rv-stagger">
              {c.results.items.map(r => (
                <div key={r.label}><b className="display" data-count={r.value}>{r.value}</b><span>{r.label}</span></div>
              ))}
            </div>
            <p className="ph-note rv">{c.results.note}</p>
          </section>
        )}

        <section className={`ph-block ${alt()}`}>
          <p className="kicker rv">El proceso</p>
          <h2 className="display rv">Cómo trabajamos</h2>
          <div className="ph-steps">
            <div className="ph-line" aria-hidden="true"><i /></div>
            {c.process.map((s, i) => (
              <article className="ph-step" key={i}>
                <span className="when">{s.when}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        {c.guarantee && (
          <div className={`ph-band ${alt()}`}>
            <section className="ph-block ph-guarantee rv">
              <b className="display">{c.guarantee.match(/\d+(?= turnos)/)?.[0]}</b>
              <div><p className="kicker">Nuestra garantía</p><p className="g-copy">{c.guarantee}</p></div>
            </section>
          </div>
        )}

        <section className={`ph-block ${alt()}`}>
          <h2 className="display rv">{c.outcome.title}</h2>
          <ul className="ph-checks gold rv-stagger">{c.outcome.items.map(t => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className={`ph-block ph-faq ${alt()}`}>
          <h2 className="display rv">Preguntas frecuentes</h2>
          <div className="rv-stagger">
            {c.faqs.map(f => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={`ph-block ph-next ${alt()}`}>
          {next ? (
            <a href={next.path} className="next-card rv">
              <span className="kicker">Después · Fase {next.n}</span>
              <b className="display">{next.name}: {next.title}</b>
              <span>{next.summary}</span>
              <i aria-hidden="true">→</i>
            </a>
          ) : (
            <a href={PHASES[0].path} className="next-card rv">
              <span className="kicker">¿No sabés por dónde empezar?</span>
              <b className="display">Volvé a la Fase 1: {PHASES[0].title}</b>
              <span>{PHASES[0].summary}</span>
              <i aria-hidden="true">→</i>
            </a>
          )}
        </section>

        <section id="contacto" className="ph-contact t-violet">
          <div className="contact">
            <div>
              <p className="kicker">Evaluación inicial</p>
              <h2 className="display big">¿En qué fase<br />está tu clínica?</h2>
              <p className="lead">{EVALUACION}</p>
              <WaLink location={`fase${n}_contact`} className="btn-wa lg">Escribinos por WhatsApp</WaLink>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
