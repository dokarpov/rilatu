const {test,expect}=require('@playwright/test');
const origin='http://127.0.0.1:8765/';
const widths=[320,375,390,768,1024,1360,1440,1920];

for (const width of widths) {
  test('live Rilatu film: responsive read-only evidence walkthrough '+width,async({browser})=>{
    // Reduced motion makes layout and content deterministic without weakening
    // the separate auto-play timing test in film.spec.js.
    const context=await browser.newContext({
      viewport:{width,height:width<600?844:900},
      reducedMotion:'reduce'
    });
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    try {
      const response=await page.goto(origin,{waitUntil:'domcontentloaded'});
      expect(response.status()).toBe(200);
      const film=page.locator('.rilatu-film');
      await expect(film).toBeVisible();
      await film.scrollIntoViewIfNeeded();
      await expect(page.locator('.rilatu-film-legacy')).toBeHidden();
      await expect(page.locator('#filmCounter')).toHaveText('04 / 04');
      await expect(page.locator('#filmResultTitle')).toContainText('Not certified');
      await expect(page.locator('.rilatu-film-doc.linked')).toHaveCount(3);
      await expect(page.locator('.rilatu-film button')).toHaveCount(0);
      const bounds=await page.evaluate(()=>{
        const film=document.querySelector('.rilatu-film');
        const box=film.getBoundingClientRect();
        const root=document.documentElement;
        return {
          viewport:innerWidth,
          scrollWidth:root.scrollWidth,
          filmLeft:box.left,
          filmRight:box.right,
          filmWidth:box.width
        };
      });
      expect(bounds.scrollWidth,'document horizontal overflow').toBeLessThanOrEqual(width+2);
      expect(bounds.filmLeft,'film outside left edge').toBeGreaterThanOrEqual(-2);
      expect(bounds.filmRight,'film outside right edge').toBeLessThanOrEqual(width+2);
      expect(bounds.filmWidth,'film should remain visible').toBeGreaterThan(120);
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

test('live site loads external style, film, and visual identity assets',async({page,request})=>{
  for(const path of ['film.css','film.js','styles.css','script.js','rilatu-logo.svg']){
    const response=await request.get(origin+path);
    expect(response.ok(),path+' not served').toBeTruthy();
  }
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await expect(page.locator('img[src^="rilatu-logo.svg"]').first()).toBeVisible();
});
