<template>
  <v-app>
    <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
      <div class="game-background">
        <v-row class="h-100">
          <v-col cols="12" class="text-center">
            <h1 class="display-2 font-weight-bold text-white mb-4">GameStore</h1>
            <p class="subtitle-1 text-white mb-8">Tu Destino Definitivo para Videojuegos</p>
            <div class="d-flex flex-column align-center justify-center">
              <v-btn size="x-large"  class="mb-4" @click="goToLogin">
                Iniciar Sesión
              </v-btn>
            </div>
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
  name: 'App',
  setup() {
    const router = useRouter();

    
    const goToLogin = () => {
      router.push('/login');
    };

    return {
      goToLogin
    };
  },
  mounted() {
    // Realiza la solicitud al backend usando axios
    axios.get('http://localhost:8080/home/secure')
      .then(response => {
        // Muestra la información en la consola del navegador
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}
</script>

<style scoped>
.game-background {
  width: 100%;
  min-height: 90%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(229, 57, 53, 0.8)),
              url('backgroundgame.jpg') no-repeat center center / cover;
  border-radius: 0;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 4rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle-1 {
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.v-btn {
  font-weight: bold;
  color: white;
  transition: transform 0.3s ease, background 0.3s ease;
  background: linear-gradient(135deg, #FF0000, #C8102E); 
  width: 90%;
  height: 250px;
  font-size: 1.5rem;
}

.v-btn:hover {
  
  background: linear-gradient(135deg, #C8102E, #A40000);
    transform: scale(1.05);
}

</style>


