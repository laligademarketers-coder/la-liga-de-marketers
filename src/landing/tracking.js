export function pushEvent(name, extra = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, event_id: `${name}_${Date.now()}`, ...extra });
}
