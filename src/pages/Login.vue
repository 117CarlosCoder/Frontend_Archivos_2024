<template>
  <v-app>
    <v-container
      class="d-flex flex-column align-center justify-center h-100"
      fluid
    >
      <div class="translucent-background">
       <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card mx-auto pa-10" elevation="8" max-width="400">
          <v-card-title class="text-center">
            <h1 class="text-h4 font-weight-bold mb-4">GameStore Login</h1>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="userName"
                :rules="userNameRules"
                label="Username"
                prepend-icon="mdi-account"
                required
                variant="outlined"
                color="primary"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                prepend-icon="mdi-lock"
                required
                variant="outlined"
                color="primary"
                class="mb-6"
              ></v-text-field>

              <v-btn 
                class="custom-btn" 
                type="submit" 
                block 
                color="primary"
                size="large"
              >
                Iniciar sesión
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn class="mt-2 custom-btn" color="secondary" variant="text">
              ¿Olvidaste tu contraseña?
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      userName: '',
      password: '',
      userNameRules: [(v) => !!v || 'Username is required'],
      passwordRules: [(v) => !!v || 'Password is required'],
    };
  },
  methods: {
    async login() {
      const loginData = {
        username: this.userName,
        password: this.password
      };

      try {
        const response = await axios.post('http://localhost:8080/auth/login', loginData);

        if (response.status === 200) {
          const { role } = response.data; // Suponiendo que el backend envía `role` en la respuesta

          localStorage.setItem('userRole', role);

          if (role === 'ADMIN') {
            this.router.push('/admin/home');
          } else if (role === 'CASHIER') {
            this.router.push('/cashier/home');
          } else if (role === 'WAREHOUSE') {
            this.router.push('/warehouse/home');
          } else if (role === 'INVENTORY') {
            this.router.push('/inventory/home');
          } else {
            this.router.push('/');
          }
        }
      } catch (error) {
        console.error('Error en la solicitud de login:', error);
        this.errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        console.error('Error de inicio de sesión:', error.response.data.message);
      }
    }
  }
};
</script>


<style scoped>
body {
  background-color: #000000; /* Fondo negro para toda la página */
}

.translucent-background {
  width: 90%;
  height: 90%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(255, 0, 0, 0.5));
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

h1 {
  color: #e53935; /* Color rojo para el título */
  font-size: 2rem;
}

.custom-btn {
  background: linear-gradient(135deg, #FF0000, #C8102E); 
    color: white;
    font-weight: bold;
    border-radius: 12px;
    transition: transform 0.3s ease, background 0.3s ease;
  width: 100%;
  height: 60px; /* Ajuste de altura para los botones */
}

.custom-btn:hover {
  background: linear-gradient(135deg, #C8102E, #A40000);
  transform: scale(1.05);
}

.v-card {
  border-radius: 25px;
  background-color: rgba(0, 0, 0, 0.8); 
}

.v-card-title h1 {
  color: #e53935; /* Color rojo para el título */
}


</style>



