import MarkdownIt from "markdown-it";
import { fromHighlighter } from "markdown-it-shikiji/core";
import { getHighlighterCore, loadWasm } from "shikiji/core";
import postsListText from "./posts-list.txt";
import fm from "front-matter";
import darkTheme from "shikiji/themes/dark-plus.mjs";
import ts from "shikiji/langs/typescript.mjs";
import js from "shikiji/langs/javascript.mjs";
import wasm from "./node_modules/shikiji/dist/onig.wasm";
import templateStr from "./template.html";
import { createSitemap } from "./sitemap";
import { ogImage } from "./og-image";

const base = "https://minimalistweb.dev";

/** @type {Array<string>} */
const postsPaths = postsListText.split("\n").filter(Boolean);

await loadWasm((obj) => WebAssembly.instantiate(wasm, obj));

const highlighter = await getHighlighterCore({
  langs: [js, ts],
});

const md = MarkdownIt({ html: true });

md.use(
  fromHighlighter(highlighter, {
    defaultColor: "dark",
    themes: {
      dark: darkTheme,
    },
    langs: [js],
  })
);

/**
 * @typedef {Object} Frontmatter
 * @property {string} title
 * @property {string} description
 * @property {string} created_at
 */

/** @typedef {ReturnType<typeof fm<Frontmatter>>} Content*/

/**
 * @typedef {Object} Env
 * @property {import('@cloudflare/workers-types').Fetcher} ASSETS
 */

export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
   */
  async fetch(request, env, ctx) {
    let metaTitle = "Minimalist Web Dev";
    const requestUrl = new URL(request.url);
    const ogPath = new URL("/og/", requestUrl.origin);

    if (requestUrl.pathname === "/.well-known/nostr.json") {
      return new Response(JSON.stringify(nostr), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "content-type": "application/json",
        },
      })
    }

    // get all the blog posts from assets to have them on /
    if (requestUrl.pathname === "/" || requestUrl.pathname === "/sitemap.xml") {
      const posts = (
        await Promise.all(
          postsPaths.map(async (postPath) => {
            const postPathUrl = new URL(
              "/posts/" + postPath,
              requestUrl.origin
            ); // markdown path
            const postResponse = await env.ASSETS.fetch(postPathUrl);

            /** @type {Content} */
            const content = fm(await postResponse.text());
            const postUrl = "/p/" + postPath.split("/")[1].replace('.md', ''); // post link (/p/how-to-write-js)
            return { ...content, postPath, postUrl };
          })
        )
      ).sort((a, b) => {
        const date1 = new Date(a.attributes.created_at);
        const date2 = new Date(b.attributes.created_at);

        return date2 - date1;
      });

      if (requestUrl.pathname === "/sitemap.xml") {
        return new Response(
          createSitemap({
            urls: [
              {
                loc: new URL("/", base).href,
                lastmod: posts[0].attributes.created_at,
              },
              ...posts.map((p) => ({
                loc: new URL(p.postUrl, base).href,
                lastmod: p.attributes.created_at,
              })),
            ],
          }),
          {
            headers: {
              "content-type": "text/xml;charset=UTF-8",
              "Cache-Control": maxAge 
            },
          }
        );
      }

      const intro = await (await env.ASSETS.fetch(new URL(
        "intro.md",
        requestUrl.origin
      ))).text()

      let placeholder = md.render(intro)
      placeholder += posts
        .map((content) => {
          const date = new Date(
            content.attributes.created_at
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const text = md.render(`
### [${content.attributes.title}](${content.postUrl})

${content.attributes.description}

_${date}_
        `);
          return text;
        })
        .join("");
      return new Response(
        render(templateStr, placeholder, {
          title: metaTitle,
          description: "",
          "og:url": request.url,
          "og:image": ogPath.href + `?title=${encodeURIComponent(metaTitle)}`,
        }),
        {
          headers: {
            "content-type": "text/html;charset=UTF-8",
            "Cache-Control": maxAge 
          },
        }
      );
    }
    const postPrefix = "/p/";
    if (requestUrl.pathname.startsWith(postPrefix)) {
      const postPath = requestUrl.pathname.slice(postPrefix.length) + ".md";
      const postPathUrl = new URL("/posts/" + postPath, requestUrl.origin); // markdown path
      const postResponse = await env.ASSETS.fetch(postPathUrl);

      /** @type {Content} */
      const content = fm(await postResponse.text());
      const date = new Date(content.attributes.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      metaTitle = content.attributes.title;
      const placeholder = md.render(`
     
# ${content.attributes.title}

_${date}_

${content.body}`);

      return new Response(
        render(templateStr, placeholder, {
          title: metaTitle,
          description: content.attributes.description,
          "og:url": request.url,
          "og:image": ogPath.href + `?title=${encodeURIComponent(metaTitle)}`,
        }),
        {
          headers: {
            "content-type": "text/html;charset=UTF-8",
            "Cache-Control": maxAge 
          },
        }
      );
    }
    if (requestUrl.pathname.startsWith("/og")) {
      return ogImage(requestUrl);
    }

    return env.ASSETS.fetch(request);
  },
};

const placeholderComment = "<!-- placeholder -->";

/**
 * @param {string} templateStr
 * @param {string} placeholder
 * @param {string} theme
 * @param {Object} meta
 */
function render(templateStr, placeholder, meta) {
  let value = templateStr
    .replace(placeholderComment, placeholder)
  for (const key of Object.keys(meta)) {
    value = value.replaceAll(`#${key}`, meta[key]);
  }
  return value;
}

const maxAge = `max-age=${60 * 60 * 24 * 3}`

const nostr = {
  "names": {
    "Mohammad Bagher Abiyat": "9e77eabc6b7c575a619ab7ce235b3d99443ff33b8b9d805eacc5ec3a38a48976"
  },
  "relays": {
    "9e77eabc6b7c575a619ab7ce235b3d99443ff33b8b9d805eacc5ec3a38a48976": [
      "wss://nos.lol/",
      "wss://nostr.land/",
      "wss://nostr.wine/",
      "wss://purplerelay.com/",
      "wss://relay.damus.io/",
      "wss://relay.primal.net/",
      "wss://relay.snort.social/"
    ]
  }
}
