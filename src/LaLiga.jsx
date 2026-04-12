import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Users, CheckCircle, XCircle, Send, X, Calendar, MessageCircle } from "lucide-react";

const WA_NUMBER = "5493512033845";
const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbzWVSlY5FhpXy6n9eueLheNUvvFsKloqPnPOYca84mhnIn13KvBeZqN_OGxjifO_Uj3/exec";
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const GCAL_URL = "https://calendar.app.google/fMT32F18mFNct2Bg6";

/* ── REACT BITS COMPONENTS ── */
function BlurText({ text, delay = 40, direction = "top", threshold = 0 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.28em",
          opacity: inView ? 1 : 0, filter: inView ? "blur(0)" : "blur(10px)",
          transform: inView ? "translateY(0)" : direction === "top" ? "translateY(-18px)" : "translateY(18px)",
          transition: `opacity 0.6s ease ${i * delay}ms, filter 0.6s ease ${i * delay}ms, transform 0.6s ease ${i * delay}ms`
        }}>{w}</span>
      ))}
    </span>
  );
}

function SplitText({ text, delay = 35 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    setInView(false);
    const t = setTimeout(() => setInView(true), 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <span ref={ref} aria-label={text} style={{ display: "inline-block" }}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden style={{
          display: "inline-block",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(-40px)",
          transition: `opacity 0.5s ease ${i * delay}ms, transform 0.5s ease ${i * delay}ms`,
          whiteSpace: ch === " " ? "pre" : "normal",
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
        }}>{ch}</span>
      ))}
    </span>
  );
}

function CountUp({ end, duration = 2200 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const num = parseFloat(String(end).replace(/[^0-9.]/g, "")) || 0;
    const t0 = performance.now();
    const frame = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) requestAnimationFrame(frame); else setVal(num);
    };
    requestAnimationFrame(frame);
  }, [started, end, duration]);
  const prefix = String(end).startsWith("+") ? "+" : "";
  return <span ref={ref}>{prefix}{val}</span>;
}

function ScrollReveal({ children, direction = "up", delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const map = { up: "translateY(48px)", down: "translateY(-48px)", left: "translateX(-48px)", right: "translateX(48px)" };
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : map[direction], transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function Aurora() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let raf, t = 0;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const colors = ["#7c3aed", "#db2777", "#4f46e5"];
    const animate = () => {
      t += 0.004; ctx.clearRect(0, 0, c.width, c.height);
      colors.forEach((col, i) => {
        const g = ctx.createRadialGradient(
          c.width * (0.2 + i * 0.3 + Math.sin(t + i) * 0.15), c.height * (0.3 + Math.cos(t * 0.7 + i) * 0.2), 0,
          c.width * 0.5, c.height * 0.5, c.width * 0.65);
        g.addColorStop(0, col + "50"); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 50 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.8 + 0.5, c: ["#7c3aed","#db2777","#a855f7"][Math.floor(Math.random()*3)] }));
    const animate = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + "80"; ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function StarBorder({ children, onClick, color = "#a855f7", speed = "3s", size = "md" }) {
  const pads = { sm: { padding: "8px 18px", fontSize: 13 }, md: { padding: "14px 32px", fontSize: 15, fontWeight: 700 }, lg: { padding: "18px 40px", fontSize: 17, fontWeight: 700 } };
  return (
    <button onClick={onClick} style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "linear-gradient(135deg,#1e1b4b,#0a0a14)", color: "#fff", border: "1px solid rgba(139,92,246,0.3)", transition: "transform 0.2s", ...pads[size] }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: `conic-gradient(from var(--a,0deg),transparent 75%,${color} 80%,transparent 85%)`, animation: `spin ${speed} linear infinite`, WebkitMask: "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 1 }} />
      <style>{`@keyframes spin{to{--a:360deg}}@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}`}</style>
      {children}
    </button>
  );
}

/* ── LEAD FORM MODAL ── */
function LeadModal({ onClose }) {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));
const submit = async () => {
    if (!form.nombre || !form.email) return;
    
    // 1. Track Meta Pixel (Client-Side)
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        value: 0,
        currency: 'ARS'
      });
    }
    
    // 2. Track Google Analytics Lead Event
    if (window.gtag) {
      window.gtag('event', 'generate_lead', {
        currency: 'ARS',
        value: 0
      });
    }
    
    // 3. Track Meta Conversion API (Server-Side)
    const trackConversionAPI = async () => {
      try {
        const userData = {
          em: form.email ? btoa(form.email.toLowerCase()).toString() : null,
          fn: form.nombre ? btoa(form.nombre.toLowerCase().split(' ')[0]).toString() : null,
          ln: form.nombre ? btoa(form.nombre.toLowerCase().split(' ').pop()).toString() : null
        };
        
        await fetch('https://graph.facebook.com/v18.0/1265283559068729/events?access_token=EAASokIySZBvwBRNqsBZBnVtx44PEMsHWxLwxGZAZC4AgumGnKAsvy4iydKXOdZATMj5D5CbXecLE182bZALTE29qdztuhyAjczSHNwy2p3OxalLsQYzpOgZCzrZCGnJ305Qvib4wD1hwyuAkRRczY3TNFHAdHZAk29NQrKl2srRrE3YLEnPiCln4l8IFYid2jVwZDZD', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              user_data: userData,
              custom_data: {
                currency: 'ARS',
                value: 0
              }
            }]
          })
        });
      } catch (err) {
        console.error('Conversion API error:', err);
      }
    };
    
    // Ejecutar tracking
    await trackConversionAPI();
    
    // Pequeño delay para que registren los eventos
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 4. Guardar en Google Sheets
    try {
      await fetch(SHEETS_WEBHOOK, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fuente: "Landing Page" })
      });
    } catch (err) {
      console.error("Sheets error:", err);
    }
    
    // 5. Abrir WhatsApp con datos pre-cargados
    const msg = encodeURIComponent(`Hola La Liga! 👋\n\nSoy *${form.nombre}*\nEmail: ${form.email}\n\n${form.mensaje || "Me interesa una consulta gratuita."}`);
    window.open(`${WA_BASE}?text=${msg}`, "_blank");
    setSent(true);
};
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div style={{ position: "relative", width: "100%", maxWidth: 480, borderRadius: 24, background: "linear-gradient(135deg,#0f0e1f,#0a0a14)", border: "1px solid rgba(139,92,246,0.3)", padding: 40, boxShadow: "0 40px 80px rgba(109,40,217,0.3)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(139,92,246,0.15)", border: "none", borderRadius: 8, color: "#a855f7", cursor: "pointer", padding: "6px 8px", display: "flex" }}>
          <X size={18} />
        </button>
        {!sent ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, letterSpacing: 3, color: "#a855f7", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>Consulta Gratuita</p>
              <h3 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: 0 }}>Hablemos de tu negocio</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>Sin compromiso · 30 minutos · Respuesta en 2hs</p>
            </div>
            {[
              { key: "nombre", label: "Tu nombre *", placeholder: "Juan García", type: "text" },
              { key: "email", label: "Email *", placeholder: "juan@empresa.com", type: "email" },
              { key: "mensaje", label: "¿Qué necesitás?", placeholder: "Contanos sobre tu negocio...", type: "textarea" }
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 6 }}>{f.label}</label>
                {f.type === "textarea"
                  ? <textarea value={form[f.key]} onChange={e => handle(f.key, e.target.value)} placeholder={f.placeholder} rows={3}
                      style={{ width: "100%", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  : <input type={f.type} value={form[f.key]} onChange={e => handle(f.key, e.target.value)} placeholder={f.placeholder}
                      style={{ width: "100%", background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />}
              </div>
            ))}
            <button onClick={submit} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
              <MessageCircle size={18} /> Enviar por WhatsApp
            </button>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ color: "#475569", fontSize: 13 }}>o preferís </span>
              <a href={GCAL_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#a855f7", fontSize: 13, fontWeight: 600 }}>agendar en Google Calendar →</a>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 8 }}>¡WhatsApp abierto!</h3>
            <p style={{ color: "#94a3b8" }}>Enviá el mensaje y te respondemos en menos de 2hs hábiles.</p>
            <button onClick={onClose} style={{ marginTop: 24, padding: "10px 28px", borderRadius: 10, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", color: "#a855f7", cursor: "pointer", fontWeight: 700 }}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function LaLiga() {
  const [activeCase, setActiveCase] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const grad = "linear-gradient(135deg,#7c3aed,#ec4899)";
  const gText = { background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" };

  const featuredCases = [
    { name: "Zoomin Groomin", category: "Peluquería Mascotas", metric: "+567%", description: "De 30 a 200 leads calificados en 3 meses", author: "Joaquín M.", quote: "Habian pasado por varios profesionales. Los chicos entendieron el negocio perfecto. Se notó profesionalidad desde el primer día." },
    { name: "Gluten Free Shop", category: "E-commerce Alimentos", metric: "160 ventas", description: "De 0 a 160 ventas mensuales en 3 meses", author: "Marcos Q.", quote: "El trabajo fue impresionante. Vimos la potencia que tiene vender por internet. Confiamos 100% en ellos." },
    { name: "Farmaquiero", category: "E-commerce Farmacéutico", metric: "600 ventas", description: "De 0 a 600 ventas mensuales en 12 meses", author: "Sebastián R.", quote: "Lo contratamos por su pasión y dedicación. Se adaptó 100% a la necesidad." }
  ];

  const allCases = [
    { name: "Zoomin Groomin", metric: "+567% leads", type: "Servicios", year: 2023, icon: "🎯" },
    { name: "Gluten Free Shop", metric: "160 ventas/mes", type: "E-commerce", year: 2023, icon: "🍃" },
    { name: "Farmaquiero", metric: "600 ventas/mes", type: "Farmacéutico", year: 2023, icon: "💊" },
    { name: "Tienda Vanesa", metric: "120 ventas/mes", type: "Retail", year: 2018, icon: "🛍️" },
    { name: "Kuda Rose", metric: "+100 ventas/mes", type: "Indumentaria", year: 2019, icon: "👗" },
    { name: "Colibri Chic", metric: "+Facturación", type: "Local Físico", year: 2024, icon: "✨" },
    { name: "Welter IMW", metric: "#1 Posición", type: "B2B", year: 2025, icon: "⚙️" },
    { name: "Librería Patán", metric: "+Visibilidad", type: "Servicios", year: 2025, icon: "📚" }
  ];

  const stats = [
    { number: "8", label: "Negocios Transformados" },
    { number: "567", label: "% Máx. Crecimiento" },
    { number: "65", label: "% Tasa Conversión" },
    { number: "5", label: "Años de Trayectoria" }
  ];

  const services = [
    { title: "Community Manager", icon: "📱", desc: "Contenido que conecta y convierte" },
    { title: "Meta & Google Ads", icon: "🎯", desc: "Campañas que generan ROI real" },
    { title: "E-commerce", icon: "🛍️", desc: "Tiendas que venden solas" },
    { title: "Google Mi Negocio", icon: "📍", desc: "Visibilidad local dominante" },
    { title: "CRM", icon: "⚙️", desc: "Automatización de ventas" },
    { title: "Diseño Gráfico", icon: "🎨", desc: "Identidad que impacta" }
  ];

  const steps = [
    { num: "01", title: "Auditoría Profunda", desc: "Analizamos tu negocio sin asumir nada. Entrevistamos, investigamos, entendemos." },
    { num: "02", title: "Definir KPI Real", desc: "¿Ventas? ¿Leads? Juntos definimos lo que realmente importa medir." },
    { num: "03", title: "Estrategia Personal", desc: "Diseño específico para ti, sin templates genéricos ni estrategias copiadas." },
    { num: "04", title: "Ejecución + Testing", desc: "Implementamos, testeamos y optimizamos con datos reales del mercado." },
    { num: "05", title: "Reportes Claros", desc: "Cada semana: progreso hacia el KPI. Sin números que no importan." }
  ];

  const team = [
    {
      name: "Lucas Cabrera", role: "eCommerce & Growth Strategy",
      tags: ["VTEX", "Meta & Google Ads", "Data & BI", "Automatización"],
      bio: "Project Manager eCommerce con foco en crecimiento, rentabilidad y escalabilidad. Lideró el canal B2C de Farmaquiero con facturación de $50M ARS/mes, triplicando la conversión (0,4% → 1,2%) y aumentando el ticket promedio un 66%. Especialista en VTEX, n8n y Power BI.",
      photo: "/imagenes/Lucas.jpg.png",
      grad: "linear-gradient(135deg,#3b82f6,#7c3aed)",
      linkedin: "https://www.linkedin.com/in/lucas-ignacio-cabrera-03bb67140/",
      stats: [{ v: "3x", l: "Conversión" }, { v: "+66%", l: "Ticket" }, { v: "$50M", l: "ARS/mes" }]
    },
    {
      name: "Mariel Calvet", role: "Marketing Strategist & Digital Growth",
      tags: ["Meta Ads", "Google Ads", "Branding", "Contenido"],
      bio: "Especialista en marketing digital con foco en resultados tangibles. Lidera el área de Marketing en FOTOPOINT y acompaña PyMEs a escalar su presencia digital: desde identidad de marca y contenido social hasta campañas de performance y expansión omnicanal.",
      photo: "/imagenes/Mariel.jpg.png",
      grad: "linear-gradient(135deg,#ec4899,#7c3aed)",
      linkedin: "https://www.linkedin.com/in/mariel-calvet-334532260/",
      stats: [{ v: "Meta", l: "& Google Ads" }, { v: "PyMEs", l: "Especialista" }, { v: "Omni", l: "Canal" }]
    }
  ];

  const card = (style = {}) => ({
    borderRadius: 20, border: "1px solid rgba(139,92,246,0.2)",
    background: "linear-gradient(135deg,rgba(20,18,50,0.6),rgba(0,0,0,0.35))",
    backdropFilter: "blur(8px)", ...style
  });

  return (
    <div style={{ minHeight: "100vh", background: "#050508", color: "#fff", overflowX: "hidden", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, backdropFilter: "blur(20px)", background: scrolled ? "rgba(5,5,8,0.95)" : "transparent", borderBottom: scrolled ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent", transition: "all 0.4s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", padding: 2 }}>
              <img src="/imagenes/isologo.jpg.png" alt="La Liga" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, ...gText }}>LA LIGA</div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1 }}>DE MARKETERS</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => window.open(GCAL_URL, "_blank")}
              style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} /> Agendar
            </button>
            <StarBorder size="sm" onClick={() => setShowModal(true)}>
              Consulta Gratis
            </StarBorder>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", paddingTop: 140, paddingBottom: 100, paddingLeft: 24, paddingRight: 24, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}><Aurora /><Particles /></div>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <ScrollReveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 999, padding: "8px 20px", marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 13, color: "#c4b5fd" }}>Agencia de Marketing Digital — Córdoba, Argentina</span>
            </div>
          </ScrollReveal>
          <h1 style={{ fontSize: "clamp(52px,8vw,96px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-2px" }}>
            <div style={{ color: "#e2e8f0" }}><BlurText text="Somos el equipo" delay={60} /></div>
            <div style={{ display: "block" }}><SplitText text="QUE GENERA" delay={40} /></div>
            <div style={{ color: "#cbd5e1" }}><BlurText text="resultados reales" delay={50} direction="bottom" /></div>
          </h1>
          <ScrollReveal delay={200}>
            <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
              8 negocios transformados. De 0 a 600 ventas mensuales. Estrategia, ejecución y <strong style={{ color: "#c4b5fd" }}>resultados medibles.</strong>
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 64 }}>
  <StarBorder size="md" onClick={() => setShowModal(true)}>
    📋 Consulta Gratuita <ArrowUpRight size={18} />
  </StarBorder>
  <button onClick={() => window.open(GCAL_URL, "_blank")}
    style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid rgba(139,92,246,0.4)", background: "rgba(109,40,217,0.1)", color: "#c4b5fd", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.7)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"}>
    <Calendar size={18} /> Agendar Reunión
  </button>
  <button onClick={() => window.location.href = "/diagnostico"}
    style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid rgba(34,197,94,0.4)", background: "rgba(34,197,94,0.1)", color: "#86efac", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(34,197,94,0.7)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"}>
    🔍 Diagnóstico Gratis
  </button>
</div>
          </ScrollReveal>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, maxWidth: 680, margin: "0 auto" }}>
            {stats.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 90}>
                <div style={{ ...card(), padding: 24, cursor: "default", transition: "border-color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"}>
                  <div style={{ fontSize: 30, fontWeight: 900, ...gText, marginBottom: 4 }}>
                    <CountUp end={s.number} />
                    {s.label.includes("%") && s.number !== "65" ? "" : ""}
                  </div>
                  <p style={{ fontSize: 12, color: "#64748b" }}>{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASOS DESTACADOS ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 12, letterSpacing: 4, color: "#a855f7", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Casos de Éxito</p>
              <h2 style={{ fontSize: "clamp(36px,6vw,68px)", fontWeight: 900 }}>
                <span style={{ color: "#cbd5e1" }}>Nuestros Mayores </span><span style={gText}>IMPACTOS</span>
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {featuredCases.map((c, i) => {
              const isActive = activeCase === i;
              return (
                <ScrollReveal key={i} direction="up" delay={i * 100}>
                  <div onClick={() => setActiveCase(i)} style={{ ...card({ cursor: "pointer", height: 380, padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", transition: "all 0.3s", boxShadow: isActive ? "0 0 0 2px rgba(168,85,247,0.5)" : "none", transform: isActive ? "scale(1.02)" : "scale(1)" }), }}
                    onMouseMove={e => {
                      const r = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
                      e.currentTarget.style.transform = `perspective(600px) rotateY(${x*7}deg) rotateX(${-y*7}deg) scale(1.02)`;
                    }}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(109,40,217,0.2),rgba(219,39,119,0.15))" }} />
                    <div style={{ position: "relative" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#a855f7", textTransform: "uppercase", marginBottom: 8 }}>{c.category}</div>
                      <h3 style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{c.name}</h3>
                    </div>
                    <div style={{ position: "relative" }}>
                      <div style={{ fontSize: 48, fontWeight: 900, ...gText, marginBottom: 8 }}>{c.metric}</div>
                      <p style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 12 }}>{c.description}</p>
                      <p style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 12, borderLeft: "2px solid #7c3aed", paddingLeft: 12, marginBottom: 8 }}>"{c.quote}"</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#a855f7" }}>{c.author}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GRID CASOS ── */}
      {/* ── NUESTROS CLIENTES ── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(109,40,217,0.12)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900 }}>
                <span style={{ color: "#cbd5e1" }}>Todos los </span><span style={gText}>CASOS REALES</span>
              </h2>
              <p style={{ color: "#475569", marginTop: 10 }}>Diversidad de industrias, mismo resultado: crecimiento medible</p>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14 }}>
            {allCases.map((c, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 50}>
                <div style={{ ...card({ padding: 22, cursor: "pointer", transition: "all 0.3s", position: "relative" }) }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontSize: 11, color: "#a855f7", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>{c.type}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{c.name}</h3>
                  <div style={{ fontSize: 20, fontWeight: 900, ...gText, marginBottom: 4 }}>{c.metric}</div>
                  <span style={{ fontSize: 11, color: "#334155" }}>{c.year}</span>
                  <ArrowUpRight size={16} style={{ position: "absolute", bottom: 14, right: 14, color: "rgba(168,85,247,0.3)" }} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── METODOLOGÍA ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(109,40,217,0.12)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ fontSize: 12, letterSpacing: 4, color: "#a855f7", fontWeight: 700, textTransform: "uppercase", marginBottom: 10 }}>Cómo trabajamos</p>
              <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900 }}>
                <span style={{ color: "#cbd5e1" }}>Nuestra </span><span style={gText}>METODOLOGÍA</span>
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
            {steps.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 90}>
                <div style={{ ...card({ flex: "1 1 190px", maxWidth: 210, padding: 26 }) }}>
                  <div style={{ fontSize: 44, fontWeight: 900, ...gText, opacity: 0.35, marginBottom: 14 }}>{s.num}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900 }}>
                <span style={{ color: "#cbd5e1" }}>Herramientas que </span><span style={gText}>UTILIZAMOS</span>
              </h2>
              <p style={{ color: "#475569", maxWidth: 520, margin: "12px auto 0", fontSize: 15 }}>
                Lo que nos diferencia es saber exactamente qué hacer con cada una.
              </p>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
            {services.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 70}>
                <div style={{ ...card({ padding: 30, cursor: "pointer", transition: "all 0.3s" }) }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.5)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(109,40,217,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: 38, marginBottom: 14 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "#e2e8f0", marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: "#475569" }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(109,40,217,0.12)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900 }}>
                <span style={{ color: "#cbd5e1" }}>Los integrantes de </span><span style={gText}>LA LIGA</span>
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 32, marginBottom: 40 }}>
            {team.map((p, i) => (
              <ScrollReveal key={i} direction={i === 0 ? "left" : "right"} delay={i * 120}>
                <div style={{ ...card({ overflow: "hidden" }) }}>
                  <div style={{ position: "relative", height: 300 }}>
                    <div style={{ position: "absolute", inset: 0, background: p.grad, opacity: 0.2 }} />
                    <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                      onError={e => { e.target.style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(5,5,8,1) 0%,rgba(5,5,8,0.3) 50%,transparent 100%)" }} />
                    <a href={p.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ position: "absolute", top: 14, right: 14, background: "rgba(10,102,194,0.85)", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
                      in LinkedIn
                    </a>
                  </div>
                  <div style={{ padding: 26 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{p.name}</h3>
                    <p style={{ color: "#a855f7", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>{p.role}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {p.tags.map((t, ti) => (
                        <span key={ti} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#c4b5fd" }}>{t}</span>
                      ))}
                    </div>
                    <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 13, marginBottom: 18 }}>{p.bio}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, borderTop: "1px solid rgba(139,92,246,0.12)", paddingTop: 18 }}>
                      {p.stats.map((s, si) => (
                        <div key={si} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 16, fontWeight: 900, background: p.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.v}</div>
                          <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div style={{ ...card({ padding: 36, textAlign: "center" }) }}>
              <Users style={{ color: "#a855f7", margin: "0 auto 14px" }} size={36} />
              <p style={{ fontSize: 17, color: "#94a3b8", lineHeight: 1.8, maxWidth: 580, margin: "0 auto" }}>
                Llevamos años en marketing digital. Entendemos que detrás de cada número hay gente que depende de eso. <strong style={{ color: "#c4b5fd" }}>Por eso trabajamos unidos por un solo objetivo: tu crecimiento.</strong>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── POR QUÉ LA LIGA ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(109,40,217,0.12)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <ScrollReveal>
            <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 900, textAlign: "center", marginBottom: 56 }}>
              <span style={{ color: "#cbd5e1" }}>¿Por qué </span><span style={gText}>LA LIGA?</span>
            </h2>
          </ScrollReveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
            <ScrollReveal direction="left">
              <div style={{ padding: 32, borderRadius: 20, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f87171", marginBottom: 20 }}>❌ La mayoría de agencias...</h3>
                {["Venden horas, no resultados", "No entienden tu modelo de negocio", "Reportes bonitos con métricas vacías", "\"Crecimiento\" que no se traduce en dinero"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, color: "#94a3b8", fontSize: 14, alignItems: "flex-start" }}>
                    <XCircle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />{item}
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={100}>
              <div style={{ padding: 32, borderRadius: 20, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#4ade80", marginBottom: 20 }}>✓ La Liga...</h3>
                {["Entendemos tu negocio PRIMERO", "Definimos el KPI real juntos", "Solo reportamos lo que importa", "8 casos reales que lo prueban"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, color: "#94a3b8", fontSize: 14, alignItems: "flex-start" }}>
                    <CheckCircle size={16} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />{item}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}><Aurora /></div>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <ScrollReveal>
            <h2 style={{ fontSize: "clamp(44px,8vw,88px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 20, letterSpacing: "-2px" }}>
              <span style={{ color: "#e2e8f0" }}>¿Listo para </span>
              <span style={{ ...gText, display: "block" }}>RESULTADOS?</span>
            </h2>
            <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 44, lineHeight: 1.7 }}>
              30 minutos de consulta gratuita. Sin compromiso. Solo conversación honesta sobre tu negocio.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
              <StarBorder color="#ec4899" speed="2.5s" size="lg" onClick={() => setShowModal(true)}>
                📋 Consulta Gratuita <ArrowUpRight size={20} />
              </StarBorder>
              <StarBorder color="#7c3aed" speed="3.5s" size="lg" onClick={() => window.open(GCAL_URL, "_blank")}>
                <Calendar size={20} /> Agendar Reunión
              </StarBorder>
            </div>
            <p style={{ fontSize: 13, color: "#334155", marginTop: 20 }}>Respondemos en máximo 2 horas hábiles</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "56px 24px 32px", borderTop: "1px solid rgba(109,40,217,0.12)", background: "rgba(5,5,8,0.9)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 36, marginBottom: 36 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 900, ...gText }}>∞</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, ...gText }}>LA LIGA</div>
                  <div style={{ fontSize: 9, color: "#334155" }}>DE MARKETERS</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>Resultados medibles para negocios reales. Desde 2019.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: 12, fontSize: 14 }}>Ubicación</h4>
              <p style={{ color: "#334155", fontSize: 13, marginBottom: 6 }}>📍 Córdoba, Argentina</p>
              <p style={{ color: "#334155", fontSize: 13 }}>🌍 Clientes en LATAM y USA</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: 12, fontSize: 14 }}>Contacto</h4>
              <button onClick={() => window.open(WA_BASE, "_blank")}
                style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 13, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 8, fontWeight: 600 }}>
                <MessageCircle size={14} /> WhatsApp directo
              </button>
              <button onClick={() => window.open(GCAL_URL, "_blank")}
                style={{ display: "flex", alignItems: "center", gap: 6, color: "#a855f7", fontSize: 13, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}>
                <Calendar size={14} /> Agendar reunión
              </button>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(109,40,217,0.1)", paddingTop: 20, textAlign: "center", color: "#1e293b", fontSize: 12 }}>
            © 2025 La Liga de Marketers — Resultados que hablan solos.
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOTANTE ── */}
      <button onClick={() => window.open(`${WA_BASE}?text=${encodeURIComponent("Hola La Liga! 👋 Me interesa una consulta gratuita.")}`, "_blank")}
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 300, width: 60, height: 60, borderRadius: "50%", background: "#25D366", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(37,211,102,0.4)", transition: "transform 0.2s, box-shadow 0.2s", animation: "wapulse 3s ease-in-out infinite" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,211,102,0.55)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,211,102,0.4)"; }}>
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.67 4.8 1.836 6.8L2 30l7.4-1.836A13.9 13.9 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm7.2 19.6c-.3.836-1.5 1.532-2.468 1.732-.656.132-1.512.236-4.4-1.2-3.696-1.8-6.1-5.6-6.284-5.864-.18-.264-1.516-2.016-1.516-3.836 0-1.82.952-2.716 1.288-3.08.336-.364.736-.456 1.008-.456.244 0 .484.008.7.016.232.012.548-.088.856.652.312.748 1.064 2.568 1.156 2.752.092.184.156.4.04.652-.116.252-.18.4-.356.62-.18.22-.38.492-.544.66-.18.18-.372.376-.16.74.212.364.944 1.556 2.024 2.52 1.392 1.24 2.564 1.624 2.928 1.808.364.184.58.156.796-.092.216-.248.932-1.088 1.184-1.456.248-.368.5-.308.84-.184.34.124 2.152 1.016 2.52 1.2.368.184.612.276.704.428.092.152.092.88-.208 1.716z"/>
        </svg>
      </button>

      {/* ── MODAL ── */}
      {showModal && <LeadModal onClose={() => setShowModal(false)} />}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        @keyframes wapulse { 0%,100%{box-shadow:0 8px 32px rgba(37,211,102,0.4)} 50%{box-shadow:0 8px 48px rgba(37,211,102,0.65)} }
        *{scrollbar-width:thin;scrollbar-color:rgba(139,92,246,0.4) transparent}
        *::-webkit-scrollbar{width:5px}
        *::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.4);border-radius:3px}
      `}</style>
    </div>
  );
}
