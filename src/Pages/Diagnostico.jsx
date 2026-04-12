import React, { useState } from 'react';

const Diagnostico = () => {
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    stage: '',
    revenue: '',
    problem: '',
    channels: [],
    budget: '',
    metric: ''
  });
  const [report, setReport] = useState(null);

  const SUPABASE_URL = 'https://ybqvoczaczkczvrbhqvo.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXZvY3phY3prY3p2cmJocXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Mzk1NzksImV4cCI6MjA5MTQxNTU3OX0.Zz06EmvLpN1GS0ClBkjSxROTp50pc5ZM9GWeIkwbFBw';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      channels: checked 
        ? [...prev.channels, value]
        : prev.channels.filter(c => c !== value)
    }));
  };

  const generateHaikuReport = async (data) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20241022',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Eres un experto en crecimiento de negocios. Analiza este negocio y genera SOLO 3-5 recomendaciones CLAVE y ACCIONABLES:

DATOS:
- Industria: ${data.industry}
- Etapa: ${data.stage}
- Ingresos: ${data.revenue}
- Problema: ${data.problem}
- Canales: ${data.channels.length > 0 ? data.channels.join(', ') : 'Ninguno'}
- Presupuesto: ${data.budget}
- Métrica clave: ${data.metric}

FORMATO RESPUESTA (JSON):
{
  "titulo": "Diagnóstico de ${data.industry}",
  "resumen": "1-2 frases sobre el estado actual",
  "recomendaciones": [
    {
      "titulo": "string corto (máx 8 palabras)",
      "descripcion": "1-2 líneas explicando POR QUÉ y CÓMO"
    }
  ],
  "proximos_pasos": "Qué hacer en los próximos 7 días",
  "inversion_estimada": "Rango de inversión recomendada"
}

Sé específico, directo y accionable. NO uses términos vagos.`
            }]
          })
        });

      const result = await response.json();
      const text = result.content[0].text;
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch[0]);
      } catch {
        return {
          titulo: 'Diagnóstico de tu negocio',
          resumen: 'Análisis completado',
          recomendaciones: [{ titulo: 'Consulta con nuestro equipo', descripcion: text }],
          proximos_pasos: 'Agendar una consulta para análisis personalizado',
          inversion_estimada: 'A definir según estrategia'
        };
      }
    } catch (error) {
      console.error('Error generating report:', error);
      return null;
    }
  };

  const saveToSupabase = async (data, simpleReport) => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/diagnostics`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            industry: data.industry,
            stage: data.stage,
            revenue: data.revenue,
            problem: data.problem,
            channels: data.channels,
            budget: data.budget,
            metric: data.metric,
            simple_report: simpleReport,
            status: 'pending'
          })
        }
      );

      if (!response.ok) {
        console.error('Supabase error:', await response.text());
      }
      return response.ok;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const simpleReport = await generateHaikuReport(formData);
    
    if (simpleReport) {
      await saveToSupabase(formData, simpleReport);
      setReport(simpleReport);
      setStep('report');
    }

    setLoading(false);
  };

  const handleContact = () => {
    const msg = encodeURIComponent(`Hola! Completé el diagnóstico y me gustaría una consulta personalizada.\n\nNombre: ${formData.name}\nEmail: ${formData.email}`);
    window.open(`https://wa.me/5493512033845?text=${msg}`, '_blank');
  };

  const handleSchedule = () => {
    window.open('https://calendar.app.google/fMT32F18mFNct2Bg6', '_blank');
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '3rem 1.5rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a14 0%, #1a0a2e 100%)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      color: '#fff'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 900,
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#94a3b8',
      marginTop: '0.5rem'
    },
    formSection: {
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '16px',
      padding: '2.5rem',
      backdropFilter: 'blur(10px)'
    },
    formGroup: {
      marginBottom: '2rem'
    },
    label: {
      display: 'block',
      fontWeight: 600,
      color: '#e2e8f0',
      marginBottom: '0.75rem',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '0.875rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: '8px',
      background: 'rgba(30, 41, 59, 0.6)',
      color: '#e2e8f0',
      fontSize: '0.95rem',
      transition: 'all 0.3s'
    },
    select: {
      width: '100%',
      padding: '0.875rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: '8px',
      background: 'rgba(30, 41, 59, 0.6)',
      color: '#e2e8f0',
      fontSize: '0.95rem'
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    radioItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    radioInput: {
      cursor: 'pointer',
      accentColor: '#a855f7'
    },
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    button: {
      padding: '0.875rem 2rem',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '0.95rem',
      transition: 'all 0.3s',
      marginTop: '1.5rem'
    },
    report: {
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '16px',
      padding: '2.5rem',
      backdropFilter: 'blur(10px)',
      color: '#e2e8f0'
    },
    reportSection: {
      marginBottom: '2rem',
      paddingBottom: '2rem',
      borderBottom: '1px solid rgba(168, 85, 247, 0.1)'
    },
    reportH2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: '1rem',
      color: '#fff'
    },
    recommendation: {
      background: 'rgba(168, 85, 247, 0.1)',
      padding: '1.25rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      borderLeft: '3px solid #a855f7'
    },
    recommendationTitle: {
      fontWeight: 700,
      marginBottom: '0.5rem',
      color: '#e2e8f0'
    },
    recommendationDesc: {
      color: '#cbd5e1',
      fontSize: '0.95rem',
      lineHeight: '1.6'
    },
    ctaBox: {
      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center',
      marginTop: '2rem'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem 1.5rem',
      color: '#cbd5e1'
    },
    spinner: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      border: '3px solid rgba(168, 85, 247, 0.3)',
      borderTop: '3px solid #a855f7',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
            Analizando tu negocio con IA...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'report' && report) {
    return (
      <div style={styles.container}>
        <div style={styles.report}>
          <div style={styles.header}>
            <h1 style={{ ...styles.title, background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {report.titulo}
            </h1>
            <p style={styles.subtitle}>{report.resumen}</p>
          </div>

          <div style={styles.reportSection}>
            <h2 style={styles.reportH2}>Recomendaciones clave</h2>
            {report.recomendaciones && report.recomendaciones.map((rec, i) => (
              <div key={i} style={styles.recommendation}>
                <div style={styles.recommendationTitle}>{rec.titulo}</div>
                <div style={styles.recommendationDesc}>{rec.descripcion}</div>
              </div>
            ))}
          </div>

          <div style={styles.reportSection}>
            <h2 style={styles.reportH2}>Próximos pasos</h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{report.proximos_pasos}</p>
          </div>

          <div style={styles.reportSection}>
            <h2 style={styles.reportH2}>Inversión estimada</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', fontWeight: 600 }}>
              {report.inversion_estimada}
            </p>
          </div>

          <div style={styles.ctaBox}>
            <h3 style={{ color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>
              ¿Te gustaría ejecutar esta estrategia?
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
              Agendar una consulta gratis de 30 minutos
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                style={{ ...styles.button, background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                onClick={handleSchedule}
              >
                Agendar consulta →
              </button>
              <button 
                style={{ ...styles.button, background: 'transparent', border: '1px solid rgba(168, 85, 247, 0.5)', color: '#e2e8f0' }}
                onClick={handleContact}
              >
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        input:focus, select:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.6);
          background: rgba(30, 41, 59, 0.8);
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>Diagnóstico de Crecimiento</h1>
        <p style={styles.subtitle}>Descubre dónde está tu negocio y qué hacer para crecer</p>
      </div>

      <div style={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>¿En qué industria opera tu negocio?</label>
            <select 
              name="industry" 
              value={formData.industry}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="servicios-leads">Servicios B2B / Lead generation</option>
              <option value="clinicas">Clínicas / Salud</option>
              <option value="ecommerce">E-commerce</option>
              <option value="retail">Retail / Comercio local</option>
              <option value="servicios">Servicios profesionales</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿En qué etapa está tu negocio?</label>
            <div style={styles.radioGroup}>
              {['startup', 'growth', 'established', 'scaling'].map(val => (
                <div key={val} style={styles.radioItem}>
                  <input 
                    type="radio" 
                    name="stage" 
                    value={val}
                    checked={formData.stage === val}
                    onChange={handleInputChange}
                    style={styles.radioInput}
                    required
                  />
                  <label style={{ margin: 0, color: '#cbd5e1', cursor: 'pointer' }}>
                    {val === 'startup' && 'Startup / Menos de 1 año'}
                    {val === 'growth' && 'Crecimiento / 1-3 años'}
                    {val === 'established' && 'Consolidado / 3+ años'}
                    {val === 'scaling' && 'Escalando / Múltiples líneas de negocio'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cuál es tu ingreso mensual aproximado?</label>
            <select 
              name="revenue" 
              value={formData.revenue}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecciona un rango</option>
              <option value="0-5k">Menos de $5.000</option>
              <option value="5-20k">$5.000 - $20.000</option>
              <option value="20-50k">$20.000 - $50.000</option>
              <option value="50-100k">$50.000 - $100.000</option>
              <option value="100k+">Más de $100.000</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cuál es tu principal problema AHORA?</label>
            <div style={styles.radioGroup}>
              {[
                { val: 'leads', label: 'No tengo suficientes leads/clientes potenciales' },
                { val: 'conversion', label: 'Tengo tráfico pero baja conversión' },
                { val: 'retention', label: 'Pierdo clientes rápidamente' },
                { val: 'visibility', label: 'Nadie conoce mi negocio' },
                { val: 'roi', label: 'No sé si mis gastos en marketing dan resultado' }
              ].map(item => (
                <div key={item.val} style={styles.radioItem}>
                  <input 
                    type="radio" 
                    name="problem" 
                    value={item.val}
                    checked={formData.problem === item.val}
                    onChange={handleInputChange}
                    style={styles.radioInput}
                    required
                  />
                  <label style={{ margin: 0, color: '#cbd5e1', cursor: 'pointer' }}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Qué canales usas actualmente?</label>
            <div style={styles.checkboxGroup}>
              {[
                { val: 'organic', label: 'Tráfico orgánico / SEO' },
                { val: 'paid', label: 'Publicidad pagada (Meta, Google)' },
                { val: 'social', label: 'Redes sociales' },
                { val: 'email', label: 'Email marketing' },
                { val: 'referral', label: 'Referidos / Boca a boca' },
                { val: 'none', label: 'No tengo estrategia digital' }
              ].map(item => (
                <div key={item.val} style={styles.radioItem}>
                  <input 
                    type="checkbox" 
                    value={item.val}
                    checked={formData.channels.includes(item.val)}
                    onChange={handleCheckboxChange}
                    style={styles.radioInput}
                  />
                  <label style={{ margin: 0, color: '#cbd5e1', cursor: 'pointer' }}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cuánto puedes invertir mensualmente en growth?</label>
            <select 
              name="budget" 
              value={formData.budget}
              onChange={handleInputChange}
              style={styles.select}
              required
            >
              <option value="">Selecciona un rango</option>
              <option value="0">No tengo presupuesto aún</option>
              <option value="100-300">$100 - $300</option>
              <option value="300-800">$300 - $800</option>
              <option value="800-2000">$800 - $2.000</option>
              <option value="2000+">Más de $2.000</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cuál es tu métrica más importante?</label>
            <div style={styles.radioGroup}>
              {[
                { val: 'leads', label: 'Cantidad de leads / clientes nuevos' },
                { val: 'sales', label: 'Ventas / Ingresos' },
                { val: 'retention', label: 'Retención / Lifetime value' },
                { val: 'brand', label: 'Visibilidad / Reconocimiento de marca' }
              ].map(item => (
                <div key={item.val} style={styles.radioItem}>
                  <input 
                    type="radio" 
                    name="metric" 
                    value={item.val}
                    checked={formData.metric === item.val}
                    onChange={handleInputChange}
                    style={styles.radioInput}
                    required
                  />
                  <label style={{ margin: 0, color: '#cbd5e1', cursor: 'pointer' }}>
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>¿Cuál es tu nombre?</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tu email de contacto</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Generar diagnóstico →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Diagnostico;