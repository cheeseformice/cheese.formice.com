import { createStore, Store } from "vuex";
import { PlayerModule } from "./modules";
export * from "./modules";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $store: Store<any>;
  }
}

export default function (/* { ssrContext } */) {
  const store = createStore({
    modules: {
      player: PlayerModule,
    },
    strict: !!process.env.DEBUGGING,
  });
  return store;
}
