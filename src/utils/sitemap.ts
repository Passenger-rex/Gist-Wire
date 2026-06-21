import { Article } from '../types';

export const generateSitemap = (articles: Article[], baseUrl: string = 'https://gistwire.com') => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Static routes
  const staticRoutes = ['/', '/about', '/contact', '/category/Celebrity%20News', '/category/Tech'];
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Dynamic article routes
  articles.forEach(article => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/post/${article.slug || article.id}</loc>\n`;
    xml += `    <lastmod>${new Date(article.publishDate).toISOString()}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
};
