import { createRouter, createWebHistory } from "vue-router";

const InfoComponent = () => import("./components/InfoComponent.vue");
const DataTable = () => import("./components/DataTable.vue");

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

 
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});



export default router;
