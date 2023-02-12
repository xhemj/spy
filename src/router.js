import { createRouter, createWebHashHistory } from "vue-router";

const Home = () => import("./view/Home.vue");
const Setting = () => import("./view/Setting.vue");
const Game = () => import("./view/Game.vue");

const routes = [
  {
    path: "/",
    component: Home,
    name: "home",
    meta: { level: 1 },
  },
  {
    path: "/setting",
    component: Setting,
    name: "setting",
    meta: { level: 2 },
  },
  {
    path: "/game",
    component: Game,
    name: "game",
    meta: { level: 3 },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
    meta: { level: 4 },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
