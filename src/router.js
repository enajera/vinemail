import { createRouter, createWebHistory } from "vue-router";

const InfoComponent = () => import("./components/InfoComponent.vue");
const DataTable = () => import("./components/DataTable.vue");
const Login = () => import("./views/Login.vue");

const routes = [
  {
    path: "/",
    name: "DataTable",
    component: DataTable,
  },
  {
    path: "/info/:subject/:to/:from/:date/:body",
    name: "InfoComponent",
    component: InfoComponent,
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});



export default router;
