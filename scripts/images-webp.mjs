import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = 'public/images';
const files = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.jpg'));
console.log(`Converting ${files.length} JPGs to WebP...`);
let totalJpg = 0, totalWebp = 0;
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = src.replace(/\.jpg$/i, '.webp');
  if (fs.existsSync(dest)) continue; // skip if exists
  const jpgSize = fs.statSync(src).size;
  totalJpg += jpgSize;
  await sharp(src).webp({ quality: 76 }).toFile(dest);
  const webpSize = fs.statSync(dest).size;
  totalWebp += webpSize;
  const saving = ((1 - webpSize/jpgSize)*100).toFixed(1);
  console.log(`${file}: ${(jpgSize/1024).toFixed(0)}KB -> ${(webpSize/1024).toFixed(0)}KB (${saving}% saved)`);
}
console.log(`Total JPG ${(totalJpg/1024/1024).toFixed(2)}MB -> WebP ${(totalWebp/1024/1024).toFixed(2)}MB saving ${((1-totalWebp/totalJpg)*100).toFixed(1)}%`);
