export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, industry, stage, revenue, problem, channels, budget, metric } = req.body;

    if (!name || !email || !industry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_GEMINI_API_KEY not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `Eres un experto en crecimiento de negocios. Analiza este negocio y genera SOLO 3-5 recomendaciones CLAVE y ACCIONABLES:

DATOS:
- Nombre: ${name}
- Email: ${email}
- Industria: ${industry}
- Etapa: ${stage}
- Ingresos: ${revenue}
- Problema: ${problem}
- Canales: ${channels && channels.length > 0 ? channels.join(', ') : 'Ninguno'}
- Presupuesto: ${budget}
- Métrica clave: ${metric}

RESPONDE EN JSON (sin markdown, sin backticks):
{
  "titulo": "Diagnóstico de ${industry}",
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

Sé específico, directo y accionable.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      return res.status(500).json({ 
        error: 'Failed to generate report',
        status: response.status
      });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response:', data);
      return res.status(500).json({ error: 'Invalid API response' });
    }

    const text = data.candidates[0].content.parts[0].text;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(200).json({
          titulo: 'Diagnóstico de tu negocio',
          resumen: 'Análisis completado',
          recomendaciones: [{ 
            titulo: 'Análisis realizado', 
            descripcion: text.substring(0, 200) 
          }],
          proximos_pasos: 'Agendar una consulta para análisis personalizado',
          inversion_estimada: 'A definir según estrategia'
        });
      }
      const report = JSON.parse(jsonMatch[0]);
      return res.status(200).json(report);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(200).json({
        titulo: 'Diagnóstico de tu negocio',
        resumen: 'Análisis completado',
        recomendaciones: [{ 
          titulo: 'Análisis realizado', 
          descripcion: text.substring(0, 200) 
        }],
        proximos_pasos: 'Agendar una consulta para análisis personalizado',
        inversion_estimada: 'A definir según estrategia'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}