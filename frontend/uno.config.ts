import { defineConfig, presetUno, presetWind, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetWind(),
    presetIcons(),
  ],
  // You can add more custom rules, shortcuts, or safelist here
});
