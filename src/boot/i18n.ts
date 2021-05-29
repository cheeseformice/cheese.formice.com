import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";

import messages from "src/i18n";

interface TranslationMap {
  [key: string]: string | TranslationMap;
}

for (const code of Object.keys(messages)) {
  const translation = messages[code as keyof typeof messages] as TranslationMap;
  translation.__isoCode = code;
}

const userLanguage = window.localStorage.getItem("language") || window.navigator.language;
const i18n = createI18n({
  locale: userLanguage || "en",
  fallbackLocale: "en",
  messages,
});

// This will fallback to the proper language (es-AR: es, if it exists)
i18n.global.locale = i18n.global.t("__isoCode");

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
