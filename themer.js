import { html, reactive } from "./vendor/@arrow-js/core/dist/index.min.mjs";

import {
  getCurrentTheme,
  init,
  setTheme,
} from "./vendor/@barelyreaper/themer/index.mjs";

init();

const state = reactive({
  theme: getCurrentTheme(),
});

const toggleTheme = () => {
  const theme = getCurrentTheme() === "dark" ? "light" : "dark";
  setTheme(theme);
  state.theme = theme;
};

const toggleButtonContainer = document.getElementById("themer");

const toggleButton = html`
  <button class="ml-auto">
    <div
      class="h-1 w-[50px] rounded-full bg-light overflow-hidden"
      @click="${() => toggleTheme()}"
    >
      ${() => toggleable(state)}
    </div>
  </button>
`;

const toggleable = (state) => {
  return html`
    <div
      class="h-full w-[50%] transition-all delay-75 bg-dark rounded-full flex items-center ${state.theme ===
      "dark"
        ? "ml-auto"
        : "mr-auto"}"
    ></div>
  `;
};

toggleButton(toggleButtonContainer);
