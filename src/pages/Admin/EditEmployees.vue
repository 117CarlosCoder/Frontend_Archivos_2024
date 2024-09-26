<template>
    <v-app>
      <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
        <div class="translucent-background d-flex flex-column align-center justify-start w-100">
          <div class=" d-flex flex-row align-start justify-space-between w-100">
            <h1>Admin User Update</h1>
            <v-btn class="btn-arrowl" icon @click="goBack">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </div>
          <div class="background-register">
            <form @submit.prevent="submit">
              <v-text-field v-model="name.value.value" :counter="100" :error-messages="name.errorMessage.value"
                label="Nombre"></v-text-field>

              <v-text-field v-model="username.value.value" :counter="100" :error-messages="username.errorMessage.value"
              label="Username"></v-text-field>  

              <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
                label="Correo"></v-text-field>
  
            
  
              <v-text-field v-model="nit.value.value" :error-messages="nit.errorMessage.value"
              label="Nit"></v-text-field>

              <div v-if="updateOptions.length">
                <v-select
                  v-model="update.value.value" 
                  :items="updateOptions"
                  label="Modificable"
                ></v-select>
              </div>

  
              <v-btn class="btn-p me-4" type="submit" color="primay">
                Enviar
              </v-btn>
  
              <v-btn class="btn-d" @click="handleReset" coloer="danger">
                Limpiar
              </v-btn>
            </form>
          </div>
  
        </div>
  
      </v-container>
    </v-app>
  </template>
  <script setup>
  import { ref } from 'vue'
  import { useField, useForm } from 'vee-validate';
  import axios from 'axios';  
  import { useRouter , useRoute } from 'vue-router';
  const router = useRouter();
  const route = useRoute();
  
  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name(value) {
        if (value?.length >= 5) return true
  
        return 'Nombre necesita almenos 5 caracteres'
      },
      username(value) {
        if (value?.length >= 5) return true
  
        return 'Username necesita almenos 5 caracteres'
      },
      email(value) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
  
        return 'Correo Valido.'
      }
      
      /*nit(value) {
        if (value?.length > 8 && /[0-9-]+/.test(value)) return true
  
        return 'El nit necesita almenos 9 digitos.'
      },*/
    },
  })


  const id = useField('id')
  const name = useField('name')
  const username = useField('username')
  const password = useField('password')
  const email = useField('email')
  const nit = useField('nit')
  const update = useField('update')

  const updateOptions = ['true', 'false'];


  const submit = handleSubmit(async values => {
    try {
        const response = await axios.post('http://localhost:8080/admin/update-user', values);

        if (response.status === 200) {
          alert('El usuario se actualizo con exito');
          router.push('/admin/home');
        }
      } catch (error) {
        console.error('Error al crear usuario ', error);
      }
  });
  
  const goBack = () => {
    window.history.back()
  }

  if (route.params) {
    
    console.log(route.params.cliente);
    const cliente = JSON.parse(route.params.cliente); 
    id.value.value = cliente.id || '';
    name.value.value = cliente.name || '';
    console.log(name.value.value) 
    email.value.value = cliente.email || '';
    console.log(email.value.value)
    nit.value.value = cliente.nit || '';
    console.log(nit.value.value)  
    password.value.value = cliente.password || '';
    console.log(password.value.value)  
    username.value.value = cliente.username || '';
    console.log(username.value.value) 
    if (cliente.update === 'f') {
      update.value.value =  'false';
    }
    else{
      update.value.value = 'true';
    }
    //update.value.value = cliente.update || false;
    console.log(update.value.value) 
   
  }
  
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
  
  .background-register {
    width: 50%;
    height: auto;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 15px;
    padding: 30px;
  }
  
  h1,
  p {
    color: #ffffff;
  }
  
  .v-btn{
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
  
  .btn-arrowl{
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
  