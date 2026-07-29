import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import './LaLiga.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const WA_NUMBER = '5493512033845';
const WA_MSG = encodeURIComponent(
  'Hola, quiero saber cómo conseguir más pacientes particulares para mi clínica dental'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function pushEvent(eventName, extra = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, event_id: `${eventName}_${Date.now()}`, ...extra });
}

// ─── EASE PREMIUM (igual que Vercel / Linear) ───────────────────────────────
const EASE = [0.22, 1, 0.36, 1];

// ─── VARIANTS ────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: EASE } },
};

const staggerGrid = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// ─── FadeUp wrapper ──────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Texto rotatorio del hero ─────────────────────────────────────────────────
const TREATMENTS = ['implantes', 'ortodoncia', 'ATM y bruxismo', 'pacientes particulares'];

function RotatingWord() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TREATMENTS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="llm-rotating-wrap">
      <AnimatePresence mode="wait">
        <motion.em
          key={idx}
          initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: -18, filter: 'blur(4px)' }}
          transition={{ duration: 0.38, ease: EASE }}
        >
          {TREATMENTS[idx]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

// ─── Contador animado ─────────────────────────────────────────────────────────
function CountUp({ to, duration = 2, format = n => n }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setDisplay(format(Math.round(v))),
    });
    return controls.stop;
  }, [isInView, to, duration, format]);

  return <span ref={ref}>{display}</span>;
}

// ─── WhatsApp icon ────────────────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2.163c5.514 0 9.98 4.466 9.98 9.98 0 5.515-4.466 9.98-9.98 9.98-1.733 0-3.363-.442-4.778-1.218L2 22l1.126-4.118A9.938 9.938 0 012.02 12.143C2.02 6.628 6.486 2.163 12 2.163z"/>
  </svg>
);

const PAIN_ITEMS = [
  { label: 'Agenda impredecible',       desc: 'No sabés cuántos pacientes tenés el mes que viene. Dependés del boca en boca y de lo que manda la obra social.' },
  { label: 'Más obra social que caja',  desc: 'Trabajás el doble por la mitad del ingreso. Los pacientes particulares existen y tienen capacidad de pago, pero no te encuentran.' },
  { label: 'Alto valor sin demanda',    desc: 'Hacés implantes, ortodoncia y bruxismo/ATM, pero esos turnos no se llenan. El problema no es tu calidad: es que nadie sabe que los ofrecés.' },
];

const HOW_ITEMS = [
  { num: '01', title: 'Captamos',   desc: 'Google Ads y Meta Ads específicos por tratamiento. Cada campaña apunta a pacientes con capacidad e intención real de tratarse.' },
  { num: '02', title: 'Convertimos',desc: 'Landings por tratamiento y flujo de WhatsApp con scripts de FAQ para romper objeciones antes de que lleguen a la consulta.' },
  { num: '03', title: 'Seguimos',   desc: 'CRM y sistema de seguimiento para que ningún paciente potencial se pierda. Cada consulta que entra tiene su proceso hasta el turno confirmado.' },
  { num: '04', title: 'Medimos',    desc: 'Métricas reales cada mes: costo por turno, tasa de conversión, turnos por tratamiento. Sabés exactamente qué funcionó y qué ajustamos.' },
];

const BEYOND_ITEMS = [
  { title: 'Financiación para el paciente',       desc: 'Cuotas propias para ortodoncia, financiación bancaria para implantes y ATM. Cuando el paciente puede pagar en cuotas, el "no tengo presupuesto" desaparece.' },
  { title: 'CRM y seguimiento de consultas',      desc: 'Un sistema simple para que ningún lead se pierda. Desde la primera consulta por WhatsApp hasta el turno confirmado, todo rastreado.' },
  { title: 'Scripts de FAQ y manejo de objeciones',desc: 'Flujos de respuesta para WhatsApp y para el consultorio. Contestamos las dudas del paciente antes de que se vaya a pensar y no vuelva.' },
  { title: 'Oferta comercial clara por tratamiento',desc: 'Materiales, proceso clínico, tiempos y precio claro para implantes, ortodoncia y ATM. El paciente particular necesita entender qué está pagando para decidirse.' },
];

const AGENDA_BEFORE = [
  { time: '09:00', text: 'Obra Social',  type: 'os' },
  { time: '10:00', text: 'Obra Social',  type: 'os' },
  { time: '11:00', text: 'Sin turno',    type: 'empty' },
  { time: '12:00', text: 'Obra Social',  type: 'os' },
  { time: '14:00', text: 'Obra Social',  type: 'os' },
  { time: '15:00', text: 'Sin turno',    type: 'empty' },
];

const AGENDA_AFTER = [
  { time: '09:00', text: 'Implante · Particular',    type: 'high' },
  { time: '10:00', text: 'Ortodoncia · Particular',  type: 'high' },
  { time: '11:00', text: 'ATM / Bruxismo · Part.',   type: 'high' },
  { time: '12:00', text: 'Blanqueamiento · Part.',   type: 'part' },
  { time: '14:00', text: 'Implante · Particular',    type: 'high' },
  { time: '15:00', text: 'Consulta · Particular',    type: 'part' },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function LaLiga() {
  const [form, setForm] = useState({ name: '', phone: '', clinic: '', challenge: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStatus('loading');
    try {
      const { error } = await supabase.from('leads').insert([{
        name: form.name, phone: form.phone,
        clinic: form.clinic || null, challenge: form.challenge || null,
        source: 'landing_dental', created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      pushEvent('lead_form_submit', { user_name: form.name, user_phone: form.phone, lead_source: 'landing_dental' });
      setStatus('success');
    } catch (err) {
      console.error('Form error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="llm">

      {/* ── NAV ── */}
      <motion.nav
        className="llm-nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        role="navigation"
      >
        <a href="/" className="llm-logo">La Liga de Marketers</a>
        <ul className="llm-nav-links">
          <li><a href="#resultados">Resultados</a></li>
          <li><a href="#como">Cómo trabajamos</a></li>
          <li><a href="#contacto">Contacto</a></li>
          <li>
            <a href={WA_URL} target="_blank" rel="noreferrer" className="llm-nav-cta"
               onClick={() => pushEvent('wa_click', { location: 'nav' })}>
              WhatsApp
            </a>
          </li>
        </ul>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="llm-hero-wrap">
        <div className="llm-hero">
          <div className="llm-hero-content">

            <motion.p className="llm-eyebrow"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}>
              Especialistas en marketing odontológico · Córdoba
            </motion.p>

            <motion.h1 className="llm-h1"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}>
              Conseguimos pacientes<br />
              para <RotatingWord /><br />
              en Córdoba.
            </motion.h1>

            <motion.p className="llm-sub"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: EASE }}>
              Sin adivinanzas: te mostramos exactamente qué invertiste y cuántos turnos obtuviste.
              Datos reales, ajustes en tiempo real.
            </motion.p>

            <motion.div className="llm-actions"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.48, ease: EASE }}>
              <motion.a href={WA_URL} target="_blank" rel="noreferrer"
                className="llm-btn-wa"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => pushEvent('wa_click', { location: 'hero' })}>
                <WhatsAppIcon /> Hablar por WhatsApp
              </motion.a>
              <motion.button className="llm-btn-outline"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' })}>
                Completar formulario →
              </motion.button>
            </motion.div>
          </div>

          {/* Agenda visual */}
          <motion.div className="llm-agenda"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            aria-label="Comparación de agenda antes y después">
            <div className="llm-agenda-header">
              <div className="llm-agenda-label llm-label-before">Tu agenda hoy</div>
              <div className="llm-agenda-label llm-label-after">Tu agenda con La Liga</div>
            </div>
            <div className="llm-agenda-grid">
              <div className="llm-agenda-col">
                {AGENDA_BEFORE.map((s, i) => (
                  <motion.div key={i} className={`llm-slot llm-slot-${s.type}`}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06, ease: EASE }}>
                    <span className="llm-slot-time">{s.time}</span>{s.text}
                  </motion.div>
                ))}
              </div>
              <div className="llm-agenda-col">
                {AGENDA_AFTER.map((s, i) => (
                  <motion.div key={i} className={`llm-slot llm-slot-${s.type}`}
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.06, ease: EASE }}>
                    <span className="llm-slot-time">{s.time}</span>{s.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MÉTRICAS ── */}
      <section className="llm-metrics" id="resultados">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label llm-label-light">Resultados reales — Julio 2025</p></FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="llm-h2 llm-h2-light">Clínicas dentales activas en Córdoba</h2>
          </FadeUp>

          <motion.div className="llm-metrics-grid"
            variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {[
              { to: 685,   label: 'pacientes potenciales generados',          format: n => n.toLocaleString('es-AR') },
              { to: 28,    label: 'turnos confirmados',                        format: n => n.toString() },
              { to: 415,   label: 'tasa de conversión lead → turno',           format: n => (n / 100).toFixed(2).replace('.', ',') + '%' },
              { to: 17507, label: 'costo por turno de tratamiento especial',   format: n => '$' + n.toLocaleString('es-AR') },
            ].map((m, i) => (
              <motion.div key={i} className="llm-metric-card" variants={staggerItem}>
                <span className="llm-metric-num">
                  <CountUp to={m.to} duration={2} format={m.format} />
                </span>
                <span className="llm-metric-label">{m.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <FadeUp delay={0.1}>
            <div className="llm-metrics-breakdown">
              <div className="llm-breakdown-item">
                <span className="llm-breakdown-val">19 turnos</span>
                <span className="llm-breakdown-lbl">Tratamientos especiales (implantes, ortodoncia, ATM)</span>
                <span className="llm-breakdown-pct">67,86% conversión</span>
              </div>
              <div className="llm-breakdown-divider" role="separator" />
              <div className="llm-breakdown-item">
                <span className="llm-breakdown-val">9 turnos</span>
                <span className="llm-breakdown-lbl">Odontología general</span>
                <span className="llm-breakdown-pct">47,37% conversión</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="llm-metrics-note">
              Inversión total: $452.988 ARS · Resultados de clínicas con sistema completo activo
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="llm-pains" id="problemas">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">El problema que no se nombra</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">¿Te identificás con alguno de estos escenarios?</h2></FadeUp>

          <motion.div className="llm-pain-grid"
            variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {PAIN_ITEMS.map((p, i) => (
              <motion.div key={i} className="llm-pain-card"
                variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                <h3 className="llm-pain-title">{p.label}</h3>
                <p className="llm-pain-desc">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ROI ── */}
      <section className="llm-roi" id="inversion">
        <div className="llm-container llm-roi-inner">
          <motion.div
            initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE }}>
            <p className="llm-sec-label">La objeción más común</p>
            <h2 className="llm-h2">"¿Y si gasto plata<br />y no funciona?"</h2>
            <p className="llm-body">Es la pregunta que más escuchamos. Y tiene sentido: nadie quiere invertir sin certeza.</p>
            <p className="llm-body">Pero miralo así: un turno de implante cierra entre $400.000 y $800.000 en ingresos para tu clínica. En julio, el costo por turno de tratamiento especial fue <strong>$17.507</strong>.</p>
            <p className="llm-body">Eso no es un gasto. Es una palanca con retorno de 34x.</p>
            <p className="llm-body">Y si algo no está funcionando, lo sabemos antes que vos. Porque tenemos los números en tiempo real y ajustamos en el momento.</p>
          </motion.div>

          <motion.div className="llm-roi-card"
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE }}>
            <p className="llm-roi-card-title">Ejemplo de retorno — Julio 2025</p>
            <div className="llm-roi-row">
              <span>Costo por turno tratamiento especial</span>
              <span className="llm-roi-val">$17.507</span>
            </div>
            <div className="llm-roi-row">
              <span>Ingreso promedio por implante</span>
              <span className="llm-roi-val">$600.000</span>
            </div>
            <div className="llm-roi-divider" />
            <div className="llm-roi-row llm-roi-result">
              <span>Retorno por turno cerrado</span>
              <motion.span className="llm-roi-highlight"
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: EASE }}>
                34x
              </motion.span>
            </div>
            <p className="llm-roi-note">* Datos reales de julio 2025. El retorno varía según la tasa de cierre de cada clínica.</p>
          </motion.div>
        </div>
      </section>

      {/* ── CÓMO TRABAJAMOS ── */}
      <section className="llm-how" id="como">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">Cómo trabajamos</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">Un sistema, no campañas sueltas</h2></FadeUp>

          <motion.div className="llm-how-grid"
            variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {HOW_ITEMS.map((s, i) => (
              <motion.div key={i} className="llm-how-item"
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <span className="llm-how-num">{s.num}</span>
                <h3 className="llm-how-title">{s.title}</h3>
                <p className="llm-how-desc">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MÁS QUE MARKETING ── */}
      <section className="llm-beyond" id="diferencial">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">Más que campañas</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">Para cerrar más turnos,<br />también trabajamos esto</h2></FadeUp>
          <FadeUp delay={0.1}>
            <p className="llm-beyond-sub">
              Sabemos que el marketing solo no alcanza. Para que las consultas se conviertan en
              tratamientos, la clínica necesita herramientas clave.
            </p>
          </FadeUp>

          <motion.div className="llm-beyond-grid"
            variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {BEYOND_ITEMS.map((b, i) => (
              <motion.div key={i} className="llm-beyond-card"
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <div className="llm-beyond-index">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="llm-beyond-title">{b.title}</h3>
                <p className="llm-beyond-desc">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTACTO ── */}
      <section className="llm-contact" id="contacto">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">Hablemos</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">¿Querés más pacientes particulares?</h2></FadeUp>

          <div className="llm-contact-grid">
            <motion.div className="llm-contact-left"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1, ease: EASE }}>
              <p className="llm-body">
                Una llamada de 30 minutos sin costo para revisar tu situación y ver si podemos ayudarte. Sin compromiso.
              </p>
              <motion.a href={WA_URL} target="_blank" rel="noreferrer"
                className="llm-wa-btn"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => pushEvent('wa_click', { location: 'contact' })}>
                <WhatsAppIcon /> Escribir por WhatsApp
              </motion.a>
              <div className="llm-or-divider"><span>o</span></div>
              <p className="llm-contact-sub">Completá el formulario y te contactamos en menos de 24hs</p>
            </motion.div>

            <motion.div className="llm-contact-right"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.2, ease: EASE }}>
              {status === 'success' ? (
                <div className="llm-success-msg" role="alert">
                  <p>¡Listo! Te contactamos pronto. También podés escribirnos directo por WhatsApp.</p>
                  <motion.a href={WA_URL} target="_blank" rel="noreferrer"
                    className="llm-wa-btn" style={{ marginTop: '1.25rem' }}
                    whileHover={{ scale: 1.02 }}>
                    <WhatsAppIcon /> Ir a WhatsApp
                  </motion.a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {[
                    { id: 'name',    label: 'Tu nombre',           type: 'text', placeholder: 'Dr. / Dra. nombre', required: true },
                    { id: 'phone',   label: 'WhatsApp',            type: 'tel',  placeholder: '+54 9 351...',      required: true },
                    { id: 'clinic',  label: 'Clínica / Consultorio', type: 'text', placeholder: 'Nombre de tu clínica' },
                  ].map(f => (
                    <div key={f.id} className="llm-form-group">
                      <label className="llm-form-label" htmlFor={f.id}>{f.label}</label>
                      <input id={f.id} name={f.id} type={f.type} className="llm-form-input"
                        placeholder={f.placeholder} value={form[f.id]}
                        onChange={handleChange} required={f.required} />
                    </div>
                  ))}
                  <div className="llm-form-group">
                    <label className="llm-form-label" htmlFor="challenge">Principal desafío</label>
                    <select id="challenge" name="challenge" className="llm-form-select"
                      value={form.challenge} onChange={handleChange}>
                      <option value="">Seleccioná una opción</option>
                      <option value="mas_particulares">Quiero más pacientes particulares</option>
                      <option value="implantes">Necesito llenar turnos de implantes</option>
                      <option value="ortodoncia">Quiero crecer en ortodoncia</option>
                      <option value="bruxismo">Quiero más turnos de ATM / bruxismo</option>
                      <option value="agenda">Mi agenda es muy impredecible</option>
                    </select>
                  </div>
                  <motion.button type="submit" className="llm-btn-submit"
                    disabled={status === 'loading'}
                    whileHover={{ scale: status === 'loading' ? 1 : 1.01 }}
                    whileTap={{ scale: 0.98 }}>
                    {status === 'loading' ? 'Enviando...' : 'Quiero más pacientes particulares →'}
                  </motion.button>
                  {status === 'error' && (
                    <p className="llm-form-error" role="alert">
                      Hubo un error. <a href={WA_URL} target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="llm-footer">
        <strong>La Liga de Marketers</strong>
        <p>Córdoba, Argentina · <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">+54 9 351 203-3845</a></p>
      </footer>
    </div>
  );
}
