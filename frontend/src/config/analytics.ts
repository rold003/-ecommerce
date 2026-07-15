declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let activo = false;

// Sin VITE_GA_MEASUREMENT_ID configurado, esto no hace nada: nunca se carga
// el script de Google ni se llama gtag() en ningun lado (ver trackEvent/
// trackPageview mas abajo, que quedan como no-ops seguros).
export function initAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  // send_page_view en false: las vistas se mandan a mano en cada cambio de
  // ruta (ver trackPageview / useAnalyticsPageview), porque en una SPA el
  // "config" inicial de gtag solo ve la primera carga, no la navegacion
  // interna de React Router.
  // debug_mode en desarrollo: hace que los eventos aparezcan al instante en
  // Admin > DebugView de GA4, que es mas confiable que "Tiempo real" para
  // confirmar que un evento puntual llego bien (Tiempo real puede tardar
  // minutos en propagar, DebugView es casi inmediato).
  window.gtag('config', measurementId, { send_page_view: false, debug_mode: import.meta.env.DEV });

  activo = true;
}

export function trackPageview(path: string): void {
  if (!activo) return;
  window.gtag('event', 'page_view', { page_path: path });
}

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
}

export function trackEvent(name: string, params: Record<string, unknown>): void {
  if (!activo) return;
  window.gtag('event', name, params);
}
