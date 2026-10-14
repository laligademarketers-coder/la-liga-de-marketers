import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Load Meta Pixel
window.fbq = window.fbq || function() {
  window.fbq.queue = window.fbq.queue || [];
  window.fbq.queue.push(arguments);
};
window.fbq('init', '1265283559068729');
window.fbq('track', 'PageView');

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
const container = document.getElementById('root');
// En producción el HTML ya viene prerenderizado (scripts/prerender.mjs): React lo hidrata.
// En desarrollo el contenedor llega vacío y se renderiza desde cero.
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);
