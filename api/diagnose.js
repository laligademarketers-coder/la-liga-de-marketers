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

    console.log('[diagnose] Body recibido:', { name, email, industry, stage });

    if (!name || !email || !industry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    console.log('[diagnose] API key presente:', !!apiKey, '| Longitud:', apiKey?.length ?? 0);

    if (!apiKey) {
      console.error('[diagnose] ERROR: ANTHROPIC_API_KEY no configurada');
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

RESPONDE ÚNICAMENTE EN JSON VÁLIDO (sin markdown, sin backticks, sin texto antes o después):
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
}`;

    console.log('[diagnose] Llamando a Claude Haiku...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    console.log('[diagnose] Claude HTTP status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[diagnose] Claude error body:', errorText);
      return res.status(500).json({
        error: 'Claude API error',
        claudeStatus: response.status,
        detail: errorText.substring(0, 300)
      });
    }

    const data = await response.json();

    console.log('[diagnose] Claude response - stop_reason:', data.stop_reason);

    if (!data.content?.[0]?.text) {
      console.error('[diagnose] Estructura inesperada:', JSON.stringify(data).substring(0, 500));
      return res.status(500).json({ error: 'Unexpected Claude response structure' });
    }

    const text = data.content[0].text;

    console.log('[diagnose] Texto crudo (primeros 300 chars):', text.substring(0, 300));

    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('[diagnose] No se encontró JSON:', cleaned.substring(0, 300));
      return res.status(200).json({
        titulo: `Diagnóstico de ${industry}`,
        resumen: 'Análisis completado.',
        recomendaciones: [{ titulo: 'Análisis realizado', descripcion: text.substring(0, 300) }],
        proximos_pasos: 'Agendá una consulta para análisis personalizado.',
        inversion_estimada: 'A definir según estrategia'
      });
    }

    try {
      const report = JSON.parse(jsonMatch[0]);
      console.log('[diagnose] Reporte parseado OK. Título:', report.titulo);
      return res.status(200).json(report);
    } catch (parseError) {
      console.error('[diagnose] Parse error:', parseError.message);
      return res.status(200).json({
        titulo: `Diagnóstico de ${industry}`,
        resumen: 'Análisis completado.',
        recomendaciones: [{ titulo: 'Análisis realizado', descripcion: text.substring(0, 300) }],
        proximos_pasos: 'Agendá una consulta para análisis personalizado.',
        inversion_estimada: 'A definir según estrategia'
      });
    }

  } catch (error) {
    console.error('[diagnose] Error no controlado:', error.message, error.stack);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}