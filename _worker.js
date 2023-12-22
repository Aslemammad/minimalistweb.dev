import MarkdownIt from "markdown-it";
import { fromHighlighter } from "markdown-it-shikiji/core";
import wasm from "shikiji/onig.wasm";
import { getHighlighterCore, loadWasm } from "shikiji/core";

await loadWasm((obj) => WebAssembly.instantiate(wasm, obj));

const highlighter = await getHighlighterCore({
  themes: [import("shikiji/themes/vitesse-light.mjs")],
  langs: [import("shikiji/langs/javascript.mjs")],
});

const md = MarkdownIt();

md.use(
  fromHighlighter(highlighter, {
    /* options */
  })
);

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
    console.log(md.render("# hellow"));
    // console.log(env.__STATIC_CONTENT);
    console.log(await env.ASSETS.fetch(request));
    return env.ASSETS.fetch(request);
  },
};
