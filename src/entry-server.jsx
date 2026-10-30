// Render del lado servidor, usado solo al compilar (scripts/prerender.mjs) para que cada página
// publicada ya traiga todo su contenido: los buscadores lo leen sin ejecutar JavaScript.
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { PAGES } from './pages';
import { SITE_URL } from './shared/phases';

export { PAGES, SITE_URL };

export function render(path) {
  return renderToString(
    <React.StrictMode>
      <App path={path} />
    </React.StrictMode>
  );
}
