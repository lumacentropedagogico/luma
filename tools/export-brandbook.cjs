// Exporta brand-book/index.html a PDF: cada <section> es una página de 1280 px
// de ancho con la altura exacta de su contenido (se lee como una web).
const { chromium } = require('playwright');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const src = 'file://' + path.join(root, 'brand-book/index.html');
const out = path.join(root, 'brand-book/luma-brand-book.pdf');
const preview = process.argv[2]; // opcional: ruta para un PNG de página completa

(async () => {
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(src, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(() => document.fonts.ready);

const heights = await page.$$eval('body > section', els => els.map(e => Math.ceil(e.getBoundingClientRect().height)));
await page.addStyleTag({ content: heights.map((h, i) => `@page s${i} { size: 1280px ${h}px; margin: 0; } body > section:nth-of-type(${i + 1}) { page: s${i}; }`).join('\n') });
await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true });
if (preview) { await page.emulateMedia({ media: 'screen' }); await page.screenshot({ path: preview, fullPage: true }); }
console.log('pages', heights.length, 'heights', heights.join(','));
await browser.close();
})();
