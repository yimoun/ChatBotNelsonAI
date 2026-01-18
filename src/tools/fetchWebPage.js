// Un script qui va recupérer la documentation sur un site (notion.so...personalisé) pour retourner un text souhaité

//https://olive-amount-97d.notion.site/Guide-Utilisation-243db2d7883480098d29d8a19da5dfba
import puppeteer from "puppeteer";

export async function fetchWebPage(
  url,
  options = {}
) {
  const {
    selector,
    waitUntil = "networkidle2",
  } = options;
    let browser = null;
    try {
      browser = await puppeteer.launch();
      const page = await browser.newPage();

      // aller sur la page
      await page.goto(url, { waitUntil: waitUntil });

      // si un sélecteur est fourni, attendre et extraire cet élément
      if (selector) {
        await page.waitForSelector(selector);
        const text = await page.evaluate((selector) => {
          const el = document.querySelector(selector);
          return el  ? el.innerText || el.textContent || "" : "";
        }, selector);
        await browser.close();
        return  text;
      }
      else {
           // sinon extraire le texte du body (fallback)
            const text = await page.evaluate(() => document.body.innerText || "");
            await browser.close();
            return text;
      }
    } catch (err) {
       throw new Error(
    `fetchDocumentation failed for ${url}. error: ${String(
      err
    )}`
  );
    }
  }
