import { RouteRecordRaw } from "vue-router";

const changelogs = ["Mouse", "Shaman", "Racing", "Survivor", "Defilante"];

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
      path: "members",
      name: "tribeMembers",
      component: () => import("src/pages/Tribe/Members.vue"),
    },
    ...changelogs.map((c) => {
      const type = c.toLowerCase();
      return {
        path: type,
        name: `tribe${c}`,
        component: () => import("./Changelogs.vue"),
        props: { type },
      };
    }),
  ],
};
