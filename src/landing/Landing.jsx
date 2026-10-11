import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  RESULTS, WA_URL, WA_NUMBER, WA_PHONE_LABEL, PAINS, SEARCH_LINES, NODES, TIMELINE,
  EXTRAS, NOT_INCLUDED, CHALLENGES, DAYS, HOURS, AGENDA,
} from './data';
import { pushEvent } from './tracking';
import { initStory } from './story';
import './landing.css';

const fmt = n => n.toLocaleString('es-AR');

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2.163c5.514 0 9.98 4.466 9.98 9.98 0 5.515-4.466 9.98-9.98 9.98-1.733 0-3.363-.442-4.778-1.218L2 22l1.126-4.118A9.938 9.938 0 012.02 12.143C2.02 6.628 6.486 2.163 12 2.163z" />
  </svg>
);

function WaLink({ location, className = 'btn-wa', children }) {
  return (
    <a className={className} href={WA_URL} target="_blank" rel="noopener noreferrer"
      onClick={() => pushEvent('wa_click', { location })}>
      <WhatsAppIcon />{children}
    </a>
  );
}

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
                    : <div className={`face back ${cell.after === 'gold' ? 'gold' : ''}`}>{cell.treatment} · Particular</div>)}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', clinic: '', challenge: '' });
  const [error, setError] = useState(false);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError(true); return; }
    setError(false);
    const msg = encodeURIComponent(
      `Hola, soy ${form.name}${form.clinic ? ` de ${form.clinic}` : ''}. Mi WhatsApp es ${form.phone}.${form.challenge ? ` Desafío: ${form.challenge}.` : ''}`
    );
    pushEvent('lead_form_submit', { user_name: form.name, lead_source: 'landing_dental' });
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>Tu nombre<input name="name" value={form.name} onChange={onChange} placeholder="Dr. / Dra. nombre" autoComplete="name" required /></label>
      <label>WhatsApp<input name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+54 9 351..." autoComplete="tel" required /></label>
      <label>Clínica / Consultorio<input name="clinic" value={form.clinic} onChange={onChange} placeholder="Nombre de tu clínica" autoComplete="organization" /></label>
      <label>Principal desafío
        <select name="challenge" value={form.challenge} onChange={onChange}>
          <option value="">Seleccioná una opción</option>
          {CHALLENGES.map(c => <option key={c}>{c}</option>)}
        </select>
      </label>
      {error && <p className="form-error" role="alert">Completá tu nombre y tu WhatsApp.</p>}
      <button type="submit">Quiero más pacientes particulares →</button>
    </form>
  );
}

export default function Landing() {
  const root = useRef(null);

  useLayoutEffect(() => {
    document.body.classList.add('is-landing');
    const destroy = initStory(root.current);
    return () => { destroy(); document.body.classList.remove('is-landing'); };
  }, []);

  return (
    <div className="landing" ref={root}>
      <header className="topbar">
        <a className="brand" href="#s-hero" aria-label="La Liga de Marketers, inicio">
          <img src="/imagenes/logo-icon.png" alt="" /><span>La Liga de Marketers</span>
        </a>
        <div className="top-right">
          <div className="clock" aria-hidden="true"><span className="clock-time">09:00</span><small>Martes</small></div>
          <WaLink location="nav">WhatsApp</WaLink>
        </div>
      </header>

      <nav className="chapters" aria-label="Capítulos" />

      <main>
        {/* 0 · HERO */}
        <section id="s-hero" data-chapter="09:00">
          <div className="scene">
            <div className="intro"><p className="kicker hero-k">Martes · Un consultorio dental en Córdoba</p></div>
            <div className="intro">
              <h1 className="hero-time display" aria-label="Llenamos tu agenda de pacientes particulares">
                <span aria-hidden="true">09</span><span className="colon" aria-hidden="true">:</span><span aria-hidden="true">00</span>
              </h1>
            </div>
            <div className="intro"><p className="hero-line">El teléfono <b>no suena.</b></p></div>
            <div className="phone-ring">0 llamadas · 0 mensajes</div>
            <div className="scroll-cue">Scrolleá para que pase el día</div>
          </div>
        </section>

        {/* 1 · PROBLEMA */}
        <section id="s-problema" data-chapter="La agenda">
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
        <section id="s-busqueda" data-chapter="El paciente">
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
        <section id="s-maquina" data-chapter="La máquina">
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

        {/* 3b · MÁS QUE CAMPAÑAS */}
        <section id="s-cierre" data-chapter="El cierre">
          <p className="kicker center">Más que campañas</p>
          <h2 className="display big center">La máquina no termina<br />en el click</h2>
          <p className="lead center">Para que una consulta se convierta en tratamiento, la clínica necesita herramientas. Las armamos con vos.</p>
          <div className="extras">
            {EXTRAS.map((x, i) => (
              <article className="extra" key={x.title}>
                <span className="n">0{i + 1}</span><h3>{x.title}</h3><p>{x.text}</p>
              </article>
            ))}
          </div>
          <p className="not-included"><span>Lo que no hacemos:</span>{NOT_INCLUDED.map(n => <s key={n}>{n}</s>)}<em>Ser claros evita malentendidos.</em></p>
        </section>

        {/* 4 · OBJECIÓN */}
        <section id="s-objecion" data-chapter="La duda">
          <p className="kicker center">La pregunta que más escuchamos</p>
          <h2 className="quote display center">{'“¿Y si gasto plata y no funciona?”'.split(' ').map((w, i) => <span className="w" key={i}>{w}</span>)}</h2>
          <p className="obj-sub">Tiene sentido: nadie quiere invertir sin certeza. Entonces <b>hacé la cuenta vos.</b> Con tus precios, con tu tasa de cierre.</p>
          <Calculator />
        </section>

        {/* 5 · 90 DÍAS */}
        <section id="s-dias" data-chapter="90 días">
          <div className="scene">
            <div className="d-head">
              <div><p className="kicker">El proceso</p><h2 className="display">Sabés qué pasa<br />cada semana</h2></div>
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
        <section id="s-garantia" data-chapter="La garantía">
          <div className="scene">
            <p className="kicker">Nuestra garantía</p>
            <div className="g-20 display" aria-hidden="true">{RESULTS.metaTurnosMes}</div>
            <h2 className="g-copy">Si al mes 3 no llegamos a {RESULTS.metaTurnosMes} turnos agendados, <em>el mes 4 no se cobra.</em></h2>
            <p className="g-note">Nosotros traemos el paciente calificado. Que agende y se trate depende de cómo lo atienden en la clínica, por eso trabajamos juntos el flujo de atención desde el día 1.</p>
            <div className="stamp" aria-hidden="true">Garantizado<small>Mes 4 sin costo</small></div>
          </div>
        </section>

        {/* 7 · FINAL */}
        <section id="s-final" data-chapter="18:30">
          <div className="scene">
            <div className="f-head"><span className="kicker">Martes · 18:30</span><h2 className="display">Así se ve tu agenda<br />con La Liga</h2></div>
            <Agenda id="agenda-liga" mode="after" />
            <div className="f-cta">
              <WaLink location="final">Quiero más pacientes particulares</WaLink>
              <p>Llamada de 30 minutos, sin costo ni compromiso.</p>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" data-chapter="Hablemos">
          <div className="contact">
            <div>
              <p className="kicker">Hablemos</p>
              <h2 className="display big">¿Preferís que<br />te escribamos?</h2>
              <p className="lead">Completá el formulario y te contactamos en menos de 24 hs. O escribinos directo.</p>
              <WaLink location="contact" className="btn-wa lg">Escribir por WhatsApp</WaLink>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <span>La Liga de Marketers · Córdoba, Argentina</span>
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer">{WA_PHONE_LABEL}</a>
      </footer>
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
