<template>
  <div class="flexi p-2">
   
    <input
      v-model="term"
      @keyup.enter="search"
      style="width: 50%"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full pl-4 p-2.5"
      placeholder="Presione 'Enter' después de ingresar su criterio de búsqueda"
    />
   
    <select v-model="maxResults">
      <option value="5">5</option>
      <option value="15">15</option>
      <option value="25">25</option>
    </select>
  </div>

  <div class="div">
    <!-- div dinamico -->
    <div class="p-8 bg-white  shadow-xl bradius din ">

      <div class="min-w-full table">
        
        <DataTable :results="results"  />
       
      
      </div>

    </div>
  </div>
</template>

<script>
//imports
import { ref, onBeforeMount } from "vue";
import DataTable from "./components/DataTable.vue";

export default {
  name: "App",
  components: {
    DataTable,
  },
  setup() {
    //Propiedades reactivas
    const term = ref("");
    const results = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const searchType = ref("matchAll");
    const from = ref(0);
    const maxResults = ref(15);

    //Ejecutar al inicio
    onBeforeMount(() => {
      searchData();
    });

    const search = () => {
      searchType.value = term.value.length !== 0 ? "match" : "matchAll";
      searchData();
    };

    //Metodo searchData
    async function searchData() {
      try {
        const response = await fetch("http://localhost:9000/search", {
          method: "POST",
          body: JSON.stringify({
            search_type: searchType.value,
            query: {
              term: term.value,
            },
            from: from.value,
            max_results: maxResults.value,
          }),
        });

        const data = await response.json();
        results.value = data;
        console.log(results.value);
      } catch (error) {
        console.error(error);
      }
    }

    return {
      results,
      currentPage,
      totalPages,
      searchData,
      searchType,
      term,
      from,
      maxResults,
      search,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
}

.din{
  width: 100%;
  height: 600px;
  cursor: pointer;
  user-select: none;
 }

 .table{
  margin-top:30px;
 }

.center-v{
  display: flex;
  align-items: center;
  justify-content: center;
}

body{
  background: #8baacb;
}

.div {
  margin: 30px 60px 30px 60px;
 
}

.flexi {
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
  gap: 1px;
  margin-top: 50px;
}

td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  width: 40%;
}

.th2 {
  width: 15%;
}

.bradius {
    border-radius: 2rem;
}

.select-row tr:hover {
  background-color: #d9d9e4;
}
</style>
