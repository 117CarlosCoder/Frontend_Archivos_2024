
<template>
    <v-app>
      <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
        <div class="translucent-background d-flex flex-column align-center justify-start w-100">
          <div class=" d-flex flex-row align-start justify-space-between w-100">
            <v-icon class="mr-2">mdi-gamepad</v-icon>
            <h1>Actualizar Cliente</h1>
            <v-btn class="btn-arrowl" icon @click="goBack">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </div>
          <div class="background-update">
            <form @submit.prevent="submit">
              
              <v-text-field v-model="id.value.value"  type="hidden" > </v-text-field>

              <v-text-field v-model="name.value.value" :counter="100" :error-messages="name.errorMessage.value"
                label="Nombre"> </v-text-field>
  
              <v-text-field v-model="username.value.value" :counter="30"
                :error-messages="username.errorMessage.value" label="Nombre Usuario"></v-text-field>
  
              <v-text-field v-model="email.value.value" :error-messages="email.errorMessage.value"
                label="Correo"></v-text-field>
  
              <v-text-field v-model="nit.value.value" :error-messages="nit.errorMessage.value" label="Nit"></v-text-field>
  
              <v-btn class="btn-p me-4"  type="submit" color="primay">
                Actualizar
              </v-btn>
  
            </form>
          </div>
  
        </div>
        <ModalLogin v-model="openDialog" @login-success="handleLoginSuccess" :queryParam="String(id.value.value)"></ModalLogin>
      </v-container>
    </v-app>
  </template>
  <script setup>
  
  import { ref, onMounted } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import axios from 'axios';  
  import { useRouter , useRoute } from 'vue-router';
  import ModalLogin from '@/pages/Cashier/ModalLogin.vue';
  
  const openDialog = ref(false);
  const router = useRouter();
  const route = useRoute();

  
  const { handleSubmit } = useForm({
    validationSchema: {
      name(value) {
        if (value?.length >= 5) return true
  
        return 'Nombre necesita almenos 5 caracteres'
      },
      username(value) {
        if (value?.length >= 5) return true
  
        return 'Nombre de usuario necesita almenos 5 caracteres.'
      },
      nit(value) {
        if (value?.length > 8 && /[0-9-]+/.test(value)) return true
  
        return 'El nit necesita almenos 9 digitos.'
      }
    },
  });
  const id = useField('id'); 
  const name = useField('name')
  const username = useField('username')
  const email = useField('email')
  const nit = useField('nit')

  
  
  const submit = handleSubmit(async values => {

    openDialog.value = true;

    //openDialog();
    
    /*const userName = prompt('Por favor, ingresa tu nombre de usuario:');
    const password = prompt('Por favor, ingresa tu contraseña:');

     Validar que ambos campos no estén vacíos
    if (!userName || !password) {
      alert('El nombre de usuario y la contraseña son obligatorios.');
      return;
    }

   Crear los datos de inicio de sesión
    const loginData = {
      username: userName,
      password: password
    };

    const response = await axios.post('http://localhost:8080/auth/login', loginData);

        if (response.status === 200) {
          valor = true;
        }
  */
    /*console.log("valores")
    console.log(values)
    if (valor) {
      try {
      
      console.log("valores")
      console.log(values)
      const response = await axios.put('http://localhost:8080/cashier/update-client', values,{
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
    }
    */
  });

  const handleLoginSuccess = async (success) => {
  if (success) {
    try {
      const response = await axios.put('http://localhost:8080/cashier/update-client', {
        id: id.value.value,
        name: name.value.value,
        username: username.value.value,
        email: email.value.value,
        nit: nit.value.value
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        alert('Cliente actualizado con éxito!');
        router.push('/cashier/home');
      }
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      alert('Error al actualizar el cliente');
    }
  }
};

  
  const goBack = () => {
    window.history.back()
  }

  onMounted(() => {

    

  if (route.params) {
    console.log(route.params.cliente);
    const cliente = JSON.parse(route.params.cliente); // Asumiendo que pasaste el cliente como JSON
    id.value.value = cliente.id || ''; 
    name.value.value = cliente.name || '';
    console.log(name.value) // Establecer el valor en el campo de nombre
    username.value.value = cliente.username || '';
    console.log(username.value) // Establecer el valor en el campo de nombre de usuario
    email.value.value = cliente.email || '';
    console.log(email.value) // Establecer el valor en el campo de correo
    nit.value.value = cliente.nit || '';
    console.log(nit.value.value)  // Establecer el valor en el campo de NIT
  }
});
  
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
  
  .background-update {
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
  