<template>
  <div class="overflow-hidden">
    <table class="min-w-full bradius select-row ">
      <thead class="bg-white">
        <tr>
          <th class="text-sm font-semibold text-gray-900 px-6 py-2 text-left th2 ">
            Subject
          </th>
          <th class="text-sm font-semibold text-gray-900 px-6 py-2 text-left th2">
            From
          </th>
          <th class="text-sm font-semibold text-gray-900 px-6 py-2 text-left th2">
            To
          </th>
          <th class="text-sm font-semibold text-gray-900 px-6 py-2 text-left">
            Body
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(result, index) in results"
          :key="result.MessageID"
          :class="{
            'bg-gray-100 border-b': index % 2 === 0,
            'bg-white border-b': index % 2 === 1,
          }"
        >
          <td
            class="text-sm text-gray-600 font-light px-6 py-1 whitespace-nowrap"
          >
            {{ result.Subject }}
          </td>
          <td
            class="text-sm text-gray-600 font-light px-6 py-1 whitespace-nowrap"
          >
            {{ result.From }}
          </td>
          <td
            class="text-sm text-gray-600 font-light px-6 py-1 whitespace-nowrap"
          >
            {{ result.To }}
          </td>
          <td
            class="text-sm text-gray-600 font-light px-6 py-1 whitespace-nowrap"
          >
            {{ result.Body }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: "DataTable",
  props: ["results"],

  setup(){

  }
};
</script>
