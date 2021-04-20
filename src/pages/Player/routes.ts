import { RouteRecordRaw } from "vue-router";

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
    {
      path: "normal",
      name: "playerNormal",
      component: () => import("src/pages/Player/Changelogs.vue"),
      props: { type: "normal" },
    },
    {
      path: "racing",
      name: "playerRacing",
      component: () => import("src/pages/Player/Changelogs.vue"),
      props: { type: "racing" },
    },
    {
      path: "survivor",
      name: "playerSurvivor",
      component: () => import("src/pages/Player/Changelogs.vue"),
      props: { type: "survivor" },
    },
    {
      path: "defilante",
      name: "playerDefilante",
      component: () => import("src/pages/Player/Changelogs.vue"),
      props: { type: "defilante" },
    },
  ],
};
