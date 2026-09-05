import fs from 'fs';
import path from 'path';

/**
 * Minimal prerender: copies dist/index.html into route folders with injected SEO meta.
 * This gives crawlers distinct HTML per URL without needing JS execution.
 * Full JS hydrates anyway; this just fixes the SPA empty-shell problem.
 */
const routes = [
  { path: 'discover', title: 'Discover the Cape — Capesee', desc: 'Follow living discoveries, source-backed stories and memorable local experiences — all connected to place.', image: '/images/IMG-20260823-WA0114.jpg' },
  { path: 'discover/map', title: 'Living Map — Cape Discoveries — Capesee', desc: 'Explore the living map: verified places and traveler discoveries pinned to real coordinates across the Cape.' },
  { path: 'discover/gallery', title: 'Field Gallery — Capesee', desc: 'Browse 84 field photos and 15 videos from the Cape — shot in the field.' },
  { path: 'discover/places', title: 'Places — Western Cape — Capesee', desc: 'Browse verified places across the Western Cape — Castle of Good Hope, Kirstenbosch, Stellenbosch and more.' },
  { path: 'discover/places/castle-of-good-hope', title: 'Castle of Good Hope — Capesee', desc: 'The oldest surviving colonial building in South Africa, a pentagonal fort built 1666–1679 — source-backed timeline and traveler reports.', image: '/images/IMG-20260823-WA0131.jpg' },
  { path: 'discover/places/kirstenbosch', title: 'Kirstenbosch National Botanical Garden — Capesee', desc: 'World-renowned botanical garden against Table Mountain — history, discoveries and experiences.', image: '/images/IMG-20260823-WA0185.jpg' },
  { path: 'discover/places/stellenbosch', title: 'Stellenbosch — Capesee', desc: "One of South Africa's oldest towns, centre of the Cape winelands — verified history and local stays.", image: '/images/IMG-20260823-WA0179.jpg' },
  { path: 'book/tours', title: 'Tours — Western Cape — Capesee', desc: 'Browse guided Cape tours — Stellenbosch wine, Peninsula routes, whale watching and city walks.' },
  { path: 'book/stays', title: 'Stays — Capesee', desc: 'Book stays across the Cape — lodges, villas and heritage stays rooted in place.' },
];

const dist = 'dist';
const baseHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

for (const r of routes) {
  const canonical = `https://www.capesee.com/${r.path}`;
  const img = r.image ? `https://www.capesee.com${r.image}` : 'https://www.capesee.com/images/IMG-20260823-WA0114.jpg';
  // inject/overwrite <title>, <meta name="description">, <link rel="canonical">, og/twitter
  let html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${r.title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${r.desc}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${r.title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${r.desc}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${img}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${r.title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${r.desc}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${img}" />`);

  const outDir = path.join(dist, r.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`prerendered ${r.path}`);
}
// also copy discover/index.html to root for / -> /discover parity
fs.copyFileSync(path.join(dist, 'discover/index.html'), path.join(dist, 'index.html'));
console.log('prerender done');
