// Exporta lead-magnet/index.html a PDF (páginas 1080 × 1920) y a PNG por página.
const { chromium } = require('playwright');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const src = 'file://' + path.join(root, 'lead-magnet/index.html');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(src, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(root, 'lead-magnet/conocerte-es-el-primer-paso-LUMA.pdf'), printBackground: true, preferCSSPageSize: true });
  const pages = await page.$$('section.page');
  for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(root, `lead-magnet/png/pagina-${i + 1}.png`) });
  console.log('pages', pages.length);
  await browser.close();
})();
