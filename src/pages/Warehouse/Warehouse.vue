<template>
    <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
      <div class="translucent-background d-flex flex-column align-center justify-start w-100">
        <div class="d-flex flex-row align-start justify-space-between w-100">
          <h1 class="text-h4 font-weight-bold white--text">Product Register</h1>
          <Logout />
        </div>
        <div class="w-100">
          <v-text-field
            v-model="searchValue"
            label="Search product"
            outlined
            dense
            class="mb-4"
          ></v-text-field>
  
          <v-list height="200" class="overflow-y-auto mb-4 bg-grey-darken-3">
            <v-list-item
              v-for="product in productList"
              :key="product.id"
              @click="addProduct(product)"
            >
              <v-list-item-title>{{ product.nombre }}</v-list-item-title>
              <v-list-item-subtitle>
                ID: {{ product.id }} | Price: ${{ product.precio }} | Stock: {{ product.cantidad }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-btn icon="mdi-plus" size="small" @click.stop="addProduct(product)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
  
          <v-btn @click="addRow" color="primary" class="mr-2">Add manual row</v-btn>
          <v-btn @click="handleFinish" color="success">Finish</v-btn>
  
          <v-data-table
            :headers="headers"
            :items="items"
            class="mt-4"
          >
            <template v-slot:item.nombre="{ item }">
              <v-text-field v-model="item.nombre" solo dense></v-text-field>
            </template>
            <template v-slot:item.cantidad="{ item }">
              <v-text-field v-model.number="item.cantidad" type="number" solo dense></v-text-field>
            </template>
            <template v-slot:item.precio="{ item }">
              <v-text-field v-model.number="item.precio" type="number" step="0.01" solo dense></v-text-field>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon @click="removeRow(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
  
          <v-alert v-if="error" type="error" class="mt-4">
            {{ error }}
          </v-alert>
        </div>
      </div>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import Logout from '@/components/Logout.vue';
  
  export default {
    components: {
      Logout,
    },
    setup() {
      const items = ref([]);
      const productList = ref([]);
      const searchValue = ref('');
      const error = ref(null);
  
      const headers = [
        { text: 'Name', value: 'nombre' },
        { text: 'Quantity', value: 'cantidad' },
        { text: 'Price', value: 'precio' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
  
      const api = axios.create({
        baseURL: 'http://localhost:8080/warehouse',
        withCredentials: true,
      });
  
      const fetchProducts = async () => {
        try {
          error.value = null;
          const response = await api.get('/getProducts', {
            params: { value: searchValue.value || "" }
          });
          if (typeof response.data === 'string') {
            throw new Error('Received unexpected HTML response');
          }
          productList.value = response.data;
          console.log('Fetched products:', productList.value);
        } catch (err) {
          console.error('Error fetching products:', err);
          error.value = `Failed to fetch products: ${err.message}. Please check your network connection and API configuration.`;
          productList.value = [];
        }
      };
  
      const addRow = () => {
        items.value.push({ id: Date.now(), nombre: '', cantidad: 0, precio: 0, sucursal: '' });
      };
  
      const addProduct = async (product) => {
        try {
          await api.post('/add-product', { id: product.id, nombre: product.nombre, cantidad: 1 });
          items.value.push({ ...product, cantidad: 1 });
        } catch (err) {
          console.error('Error adding product:', err);
          error.value = `Failed to add product: ${err.message}`;
        }
      };
  
      const removeRow = async (item) => {
        try {
          await api.post('/remove-product', { id: item.id, nombre: item.nombre, cantidad: 1 });
          const index = items.value.findIndex(i => i.id === item.id);
          if (index !== -1) {
            items.value.splice(index, 1);
          }
        } catch (err) {
          console.error('Error removing product:', err);
          error.value = `Failed to remove product: ${err.message}`;
        }
      };
  
      const handleFinish = async () => {
        try {
          for (const item of items.value) {
            const createProductRequest = {
              cantidad: item.cantidad,
              nombre: item.nombre,
              precio: item.precio,
              sucursal: item.sucursal || ''  // You might want to set a default value or get it from somewhere
            };
            await api.post('/create-products', createProductRequest);
          }
          items.value = [];
          console.log('Products registered successfully');
        } catch (err) {
          console.error('Error registering products:', err);
          error.value = `Failed to register products: ${err.message}`;
        }
      };
  
      onMounted(fetchProducts);
      watch(searchValue, fetchProducts);
  
      return {
        items,
        productList,
        searchValue,
        headers,
        error,
        addRow,
        addProduct,
        removeRow,
        handleFinish,
      };
    },
  };
  </script>
  
  <style scoped>
  .translucent-background {
    width: 90%;
    height: 90%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(229, 57, 53, 0.8));
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  }
  
  .v-btn {
    background-color: #e53935;
    border-radius: 8px;
  }
  
  .v-btn:hover {
    background-color: #b71c1c;
  }
  
  .v-list {
    border-radius: 8px;
  }
  </style>