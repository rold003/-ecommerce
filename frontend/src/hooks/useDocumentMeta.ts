import { useEffect } from 'react';

const SITE_NAME = 'Tienda Online';

function setMetaDescription(content: string): void {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Actualiza <title> y la meta description al montar la pagina, y los restaura
 * al desmontar. No reemplaza Open Graph para compartir en redes (eso necesita
 * SSR/prerender, que esta app no tiene), pero sirve para la pestaña del
 * navegador y para crawlers que si ejecutan JS (como Googlebot).
 */
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    const tituloPrevio = document.title;
    document.title = `${title} | ${SITE_NAME}`;
    if (description) setMetaDescription(description);

    return () => {
      document.title = tituloPrevio;
    };
  }, [title, description]);
}
