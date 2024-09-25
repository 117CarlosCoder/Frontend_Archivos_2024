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
      <div class="translucent-background d-flex flex-column align-center justify-start w-100">
        <div class=" d-flex flex-row align-start justify-space-between w-100">
          <v-icon class="mr-2">mdi-gamepad</v-icon>
          <h1>Registrar Cliente</h1>
          <v-btn class="btn-arrowl" icon @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </div>
        <div class="background-register">
          <form @submit.prevent="submit">
            <v-text-field v-model="name.value.value" :counter="100" :error-messages="name.errorMessage.value"
              label="Nombre"></v-text-field>

            <v-text-field v-model="username.value.value" :counter="30"
              :error-messages="username.errorMessage.value" label="Nombre Usuario"></v-text-field>

            <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
              label="Correo"></v-text-field>

            <v-text-field v-model="nit.value.value" :error-messages="nit.errorMessage.value" label="Nit"></v-text-field>

            <v-btn class="btn-p me-4" type="submit" color="primay">
              Crear
            </v-btn>

            <v-btn class="btn-d" @click="handleReset" color="danger">
              Limpiar
            </v-btn>
          </form>
        </div>

      </div>

    </v-container>
  </v-app>
</template>
<script setup>

import { useField, useForm } from 'vee-validate';
import axios from 'axios';  
import { useRouter } from 'vue-router';

const router = useRouter();

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value) {
      if (value?.length >= 5) return true

      return 'Nombre necesita almenos 5 caracteres'
    },
    username(value) {
      if (value?.length >= 5) return true

      return 'Nombre de usuario necesita almenos 5 caracteres.'
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

      return 'Correo Valido.'
    },
    nit(value) {
      if (value?.length > 8 && /[0-9-]+/.test(value)) return true

      return 'El nit necesita almenos 9 digitos.'
    }
  },
});

const name = useField('name')
const username = useField('username')
const email = useField('email')
const nit = useField('nit')

const submit = handleSubmit(async values => {
  console.log(values)
  try {
    console.log(values)
    const response = await axios.post('http://localhost:8080/cashier/create-client', values,{
        withCredentials:true
    });
        
    console.log('Respuesta del servidor:', response.data);
    

    if(response.status == 200){
      console.log("Entro")
      alert('Formulario enviado con éxito!');
      router.push('/cashier/home');
    }

  } catch (error) {

    console.error('Error al enviar el formulario:', error);
    alert('Error al enviar el formulario');

  }
});

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
  background: linear-gradient(135deg, #FF0000, #C8102E); 
  color: white;
  font-weight: bold;
  border-radius: 8px;
  float: right;
}

.btn-p {
  background-color: #6de535;
    color: white;
    border-radius: 8px;
    font-weight: bold;
    transition: transform 0.3s ease, background 0.3s ease;
}

.btn-arrowl {
  background-color: #20221f;
  border-radius: 8px;
  width: 10%;
}

.btn-d:hover {
  background: linear-gradient(135deg, #C8102E, #A40000);
    transform: scale(1.05);
}

.btn-p:hover {
  background-color: #4cb92b;
    transform: scale(1.05);
}
</style>
