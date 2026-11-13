import { chromium } from '/Users/pooya.nikbakht/.claude/tools/browser/node_modules/playwright/index.mjs';

const URL = 'http://localhost:3100/work/kingsway-cuts';
const OUT = '/private/tmp/claude-502/-Users-pooya-nikbakht-pooya/c4890d05-7391-4dec-b1df-169657c7ff3a/scratchpad/shots9';

const viewports = [
  { name: '360', width: 360, height: 800, file: `${OUT}/01-mobile-360x800.png` },
  { name: '1280', width: 1280, height: 800, file: `${OUT}/02-desktop-1280x800.png` },
];

const browser = await chromium.launch({ headless: true });
let fails = 0;
const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  if (!ok) fails++;
};

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  const badRequests = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message.slice(0, 160)}`));
  page.on('requestfailed', (r) => badRequests.push(`failed ${r.url().slice(0, 120)}`));
  page.on('response', (r) => { if (r.status() >= 400) badRequests.push(`${r.status()} ${r.url().slice(0, 120)}`); });

  const resp = await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  check(Boolean(resp && resp.ok()), `${vp.name}px page loaded (HTTP ${resp?.status()})`);
  await page.waitForSelector('header h1', { timeout: 30000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((res) => { img.onload = img.onerror = res; })));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);

  const m = await page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: Math.round(b.top), left: Math.round(b.left), bottom: Math.round(b.bottom), right: Math.round(b.right) };
    };
    const area = (el) => { const b = el.getBoundingClientRect(); return b.width * b.height; };
    const h1 = document.querySelector('header h1');
    const img = [...document.querySelectorAll('header img')].sort((a, b) => area(b) - area(a))[0];
    const summary = document.querySelector('header .max-w-2xl.text-lg');
    const eyebrow = document.querySelector('header p');
    const nav = document.querySelector('header nav[aria-label="Breadcrumb"]');
    const pills = document.querySelector('header ul[aria-label="Categories"]');
    const tags = document.querySelector('header ul[aria-label="Stack"]');
    const btns = [...document.querySelectorAll('header a.min-h-12')];
    const btnTop = Math.min(...btns.map((b) => b.getBoundingClientRect().top));
    const btnBottom = Math.max(...btns.map((b) => b.getBoundingClientRect().bottom));
    const btnLeft = Math.min(...btns.map((b) => b.getBoundingClientRect().left));
    const h1Box = box(h1);
    const sumBox = box(summary);
    const imgBox = box(img);
    const textBottom = Math.max(btnBottom, tags?.getBoundingClientRect().bottom ?? 0, pills?.getBoundingClientRect().bottom ?? 0);
    const eyeBox = box(eyebrow);
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      eyebrowText: eyebrow?.textContent?.trim(),
      eyebrowTransform: eyebrow ? getComputedStyle(eyebrow).textTransform : null,
      h1: h1Box,
      h1Text: h1?.textContent?.trim().slice(0, 40),
      img: imgBox,
      imgLoaded: img ? img.complete && img.naturalWidth > 0 : false,
      imgAlt: img?.alt?.slice(0, 50),
      summary: sumBox,
      summaryText: summary?.textContent?.trim().slice(0, 40),
      nav: box(nav),
      eyebrowBox: eyeBox,
      pills: box(pills),
      tags: box(tags),
      buttons: { top: Math.round(btnTop), left: Math.round(btnLeft), bottom: Math.round(btnBottom), count: btns.length },
      textColTop: eyeBox?.top,
      textColBottom: Math.round(textBottom),
      textColLeft: eyeBox?.left,
    };
  });

  const r = (b) => (b ? `${b.top}/${b.left}` : 'n/a');
  console.log(`--- ${vp.name}px ---`);
  console.log(`h1 top/left ${r(m.h1)} | img top/left ${r(m.img)} (${m.img?.right - m.img?.left}x${m.img?.bottom - m.img?.top}) | summary top/left ${r(m.summary)}`);
  console.log(`nav ${r(m.nav)} | eyebrow ${r(m.eyebrowBox)} "${m.eyebrowText}" transform=${m.eyebrowTransform} | pills ${r(m.pills)} | tags ${r(m.tags)} | buttons ${m.buttons.top}/${m.buttons.left} (${m.buttons.count})`);
  console.log(`scrollWidth ${m.scrollWidth} vs viewport ${m.viewport}`);
  console.log(`img loaded=${m.imgLoaded} alt="${m.imgAlt}" | summary text starts "${m.summaryText}" | h1 "${m.h1Text}"`);

  check(m.scrollWidth <= m.viewport, `${vp.name}px no horizontal overflow (${m.scrollWidth} <= ${m.viewport})`);
  check(m.imgLoaded, `${vp.name}px hero image loaded`);

  if (vp.name === '360') {
    const order = [m.nav, m.eyebrowBox, m.h1, m.img, m.summary, m.pills, m.tags, { top: m.buttons.top }];
    const ascending = order.every((b, i) => i === 0 || (b.top >= order[i - 1].top));
    check(ascending && m.img.top >= m.h1.bottom && m.img.top < m.summary.top,
      `360px stacked order breadcrumbs > eyebrow > h1 > image > summary > pills > tags > buttons`);
    check(m.img.left === m.summary.left && m.h1.left === m.summary.left, '360px single column (left edges aligned)');
  } else {
    check(m.img.left > m.h1.left && m.img.left > m.summary.left && m.img.left >= m.textColLeft,
      '1280px text column left, image right');
    const textCenter = (m.textColTop + m.textColBottom) / 2;
    const imgCenter = (m.img.top + m.img.bottom) / 2;
    const centerDiff = Math.round(Math.abs(textCenter - imgCenter));
    const gap = m.summary.top - m.h1.bottom;
    console.log(`1280 vertical centre diff ${centerDiff}px (text ${Math.round(textCenter)} vs image ${Math.round(imgCenter)}) | h1-to-summary gap ${gap}px`);
    check(centerDiff <= 40, `1280px text block vertically centred against image (diff ${centerDiff}px, tolerance 40px)`);
    check(gap <= 40, `1280px no big gap title to summary (gap ${gap}px, tolerance 40px)`);
  }

  const shownErrors = consoleErrors.slice(0, 5);
  console.log(`console errors (${consoleErrors.length}): ${shownErrors.length ? shownErrors.join(' || ') : 'none'}`);
  console.log(`bad requests (${badRequests.length}): ${badRequests.slice(0, 5).join(' || ') || 'none'}`);

  await page.screenshot({ path: vp.file, fullPage: false });
  console.log(`saved ${vp.file}`);
  await context.close();
}

await browser.close();
console.log(`TOTAL FAILS: ${fails}`);
