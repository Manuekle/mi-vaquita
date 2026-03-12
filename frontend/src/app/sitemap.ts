import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mivaquita.com'; // Ajustar según el dominio real

  // Rutas estáticas
  const routes = [
    '',
    '/menu',
    '/turnos',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // En el futuro, aquí se podrían añadir slugs de categorías de productos si tuvieran páginas propias
  // como /categoria/cupcakes, etc.

  return [...routes];
}
