import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Load Meta Pixel
window.fbq = window.fbq || function() { 
  window.fbq.queue = window.fbq.queue || [];
  window.fbq.queue.push(arguments);
};
window.fbq('init', '1282058290533379');
window.fbq('track', 'PageView');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
