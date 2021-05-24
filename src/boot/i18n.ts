import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";

import messages from "src/i18n";

const userLanguage = window.localStorage.getItem("language") || window.navigator.language;
const i18n = createI18n({
  locale: userLanguage || "en",
  fallbackLocale: "en",
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
