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

    // LOG 1: confirmar que el body llega
    console.log('[diagnose] Body recibido:', { name, email, industry, stage });

    if (!name || !email || !industry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    // LOG 2: confirmar que la key existe (nunca loggear la key completa)
    console.log('[diagnose] API key presente:', !!apiKey, '| Longitud:', apiKey?.length ?? 0);

    if (!apiKey) {
      console.error('[diagnose] ERROR: API key no configurada en variables de entorno');
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

    // Modelo actualizado: gemini-2.0-flash es el sucesor activo de 1.5-flash
    const GEMINI_MODEL = 'gemini-2.0-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // LOG 3: confirmar URL (sin la key)
    console.log('[diagnose] Llamando a Gemini model:', GEMINI_MODEL);

    const geminiBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    // LOG 4: status de Gemini
    console.log('[diagnose] Gemini HTTP status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[diagnose] Gemini error body:', errorText);
      return res.status(500).json({
        error: 'Gemini API error',
        geminiStatus: response.status,
        // Devolvemos el mensaje de Gemini para facilitar el debug
        detail: errorText.substring(0, 300)
      });
    }

    const data = await response.json();

    // LOG 5: estructura de la respuesta
    console.log('[diagnose] Gemini response keys:', Object.keys(data));

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('[diagnose] Estructura de respuesta inesperada:', JSON.stringify(data).substring(0, 500));
      return res.status(500).json({ error: 'Unexpected Gemini response structure' });
    }

    const text = data.candidates[0].content.parts[0].text;

    // LOG 6: texto crudo antes del parse
    console.log('[diagnose] Texto crudo de Gemini (primeros 300 chars):', text.substring(0, 300));

    // Limpieza robusta: eliminar bloques markdown si Gemini los incluye igual
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('[diagnose] No se encontró JSON en la respuesta:', cleaned.substring(0, 300));
      // Fallback graceful en lugar de 500
      return res.status(200).json({
        titulo: `Diagnóstico de ${industry}`,
        resumen: 'Análisis completado. Revisá los detalles abajo.',
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
      console.error('[diagnose] Parse error:', parseError.message, '| JSON candidato:', jsonMatch[0].substring(0, 200));
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