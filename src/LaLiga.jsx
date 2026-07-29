import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import './LaLiga.css';

const WA_NUMBER = '5493512033845';
const WA_MSG = encodeURIComponent('Hola, quiero saber cómo conseguir más pacientes particulares para mi clínica dental');
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function pushEvent(name, extra = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, event_id: `${name}_${Date.now()}`, ...extra });
}

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const staggerGrid = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const staggerItem  = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function FadeUp({ children, delay = 0, className }) {
  return (
    <motion.div className={className} variants={fadeUp} initial="hidden"
      whileInView="show" viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}>
      {children}
    </motion.div>
  );
}

const TREATMENTS = ['implantes', 'ortodoncia', 'bruxismo y ATM', 'particulares'];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TREATMENTS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="llm-rotating-wrap">
      <AnimatePresence mode="wait">
        <motion.em key={idx}
          initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: -18, filter: 'blur(4px)' }}
          transition={{ duration: 0.38, ease: EASE }}>
          {TREATMENTS[idx]}
        </motion.em>
      </AnimatePresence>
    </span>
  );
}

function CountUp({ to, duration = 2, format = n => n }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(format(0));
  useEffect(() => {
    if (!isInView) return;
    const ctrl = animate(0, to, {
      duration, ease: 'easeOut',
      onUpdate: v => setDisplay(format(Math.round(v))),
    });
    return ctrl.stop;
  }, [isInView, to, duration, format]);
  return <span ref={ref}>{display}</span>;
}

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2.163c5.514 0 9.98 4.466 9.98 9.98 0 5.515-4.466 9.98-9.98 9.98-1.733 0-3.363-.442-4.778-1.218L2 22l1.126-4.118A9.938 9.938 0 012.02 12.143C2.02 6.628 6.486 2.163 12 2.163z"/>
  </svg>
);

// ─── BRAND ICONS ─────────────────────────────────────────────────────────────
const BRAND_ICONS = {
  wordpress: (
    <svg viewBox="0 0 24 24" fill="#21759B" aria-label="WordPress">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM1.215 12c0-1.695.38-3.301 1.057-4.74l5.825 15.96C4.641 21.129 1.215 16.95 1.215 12zM12 22.785c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149A10.76 10.76 0 0112 22.785zm1.481-15.708c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.648-.03 1.234-.1 1.234-.1.584-.075.515-.93-.066-.896 0 0-1.746.138-2.874.138-.201 0-.44-.008-.69-.015A10.78 10.78 0 0112 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.906-11.629zm5.37 14.507l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.027-.78-.07-1.109A10.762 10.762 0 0122.785 12c0 3.979-2.156 7.456-5.363 9.325l.429-.741z"/>
    </svg>
  ),
  googleads: (
    <svg viewBox="0 0 24 24" aria-label="Google Ads">
      <path fill="#4285F4" d="M13.854 5.106l-7.5 12.99a2.998 2.998 0 000 3l.003.005A3 3 0 009.857 22.5h.002a3 3 0 002.597-1.502l7.5-12.99a2.998 2.998 0 000-3A3 3 0 0016.356 3.5a3 3 0 00-2.502 1.606"/>
      <circle fill="#FBBC04" cx="3" cy="18.75" r="2.75"/>
      <circle fill="#34A853" cx="21" cy="5.25" r="2.75"/>
    </svg>
  ),
  gmb: (
    <svg viewBox="0 0 24 24" aria-label="Google My Business">
      <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      <ellipse fill="#4285F433" cx="12" cy="21.5" rx="5" ry="1.5"/>
    </svg>
  ),
  gtm: (
    <svg viewBox="0 0 24 24" aria-label="Google Tag Manager">
      <path fill="#8AB4F8" d="M12.005 0L4.952 7.053 8.01 10.11l1.497-1.497L14.43 3.69a1.058 1.058 0 00-1.496-1.496l-3.32 3.32.937.938L9.056 7.346 12.005 4.4l2.426 2.426-2.426 2.426L9.58 6.807 7.064 9.324l2.946 2.946-4.998 4.998a2.116 2.116 0 000 2.993l2.993 2.993a2.116 2.116 0 002.993 0l7.054-7.053-2.946-2.946 2.946-2.946-3.047-3.047z"/>
      <path fill="#4285F4" d="M9.58 6.808L7.064 9.324l2.946 2.946L7.064 15.216l-4.057 4.057a2.116 2.116 0 000 2.993l2.993 2.993a2.116 2.116 0 002.993 0L12.005 22.2l-2.425-2.425 2.425-2.426-2.425-2.425 2.425-2.426z"/>
    </svg>
  ),
  meta: (
    <svg viewBox="0 0 24 24" fill="#1877F2" aria-label="Meta Ads">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 00.265.86 5.297 5.297 0 00.371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a4.908 4.908 0 001.218-1.408c.22-.351.353-.676.455-.981.156-.467.249-.94.249-1.469 0-2.516-.725-5.31-2.01-7.409-1.154-1.885-2.714-3.053-4.562-3.053-1.243 0-2.456.413-3.59 1.316-.737.587-1.247 1.21-1.992 2.275l-.26.379-.179-.284C10.432 4.764 8.764 4.03 6.915 4.03zm6.674 7.726c.086.139.168.276.254.415l.774 1.286-1.347 2.304c-1.029 1.808-1.498 2.396-1.868 2.763-.514.504-.987.706-1.54.706-1.004 0-1.508-.594-1.925-1.336a4.58 4.58 0 01-.354-.963 5.928 5.928 0 01-.138-1.316c0-2.197.606-4.482 1.636-6.016.648-.979 1.41-1.495 2.14-1.495.87 0 1.69.594 2.44 1.708.28.409.526.856.757 1.312l-.17.285-.659 1.347z"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="#25D366" aria-label="WhatsApp">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.122 1.524 5.858L.052 23.988l6.262-1.474A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.805a9.8 9.8 0 01-5.027-1.383l-.362-.213-3.712.875.892-3.619-.236-.373A9.8 9.8 0 012.195 12C2.195 6.59 6.59 2.195 12 2.195c5.41 0 9.805 4.394 9.805 9.805S17.41 21.805 12 21.805z"/>
    </svg>
  ),
};



const PAIN_ITEMS = [
  { label: 'Agenda impredecible',      desc: 'No sabés cuántos pacientes tenés el mes que viene. Dependés del boca en boca y de lo que manda la obra social.' },
  { label: 'Más obra social que caja', desc: 'Trabajás el doble por la mitad del ingreso. Los pacientes particulares existen y tienen capacidad de pago, pero no te encuentran.' },
  { label: 'Alto valor sin demanda',   desc: 'Hacés implantes, ortodoncia y bruxismo/ATM, pero esos turnos no se llenan. El problema no es tu calidad: es que nadie sabe que los ofrecés.' },
];

const ECOSYSTEM_SI = [
  { brand: 'wordpress', title: 'Página web WordPress',  desc: '3 landing pages de alto valor: Implantes, Ortodoncia y ATM/Bruxismo.' },
  { brand: 'googleads', title: 'Google Ads',            desc: 'Campañas de búsqueda para pacientes que ya están buscando tratamientos.' },
  { brand: 'gmb',       title: 'Google My Business',    desc: 'Aparición en mapas y búsquedas locales en Córdoba.' },
  { brand: 'gtm',       title: 'GTM + GA4',             desc: 'Medición completa de eventos, conversiones y comportamiento.' },
  { brand: 'meta',      title: 'Meta Ads',              desc: 'Campañas en Facebook e Instagram segmentadas por zona y perfil.' },
  { brand: 'whatsapp',  title: 'WhatsApp Business',     desc: 'Vinculado y configurado con flujo de atención desde el día 1.' },
];

const ECOSYSTEM_NO = [
  'Community management / publicaciones orgánicas',
  'Diseño de marca o logo',
  'SEO orgánico',
];

const TIMELINE = [
  {
    mes: 'Mes 1',
    titulo: 'Setup completo',
    tipo: 'semanas',
    items: [
      { label: 'Semana 1', desc: 'Reunión de arranque, recolección de accesos y brief del consultorio.' },
      { label: 'Semana 2', desc: 'Web nueva + 3 landings + tracking instalado + ecosistema Meta configurado.' },
      { label: 'Semana 3', desc: 'Google Ads + Meta Ads en vivo — primeras consultas llegando.' },
      { label: 'Semana 4', desc: 'Primera evaluación de datos y ajustes.' },
    ],
  },
  {
    mes: 'Mes 2',
    titulo: 'Optimización',
    tipo: 'lista',
    items: [
      'Optimización semanal de campañas.',
      'Ajuste de palabras clave y creativos.',
      'Reunión de 15–30 min cada viernes.',
      'Reporte mensual: leads, turnos agendados, costo por paciente.',
    ],
  },
  {
    mes: 'Mes 3',
    titulo: 'Evaluación y decisión',
    tipo: 'lista',
    meta: true,
    items: [
      'Evaluación completa de los 3 meses.',
      'Meta: 20 turnos agendados por mes de pacientes calificados.',
      'Decisión de continuidad basada en datos reales.',
    ],
  },
];

const KPIS = [
  { num: '01', label: 'Leads capturados',     desc: 'Formulario + WhatsApp. Todo lo que entra, medido.' },
  { num: '02', label: 'Turnos agendados',      desc: 'La métrica que más le importa a tu clínica.' },
  { num: '03', label: 'CPL',                   desc: 'Costo por lead calificado, mes a mes.' },
  { num: '04', label: 'Tasa de conversión',    desc: 'Leads → turnos. CTR ideal entre 3% y 5%.' },
];

const BEYOND_ITEMS = [
  { title: 'Financiación para el paciente',         desc: 'Cuotas propias para ortodoncia, bancaria para implantes y ATM. Cuando el paciente puede pagar en cuotas, el "no tengo presupuesto" desaparece.' },
  { title: 'CRM y seguimiento de consultas',        desc: 'Un sistema simple para que ningún lead se pierda. Desde la primera consulta hasta el turno confirmado, todo rastreado.' },
  { title: 'Scripts de FAQ y manejo de objeciones', desc: 'Flujos de respuesta para WhatsApp y para el consultorio. Respondemos las dudas antes de que el paciente se vaya a pensar.' },
  { title: 'Oferta comercial clara por tratamiento',desc: 'Materiales, proceso clínico, tiempos y precio para implantes, ortodoncia y ATM. El paciente particular necesita entender qué está pagando.' },
];

const AGENDA_BEFORE = [
  { time: '09:00', text: 'Obra Social', type: 'os' },
  { time: '10:00', text: 'Obra Social', type: 'os' },
  { time: '11:00', text: 'Sin turno',   type: 'empty' },
  { time: '12:00', text: 'Obra Social', type: 'os' },
  { time: '14:00', text: 'Obra Social', type: 'os' },
  { time: '15:00', text: 'Sin turno',   type: 'empty' },
];

const AGENDA_AFTER = [
  { time: '09:00', text: 'Implante · Particular',   type: 'high' },
  { time: '10:00', text: 'Ortodoncia · Particular', type: 'high' },
  { time: '11:00', text: 'ATM / Bruxismo · Part.',  type: 'high' },
  { time: '12:00', text: 'Blanqueamiento · Part.',  type: 'part' },
  { time: '14:00', text: 'Implante · Particular',   type: 'high' },
  { time: '15:00', text: 'Consulta · Particular',   type: 'part' },
];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function LaLiga() {
  const [form, setForm] = useState({ name: '', phone: '', clinic: '', challenge: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const msg = encodeURIComponent(
      `Hola, soy ${form.name}${form.clinic ? ` de ${form.clinic}` : ''}. Mi WhatsApp es ${form.phone}.${form.challenge ? ` Desafío: ${form.challenge}.` : ''}`
    );
    pushEvent('lead_form_submit', { user_name: form.name, lead_source: 'landing_dental' });
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <div className="llm">

      {/* ── NAV ── */}
      <motion.nav className="llm-nav" role="navigation"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}>
        <a href="/" className="llm-logo">La Liga de Marketers</a>
        <ul className="llm-nav-links">
          <li><a href="#resultados">Resultados</a></li>
          <li><a href="#proceso">Proceso</a></li>
          <li><a href="#garantia">Garantía</a></li>
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
              Llenamos tu agenda<br />
              de <RotatingWord />
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

          <motion.div className="llm-agenda"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>
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
          <FadeUp><p className="llm-sec-label llm-label-light">Resultados reales — Julio 2026</p></FadeUp>
          <FadeUp delay={0.08}><h2 className="llm-h2 llm-h2-light">Clínicas dentales activas en Córdoba</h2></FadeUp>

          <motion.div className="llm-metrics-grid"
            variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {[
              { to: 685,   label: 'pacientes potenciales generados',        format: n => n.toLocaleString('es-AR') },
              { to: 28,    label: 'turnos confirmados',                      format: n => String(n) },
              { to: 415,   label: 'tasa de conversión lead → turno',         format: n => (n / 100).toFixed(2).replace('.', ',') + '%' },
              { to: 15000, label: 'costo por turno de tratamiento especial', format: n => '$' + n.toLocaleString('es-AR') },
            ].map((m, i) => (
              <motion.div key={i} className="llm-metric-card" variants={staggerItem}>
                <span className="llm-metric-num"><CountUp to={m.to} duration={2} format={m.format} /></span>
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
            <p className="llm-metrics-note">Inversión total: $452.988 ARS · Resultados de clínicas con sistema completo activo</p>
          </FadeUp>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="llm-pains" id="problemas">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">El problema que no se nombra</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">¿Te identificás con alguno de estos escenarios?</h2></FadeUp>
          <motion.div className="llm-pain-grid" variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {PAIN_ITEMS.map((p, i) => (
              <motion.div key={i} className="llm-pain-card" variants={staggerItem}
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
          <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE }}>
            <p className="llm-sec-label">La objeción más común</p>
            <h2 className="llm-h2">"¿Y si gasto plata<br />y no funciona?"</h2>
            <p className="llm-body">Es la pregunta que más escuchamos. Y tiene sentido: nadie quiere invertir sin certeza.</p>
            <p className="llm-body">Pero miralo así: un implante en Córdoba hoy sale arriba del millón de pesos. El costo por turno de tratamiento especial que logramos es de <strong>$15.000</strong>.</p>
            <p className="llm-body">Eso no es un gasto. Es una palanca con retorno de más de 66x.</p>
            <p className="llm-body">Y si algo no funciona, lo sabemos antes que vos. Porque tenemos los números en tiempo real y ajustamos en el momento.</p>
          </motion.div>
          <motion.div className="llm-roi-card"
            initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE }}>
            <p className="llm-roi-card-title">Ejemplo de retorno — Julio 2026</p>
            <div className="llm-roi-row">
              <span>Costo por turno tratamiento especial</span><span className="llm-roi-val">$15.000</span>
            </div>
            <div className="llm-roi-row">
              <span>Ingreso promedio por implante</span><span className="llm-roi-val">+$1.000.000</span>
            </div>
            <div className="llm-roi-divider" />
            <div className="llm-roi-row llm-roi-result">
              <span>Retorno por turno cerrado</span>
              <motion.span className="llm-roi-highlight"
                initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3, ease: EASE }}>
                +66x
              </motion.span>
            </div>
            <p className="llm-roi-note">* Datos reales de julio 2026. El retorno varía según la tasa de cierre de cada clínica.</p>
          </motion.div>
        </div>
      </section>

      {/* ── ECOSISTEMA ── */}
      <section className="llm-ecosystem" id="proceso">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">Lo que armamos para tu clínica</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">Un ecosistema digital completo,<br />no campañas sueltas</h2></FadeUp>

          <motion.div className="llm-ecosystem-grid" variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {ECOSYSTEM_SI.map((s, i) => (
              <motion.div key={i} className="llm-eco-card" variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <div className="llm-eco-check" aria-hidden="true">
                  {BRAND_ICONS[s.brand]}
                </div>
                <div>
                  <p className="llm-eco-title">{s.title}</p>
                  <p className="llm-eco-desc">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <FadeUp delay={0.1}>
            <div className="llm-ecosystem-no">
              <p className="llm-eco-no-label">Esto NO incluye el servicio</p>
              <ul className="llm-eco-no-list">
                {ECOSYSTEM_NO.map((item, i) => (
                  <li key={i}><span aria-hidden="true">✕</span>{item}</li>
                ))}
              </ul>
              <p className="llm-eco-no-note">
                Ser claros en esto evita malentendidos y nos permite hacer bien lo que hacemos.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="llm-timeline" id="timeline">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">El proceso mes a mes</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">Sabés exactamente qué pasa<br />en cada etapa</h2></FadeUp>

          <div className="llm-timeline-track">
            {TIMELINE.map((mes, mi) => (
              <motion.div key={mi} className={`llm-tl-mes${mes.meta ? ' llm-tl-meta' : ''}`}
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: mi * 0.12, ease: EASE }}>
                <div className="llm-tl-header">
                  <span className="llm-tl-mes-label">{mes.mes}</span>
                  <span className="llm-tl-titulo">{mes.titulo}</span>
                  {mes.meta && <span className="llm-tl-badge">Meta: 20 turnos/mes</span>}
                </div>
                <div className="llm-tl-body">
                  {mes.tipo === 'semanas'
                    ? mes.items.map((s, si) => (
                        <div key={si} className="llm-tl-semana">
                          <span className="llm-tl-semana-label">{s.label}</span>
                          <span className="llm-tl-semana-desc">{s.desc}</span>
                        </div>
                      ))
                    : mes.items.map((item, ii) => (
                        <div key={ii} className="llm-tl-item">
                          <span className="llm-tl-dot" aria-hidden="true" />
                          <span>{item}</span>
                        </div>
                      ))
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KPIs ── */}
      <section className="llm-kpis">
        <div className="llm-container">
          <FadeUp><p className="llm-sec-label">Lo que medimos cada mes</p></FadeUp>
          <FadeUp delay={0.06}><h2 className="llm-h2">Métricas que le importan<br />a tu negocio, no al nuestro</h2></FadeUp>

          <motion.div className="llm-kpi-grid" variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {KPIS.map((k, i) => (
              <motion.div key={i} className="llm-kpi-card" variants={staggerItem}>
                <span className="llm-kpi-num">{k.num}</span>
                <h3 className="llm-kpi-label">{k.label}</h3>
                <p className="llm-kpi-desc">{k.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GARANTÍA ── */}
      <section className="llm-garantia" id="garantia">
        <div className="llm-container">
          <motion.div className="llm-garantia-card"
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE }}>
            <p className="llm-garantia-label">Nuestra garantía</p>
            <h2 className="llm-garantia-titulo">
              Si al mes 3 no llegamos<br />a 20 turnos agendados,<br />
              <em>el mes 4 no se cobra.</em>
            </h2>
            <p className="llm-garantia-desc">
              Nos comprometemos con un resultado concreto: 20 turnos mensuales de pacientes calificados.
              Si no lo alcanzamos en los 3 primeros meses, el cuarto mes de servicio es sin costo.
            </p>
            <div className="llm-garantia-divider" />
            <p className="llm-garantia-aclaracion">
              <strong>Una aclaración importante:</strong> nosotros traemos el paciente calificado.
              Que agende y se trate depende de cómo los atienden en la clínica.
              Por eso trabajamos juntos el flujo de atención desde el día 1.
            </p>
            <motion.a href={WA_URL} target="_blank" rel="noreferrer"
              className="llm-btn-wa llm-garantia-cta"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => pushEvent('wa_click', { location: 'garantia' })}>
              <WhatsAppIcon /> Quiero empezar
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── MÁS QUE CAMPAÑAS ── */}
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
          <motion.div className="llm-beyond-grid" variants={staggerGrid} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            {BEYOND_ITEMS.map((b, i) => (
              <motion.div key={i} className="llm-beyond-card" variants={staggerItem}
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
                className="llm-wa-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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
                    { id: 'name',   label: 'Tu nombre',            type: 'text', placeholder: 'Dr. / Dra. nombre', required: true },
                    { id: 'phone',  label: 'WhatsApp',             type: 'tel',  placeholder: '+54 9 351...',      required: true },
                    { id: 'clinic', label: 'Clínica / Consultorio', type: 'text', placeholder: 'Nombre de tu clínica' },
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