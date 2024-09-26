<template>
  <v-app>
    <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
      <div class="translucent-background d-flex flex-column align-center justify-start w-100 h-auto">
        <div class=" d-flex flex-row align-start justify-space-between w-100">
          <v-icon class="mr-2">mdi-gamepad</v-icon>
          <h1>Editar Cliente</h1>
          <v-btn class="btn-arrowl" icon @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </div>

        <div class="w-100 mt-10">
          <v-autocomplete v-model="search" :items="items" label="Search" prepend-icon="mdi-magnify" solo hide-no-data
            hide-details dense @input="fetchSearchClients">
          </v-autocomplete>
        </div>
        <div class="w-100 mt-10 ">
          <h2>Lista de Productos</h2>
          <table class="w-100">
            <thead class="text-left">
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Nit</th>
                <th>Modificable</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, index) in clients" :key="index">
                <td>{{ client.id}}</td>
                <td>{{ client.username }}</td>
                <td>{{ client.name }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.nit }}</td>
                <td>{{ client.update }}</td>
                <td style="display: flex; justify-content: flex-start; ">
                  <v-btn class="btn-d " style="margin-top: 0; margin-bottom: 20px;" @click="abrirEditor(client)" color="primary">
                    Editar
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </v-container>
  </v-app>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const search = ref('');
const items = ref([]);
const clients = ref([]);
var valor = "";

const router = useRouter();
const clienteSeleccionado = ref(null); 

const abrirEditor = (cliente) => {
  cliente.password= "";
  const clienteString = JSON.stringify(cliente); 
  console.log('Cliente seleccionado para editar:', clienteSeleccionado.value);

  router.push({
    name: 'edituser',
    params: { cliente: clienteString }
  });
};


onMounted(() => {
  fetchSearchClients();
});

const fetchSearchClients = async (query) => {
  console.log("Query");
  console.log(query);
  console.log("search");
  console.log(search);
  if (query && query.data) {
    valor += query.data;
    console.log(valor)
    try {
      const response = await axios.get('http://localhost:8080/admin/find-users', {
        params: { valor: valor },  
        withCredentials: true,
      });
      clients.value = response.data;
      console.log(clients.value);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  } else {
    console.log("Valor");
    console.log(valor);

    if (valor) {
      valor = valor.slice(0, -1);
      console.log("final");
      console.log(valor);
      try {
        const response = await axios.get('http://localhost:8080/admin/find-users', {
          params: { valor: valor },  
          withCredentials: true,
        });
        clients.value = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    } else {
      console.log("Vacio");
      try {
        const response = await axios.get('http://localhost:8080/admin/find-users', {
          params: { valor: "" },  
          withCredentials: true,
        });
        clients.value = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }
  }

};

const goBack = () => {
  window.history.back()
}

</script>

<style scoped>
body {
  background-color: #000000;
}

.translucent-background {
  width: 90%;
  height: 90%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(255, 0, 0, 0.5));
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

.right-aligned-text {
  text-align: right;
}

.background-register {
  width: 50%;
  height: auto;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 30px;
}

h1,
p {
  color: #e53935;
  font-size: 2rem;
}

.v-btn {
  margin-top: 20px;
  width: 40%;
}

.btn-d {
  background-color: #e53935;
  border-radius: 8px;
  float: right;
}

.btn-p {
  background-color: #6de535;
  border-radius: 8px;
}

.btn-arrowl {
  background-color: #20221f;
  border-radius: 8px;
  width: 10%;
}

.btn-d:hover {
  background-color: #b71c1c;
}

.btn-p:hover {
  background-color: #58b92c;
}
</style>