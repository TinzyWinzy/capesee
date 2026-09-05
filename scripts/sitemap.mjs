import fs from 'fs';

const base = 'https://www.capesee.com';
const places = ['castle-of-good-hope','kirstenbosch','stellenbosch','hermanus'];
const tours = ['stellenbosch-wine-experience','cape-peninsula-tour','cape-town-walking-tour','hermanus-whale-watching'];
const staticRoutes = [
  'discover','discover/map','discover/gallery','discover/nearby','discover/search','discover/regions','discover/places',
  'book','book/tours','book/experiences','book/stays','book/transfers',
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const r of staticRoutes) xml += `  <url><loc>${base}/${r}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
for (const p of places) xml += `  <url><loc>${base}/discover/places/${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
for (const t of tours) xml += `  <url><loc>${base}/book/tours/${t}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
xml += `</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', xml);
if (fs.existsSync('dist')) fs.writeFileSync('dist/sitemap.xml', xml);
console.log(`sitemap wrote ${staticRoutes.length + places.length + tours.length} urls -> public/sitemap.xml (+ dist)`);
