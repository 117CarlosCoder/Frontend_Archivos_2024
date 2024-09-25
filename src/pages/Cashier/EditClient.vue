<!-- <template>
    <v-app>
        <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
            <div class="translucent-background d-flex flex-column align-center justify-start w-100">
                <div class=" d-flex flex-row align-start justify-space-between w-100">
                    <h1>Client Register</h1>
                    <Logout />
                </div>
                <form @submit.prevent="submit">
                    <v-text-field v-model="name.value.value" :counter="10" :error-messages="name.errorMessage.value"
                        label="Name"></v-text-field>

                    <v-text-field v-model="phone.value.value" :counter="7" :error-messages="phone.errorMessage.value"
                        label="Phone Number"></v-text-field>

                    <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
                        label="E-mail"></v-text-field>

                    <v-select v-model="select.value.value" :error-messages="select.errorMessage.value" :items="items"
                        label="Select"></v-select>

                    <v-checkbox v-model="checkbox.value.value" :error-messages="checkbox.errorMessage.value"
                        label="Option" type="checkbox" value="1"></v-checkbox>

                    <v-btn class="me-4" type="submit">
                        submit
                    </v-btn>

                    <v-btn @click="handleReset">
                        clear
                    </v-btn>
                </form>
            </div>
        </v-container>
    </v-app>
</template>

<script >
  import { ref } from 'vue'
  import { useField, useForm } from 'vee-validate'

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name (value) {
        if (value?.length >= 2) return true

        return 'Name needs to be at least 2 characters.'
      },
      phone (value) {
        if (value?.length > 9 && /[0-9-]+/.test(value)) return true

        return 'Phone number needs to be at least 9 digits.'
      },
      email (value) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

        return 'Must be a valid e-mail.'
      },
      select (value) {
        if (value) return true

        return 'Select an item.'
      },
      checkbox (value) {
        if (value === '1') return true

        return 'Must be checked.'
      },
    },
  })
  const name = useField('name')
  const phone = useField('phone')
  const email = useField('email')
  const select = useField('select')
  const checkbox = useField('checkbox')

  const items = ref([
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
  ])

  const submit = handleSubmit(values => {
    alert(JSON.stringify(values, null, 2))
  });
</script>

<style scoped>
body {
    background-color: #000000;
}

.translucent-background {
    width: 90%;
    height: 90%;
    background: linear-gradient(135deg,
            rgba(0, 0, 0, 0.8),
            rgba(229, 57, 53, 0.8));
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

h1,
p {
    color: #ffffff;
}

.v-btn {
    background-color: #e53935;
    border-radius: 8px;
}

.v-btn:hover {
    background-color: #b71c1c;
}
</style> -->


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
                <th>Sucursal</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, index) in clients" :key="index">
                <td>{{ index+1 }}</td>
                <td>{{ client.username }}</td>
                <td>{{ client.name }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.nit }}</td>
                <td>{{ client.sucursal }}</td>
                <td style="display: flex; justify-content: flex-start; ">
                  <v-btn class="btn-d " style="margin-top: 0; margin-bottom: 20px;" @click="abrirEditor(client)" color="primary">
                    Editar
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- <div class="background-register">
          <form @submit.prevent="submit">
            <v-text-field v-model="nombre.value.value" :counter="100" :error-messages="nombre.errorMessage.value"
              label="Nombre"></v-text-field>

            <v-text-field v-model="numero.value.value" :counter="8" :error-messages="numero.errorMessage.value"
              label="Numero de Telefono"></v-text-field>

            <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
              label="Correo"></v-text-field>

            <v-text-field v-model="nit.value.value" :error-messages="nit.errorMessage.value" label="Nit"></v-text-field>

            <v-btn class="btn-p me-4" type="submit" color="primay">
              submit
            </v-btn>

            <v-btn class="btn-d" @click="handleReset" coloer="danger">
              clear
            </v-btn>
          </form>
        </div> -->

      </div>

    </v-container>
  </v-app>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// Estado para el término de búsqueda y los resultados
const search = ref('');
const items = ref([]);
const clients = ref([]);
var valor = "";

const router = useRouter();
const clienteSeleccionado = ref(null); // Cliente seleccionado para editar

// Método para abrir el editor con el cliente seleccionado
const abrirEditor = (cliente) => {
  const clienteString = JSON.stringify(cliente); // Asignar el cliente seleccionado
  console.log('Cliente seleccionado para editar:', clienteSeleccionado.value);

  router.push({
    name: 'updateClient',
    params: { cliente: clienteString }
  });
};


/*
const fetchClients = async () => {
  try {
    console.log("Valor")
    console.log(clients.value)
    if (clients.value.length == 0) {
      const response = await axios.get('http://localhost:8080/cashier/getclients');
      clients.value = " "; // Asignar los datos obtenidos a la referencia
    }
    else{
      const response = await axios.get('http://localhost:8080/cashier/getclients');
      clients.value = response.data; // Asignar los datos obtenidos a la referencia
    }
    
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
};*/

// Ejecutar la función cuando el componente se monta
onMounted(() => {
  fetchSearchClients();
});

const updateUser = async (query) => {

}

// Simulación de una búsqueda en una lista estática
const fetchSearchClients = async (query) => {
  console.log("Query");
  console.log(query);
  console.log("search");
  console.log(search);
  if (query && query.data) {
    valor += query.data;
    console.log(valor)
    try {
      const response = await axios.get('http://localhost:8080/cashier/find-clients', {
        params: { nitPattern: valor },  // Usar directamente `query`
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
        const response = await axios.get('http://localhost:8080/cashier/find-clients', {
          params: { nitPattern: valor },  
          withCredentials: true,
        });
        clients.value = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    } else {
      console.log("Vacio");
      try {
        const response = await axios.get('http://localhost:8080/cashier/find-clients', {
          params: { nitPattern: "" },  
          withCredentials: true,
        });
        clients.value = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }
  }

  /* console.log(query.data);
  if(query.data !=null){
    axios.get('http://localhost:8080/cashier/find-clients', {
        params: {
          nitPattern: query.data
        },
        withCredentials: true 
      })
      .then(response => {
        console.log(response.data); 
        clients.value = response.data;
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      }); 
  }
  if(query.data == null){
    fetchClients();
  }
       */
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