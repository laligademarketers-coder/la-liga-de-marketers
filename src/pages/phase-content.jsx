// Contenido de las páginas de cada fase. Para editar textos, tocar solo este archivo.
import { RESULTS, TIMELINE } from '../landing/data';

const fmt = n => n.toLocaleString('es-AR');

export const EVALUACION = 'Empezamos con una evaluación inicial de 30 minutos, sin costo: vemos en qué punto está tu clínica y definimos por qué fase arrancar.';

export const PHASE_CONTENT = {
  1: {
    seoTitle: 'Consultoría de marketing para clínicas dentales',
    description: 'Diagnóstico y asesoría de marketing odontológico durante 3 meses: auditamos tu ecosistema digital y tu atención por WhatsApp para que cada consulta se convierta en turno. Córdoba.',
    h1: 'Consultoría y diagnóstico de marketing para clínicas dentales',
    lead: 'Antes de invertir en publicidad, ordenamos la casa. Durante 3 meses auditamos tu ecosistema digital y tu sistema de atención para que cada paciente que llegue tenga dónde convertirse en turno.',
    why: {
      title: 'Por qué empezar por acá',
      text: 'Un sistema de captación funciona, pero no todas las clínicas están listas para recibirlo. Si las consultas no se responden a tiempo, si el paciente no entiende la propuesta o nadie hace el seguimiento, la inversión en publicidad se pierde. La Fase 1 asienta las bases para que eso no pase.',
    },
    forWho: [
      'Recibís consultas por WhatsApp, pero muchas quedan sin respuesta o sin seguimiento.',
      'Invertiste en publicidad y no sabés qué te devolvió.',
      'Tu web, tu perfil de Google o tus redes no muestran lo que hacés ni cuánto vale.',
      'Tu equipo responde precios por mensaje y el paciente desaparece.',
      'Querés crecer en implantes, ortodoncia o ATM, pero no tenés una oferta clara.',
    ],
    deliverables: [
      { title: 'Auditoría del ecosistema digital', text: 'Web, perfil de Google Business, redes y medición: qué funciona, qué falta y qué está frenando consultas.' },
      { title: 'Sistema de comunicación', text: 'Flujo de atención por WhatsApp, tiempos de respuesta y guiones para responder dudas y objeciones antes de que el paciente se vaya a pensar.' },
      { title: 'CRM y seguimiento de consultas', text: 'Un sistema simple para que ningún lead se pierda: desde la primera consulta hasta el turno confirmado, todo rastreado.' },
      { title: 'Oferta clara por tratamiento', text: 'Materiales, proceso clínico, tiempos y precio para implantes, ortodoncia y ATM. El paciente particular necesita entender qué está pagando.' },
      { title: 'Financiación para el paciente', text: 'Opciones de cuotas por tratamiento, para que el presupuesto no sea el motivo del “lo voy a pensar”.' },
      { title: 'Acompañamiento durante 3 meses', text: 'Asesoría continua con tu equipo para implementar los cambios, no un informe que queda en un cajón.' },
    ],
    process: [
      { when: 'Mes 1', title: 'Diagnóstico', text: 'Auditamos el ecosistema digital y el recorrido real de una consulta: desde que el paciente te encuentra hasta que agenda (o no).' },
      { when: 'Mes 2', title: 'Implementación', text: 'Ordenamos la atención por WhatsApp, instalamos el seguimiento de consultas y armamos la oferta por tratamiento.' },
      { when: 'Mes 3', title: 'Puesta a punto', text: 'Medimos cómo responde la clínica con los cambios y evaluamos juntos si está lista para la Fase 2.' },
    ],
    outcome: {
      title: 'Al terminar la Fase 1',
      items: [
        'Una atención ordenada, con respuestas rápidas y guiones probados.',
        'Cada consulta registrada y con seguimiento.',
        'Una oferta clara por tratamiento, con opciones de financiación.',
        'Una clínica lista para recibir pacientes calificados y convertirlos en turnos.',
      ],
    },
    faqs: [
      { q: '¿Por qué no empezar directamente con publicidad?', a: 'Porque si la atención no está preparada, la inversión se pierde: los pacientes consultan, no reciben respuesta a tiempo o no entienden la propuesta, y se van. Primero nos aseguramos de que cada consulta tenga dónde convertir.' },
      { q: '¿Todas las clínicas tienen que hacer la Fase 1?', a: 'No. Empezamos con una evaluación inicial gratuita de 30 minutos. Si tu clínica ya está preparada para recibir pacientes, pasamos directo a la Fase 2.' },
      { q: '¿Cuánto dura la Fase 1?', a: 'Tres meses de acompañamiento, en los que auditamos, implementamos los cambios con tu equipo y evaluamos el resultado.' },
      { q: '¿Qué necesito de mi equipo?', a: 'Acceso a tus canales (web, redes, perfil de Google y WhatsApp) y tiempo de la persona que atiende las consultas, porque el flujo de atención se trabaja con ella.' },
      { q: '¿Cuánto cuesta?', a: 'Depende del punto de partida de tu clínica. Lo definimos después de la evaluación inicial, con una propuesta concreta.' },
    ],
  },

  2: {
    seoTitle: 'Captación de pacientes para clínicas dentales',
    description: 'Sistema de captación de pacientes particulares para clínicas dentales: Google Ads, Meta Ads, web con landings por tratamiento y WhatsApp, medido de punta a punta. Garantía de 20 turnos al mes 3.',
    h1: 'Sistema de captación de pacientes para clínicas dentales',
    lead: 'Instalamos el sistema completo y enviamos tráfico de alto valor: pacientes que buscan implantes, ortodoncia o ATM y llegan a tu WhatsApp listos para agendar.',
    why: {
      title: 'Un ecosistema, no campañas sueltas',
      text: 'Cada pieza cumple una función: la publicidad atrae al paciente que ya está buscando, la web y las landings le explican el tratamiento, WhatsApp lo convierte en turno y la medición nos dice qué ajustar. Sabés exactamente qué invertiste y cuántos turnos obtuviste.',
    },
    forWho: [
      'Tu atención ya está ordenada, o pasaste por la Fase 1.',
      'Querés llenar turnos de tratamientos de alto valor: implantes, ortodoncia, ATM.',
      'Querés depender menos del boca en boca y de la obra social.',
      'Querés ver números reales: inversión, consultas y turnos, mes a mes.',
    ],
    deliverables: [
      { title: 'Web + 3 landings', text: 'Páginas de alto valor para implantes, ortodoncia y ATM / bruxismo.' },
      { title: 'Google Ads', text: 'Campañas de búsqueda para pacientes que ya están buscando el tratamiento.' },
      { title: 'Google Business Profile', text: 'Aparición en mapas y búsquedas locales en tu zona.' },
      { title: 'GTM + GA4', text: 'Medición completa de eventos, conversiones y comportamiento.' },
      { title: 'Meta Ads', text: 'Campañas en Facebook e Instagram segmentadas por zona y perfil.' },
      { title: 'WhatsApp Business', text: 'Vinculado y configurado con flujo de atención desde el día 1.' },
    ],
    process: TIMELINE.map(t => ({ when: t.when, title: t.title, text: t.text || t.items.join(' · ') })),
    results: {
      title: `Resultados reales · ${RESULTS.periodo}`,
      note: 'Clínicas dentales activas en Córdoba, con el sistema completo.',
      items: [
        { value: fmt(RESULTS.leads), label: 'pacientes potenciales' },
        { value: String(RESULTS.turnos), label: 'turnos confirmados' },
        { value: `$${fmt(RESULTS.costoTurnoEspecial)}`, label: 'costo por turno de tratamiento especial' },
      ],
    },
    guarantee: `Si al mes 3 no llegamos a ${RESULTS.metaTurnosMes} turnos agendados por mes de pacientes calificados, el mes 4 no se cobra.`,
    outcome: {
      title: 'Lo que medimos cada mes',
      items: [
        'Leads capturados: formulario y WhatsApp, todo lo que entra.',
        'Turnos agendados: la métrica que más le importa a tu clínica.',
        'Costo por lead calificado, mes a mes.',
        'Tasa de conversión de consulta a turno.',
      ],
    },
    faqs: [
      { q: '¿En cuánto tiempo llegan las primeras consultas?', a: 'El primer mes es de instalación: en la semana 3 salen en vivo Google Ads y Meta Ads, y ahí empiezan a llegar las primeras consultas.' },
      { q: '¿Qué pasa si no se llega a la meta?', a: `Nuestra garantía: si al mes 3 no llegamos a ${RESULTS.metaTurnosMes} turnos agendados por mes de pacientes calificados, el mes 4 no se cobra.` },
      { q: '¿Puedo empezar directamente por esta fase?', a: 'Sí, si la evaluación inicial muestra que tu clínica ya está preparada para recibir y convertir pacientes. Si no, empezamos por la Fase 1.' },
      { q: '¿Cómo sé si la inversión funciona?', a: 'Medimos todo con GTM y GA4 y te mostramos cada mes leads, turnos agendados, costo por lead y tasa de conversión. Hay una reunión de seguimiento cada viernes.' },
      { q: '¿Cuánto cuesta?', a: 'Depende de tu clínica, tu zona y los tratamientos a impulsar. Lo definimos después de la evaluación inicial.' },
    ],
  },

  3: {
    seoTitle: 'Redes sociales para clínicas dentales',
    description: 'Redes sociales y community manager para clínicas y consultorios dentales: contenido y comunidad para fortalecer el canal orgánico y estar presente en todos los canales digitales. Córdoba.',
    h1: 'Redes sociales y community manager para clínicas dentales',
    lead: 'Con la agenda en marcha, fortalecemos el canal orgánico: contenido y comunidad para que tu clínica esté presente en todos los canales digitales donde te buscan tus pacientes.',
    why: {
      title: 'Por qué va después de la captación',
      text: 'El contenido construye confianza a largo plazo, pero rinde de verdad cuando la atención y el sistema de captación ya convierten. Por eso es la tercera fase: suma presencia y reduce la dependencia de la publicidad paga.',
    },
    forWho: [
      'Ya tenés un flujo de pacientes y querés depender menos de la publicidad paga.',
      'Tus redes están desactualizadas o publicás sin una estrategia.',
      'Querés que los pacientes te elijan por confianza antes de comparar precios.',
      'Querés estar presente en todos los canales donde te buscan.',
    ],
    deliverables: [
      { title: 'Estrategia de contenidos', text: 'Líneas de contenido según tus tratamientos y tu paciente ideal, alineadas con lo que impulsa la captación.' },
      { title: 'Calendario y publicación', text: 'Planificación mensual y publicación en los canales de tu clínica.' },
      { title: 'Community manager', text: 'Gestión de comentarios y mensajes, derivando las consultas a WhatsApp para que se conviertan en turnos.' },
      { title: 'Medición del canal orgánico', text: 'Alcance, interacción y consultas que llegan desde las redes, mes a mes.' },
    ],
    process: [
      { when: 'Cada mes', title: 'Planificación', text: 'Definimos temas y piezas según los tratamientos a impulsar.' },
      { when: 'Cada mes', title: 'Publicación y comunidad', text: 'Publicamos y gestionamos comentarios y mensajes.' },
      { when: 'Cada mes', title: 'Reporte', text: 'Medimos qué contenido genera consultas y ajustamos el plan.' },
    ],
    outcome: {
      title: 'Lo que suma la Fase 3',
      items: [
        'Presencia constante en los canales donde te buscan tus pacientes.',
        'Una comunidad que confía en tu clínica antes de consultar.',
        'Más consultas orgánicas, que se suman a las de la publicidad.',
      ],
    },
    faqs: [
      { q: '¿Por qué las redes van en la Fase 3?', a: 'Porque el contenido rinde más cuando la clínica ya atiende bien y el sistema de captación funciona. Primero aseguramos que cada consulta se convierta; después sumamos presencia orgánica.' },
      { q: '¿Puedo contratar solo las redes sociales?', a: 'Lo definimos en la evaluación inicial. Si la atención o la captación tienen fallas, te vamos a recomendar empezar por ahí, porque es lo que más impacto tiene en tu agenda.' },
      { q: '¿Las consultas que llegan por redes se miden?', a: 'Sí. Medimos alcance, interacción y, sobre todo, cuántas consultas llegan desde las redes a WhatsApp.' },
      { q: '¿Cuánto cuesta?', a: 'Depende de los canales y del volumen de contenido. Lo definimos después de la evaluación inicial.' },
    ],
  },
};
