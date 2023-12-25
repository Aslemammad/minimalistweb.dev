import { ImageResponse } from "workers-og";

/**
 * @param {URL} requestUrl
 */
export async function ogImage(requestUrl) {
  const title = requestUrl.searchParams.get("title") ?? "Minimalist Web Dev";
  const html = `
    <div style="font-family: ubuntu; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; font-family: ui-sans-serif, system-ui; background: #141414; color: #fff;">
      <div style="display: flex; text-align: center; justify-content: center; width: 100vw; padding: 40px">
        <h1 style="font-size: 70px; font-weight: 600; margin: 0; font-weight: 600">${title}</h1>
      </div>
      <a style="position: absolute; font-size: 25px; bottom: 1rem">minimalistweb.dev/</a>
    </div>
   `;

  const font = await fetch(new URL("/Ubuntu-B.ttf", requestUrl.origin));
  return new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "ubuntu",
        data: await font.arrayBuffer(),
        weight: 600,
        style: "normal",
      },
    ],
  });
}
