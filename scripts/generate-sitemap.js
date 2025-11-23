import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// List of canonical routes to include in sitemap
const baseUrl = 'https://www.gobuild.in';
const routes = [
  '/',
  '/services',
  '/blog',
  '/about',
  '/contact',
  '/profile',
  '/pricing',
  '/policy',
  '/terms',
  '/refund-policy',
  '/categories',
];

function buildSitemap() {
  const now = new Date().toISOString();
  const urlset = routes
    .map((route) => {
      return `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>`;

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('Sitemap written to', outPath);
}

if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.js')) {
  buildSitemap();
}

export { buildSitemap };
