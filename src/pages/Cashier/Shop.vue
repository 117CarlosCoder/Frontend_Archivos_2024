<template>
    <v-app>
      <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
        <div class="translucent-background d-flex flex-column align-center justify-start w-100">
          <div class="d-flex flex-row align-start justify-space-between w-100">
            <h1>Venta de videojuegos</h1>
            <v-col v-if="!showShopSubprocess" cols="12" md="0" sm="2">
              <v-btn @click="startSale" block color="danger">
                Venta
              </v-btn>
            </v-col>
          </div>
          <div class="w-100 mb-4">
            <v-btn class="btn-arrowl" icon @click="goBack">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </div>
          <div v-if="!showShopSubprocess" class="h-auto w-100">
            <v-card flat>
              <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
                Buscador de Videojuegos
  
                <v-spacer></v-spacer>
  
                <v-text-field v-model="search" density="compact" label="Search"
                  prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details
                  single-line></v-text-field>
              </v-card-title>
  
              <v-divider></v-divider>
              <v-data-table v-model:search="search" :items="items" :headers="headers">
                <template v-slot:item.cantidad_producto="{ item }">
                  <div class="text-end">
                    {{ item.cantidad_producto }}
                    <v-chip :color="item.cantidad_producto > 0 ? 'green' : 'red'"
                      :text="item.cantidad_producto > 0 ? 'En stock' : 'Agotado'" class="text-uppercase"
                      size="small" label></v-chip>
                  </div>
                </template>
                <template v-slot:item.precio_producto="{ item }">
                  {{ formatPrice(item.precio_producto) }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex align-center">
                    <v-text-field
                      v-model="item.quantityToAdd"
                      type="number"
                      min="1"
                      :max="item.cantidad_producto"
                      label="Cant."
                      hide-details
                      class="mr-2"
                      style="width: 60px;"
                      density="compact"
                    ></v-text-field>
                    <v-btn
                      color="primary"
                      @click="addToCart(item)"
                      :disabled="item.cantidad_producto <= 0 || !item.quantityToAdd"
                      size="small"
                    >
                      Agregar
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </div>
          <div v-if="cart.length > 0 && !showShopSubprocess" class="mt-4 w-100">
            <v-card flat>
              <v-card-title>Carrito de Compras</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item v-for="(item, index) in cart" :key="index">
                    <v-list-item-title>
                      {{ item.nombre_producto }} - Cantidad: {{ item.quantity }} - 
                      Precio: {{ formatPrice(item.precio_producto * item.quantity) }}
                    </v-list-item-title>
                    <v-list-item-action>
                      <v-btn icon @click="removeFromCart(index)" size="small">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
                <div class="text-h6 mt-4">
                  Total: {{ formatPrice(cartTotal) }}
                </div>
              </v-card-text>
            </v-card>
          </div>
          <div v-if="showShopSubprocess" class="w-100">
            <ShopProcess :cart-items="cart" :cart-total="cartTotal"  :cliente="cliente" />
          </div>
        </div>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import ShopProcess from '@/components/ShopProcess.vue';
  
  const search = ref('');
  const showShopSubprocess = ref(false);
  const items = ref([]);
  const cart = ref([]);
  const route = useRoute();
  const cliente = ref(null);
  
  const headers = [
    { title: 'ID', key: 'id_producto' },
    { title: 'Nombre', key: 'nombre_producto' },
    { title: 'Pasillo', key: 'pasillo' },
    { title: 'Cantidad', key: 'cantidad_producto' },
    { title: 'Sucursal', key: 'sucursal_producto' },
    { title: 'Precio', key: 'precio_producto' },
    { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
  ];

  
  
  const fetchItems = async () => {
    try {
      const response = await axios.post('http://localhost:8080/cashier/getProducts?value=');
      items.value = response.data.map(item => ({
        ...item,
        quantityToAdd: 1
      }));
      console.log(items.value);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };
  
  const startSale = () => {
    if (cart.value.length > 0) {
            showShopSubprocess.value = true;
        } else {
            // Mostrar un mensaje de error o alerta si el carrito está vacío
            alert('El carrito está vacío. Agregue productos antes de iniciar la venta.');
        }
  };
  
  const goBack = () => {
    window.history.back();
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(price);
  };
  
  const addToCart = (item) => {
    const quantity = parseInt(item.quantityToAdd);
    if (quantity > 0 && quantity <= item.cantidad_producto) {
      const existingItem = cart.value.find(cartItem => cartItem.id_producto === item.id_producto);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.value.push({
          ...item,
          quantity: quantity
        });
      }
      item.cantidad_producto -= quantity;
      item.quantityToAdd = 1;
    }
  };
  
  const removeFromCart = (index) => {
    const removedItem = cart.value[index];
    const originalItem = items.value.find(item => item.id_producto === removedItem.id_producto);
    if (originalItem) {
      originalItem.cantidad_producto += removedItem.quantity;
    }
    cart.value.splice(index, 1);
  };
  
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.precio_producto * item.quantity), 0);
  });
  
  onMounted(() => {
    fetchItems();
    if (route.params.cliente) {
      cliente.value = JSON.parse(route.params.cliente);
      console.log("CLIENTE: ", cliente.value);
    }
  });
  </script>
  
  <style scoped>
  body {
    background-color: #000000;
  }
  
  .translucent-background {
    width: 90%;
    height: auto;
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
  
  .v-card {
    padding: 20px;
    border-radius: 8px;
  }
  </style>