import { RouteRecordRaw } from "vue-router";

export default <RouteRecordRaw>{
  path: "t/:tribeName",
  component: () => import("pages/Tribe/index.vue"),
  props: (route) => {
    const tribeName = <string>route.params.tribeName;
    return { tribeName };
  },
  beforeEnter: (to, _from, next) => {
    if (!to.params.tribeName) next({ name: "home" });
    else next();
  },
  children: [
    {
      path: "",
      name: "tribe",
      alias: "profile",
      component: () => import("pages/Tribe/Profile.vue"),
    },
    {
      path: "normal",
      name: "tribeMembers",
      component: () => import("src/pages/Tribe/Members.vue"),
    },
    {
      path: "normal",
      name: "tribeNormal",
      component: () => import("src/pages/Tribe/Changelogs.vue"),
      props: { type: "normal" },
    },
    {
      path: "racing",
      name: "tribeRacing",
      component: () => import("src/pages/Tribe/Changelogs.vue"),
      props: { type: "racing" },
    },
    {
      path: "survivor",
      name: "tribeSurvivor",
      component: () => import("src/pages/Tribe/Changelogs.vue"),
      props: { type: "survivor" },
    },
    {
      path: "defilante",
      name: "tribeDefilante",
      component: () => import("src/pages/Tribe/Changelogs.vue"),
      props: { type: "defilante" },
    },
  ],
};
