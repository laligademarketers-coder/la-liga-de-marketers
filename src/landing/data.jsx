// Datos de la landing. Para actualizar resultados, editar solo este archivo.
export const RESULTS = {
  periodo: 'Julio 2026',
  leads: 685,                // pacientes potenciales generados
  turnos: 28,                // turnos confirmados (lo que llega a la mini-agenda dorada)
  inversion: 452988,         // ARS
  costoTurnoEspecial: 15000, // ARS, base de la calculadora
  metaTurnosMes: 20,         // garantía
};

export const WA_NUMBER = '5493512033845';
export const WA_PHONE_LABEL = '+54 9 351 203-3845';
export const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  'Hola, quiero saber cómo conseguir más pacientes particulares para mi clínica dental'
)}`;

export const PAINS = [
  { title: ['Agenda', 'impredecible'], desc: 'No sabés cuántos pacientes tenés el mes que viene. Dependés del boca en boca y de lo que manda la obra social.' },
  { title: ['Más obra social', 'que caja'], desc: 'Trabajás el doble por la mitad del ingreso. Los pacientes particulares existen y tienen con qué pagar, pero no te encuentran.' },
  { title: ['Alto valor,', 'sin demanda'], desc: 'Hacés implantes, ortodoncia y ATM, pero esos turnos no se llenan. El problema no es tu calidad: nadie sabe que los ofrecés.' },
];

export const SEARCH_LINES = [
  <>Ahora mismo, alguien en Córdoba está buscando <em>un implante.</em></>,
  <>Tiene con qué pagarlo. Tiene urgencia.</>,
  <>Va a elegir al primero que aparezca.</>,
  <>Hoy, ese primero <em>no sos vos.</em></>,
];

export const NODES = [
  { k: 'gads',  icon: 'googleads', label: 'Google Ads',       sub: 'Te busca' },
  { k: 'meta',  icon: 'meta',      label: 'Meta Ads',         sub: 'Te descubre' },
  { k: 'gmb',   icon: 'googlemaps', label: 'Google Maps',     sub: 'Te ubica' },
  { k: 'web',   icon: 'wordpress', label: 'Web + 3 landings', sub: 'Implantes · Orto · ATM' },
  { k: 'wa',    icon: 'whatsapp',  label: 'WhatsApp',         sub: 'Te escribe' },
];

export const TIMELINE = [
  { when: 'Mes 1 · Semana 1', title: 'Arranque', text: 'Reunión de arranque, recolección de accesos y brief del consultorio.' },
  { when: 'Mes 1 · Semana 2', title: 'Construcción', text: 'Web nueva + 3 landings + tracking instalado + ecosistema Meta configurado.' },
  { when: 'Mes 1 · Semana 3', title: 'En vivo', text: 'Google Ads + Meta Ads en vivo. Primeras consultas llegando.' },
  { when: 'Mes 1 · Semana 4', title: 'Primer ajuste', text: 'Primera evaluación de datos y ajustes.' },
  { when: 'Mes 2', title: 'Optimización', items: ['Optimización semanal de campañas', 'Ajuste de palabras clave y creativos', 'Reunión de 15–30 min cada viernes', 'Reporte: leads, turnos, costo por paciente'] },
  { when: 'Mes 3', title: 'Decisión', items: ['Evaluación completa de los 3 meses', 'Decisión de continuidad basada en datos reales'] },
];

export const EXTRAS = [
  { title: 'Financiación para el paciente', text: 'Cuotas propias para ortodoncia, bancaria para implantes y ATM. El "no tengo presupuesto" desaparece.' },
  { title: 'CRM y seguimiento', text: 'Ningún lead se pierde: desde la primera consulta hasta el turno confirmado, todo rastreado.' },
  { title: 'Scripts de WhatsApp', text: 'Respuestas a dudas y objeciones antes de que el paciente se vaya a pensar.' },
  { title: 'Oferta clara por tratamiento', text: 'Materiales, proceso, tiempos y precio. El paciente particular necesita entender qué paga.' },
];

export const NOT_INCLUDED = ['Community management', 'Diseño de marca o logo', 'SEO orgánico'];

export const CHALLENGES = [
  'Quiero más pacientes particulares',
  'Necesito llenar turnos de implantes',
  'Quiero crecer en ortodoncia',
  'Quiero más turnos de ATM / bruxismo',
  'Mi agenda es muy impredecible',
];

// Agenda semanal: 5 días × 6 horarios. Patrón fijo para que el "antes" y el "después" coincidan.
export const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
export const HOURS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'];
const EMPTY = new Set([2, 7, 11, 16, 19, 23, 27, 29]);
const STILL_OS = new Set([4, 13, 21, 26]);
const TREAT = ['Implante', 'Ortodoncia', 'ATM / Bruxismo', 'Implante', 'Blanqueamiento', 'Ortodoncia', 'Consulta'];
export const AGENDA = Array.from({ length: DAYS.length * HOURS.length }, (_, i) => ({
  before: EMPTY.has(i) ? 'empty' : 'os',
  after: STILL_OS.has(i) ? 'os' : (i % 5 === 1 || i % 7 === 0) ? 'gold' : 'particular',
  treatment: TREAT[i % TREAT.length],
}));
