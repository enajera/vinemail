<template>
  <div class="text-sm text-gray-600 font-light px-4 center-info">
    <button title="Regresar">
      <router-link to="/"
        ><font-awesome-icon icon="fa-solid fa-reply"
      /></router-link>
    </button>
    <h3>{{ date }}</h3>
  </div>
  <div class="scrollbar editRow" style="max-height: 85%">
    <h1 class="text-lg text-gray-900 font-bold px-6 py-1">{{ subject }}</h1>
    <p class="text-sm text-black-600 font-light px-6 py-1">To: {{ to }}</p>
    <p class="text-sm text-black-600 font-light px-6 py-1">From: {{ from }}</p>
    <p class="text-sm text-black-600 font-light px-6 py-4">{{ body }}</p>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  name: "InfoComponent",
  setup() {
    const route = useRoute();
    return {
      subject: route.params.subject,
      to: route.params.to,
      from: route.params.from,
      body: route.params.body,
      date: route.params.date,
    };
  },
};
</script>
