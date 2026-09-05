import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const base = 'https://www.capesee.com';
const fallbackPlaces = ['castle-of-good-hope','kirstenbosch','stellenbosch','hermanus'];
const fallbackTours = ['stellenbosch-wine-experience','cape-peninsula-tour','cape-town-walking-tour','hermanus-whale-watching'];
const staticRoutes = [
  'discover','discover/map','discover/gallery','discover/nearby','discover/search','discover/regions','discover/places',
  'book','book/tours','book/experiences','book/stays','book/transfers',
];

let places = fallbackPlaces;
let tours = fallbackTours;
try {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    const supa = createClient(url, key);
    const [{ data: pData }, { data: tData }] = await Promise.all([
      supa.from('places').select('slug').eq('status','published').limit(200),
      supa.from('products').select('slug').eq('status','published').eq('product_type','tour').limit(200),
    ]);
    if (pData?.length) places = pData.map(r => r.slug);
    if (tData?.length) tours = tData.map(r => r.slug);
    console.log(`sitemap DB: ${places.length} places, ${tours.length} tours`);
  } else {
    console.log('sitemap: no Supabase env, using fallback');
  }
} catch (e) {
  console.warn('sitemap DB fetch failed, fallback', String(e).slice(0,120));
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for (const r of staticRoutes) xml += `  <url><loc>${base}/${r}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
for (const p of places) xml += `  <url><loc>${base}/discover/places/${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
for (const t of tours) xml += `  <url><loc>${base}/book/tours/${t}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
xml += `</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', xml);
if (fs.existsSync('dist')) fs.writeFileSync('dist/sitemap.xml', xml);
console.log(`sitemap wrote ${staticRoutes.length + places.length + tours.length} urls -> public/sitemap.xml (+ dist)`);
