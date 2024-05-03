import { getVQD } from "duck-duck-scrape";
import { queryString } from "duck-duck-scrape/src/util";
import needle from "needle";

const SEARCH_REGEX =
  /DDG\.pageLayout\.load\('d',(\[.+])\);DDG\.duckbar\.load\('images'/;

// basically its copy from duck-duck-scrape + duckduckgo_search python lib
// # from duckduckgo_search python lib
// GET https://links.duckduckgo.com/d.js?q=RoCry&kl=wt-wt&l=wt-wt&bing_market=wt-wt&s=0&vqd=4-332371499731888456852986843812975699584&sp=0&p=1
// # from duck-duck-scrape
// GET https://links.duckduckgo.com/d.js?q=RoCry&t=D&l=wt-wt&kl=wt-wt&s=0&dl=en&ct=US&ss_mkt=wt-wt&df=a&vqd=4-332371499731888456852986843812975699584&ex=-2&sp=1&bpa=1&biaexp=b&msvrtexp=b&nadse=b&eclsexp=b&tjsexp=b
export async function simpleSearch(query: string) {
  if (!query) throw new Error("Query cannot be empty!");

  const vqd = await getVQD(query, "web");
  const queryObject: Record<string, string> = {
    q: query,
    l: "wt-wt", // 'wt-wt' is the default locale
    kl: "wt-wt", // 'wt-wt' is the default locale
    bing_market: "wt-wt",
    s: "0", // offset
    vqd,
    sp: "0",
    p: "1",
  };

  const response = (await needle(
    "get",
    `https://links.duckduckgo.com/d.js?${queryString(queryObject)}`
  )) as {
    body: string;
  };

  return response;
}
