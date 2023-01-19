<template>
  <div v-if="isLoggedIn">
    <!-- Cuadro de busqueda -->
    <div class="flexi p-2">
      <input
        v-model="term"
        @keyup.enter="search"
        style="width: 70%"
        class="text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full pl-4 p-2.5"
        placeholder="Presione 'Enter' después de ingresar su criterio de búsqueda"
      />
      <!-- boton de limpieza -->
      <button style="background-color: white" @click="clean" title="Limpiar">
        <font-awesome-icon icon="fa-solid fa-trash-can" />
      </button>

      <!-- indices -->
      <select
        class="text-black-900 text-sm rounded-lg focus:border-blue-500 block pl-4 p-2.5"
        v-model="selectedName"
        @change="onNameChange"
      >
        <option v-for="item in names" :key="item">{{ item.name }}</option>
      </select>

      <!-- boton de logout -->
      <button style="background-color: white" @click="logout" title="Salir">
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
      </button>
    </div>

    <div class="div">
      <!-- div dinamico -->
      <div class="p-6 bg-white shadow-xl bradius din">
        <template v-if="loading">
          <div class="center-b">
            <div class="line-wobble"></div>
          </div>
        </template>
        <template v-else-if="results === null">
          <div class="center-v">No hay resultados</div>
        </template>
        <template v-else>
          <router-view
            :results="results"
            :currentPage="currentPage"
            :totalPages="totalPages"
            @nextPage="nextPage"
            @previousPage="previousPage"
          />
        </template>
      </div>
    </div>
  </div>

  <!-- Login -->
  <div v-else>
    <section class="flex justify-center items-center h-screen">
      <div class="max-w-md w-full bg-white rounded p-6 space-y-4 opacity-82">
        <div class="mb-4">
          <h1 class="text-xl font-bold text-center">Login</h1>
        </div>
        <div>
          <p v-if="error" class="text-red-500 text-center">Invalid username or password</p>
          <input
            class="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
            type="text"
            placeholder="Username"
            v-model="user"
          />
        </div>
        <div>
          <input
            class="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
            type="password"
            placeholder="Password"
            v-model="pass"
            @keyup.enter="login"
          />
        </div>
        <div>
          <button
            class="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200"
            @click="login"
          >
            Sign In
          </button>
        </div>
        <div class="flex items-center justify-between">
         
        </div>
      </div>
    </section>
  </div>
  
</template>

<script>
//imports
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { endpoint } from './config.js';

export default {
  name: "App",
  components: {},
  setup() {
    //Propiedades reactivas
    const term = ref("");
    const results = ref([]);
    const names = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const searchType = ref("matchAll");
    const from = ref(0);
    const maxResults = ref(20);
    const router = useRouter();
    const loading = ref(true);
    const selectedName = ref("enronmail");
    const isLoggedIn = ref(false);
    const user = ref("");
    const pass = ref("");
    const error = ref(false);

    //Ejecutar al inicio
    onBeforeMount(() => {
      if (isLoggedIn.value) {
        indexes();
        searchData();
      }
    });

    const onNameChange = () => {
      currentPage.value = 1;
      from.value = 0;
      searchData();
    };

    const clean = () => {
      term.value = "";
      currentPage.value = 1;
      from.value = 0;
      error.value=false;
      search();
    };

    const search = () => {
      searchType.value = term.value.length !== 0 ? "match" : "matchAll";
      currentPage.value = 1;
      from.value = 0;
      searchData();
      router.push("/");
    };

    const nextPage = () => {
      currentPage.value++;
      searchData();
    };

    const previousPage = () => {
      currentPage.value--;
      searchData();
    };

    async function login() {
      try {
        const response = await fetch(endpoint+"login", {
          method: "POST",
          body: JSON.stringify({ user: user.value, pass: pass.value }),
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem("user", user.value);
          localStorage.setItem("pass", pass.value);
          indexes();
          searchData();
          isLoggedIn.value = true;
          router.push("/");
        } else {
          error.value = true
         
        }
      } catch (e) {
        error.value = true
      }
    }

    //Metodo searchData
    async function searchData() {
      try {
        loading.value = true;
        const auth = "Basic " + window.btoa(user.value + ":" + pass.value);
        const response = await fetch(endpoint+"search", {
          method: "POST",
          body: JSON.stringify({
            index: selectedName.value,
            search_type: searchType.value,
            query: {
              term: term.value,
            },
            from: (currentPage.value - 1) * maxResults.value,
            max_results: maxResults.value,
          }),
          headers: {
            Authorization: auth,
          },
        });

        const data = await response.json();
        results.value = data.data;
        totalPages.value = Math.ceil(data.total / maxResults.value);

        loading.value = false;
      } catch (error) {
        console.error(error);
        loading.value = false;
      }
    }

    //Metodo Indexes
    async function indexes() {
      try {
        const auth = "Basic " + window.btoa(user.value + ":" + pass.value);
        const response = await fetch(endpoint+"index", {
          headers: {
            Authorization: auth,
          },
        });
        const data = await response.json();
        names.value = data.list;
      } catch (error) {
        console.error(error);
        loading.value = false;
      }
    }

    //Se chequea el usuario para saber si esta loggeado
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      const storedPass = localStorage.getItem("pass");
      if (storedUser && storedPass) {
        user.value = storedUser;
        pass.value = storedPass;
        isLoggedIn.value = true;
      }
     
    };

    //Logout
    const logout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("pass");
      isLoggedIn.value = false;
      error.value=false;
    };

    checkUser();

    return {
      selectedName,
      onNameChange,
      indexes,
      names,
      nextPage,
      previousPage,
      results,
      currentPage,
      totalPages,
      searchData,
      searchType,
      term,
      from,
      maxResults,
      search,
      loading,
      clean,
      isLoggedIn,
      user,
      pass,
      error,
      login,
      logout,
    };
  },
  computed: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
}

.din {
  width: 100%;
  cursor: pointer;
  user-select: none;
  overflow-y: auto;
  height: 655px;
  max-height: 660px;
  word-wrap: break-word;
}

.editRow {
  user-select: text;
}

option {
  user-select: none;
}

.table {
  margin-top: 10px;
  margin-bottom: 3px;
}

.center-v {
  display: flex;
  align-items: center;
  justify-content: center;
}

.center-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  gap: 5px;
}

.center-b {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

body {
  background: #14202d;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='630' preserveAspectRatio='none' viewBox='0 0 1440 630'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1055%26quot%3b)' fill='none'%3e%3crect width='1440' height='630' x='0' y='0' fill='%230e2a47'%3e%3c/rect%3e%3cpath d='M620.701262874367 62.367770499545834L521.4356087543684 50.17948074568223 509.24731900050483 149.44513486568076 608.5129731205034 161.63342461954437z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1.8863270405058694 267.4590598397722L106.62813875861849 256.4502518187985 95.6193307376448 151.7084401006859-9.122480980467813 162.71724812165957z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M990.55 301.53 a203.95 203.95 0 1 0 407.9 0 a203.95 203.95 0 1 0 -407.9 0z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M47.452068634006345 473.4323835959502L163.60253640370323 554.761816694876 244.9319695026289 438.611348925179 128.78150173293204 357.28191582625334z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M824.45 412.04 a151.81 151.81 0 1 0 303.62 0 a151.81 151.81 0 1 0 -303.62 0z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M592.38 19.29 a151.66 151.66 0 1 0 303.32 0 a151.66 151.66 0 1 0 -303.32 0z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1413.1576379154064 546.456174963121L1451.2884121753561 436.05826169694785 1350.74014975783 453.7876332245126z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M714.3 583.34 a179.44 179.44 0 1 0 358.88 0 a179.44 179.44 0 1 0 -358.88 0z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M678.118611501662 502.80495058887453L655.6204472877785 572.0471802066093 770.7328738213223 571.1733117185672z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M310.27 446.41 a190.85 190.85 0 1 0 381.7 0 a190.85 190.85 0 1 0 -381.7 0z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M778.8717699572941 341.4706984600998L673.6508726015376 283.1458026538213 615.3259767952591 388.36670000957776 720.5468741510156 446.6915958158563z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M-8.92 3.99 a181.53 181.53 0 1 0 363.06 0 a181.53 181.53 0 1 0 -363.06 0z' fill='rgba(28%2c 83%2c 142%2c 0.4)' class='triangle-float2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1055'%3e%3crect width='1440' height='630' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 5s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 4s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 6s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
}

.div {
  margin: 20px 60px 30px 60px;
  opacity: 0.85;
}

.flexi {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  margin-top: 30px;
  margin-left: 60px;
  opacity: 0.85;
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

.select-row tbody tr:hover {
  background-color: #c9dcf1;
}

.scrollbar {
  overflow: auto;
  min-width: auto;
}

/* Botones */
button {
  display: flex;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
  background-color: #eeeeee4b;
  letter-spacing: 1px;
  transition: all 0.2s linear;
  cursor: pointer;
  border: none;
  background: #fff;
}

button > svg {
  font-size: 15px;
  transition: all 0.4s ease-in;
}

button:hover > svg {
  font-size: 1.2em;
  transform: translateX(-2.5px);
}

button:hover {
  box-shadow: 9px 9px 33px #d1d1d1, -9px -9px 33px #ffffff;
  transform: translateY(-2px);
}

/* Loading bar */
.line-wobble {
  --uib-size: 80px;
  --uib-speed: 1.55s;
  --uib-color: black;
  --uib-line-weight: 5px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--uib-line-weight);
  width: var(--uib-size);
  border-radius: calc(var(--uib-line-weight) / 2);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}

.line-wobble::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--uib-color);
  opacity: 0.1;
}

.line-wobble::after {
  content: "";
  height: 100%;
  width: 100%;
  border-radius: calc(var(--uib-line-weight) / 2);
  animation: wobble var(--uib-speed) ease-in-out infinite;
  transform: translateX(-90%);
  background-color: var(--uib-color);
}

@keyframes wobble {
  0%,
  100% {
    transform: translateX(-90%);
  }

  50% {
    transform: translateX(90%);
  }
}
</style>
