import { fetchWebPage } from "./fetchWebPage.js";

const text = await fetchWebPage("https://olive-amount-97d.notion.site/Guide-Utilisation-243db2d7883480098d29d8a19da5dfba",
{
  selector: ".notion-page-content",
  waitUntil: "networkidle2",
}
);

console.log(text);