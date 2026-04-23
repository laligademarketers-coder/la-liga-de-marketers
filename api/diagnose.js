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

    const prompt = `Eres un estratega de negocios experto. Tu tarea es crear un ROADMAP DE NEGOCIO ACCIONABLE (no solo marketing) basado en la situación actual del cliente.

IMPORTANTE: Usa lenguaje profesional pero incluye explicaciones simples entre paréntesis para que cualquiera entienda sin conocimiento técnico.

DATOS DEL NEGOCIO:
- Nombre: ${name}
- Email: ${email}
- Industria: ${industry}
- Etapa: ${stage}
- Ingresos mensuales: ${revenue}
- Problema principal: ${problem}
- Canales activos: ${channels && channels.length > 0 ? channels.join(', ') : 'Ninguno'}
- Presupuesto para crecimiento: ${budget}
- Métrica clave: ${metric}

ANÁLISIS REQUERIDO:
Debes generar un roadmap de 3 meses que incluya 4 pilares:

1. **OPERACIONES** (cómo estructurar el negocio)
   - Procesos que necesita implementar (pasos y sistemas para trabajar mejor)
   - Herramientas/software recomendadas (programas que te ayudan a automatizar)
   - Equipo o delegación requerida (personas o tareas a tercerizar)

2. **PRODUCTO/SERVICIO** (cómo mejorar lo que vende)
   - Cambios en oferta (qué nuevos servicios ofrecer)
   - Diferenciación vs competencia (qué te hace único vs tus competidores)
   - Precio/modelo de negocio (cuánto cobrar y cómo facturar)

3. **MARKETING/VENTAS** (cómo conseguir clientes)
   - Canales prioritarios (dónde buscar tus clientes)
   - Mensaje y propuesta de valor (qué decir para que te contraten)
   - Estrategia de adquisición específica (plan concreto para traer clientes)

4. **RECURRENCIA/RETENCIÓN** (cómo mantener clientes)
   - Sistemas para que clientes vuelvan (cómo haces que sigan comprando)
   - Upsell/cross-sell (vender más a clientes existentes)
   - Relación a largo plazo (mantener la relación después de la venta)

FORMATO RESPUESTA (JSON SOLO, sin markdown):
{
  "titulo": "Roadmap de Negocio para ${industry}",
  "resumen_situacion": "2-3 frases sobre el estado actual del negocio usando lenguaje simple",
  "score_negocio": {
    "operaciones": "1-10",
    "producto_servicio": "1-10",
    "marketing_ventas": "1-10",
    "recurrencia": "1-10"
  },
  "problema_critico": "El problema #1 que debe resolver PRIMERO (en lenguaje que cualquiera entienda)",
  "roadmap": {
    "mes_1": {
      "titulo": "Fundamentos (Semana 1-4)",
      "pilares": [
        {
          "pilar": "Operaciones",
          "acciones": ["acción 1 (explicación simple entre paréntesis)", "acción 2 (explicación)", "acción 3 (explicación)"]
        },
        {
          "pilar": "Producto/Servicio",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)"]
        },
        {
          "pilar": "Marketing/Ventas",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)", "acción 3 (explicación)"]
        },
        {
          "pilar": "Recurrencia",
          "acciones": ["acción 1 (explicación simple)"]
        }
      ]
    },
    "mes_2": {
      "titulo": "Tracción (Semana 5-8)",
      "pilares": [
        {
          "pilar": "Operaciones",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)"]
        },
        {
          "pilar": "Producto/Servicio",
          "acciones": ["acción 1 (explicación simple)"]
        },
        {
          "pilar": "Marketing/Ventas",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)"]
        },
        {
          "pilar": "Recurrencia",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)"]
        }
      ]
    },
    "mes_3": {
      "titulo": "Escala (Semana 9-12)",
      "pilares": [
        {
          "pilar": "Operaciones",
          "acciones": ["acción 1 (explicación simple)"]
        },
        {
          "pilar": "Producto/Servicio",
          "acciones": ["acción 1 (explicación simple)"]
        },
        {
          "pilar": "Marketing/Ventas",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)"]
        },
        {
          "pilar": "Recurrencia",
          "acciones": ["acción 1 (explicación simple)", "acción 2 (explicación)"]
        }
      ]
    }
  },
  "metricas_clave": {
    "mes_1": "Métrica a medir en mes 1 (explicar qué significa en lenguaje simple)",
    "mes_2": "Métrica a medir en mes 2 (explicar qué significa en lenguaje simple)",
    "mes_3": "Métrica a medir en mes 3 (explicar qué significa en lenguaje simple)"
  },
  "inversion_estimada": "Rango de inversión recomendada para ejecutar el roadmap (en dinero, con explicación de en qué gastarla)",
  "proximos_7_dias": "3-5 acciones específicas para ESTA SEMANA sin esperar nada más (cada una con explicación simple de por qué hacerla)"
}

RESTRICCIONES IMPORTANTES:
- Sé específico: cada acción debe ser ejecutable HOY
- Lenguaje accesible: usa palabras que una persona sin experiencia entienda, pero mantén profesionalismo
- Explicaciones entre paréntesis: si usas un término técnico, explícalo de forma simple
- Prioriza: no todo es importante, destaca los 20% que genera 80% del impacto
- Realista: considera el stage del negocio y presupuesto disponible
- Escalable: cada acción debe preparar el terreno para la siguiente
- La recurrencia es el corazón: si el cliente no vuelve, es pérdida total

EJEMPLOS DE LENGUAJE CON EXPLICACIONES:
❌ INCORRECTO: "Implementar un CRM"
✅ CORRECTO: "Implementar un CRM (sistema para organizar tus clientes y hacer seguimiento automático)"

❌ INCORRECTO: "Optimizar tu CAC"
✅ CORRECTO: "Reducir tu CAC (cuánto gastas para traer UN cliente nuevo)"

❌ INCORRECTO: "Crear un funnel de conversión"
✅ CORRECTO: "Crear un sistema donde primero atraes gente gratis, después los conoces mejor, y finalmente los vendes"

TONALIDAD:
- Mentor que sabe pero explica con claridad
- Directo, sin rodeos
- Inspirador pero realista
- Accionable, no teórico
- Accesible para cualquiera, profesional en fondo`;

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
        max_tokens: 1500,
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
        titulo: `Roadmap de Negocio para ${industry}`,
        resumen_situacion: 'Análisis completado.',
        score_negocio: { operaciones: 5, producto_servicio: 5, marketing_ventas: 5, recurrencia: 5 },
        problema_critico: 'Necesitas un diagnóstico personalizado',
        roadmap: { mes_1: { titulo: 'Fundamentos', pilares: [] }, mes_2: { titulo: 'Tracción', pilares: [] }, mes_3: { titulo: 'Escala', pilares: [] } },
        metricas_clave: { mes_1: 'Por definir', mes_2: 'Por definir', mes_3: 'Por definir' },
        inversion_estimada: 'A definir según estrategia',
        proximos_7_dias: 'Agendá una consulta para análisis personalizado.'
      });
    }

    try {
      const report = JSON.parse(jsonMatch[0]);
      console.log('[diagnose] Reporte parseado OK. Título:', report.titulo);
      return res.status(200).json(report);
    } catch (parseError) {
      console.error('[diagnose] Parse error:', parseError.message);
      return res.status(200).json({
        titulo: `Roadmap de Negocio para ${industry}`,
        resumen_situacion: 'Análisis completado.',
        score_negocio: { operaciones: 5, producto_servicio: 5, marketing_ventas: 5, recurrencia: 5 },
        problema_critico: 'Necesitas un diagnóstico personalizado',
        roadmap: { mes_1: { titulo: 'Fundamentos', pilares: [] }, mes_2: { titulo: 'Tracción', pilares: [] }, mes_3: { titulo: 'Escala', pilares: [] } },
        metricas_clave: { mes_1: 'Por definir', mes_2: 'Por definir', mes_3: 'Por definir' },
        inversion_estimada: 'A definir según estrategia',
        proximos_7_dias: 'Agendá una consulta para análisis personalizado.'
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