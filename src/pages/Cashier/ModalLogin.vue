<template>
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Iniciar Sesión</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  label="Nombre de usuario"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cerrar</v-btn>
          <v-btn color="blue darken-1" text @click="login">Iniciar Sesión</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    modelValue: Boolean,
    queryParam: String
  });

  console.log("Query param")
  console.log(props.queryParam)

  const emit = defineEmits(['update:modelValue', 'login-success']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const username = ref('');
  const password = ref('');
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  

  

  const login = async () => {

    const loginData = {
    username: username.value, // Usando ref para obtener el valor
    password: password.value, // Usando ref para obtener el valor
    };
    try {
      const response = await axios.post('http://localhost:8080/cashier/admin-permission?id='+ props.queryParam,loginData);
  
      if (response.status === 200) {
            emit('login-success', true);
            closeDialog();
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión');
    }
  };
  </script>