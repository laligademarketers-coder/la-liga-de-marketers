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
    const { name, email, phone, industry, stage, revenue, problem, channels, budget, metric } = req.body;

    console.log('[diagnose] Body recibido:', { name, email, industry, stage });

    if (!name || !email || !industry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('[diagnose] ERROR: ANTHROPIC_API_KEY no configurada');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `Eres un experto en negocios. Analiza BREVEMENTE este negocio y devuelve SOLO JSON válido, sin markdown ni explicaciones:

DATOS: Industria: ${industry}, Etapa: ${stage}, Ingresos: ${revenue}, Problema: ${problem}, Presupuesto: ${budget}, Métrica: ${metric}

DEVUELVE EXACTAMENTE ESTE JSON (reemplaza los valores, no cambies la estructura):
{
  "titulo": "Roadmap de Negocio para ${industry}",
  "resumen_situacion": "Una frase corta sobre el estado del negocio",
  "score_negocio": {
    "operaciones": 6,
    "producto_servicio": 5,
    "marketing_ventas": 4,
    "recurrencia": 3
  },
  "problema_critico": "El problema más importante que debe resolver primero (una frase)",
  "roadmap": {
    "mes_1": {
      "titulo": "Fundamentos (Semana 1-4)",
      "pilares": [
        {"pilar": "Operaciones", "acciones": ["Acción 1 (explicación)", "Acción 2 (explicación)"]},
        {"pilar": "Producto/Servicio", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Marketing/Ventas", "acciones": ["Acción 1 (explicación)", "Acción 2 (explicación)"]},
        {"pilar": "Recurrencia", "acciones": ["Acción 1 (explicación)"]}
      ]
    },
    "mes_2": {
      "titulo": "Tracción (Semana 5-8)",
      "pilares": [
        {"pilar": "Operaciones", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Producto/Servicio", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Marketing/Ventas", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Recurrencia", "acciones": ["Acción 1 (explicación)"]}
      ]
    },
    "mes_3": {
      "titulo": "Escala (Semana 9-12)",
      "pilares": [
        {"pilar": "Operaciones", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Producto/Servicio", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Marketing/Ventas", "acciones": ["Acción 1 (explicación)"]},
        {"pilar": "Recurrencia", "acciones": ["Acción 1 (explicación)"]}
      ]
    }
  },
  "metricas_clave": {
    "mes_1": "Métrica concreta para medir mes 1",
    "mes_2": "Métrica concreta para medir mes 2",
    "mes_3": "Métrica concreta para medir mes 3"
  },
  "inversion_estimada": "Rango de inversión en pesos argentinos",
  "proximos_7_dias": "3-4 acciones concretas para esta semana"
}

REGLAS:
- Devuelve SOLO el JSON, nada más
- Sé específico: cada acción debe ser ejecutable
- Lenguaje profesional pero simple, con explicaciones entre paréntesis
- Realista: considera el stage y presupuesto del negocio
- La recurrencia es clave: prioriza acciones para que clientes vuelvan`;

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
        max_tokens: 2000,
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

    console.log('[diagnose] Texto crudo (primeros 500 chars):', text.substring(0, 500));

    // Limpia markdown
    const cleaned = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    console.log('[diagnose] Texto limpio (primeros 500 chars):', cleaned.substring(0, 500));

    // Encuentra JSON
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('[diagnose] No se encontró JSON. Texto limpio:', cleaned);
      return res.status(500).json({
        error: 'Invalid response format from Claude',
        detail: 'Could not parse JSON from response',
        rawText: cleaned.substring(0, 200)
      });
    }

    try {
      const report = JSON.parse(jsonMatch[0]);
      console.log('[diagnose] Reporte parseado OK. Título:', report.titulo);
      return res.status(200).json(report);
    } catch (parseError) {
      console.error('[diagnose] Parse error:', parseError.message);
      console.error('[diagnose] JSON encontrado:', jsonMatch[0].substring(0, 300));
      return res.status(500).json({
        error: 'JSON parse error',
        detail: parseError.message,
        attemptedJson: jsonMatch[0].substring(0, 200)
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