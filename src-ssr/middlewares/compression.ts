import { ssrMiddleware } from "quasar/wrappers";
import compression from "compression";

export default ssrMiddleware(({ app }) => {
  app.use(compression({ threshold: 0 }));
});
