/**
 * @typedef UrlItem
 * @property {string} loc
 * @property {string} [lastmod]
 */

/**
 * @typedef CreateSitemapOptions
 * @property {Array<UrlItem>} urls
 */

/**
 * @param {CreateSitemapOptions} param0
 * @returns
 */
export function createSitemap({ urls }) {
  console.log(urls);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n\n';

  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '\txsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '\thttp://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';

  urls.forEach(({ loc, lastmod }) => {
    xml += "\t<url>\n";
    xml += `\t\t<loc>${loc}</loc>\n`;
    xml +=
      typeof lastmod === "string" ? `\t\t<lastmod>${lastmod}</lastmod>\n` : "";
    xml += "\t</url>\n";
  });

  xml += "\n</urlset>\n";

  return xml;
}
