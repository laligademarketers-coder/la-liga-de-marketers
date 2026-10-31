import React, { useRef, useState } from 'react';
import { RESULTS, PAINS, SEARCH_LINES, NODES, TIMELINE, CLOSING, DAYS, HOURS, AGENDA } from './data';
import { pushEvent } from './tracking';
import { initStory } from './story';
import { PHASES } from '../shared/phases';
import { SiteHeader, SiteFooter, WaLink, ContactForm, useIsoLayoutEffect } from '../shared/ui';
import './landing.css';
import '../shared/site.css';
import '../shared/themes.css';
import { watchTheme } from '../shared/theme';

const fmt = n => n.toLocaleString('es-AR');
function Agenda({ id, mode }) {
  return (
    <div className="agenda" id={id} aria-hidden="true">
      <div />
      {DAYS.map(d => <div key={d} className="day">{d}</div>)}
      {HOURS.map((h, r) => (
        <React.Fragment key={h}>
          <div className="hour">{h}</div>
          {DAYS.map((_, c) => {
            const cell = AGENDA[r * DAYS.length + c];
            return (
              <div className="cell" key={c}>
                <div className="in">
                  <div className={`face front ${cell.before}`}>{cell.before === 'empty' ? 'Sin turno' : 'Obra social'}</div>
                  {mode === 'after' && (cell.after === 'os'
                    ? <div className="face back os">Obra social</div>
                    : <div className={`face back ${cell.after === 'gold' ? 'gold' : ''}`}>{cell.treatment}<span className="p"> · Particular</span></div>)}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Landing() {
  const root = useRef(null);

  useIsoLayoutEffect(() => {
    document.body.classList.add('is-landing');
    const destroy = initStory(root.current);
    const unwatch = watchTheme(root.current);
    return () => { destroy(); unwatch(); document.body.classList.remove('is-landing'); };
  }, []);

  return (
    <div className="landing" ref={root}>
      <SiteHeader current="/" clock />

      <div className="story-progress" aria-hidden="true"><i /></div>
      <nav className="chapters" aria-label="Capítulos" />
      <div className="scroll-hint" aria-hidden="true"><span>Seguí bajando, la historia continúa</span><i className="chev" /></div>

      <main>
        {/* 0 · HERO */}
        <section id="s-hero" className="t-dark" data-chapter="09:00">
          <div className="scene hero-scene">
            <div className="hero-copy">
              <p className="kicker hero-k intro">Marketing odontológico · Córdoba</p>
              <h1 className="display hero-title intro">Llenamos la agenda de tu clínica dental con <em>pacientes particulares</em></h1>
              <p className="hero-sub intro">Diagnóstico, sistema de captación y redes, en 3 fases. Empezamos con una evaluación inicial sin costo.</p>
              <div className="hero-ctas intro">
                <WaLink location="hero" className="btn-wa lg">Pedir mi evaluación inicial</WaLink>
                <a className="btn-ghost" href="#s-fases">Ver las 3 fases</a>
              </div>
            </div>
            <aside className="hero-day intro" aria-label="Un martes en una clínica sin sistema">
              <span className="hero-day-k">Martes · así arranca hoy</span>
              <div className="hero-time display" aria-hidden="true">
                <span>09</span><span className="colon">:</span><span>00</span>
              </div>
              <p className="hero-line">El teléfono <b>no suena.</b></p>
              <p className="phone-ring"><i aria-hidden="true" />0 llamadas · 0 mensajes</p>
            </aside>
            <div className="scroll-cue"><span className="mouse"><i /></span>Bajá y mirá cómo cambia el día</div>
          </div>
        </section>

        {/* 1 · PROBLEMA */}
        <section id="s-problema" className="t-light" data-chapter="La agenda">
          <div className="scene">
            <div className="pain-col">
              {PAINS.map((p, i) => (
                <div className="pain" key={i}>
                  <span className="n">0{i + 1}</span>
                  <h2 className="display">{p.title[0]}<br />{p.title[1]}</h2>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="agenda-wrap">
              <Agenda id="agenda-hoy" mode="before" />
              <div className="agenda-meta">
                <div><b className="cnt-os">0</b>Obra social</div>
                <div><b className="cnt-empty">0</b>Sin turno</div>
                <div className="zero"><b>0</b>Particulares</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2 · BÚSQUEDA */}
        <section id="s-busqueda" className="t-violet" data-chapter="El paciente">
          <div className="scene">
            <div className="lines">{SEARCH_LINES.map((l, i) => <p key={i}><span>{l}</span></p>)}</div>
            <div className="phone" aria-hidden="true">
              <div className="notch" />
              <div className="screen">
                <div className="g-logo">{'Google'.split('').map((c, i) => <span key={i}>{c}</span>)}</div>
                <div className="g-search"><span className="q" /><i className="caret" /></div>
                <div className="res"><div className="tag">Patrocinado</div><h4>Otra clínica · Implantes</h4><div className="bar" style={{ width: '90%' }} /><div className="bar" style={{ width: '70%' }} /></div>
                <div className="res map">
                  <div className="mapimg"><i className="pin" style={{ left: '30%', top: '30%' }} /><i className="pin" style={{ left: '62%', top: '46%' }} /><i className="pin" style={{ left: '45%', top: '62%' }} /></div>
                  <div className="rows"><h4>3 clínicas cerca</h4><div className="bar" style={{ width: '60%' }} /></div>
                </div>
                <div className="res"><div className="tag">Patrocinado</div><h4>Centro odontológico · Turnos</h4><div className="bar" style={{ width: '80%' }} /></div>
                <div className="res ghost"><h4>Tu clínica</h4>no aparece</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 · LA MÁQUINA */}
        <section id="s-maquina" className="t-dark" data-chapter="La máquina">
          <div className="scene">
            <canvas className="machine-canvas" aria-hidden="true" />
            <div className="m-copy">
              <div className="step"><p className="kicker">Ahí entramos nosotros</p><h2 className="display">No campañas sueltas.<br />Un ecosistema.</h2></div>
              <div className="step"><p className="kicker">Lo prendemos</p><h2 className="display">Cada punto es un paciente<br />que te encontró.</h2></div>
              <div className="step">
                <p className="kicker">Resultados reales · {RESULTS.periodo}</p>
                <h2 className="display">{fmt(RESULTS.leads)} pacientes potenciales.<br />{RESULTS.turnos} turnos confirmados.</h2>
                <p>Clínicas dentales activas en Córdoba, con el sistema completo.</p>
              </div>
            </div>
            {NODES.map(n => (
              <div className="m-node" data-k={n.k} key={n.k}>
                <div className="ic"><img src={`https://cdn.simpleicons.org/${n.icon}/ffffff`} alt="" width="30" height="30" /></div>
                <div className="lb">{n.label}</div><div className="sub">{n.sub}</div>
              </div>
            ))}
            <div className="m-node turno" data-k="turno">
              <div className="ic"><div className="mini">{Array.from({ length: RESULTS.turnos }, (_, i) => <i key={i} />)}</div></div>
              <div className="lb">Turno confirmado</div>
            </div>
            <div className="m-measure">
              <img src="https://cdn.simpleicons.org/googletagmanager/ffffff" alt="" /><img src="https://cdn.simpleicons.org/googleanalytics/ffffff" alt="" />
              GTM + GA4 · cada paso, medido
            </div>
            <div className="m-hud">
              <div><b className="h-leads">0</b><span>Pacientes potenciales</span></div>
              <div className="gold"><b className="h-turnos">0</b><span>Turnos confirmados</span></div>
              <div><b className="h-inv">$0</b><span>Inversión</span></div>
              <div className="cpt"><b>${fmt(RESULTS.costoTurnoEspecial)}</b><span>Costo x turno especial</span></div>
            </div>
          </div>
        </section>

        {/* 3b · LAS 3 FASES */}
        <section id="s-fases" className="t-light" data-chapter="Las 3 fases">
          <p className="kicker center">Cómo trabajamos</p>
          <h2 className="display big center">No todas las clínicas están<br />listas para recibir pacientes</h2>
          <p className="lead fases-lead">Por eso trabajamos en 3 fases. Empezamos con una evaluación inicial: si tu clínica ya está preparada, vamos directo a la captación; si no, primero asentamos las bases.</p>
          <div className="fases">
            {PHASES.map(p => <PhaseCard key={p.n} phase={p} />)}
          </div>
          <p className="fases-route">Tocá cada fase para ver de qué se trata · <b>Evaluación inicial → Fase 1 o Fase 2 → Fase 3</b></p>
        </section>

        {/* 4 · OBJECIÓN */}
        <section id="s-objecion" className="t-dark" data-chapter="La duda">
          <p className="kicker center">La pregunta que más escuchamos</p>
          <h2 className="quote display center">{'“¿Y si gasto plata y no funciona?”'.split(' ').map((w, i) => <span className="w" key={i}>{w}</span>)}</h2>
          <p className="obj-sub">Tiene sentido: nadie quiere invertir sin certeza. Entonces <b>hacé la cuenta vos.</b> Con tus precios, con tu tasa de cierre.</p>
          <Calculator />
        </section>

        {/* 5 · 90 DÍAS */}
        <section id="s-dias" className="t-light" data-chapter="90 días">
          <div className="scene">
            <div className="d-head">
              <div><p className="kicker">Fase 2 · El proceso</p><h2 className="display">Sabés qué pasa<br />cada semana</h2></div>
              <div className="d-count" aria-hidden="true"><b className="d-num">01</b><span>Día de 90</span></div>
            </div>
            <div className="d-track">
              {TIMELINE.map(t => (
                <article className={`d-card ${t.when.startsWith('Mes 1') ? 'm1' : ''}`} key={t.when}>
                  <span className="when">{t.when}</span><h3>{t.title}</h3>
                  {t.text ? <p>{t.text}</p> : <ul>{t.items.map(it => <li key={it}>{it}</li>)}</ul>}
                </article>
              ))}
              <article className="d-card goal">
                <span className="when">Meta del mes 3</span><b>{RESULTS.metaTurnosMes}</b>
                <p>turnos agendados por mes de pacientes calificados</p>
              </article>
            </div>
            <div className="d-progress"><i className="d-bar" /><span className="mk" style={{ left: 0 }}>Mes 1</span><span className="mk" style={{ left: '50%' }}>Mes 2</span><span className="mk" style={{ left: '100%' }}>Mes 3</span></div>
          </div>
        </section>

        {/* 6 · GARANTÍA */}
        <section id="s-garantia" className="t-dark" data-chapter="La garantía">
          <Guarantee />
        </section>

        {/* 7 · FINAL */}
        <section id="s-final" className="t-light" data-chapter="18:30">
          <div className="scene">
            <div className="f-head"><span className="kicker">Martes · 18:30</span><h2 className="display">Así se ve tu agenda<br />con La Liga</h2></div>
            <Agenda id="agenda-liga" mode="after" />
            <p className="agenda-legend" aria-hidden="true"><i className="l-part" />Paciente particular<i className="l-os" />Obra social</p>
            <div className="f-cta">
              <WaLink location="final">Quiero mi evaluación inicial</WaLink>
              <p>30 minutos, sin costo: vemos en qué fase está tu clínica.</p>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="t-violet" data-chapter="Hablemos">
          <div className="contact">
            <div>
              <p className="kicker">Evaluación inicial</p>
              <h2 className="display big">¿En qué fase<br />está tu clínica?</h2>
              <p className="lead">Completá el formulario y te contactamos en menos de 24 hs para una evaluación inicial de 30 minutos, sin costo. O escribinos directo.</p>
              <WaLink location="contact" className="btn-wa lg">Escribir por WhatsApp</WaLink>
            </div>
            <ContactForm />
          </div>
        </section>
        {/* CIERRE · la frase de la propuesta */}
        <section id="s-frase" className="t-dark" data-chapter="Final">
          <div className="closing">
            <p className="closing-q">
              {CLOSING.text.split(' ').map((w, i) => <span className="w" key={`t${i}`}>{w} </span>)}
              {CLOSING.highlight.split(' ').map((w, i) => <span className="w hl" key={`h${i}`}>{w} </span>)}
            </p>
            <WaLink location="closing" className="btn-wa lg">Escribinos por WhatsApp</WaLink>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Calculator() {
  const [precio, setPrecio] = useState(1000000);
  const [cierre, setCierre] = useState(5);
  const costo = RESULTS.costoTurnoEspecial / (cierre / 10);
  const x = Math.round(precio / costo);
  const pct = (v, min, max) => ({ '--p': `${((v - min) / (max - min)) * 100}%` });
  return (
    <div className="calc">
      <div>
        <h3>Tu consultorio</h3>
        <div className="ctrl">
          <label htmlFor="r-precio">Precio de un implante <b>${fmt(precio)}</b></label>
          <input id="r-precio" type="range" min="300000" max="3000000" step="50000" value={precio}
            style={pct(precio, 300000, 3000000)} onChange={e => setPrecio(+e.target.value)} />
        </div>
        <div className="ctrl">
          <label htmlFor="r-cierre">De cada 10 turnos, ¿cuántos cerrás? <b>{cierre} de 10</b></label>
          <input id="r-cierre" type="range" min="1" max="10" step="1" value={cierre}
            style={pct(cierre, 1, 10)} onChange={e => setCierre(+e.target.value)} />
        </div>
        <div className="fixed-cost">
          Costo por turno de tratamiento especial ({RESULTS.periodo.toLowerCase()}): <b>${fmt(RESULTS.costoTurnoEspecial)}</b><br />
          Costo de cerrar un tratamiento: <b>${fmt(Math.round(costo))}</b>
        </div>
      </div>
      <div className="out" aria-live="polite">
        <div className="x">{x}x</div>
        <div className="xl">Retorno por tratamiento cerrado</div>
        <div className="bars">
          <div>Lo que invertís para cerrarlo</div><div className="b cost" style={{ width: `${Math.max(0.6, (costo / precio) * 100)}%` }} />
          <div>Lo que factura tu consultorio</div><div className="b rev" />
        </div>
        <p className="disclaimer">Basado en datos reales de {RESULTS.periodo.toLowerCase()}. El retorno varía según cada clínica.</p>
      </div>
    </div>
  );
}

/** Tarjeta de fase: al tocarla gira y muestra el resumen con el enlace a su página. */
function PhaseCard({ phase }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`fase-card ${open ? 'flipped' : ''}`}>
      <div className="fase-in">
        <button type="button" className="front" aria-expanded={open}
          onClick={() => { setOpen(true); pushEvent('fase_card_open', { fase: phase.n }); }}>
          <span className="k">Fase {phase.n}</span>
          <span className="num">0{phase.n}</span>
          <span className="t">{phase.name}</span>
          <span className="more" aria-hidden="true">+</span>
        </button>
        <div className="face back">
          <span className="k">Fase {phase.n} · {phase.name}</span>
          <h3>{phase.title}</h3>
          <p>{phase.summary}</p>
          <a className="go" href={phase.path} tabIndex={open ? 0 : -1}>Ver la fase {phase.n} →</a>
          <button type="button" className="close" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <span className="sr-only">Volver</span><span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Garantía: los 4 meses ───
const G_CLAUSE = `Si al mes 3 no llegamos a ${RESULTS.metaTurnosMes} turnos agendados por mes de pacientes calificados,`;
const G_NOTE = 'Nosotros traemos el paciente calificado. Que agende y se trate depende de cómo lo atienden en la clínica, por eso trabajamos juntos el flujo de atención desde el día 1.';

function Guarantee() {
  const meta = RESULTS.metaTurnosMes;
  return (
    <div className="scene g-scene">
      <div className="g-wrap col">
        <div className="g-text center">
          <p className="kicker">Fase 2 · Nuestra garantía</p>
          <h2 className="g-copy">{G_CLAUSE} <em>el mes 4 no se cobra.</em></h2>
        </div>
        <div className="g-months" aria-hidden="true">
          <div className="g-goal"><span>Meta · {meta} turnos/mes</span></div>
          {/* valores ilustrativos: el mes 3 queda corto a propósito para mostrar cómo actúa la garantía */}
          {[6, 13, 16].map((v, i) => {
            const h = `${(v / (meta * 1.25)) * 100}%`; // la meta queda al 80% de la altura
            return (
              <div className="g-month" key={i}>
                <div className="g-bar" data-v={v} data-h={h}><i style={{ height: h }}><b>{v}</b></i></div><span>Mes {i + 1}</span>
              </div>
            );
          })}
          <div className="g-month m4">
            <div className="g-bill">
              <span className="cobra">Se cobra</span>
              <span className="free"><b>$0</b>no se cobra</span>
            </div>
            <span>Mes 4</span>
          </div>
        </div>
        <p className="g-cond"><span className="a">Ejemplo: ¿y si al mes 3 no llegamos a la meta?</span><span className="b">{G_NOTE}</span></p>
      </div>
    </div>
  );
}
