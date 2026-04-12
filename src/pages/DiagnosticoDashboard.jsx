import React, { useState, useEffect } from 'react';

const DiagnosticoDashboard = () => {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiag, setSelectedDiag] = useState(null);
  const [generatingDeep, setGeneratingDeep] = useState(false);

  const SUPABASE_URL = 'https://ybqvoczaczkczvrbhqvo.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicXZvY3phY3prY3p2cmJocXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Mzk1NzksImV4cCI6MjA5MTQxNTU3OX0.Zz06EmvLpN1GS0ClBkjSxROTp50pc5ZM9GWeIkwbFBw';

  useEffect(() => {
    fetchDiagnosticos();
  }, []);

  const fetchDiagnosticos = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/diagnostics?order=created_at.desc`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDiagnosticos(data);
      }
    } catch (error) {
      console.error('Error fetching diagnosticos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDeepAnalysis = async (diag) => {
    setGeneratingDeep(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 3000,
          messages: [{
            role: 'user',
            content: `Eres un experto senior en crecimiento de negocios. Analiza este cliente:

DATOS:
- Nombre: ${diag.name}
- Email: ${diag.email}
- Industria: ${diag.industry}
- Etapa: ${diag.stage}
- Ingresos: ${diag.revenue}
- Problema: ${diag.problem}
- Canales: ${diag.channels && diag.channels.length > 0 ? diag.channels.join(', ') : 'Ninguno'}
- Presupuesto: ${diag.budget}
- Métrica: ${diag.metric}

Genera un análisis FODA y estrategia 360 en JSON.`
          }]
        })
      });

      const result = await response.json();
      const text = result.content[0].text;

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const deepAnalysis = JSON.parse(jsonMatch[0]);
        await saveDeepAnalysis(diag.id, deepAnalysis);
        setSelectedDiag({
          ...diag,
          deep_analysis: deepAnalysis
        });
      } catch (parseError) {
        alert('Error al procesar el análisis');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar análisis');
    } finally {
      setGeneratingDeep(false);
    }
  };

  const saveDeepAnalysis = async (diagId, deepAnalysis) => {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/diagnostics?id=eq.${diagId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            deep_analysis: deepAnalysis,
            status: 'analyzed'
          })
        }
      );
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      background: '#0a0a14',
      minHeight: '100vh',
      color: '#e2e8f0'
    },
    header: {
      marginBottom: '2rem',
      borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
      paddingBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    card: {
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    button: {
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '0.85rem',
      marginTop: '1rem'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: '#0f172a',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflowY: 'auto'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Cargando diagnósticos...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard de Diagnósticos</h1>
        <p style={{ color: '#94a3b8' }}>
          {diagnosticos.length} diagnósticos generados
        </p>
      </div>

      {diagnosticos.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
          No hay diagnósticos aún
        </p>
      ) : (
        <div style={styles.grid}>
          {diagnosticos.map(diag => (
            <div 
              key={diag.id}
              style={styles.card}
              onClick={() => setSelectedDiag(diag)}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                {diag.name}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {diag.email}
              </div>
              
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                <strong>Industria:</strong> {diag.industry}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                <strong>Problema:</strong> {diag.problem}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                <strong>Presupuesto:</strong> {diag.budget}
              </div>

              <button 
                style={styles.button}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!diag.deep_analysis) {
                    generateDeepAnalysis(diag);
                  } else {
                    setSelectedDiag(diag);
                  }
                }}
                disabled={generatingDeep}
              >
                {diag.deep_analysis ? 'Ver análisis' : 'Generar análisis'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDiag && (
        <div style={styles.modal} onClick={() => setSelectedDiag(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDiag(null)}
            >
              ✕
            </button>

            <h2 style={{ ...styles.title, marginBottom: '1.5rem' }}>
              {selectedDiag.name}
            </h2>

            {selectedDiag.simple_report && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Reporte Simple
                </h3>
                <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                  {selectedDiag.simple_report.resumen}
                </p>
              </div>
            )}

            {selectedDiag.deep_analysis && (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Análisis Profundo
                </h3>
                <p style={{ color: '#cbd5e1' }}>
                  {JSON.stringify(selectedDiag.deep_analysis, null, 2)}
                </p>
              </div>
            )}

            {!selectedDiag.deep_analysis && (
              <button 
                style={{
                  ...styles.button,
                  marginTop: '2rem',
                  width: '100%',
                  padding: '1rem'
                }}
                onClick={() => generateDeepAnalysis(selectedDiag)}
                disabled={generatingDeep}
              >
                {generatingDeep ? 'Generando...' : 'Generar análisis profundo'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticoDashboard;