import { boot } from "quasar/wrappers";

interface DarkTheme {
  enabled: boolean;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $dark: DarkTheme;
  }
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$dark

  app.config.globalProperties.$dark = {
    enabled: true,
  };
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
});
