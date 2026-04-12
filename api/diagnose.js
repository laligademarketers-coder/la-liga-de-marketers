export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, industry, stage, revenue, problem, channels, budget, metric } = req.body;

  if (!name || !email || !industry) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Eres un experto en crecimiento de negocios. Analiza este negocio y genera SOLO 3-5 recomendaciones CLAVE y ACCIONABLES:

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

FORMATO RESPUESTA (JSON):
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

Sé específico, directo y accionable. NO uses términos vagos.`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ error: 'Failed to generate report' });
    }

    const data = await response.json();
    const text = data.content[0].text;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return res.status(400).json({ 
          error: 'Invalid response format',
          titulo: 'Diagnóstico de tu negocio',
          resumen: 'Análisis completado',
          recomendaciones: [{ titulo: 'Análisis completado', descripcion: text }],
          proximos_pasos: 'Agendar una consulta para análisis personalizado',
          inversion_estimada: 'A definir según estrategia'
        });
      }
      const report = JSON.parse(jsonMatch[0]);
      return res.status(200).json(report);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(400).json({
        titulo: 'Diagnóstico de tu negocio',
        resumen: 'Análisis completado',
        recomendaciones: [{ titulo: 'Análisis completado', descripcion: text }],
        proximos_pasos: 'Agendar una consulta para análisis personalizado',
        inversion_estimada: 'A definir según estrategia'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}