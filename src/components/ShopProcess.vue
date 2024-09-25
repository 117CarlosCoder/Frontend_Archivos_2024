<template>
  <div class="bg-gray-900 text-white p-8 rounded-lg shadow-xl">
    <v-stepper v-model="step" :items="items" show-actions class="bg-transparent">
      <template v-slot:item.1>
        <h3 class="text-2xl font-bold mb-4">Revisar Orden</h3>
        <v-sheet border class="bg-gray-800 rounded-lg overflow-hidden">
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left">Descripción</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in cartItems" :key="index">
                <td v-text="product.nombre_producto"></td>
                <td class="text-right" v-text="product.quantity"></td>
                <td class="text-right">{{ formatPrice(product.quantity * product.precio_producto) }}</td>
              </tr>
              <tr>
                <th>Subtotal</th>
                <th></th>
                <th class="text-right">
                  {{ formatPrice(subtotal) }}
                </th>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </template>

      <template v-if="target" v-slot:item.2>
        <p>Puntos Acumulados {{ target.puntosAcumulados }}</p>
        <h3 class="text-2xl font-bold mb-4">Tarjeta</h3>
        <v-radio-group v-model="shipping" label="Tarjeta de descuento" class="mt-4">
          <v-radio label="Si" :value="target.puntosAcumulados"></v-radio>
          <v-radio label="No" value="0"></v-radio>
        </v-radio-group>
      </template>

      <template v-slot:item.3>
        <h3 class="text-2xl font-bold mb-4">Confirmar Orden</h3>
        <v-sheet border class="bg-gray-800 rounded-lg overflow-hidden">
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left">Descripción</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in cartItems" :key="index">
                <td v-text="product.nombre_producto"></td>
                <td class="text-right" v-text="product.quantity"></td>
                <td class="text-right">{{ formatPrice(product.quantity * product.precio_producto) }}</td>
              </tr>
              <tr>
                <td>Tarjeta de descuento</td>
                <td></td>
                <td class="text-right">{{ formatPrice(- Number(shipping)) }}</td>
              </tr>
              <tr>
                <th>Total</th>
                <th></th>
                <th class="text-right">
                  {{ formatPrice(total) }}
                </th>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </template>

      <template v-slot:prev="{ on, disabled }">
        <v-btn color="primary" :disabled="disabled" @click="goToPreviousStep" class="mt-4">
          Anterior
        </v-btn>
      </template>

      <template v-slot:next="{ on, disabled }">
        <v-btn color="primary" :disabled="step === items.length ? false : disabled" @click="handleNextClick" class="mt-4">
          {{ step === items.length ? 'Confirmar Compra' : 'Siguiente' }}
        </v-btn>
      </template>
    </v-stepper>
  </div>
</template>

<script setup>
import { String } from 'core-js';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  cartTotal: {
    type: Number,
    required: true
  },
  cliente: {
    type: Object,
    required: true
  }
});

console.log('Cliente:', props.cliente);

const router = useRouter();
const step = ref(1);
const shipping = ref('25');
const target = ref(null);
const items = ['Revisar Orden', 'Tarjeta', 'Confirmar'];

const subtotal = computed(() => props.cartTotal);

const total = computed(() => {
  return subtotal.value - Number(shipping.value);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(price);
};

const goToPreviousStep = () => {
  if (step.value > 1) {
    step.value -= 1;
  }
};

const handleNextClick = async () => {
  if (step.value < items.length) {
    step.value += 1;
    try {
        const response = await axios.post('http://localhost:8080/cashier/getTarget?target='+props.cliente.id, { 
          withCredentials: true,
        });
        target.value = response.data;
        console.log(target.value);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
  } else {
    shopvalid();
  }
};

const productos = props.cartItems.map(item => ({
      producto_id: item.id_producto, // Cambia 'id' por el campo correcto de tu objeto
      cantidad: item.quantity,
      precio_unitario: item.precio_producto
    }));

const shopUserRequest = {
      nit: props.cliente.nit,
      totDescuentos: subtotal.value - Number(shipping.value), // Calcula el total de descuentos si corresponde
      totsinDescuentos: subtotal.value, // Usa el total calculado
      cliente: props.cliente.id,
      productos: productos
};

const shopvalid = async () => {
  try {
    // Aquí puedes agregar la lógica para procesar la orden antes de redirigir
    /*console.log('Procesando orden:', {
      items: props.cartItems,
      shipping: subtotal.value - Number(shipping.value),
      total: subtotal.value,
      cliente: props.cliente 
    });*/

    const response = await axios.post('http://localhost:8080/cashier/shopUser', shopUserRequest, { 
      withCredentials: true 
    });
    if (response.status === 200) {
        alert("Compra realizada con exito");
        await router.push('/cashier/home');
    }

    
  } catch (error) {
    console.error('Error al procesar la orden:', error);
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
  }
};



</script>

<style scoped>
.v-stepper {
  background: transparent !important;
}

.v-stepper__content {
  background: transparent !important;
}

.v-btn {
  background-color: #e53935 !important;
  color: white !important;
}

.v-btn:hover {
  background-color: #b71c1c !important;
}

.v-radio-group {
  color: white !important;
}

.v-radio {
  color: white !important;
}
</style>