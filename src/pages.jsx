// Registro de páginas: lo usan el cliente (main.jsx), el prerender (entry-server + scripts/prerender.mjs)
// y el sitemap. Para sumar una página: agregarla acá con su componente y sus metadatos.
import React from 'react';
import Landing from './landing/Landing';
import PhasePage from './pages/PhasePage';
import { PHASES, SITE_URL } from './shared/phases';
import { PHASE_CONTENT } from './pages/phase-content';

const ORG_ID = `${SITE_URL}/#empresa`;

export const PAGES = [
  {
    path: '/',
    render: () => <Landing />,
    title: 'Marketing odontológico en Córdoba | La Liga de Marketers',
    description: 'Marketing para clínicas y consultorios dentales en Córdoba, en 3 fases: preparamos tu clínica, instalamos el sistema de captación de pacientes y fortalecemos tus redes. Evaluación inicial sin costo.',
    priority: '1.0',
  },
  ...PHASES.map(p => {
    const c = PHASE_CONTENT[p.n];
    const url = SITE_URL + p.path;
    return {
      path: p.path,
      render: () => <PhasePage n={p.n} />,
      title: `${c.seoTitle} | La Liga de Marketers`,
      description: c.description,
      priority: '0.9',
      schema: [
        {
          '@type': 'Service',
          '@id': `${url}#servicio`,
          name: `Fase ${p.n} · ${p.title}`,
          serviceType: p.title,
          description: c.description,
          url,
          provider: { '@id': ORG_ID },
          areaServed: { '@type': 'City', name: 'Córdoba' },
          audience: { '@type': 'BusinessAudience', name: 'Clínicas y consultorios dentales' },
        },
        {
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: c.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: `Fase ${p.n} · ${p.name}`, item: url },
          ],
        },
      ],
    };
  }),
];

export const normalizePath = path => (path.replace(/\/+$/, '') || '/');
export const findPage = path => PAGES.find(p => p.path === normalizePath(path));
