import {
  defineConfig,
  presetTypography,
  presetUno,
  presetWebFonts,
  presetWind,
} from "unocss";
// import './node_modules/@unocss/reset/tailwind.css'

export default defineConfig({
  theme: {
    colors: {
      dark: "var(--dark)",
      light: "var(--light)",
      gray: "var(--gray)",
      bg: "var(--bg)",
    },
  },
  presets: [
    presetUno(),
    presetWind(),
    presetTypography(),
    presetWebFonts({
      // provider: "google",
      // fonts: {
      //   sans: "Ubuntu:500,600,700",
      // },
    }),
  ],
});
