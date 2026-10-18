import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { PageRouter } from "./PageRouter";
import { SeoHead } from "./seo";
import { site, pageDefinitions } from "./site";
import type { PagePath } from "./site";
export function renderPage(path: PagePath, notFound = false) {
  return {
    html: renderToString(<PageRouter path={notFound ? "/404" : path} />),
    head: renderToStaticMarkup(<SeoHead path={path} notFound={notFound} />),
    origin: site.origin,
    indexable: site.indexable,
    pages: Object.keys(pageDefinitions),
  };
}
