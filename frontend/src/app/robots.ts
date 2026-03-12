import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // No queremos que los buscadores indexen el panel de administración
    },
    sitemap: 'https://mivaquita.com/sitemap.xml',
  };
}
