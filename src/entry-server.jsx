// Render del lado servidor, usado solo al compilar (scripts/prerender.mjs) para que el HTML
// publicado ya traiga todo el contenido: los buscadores lo leen sin ejecutar JavaScript.
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render() {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
