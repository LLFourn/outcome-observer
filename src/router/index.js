import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import OracleRoot from "../views/OracleRoot.vue";
import OraclePath from "../views/OraclePath.vue";
import Event from "../views/Event.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/:oracle",
    name: "oracle-root",
    component: OracleRoot,
  },
  {
    path: "/:oracle:path(/[^.]+)\\.:event_kind([^.]+)",
    name: "event",
    component: Event,
  },
  {
    path: "/:oracle:path(/.*)",
    name: "oracle-path",
    component: OraclePath,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
