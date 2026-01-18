import { fetchWebPage } from "./fetchWebPage.js";

const text = await fetchWebPage('https://olive-amount-97d.notion.site/Frais-de-livraison-243db2d7883480a2bb72c763ef5780d0',
{
  selector: ".notion-page-content",
  waitUntil: "networkidle2",
}
);

console.log(text);