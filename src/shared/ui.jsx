import React, { useEffect, useLayoutEffect, useState } from 'react';
import { WA_URL, WA_NUMBER, WA_PHONE_LABEL, CHALLENGES } from '../landing/data';
import { pushEvent } from '../landing/tracking';
import { PHASES } from './phases';

// useLayoutEffect en el navegador; en el prerender (Node) no hace nada y no emite avisos
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2.163c5.514 0 9.98 4.466 9.98 9.98 0 5.515-4.466 9.98-9.98 9.98-1.733 0-3.363-.442-4.778-1.218L2 22l1.126-4.118A9.938 9.938 0 012.02 12.143C2.02 6.628 6.486 2.163 12 2.163z" />
  </svg>
);

export function WaLink({ location, className = 'btn-wa', children }) {
  return (
    <a className={className} href={WA_URL} target="_blank" rel="noopener noreferrer"
      onClick={() => pushEvent('wa_click', { location })}>
      <WhatsAppIcon />{children}
    </a>
  );
}

export function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', clinic: '', challenge: '' });
  const [error, setError] = useState(false);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError(true); return; }
    setError(false);
    const msg = encodeURIComponent(
      `Hola, soy ${form.name}${form.clinic ? ` de ${form.clinic}` : ''}. Mi WhatsApp es ${form.phone}.${form.challenge ? ` Desafío: ${form.challenge}.` : ''} Quiero la evaluación inicial.`
    );
    pushEvent('lead_form_submit', { user_name: form.name, lead_source: 'landing_dental', page: window.location.pathname });
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
      <button type="submit">Pedir mi evaluación inicial →</button>
    </form>
  );
}

/** Encabezado fijo. En la home muestra el reloj de la historia; en el resto, solo el menú. */
export function SiteHeader({ current, clock = false }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <header className={`topbar ${open ? 'menu-open' : ''}`}>
      <a className="brand" href="/" aria-label="La Liga de Marketers, inicio">
        <img src="/imagenes/logo-icon.png" alt="" width="30" height="30" /><span>La Liga de Marketers</span>
      </a>
      <nav className="nav-links" aria-label="Fases">
        {PHASES.map(p => (
          <a key={p.n} href={p.path} aria-current={current === p.path ? 'page' : undefined}>
            <small>Fase {p.n}</small>{p.name}
          </a>
        ))}
      </nav>
      <div className="top-right">
        {clock && <div className="clock" aria-hidden="true"><span className="clock-time">09:00</span><small>Martes</small></div>}
        <WaLink location="nav">WhatsApp</WaLink>
        <button type="button" className="menu-btn" aria-expanded={open} aria-controls="menu-panel"
          onClick={() => setOpen(o => !o)}>
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span><i /><i />
        </button>
      </div>
      <div className="menu-panel" id="menu-panel" hidden={!open}>
        <a href="/" aria-current={current === '/' ? 'page' : undefined}>Inicio</a>
        {PHASES.map(p => (
          <a key={p.n} href={p.path} aria-current={current === p.path ? 'page' : undefined}>
            <small>Fase {p.n}</small>{p.name} · {p.title}
          </a>
        ))}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer t-dark">
      <div className="f-brand">
        <a className="brand" href="/"><img src="/imagenes/logo-icon.png" alt="" width="30" height="30" /><span>La Liga de Marketers</span></a>
        <p>Marketing odontológico para clínicas y consultorios dentales. Córdoba, Argentina.</p>
      </div>
      <nav aria-label="Fases">
        <p>Cómo trabajamos</p>
        {PHASES.map(p => <a key={p.n} href={p.path}>Fase {p.n} · {p.title}</a>)}
      </nav>
      <div>
        <p>Contacto</p>
        <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
          onClick={() => pushEvent('wa_click', { location: 'footer' })}>WhatsApp {WA_PHONE_LABEL}</a>
      </div>
    </footer>
  );
}
