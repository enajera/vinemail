<template>
  <div class="min-w-full table">
    <table class="min-w-full bradius select-row">
      <thead class="bg-white">
        <tr>
          <th
            class="text-sm font-semibold text-black-900 px-6 py-2 text-center th2"
          >
            Subject
          </th>
          <th
            class="text-sm font-semibold text-black-900 px-6 py-2 text-center th2"
          >
            From
          </th>
          <th
            class="text-sm font-semibold text-black-900 px-6 py-2 text-center th2"
          >
            To
          </th>
          <th
            class="text-sm font-semibold text-black-900 px-6 py-2 text-center"
          >
            Body
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(result, index) in results"
          :key="result.MessageID"
          :class="index % 2 === 0 ? 'bg-gray-100 border-b' : 'bg-white border-b'"
          @click="onRowClick(result)"
        >
          <td
            class="text-sm text-black-600 font-light px-6 py-0.5 whitespace-nowrap"
          >
            {{ result.Subject }}
          </td>
          <td
            class="text-sm text-black-600 font-light px-6 py-0.5 whitespace-nowrap"
          >
            {{ result.From }}
          </td>
          <td
            class="text-sm text-black-600 font-light px-6 py-0.5 whitespace-nowrap"
          >
            {{ result.To }}
          </td>
          <td
            class="text-sm text-black-600 font-light px-6 py-0.5 whitespace-nowrap"
          >
            {{ result.Body }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="pagination text-sm text-black-600 font-semibold my-1">
  
    <button @click="previousPage" :disabled="currentPage <= 1">
      <font-awesome-icon icon="fa-solid fa-caret-left" />
    </button>
    <span>Pag. {{ currentPage }} de {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage >= totalPages">
      <font-awesome-icon icon="fa-solid fa-caret-right" />
    </button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
// import { ref } from "vue";
export default {
  name: "DataTable",
  components: {},
  props: ["results", "currentPage", "totalPages"],

  setup(props, { emit }) {
    const router = useRouter();

    const nextPage = () => {
      emit("nextPage");
    };
    const previousPage = () => {
      emit("previousPage");
    };

    const onRowClick = (result) => {
      router.push({
        name: "InfoComponent",
        params: {
          subject: result.Subject ? result.Subject : "<empty>",
          to: result.To ? result.To : "<none>",
          from: result.From ? result.From : "<none>",
          body: result.Body ? result.Body : "<empty>",
          date: result.Date ? result.Date : "",
        },
      });
    };

    return {
      onRowClick,
      nextPage,
      previousPage,
    };
  },
};
</script>
