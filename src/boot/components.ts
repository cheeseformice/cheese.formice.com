import { boot } from "quasar/wrappers";
import * as components from "src/components";

export default boot(({ app }) => {
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
});
