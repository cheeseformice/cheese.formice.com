import { RouteRecordRaw } from "vue-router";
import playerRoute from "src/pages/Player/routes";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/Index.vue"),
      },
      playerRoute,
      {
        path: "t/:tribeName",
        name: "tribe",
        component: () => import("pages/Tribe.vue"),
        props: true,
        children: [],
      },
      {
        path: "login",
        name: "login",
        component: () => import("src/pages/Login/index.vue"),
      },
      {
        path: "leaderboard",
        name: "leaderboard",
        component: () => import("pages/Leaderboard.vue"),
        children: [
          {
            path: "",
            name: "playerLeaderboard",
            alias: "player",
            component: () => import("pages/Leaderboard.vue"),
          },
          {
            path: "tribe",
            name: "tribeLeaderboard",
            component: () => import("pages/Leaderboard.vue"),
          },
        ],
      },
      {
        path: "translation",
        name: "translation",
        component: () => import("pages/Translation.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
