import { RouteRecordRaw } from "vue-router";

const changelogs = ["Mouse", "Shaman", "Racing", "Survivor", "Defilante"];

export default <RouteRecordRaw>{
  path: "p/:playerName",
  component: () => import("pages/Player/index.vue"),
  props: (route) => {
    const playerName = <string>route.params.playerName;
    return {
      playerName: !/#|-/.test(playerName) ? `${playerName}#0000` : playerName,
    };
  },
  beforeEnter: (to, _from, next) => {
    if (!to.params.playerName) next({ name: "home" });
    else next();
  },
  children: [
    {
      path: "",
      name: "player",
      alias: "profile",
      component: () => import("pages/Player/Profile.vue"),
    },
    ...changelogs.map((c) => {
      const type = c.toLowerCase();
      return {
        path: type,
        name: `player${c}`,
        component: () => import("./Changelogs.vue"),
        props: { type },
      };
    }),
  ],
};
