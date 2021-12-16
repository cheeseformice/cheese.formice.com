import { RouteRecordRaw } from "vue-router";
import playerRoute from "src/pages/Player/routes";
import tribeRoute from "src/pages/Tribe/routes";

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
      tribeRoute,
      {
        path: "cookie-policy",
        name: "cookie-policy",
        component: () => import("pages/CookiePolicy.vue"),
      },
      {
        path: "status",
        name: "status",
        component: () => import("pages/ServerStatus.vue"),
      },
      {
        path: "faq",
        name: "faq",
        component: () => import("pages/FAQ.vue"),
      },
      {
        path: "github",
        name: "github",
        component: () => import("pages/GithubRedirect.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("src/pages/Account/Login.vue"),
      },
      {
        path: "account",
        name: "account",
        component: () => import("src/pages/Account/index.vue"),
        children: [
          {
            path: "progress",
            name: "accountProgress",
            component: () => import("src/pages/Account/Progress.vue"),
          },
          {
            path: "privacy",
            name: "accountPrivacy",
            component: () => import("src/pages/Account/Privacy.vue"),
          },
          {
            path: "password",
            name: "accountPassword",
            component: () => import("src/pages/Account/Password.vue"),
          },
        ],
      },
      {
        path: "tools",
        name: "tools",
        component: () => import("src/pages/Tools/index.vue"),
        children: [
          {
            path: "admin",
            name: "adminPanel",
            component: () => import("src/pages/Tools/Admin/index.vue"),
          },
        ],
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
