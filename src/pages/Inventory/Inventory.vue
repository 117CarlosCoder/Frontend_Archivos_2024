<template>
  <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
    <div class="translucent-background d-flex flex-column align-center justify-start w-100">
      <div class="d-flex flex-row align-start justify-space-between w-100">
        <h1 class="white--text">Inventory Register</h1>
        <Logout />
      </div>
      <div class="w-100">
        <v-tabs v-model="activeTab">
          <v-tab>Add to Inventory</v-tab>
          <v-tab>Current Shelf Inventory</v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <v-tab-item>
            <v-text-field
              v-model="searchValue"
              label="Buscar producto"
              @input="debouncedSearchProducts"
              class="mb-4"
            ></v-text-field>

            <v-autocomplete
              v-model="selectedProduct"
              :items="productListComputed"
              item-text="nombre"
              item-value="id"
              label="Seleccionar producto"
              class="mb-4"
              :loading="loading"
              :error-messages="errorMessage"
              return-object
            ></v-autocomplete>

            <v-text-field
              v-model.number="quantity"
              type="number"
              label="Cantidad"
              min="1"
              class="mb-4"
              :rules="[v => v > 0 || 'La cantidad debe ser mayor que 0']"
            ></v-text-field>

            <v-text-field
              v-model.number="pasillo"
              type="number"
              label="Pasillo"
              min="1"
              class="mb-4"
              :rules="[v => v > 0 || 'El pasillo debe ser mayor que 0']"
            ></v-text-field>

            <v-btn 
              @click="addProduct" 
              color="primary" 
              class="mr-2" 
              :disabled="!selectedProduct || !pasillo || !quantity || quantity <= 0 || pasillo <= 0"
              :loading="addingProduct"
            >
              Agregar producto
            </v-btn>
            <v-btn 
              @click="finalizeInventory" 
              color="success" 
              :disabled="inventoryItems.length === 0"
              :loading="finalizingInventory"
            >
              Finalizar
            </v-btn>

            <v-data-table
              :headers="headers"
              :items="inventoryItems"
              class="mt-4"
              v-show="false"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="removeItem(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <v-btn 
              @click="loadShelfInventory" 
              color="primary" 
              class="mb-4"
              :loading="shelfLoading"
            >
              Load Current Shelf Inventory
            </v-btn>

            <v-text-field
              v-if="showShelfInventory"
              v-model="shelfSearchValue"
              label="Buscar producto en estantería"
              @input="debouncedSearchShelfProducts"
              class="mb-4"
            ></v-text-field>

            <v-data-table
              v-if="showShelfInventory"
              :headers="shelfHeaders"
              :items="shelfProducts"
              :loading="shelfLoading"
              class="mt-4"
            >
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>

    <v-snackbar v-model="snackbar" :color="snackbarColor" top>
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'
import Logout from '@/components/Logout.vue'
import { debounce } from 'lodash'

export default {
  components: {
    Logout
  },
  setup() {
    const productList = ref([])
    const selectedProduct = ref(null)
    const quantity = ref(1)
    const pasillo = ref(null)
    const inventoryItems = ref([])
    const searchValue = ref('')
    const loading = ref(false)
    const errorMessage = ref('')
    const snackbar = ref(false)
    const snackbarText = ref('')
    const snackbarColor = ref('success')
    const activeTab = ref(0)
    const shelfProducts = ref([])
    const shelfSearchValue = ref('')
    const shelfLoading = ref(false)
    const addingProduct = ref(false)
    const finalizingInventory = ref(false)
    const showShelfInventory = ref(false)
    const idv = 0;

    const headers = [
      { text: 'ID' }
    ]

    const shelfHeaders = [
      { text: 'ID', value: 'id_producto' },
      { text: 'Nombre del Producto', value: 'nombre_producto' },
      { text: 'Pasillo', value: 'pasillo' },
      { text: 'Cantidad', value: 'cantidad_producto' },
      { text: 'Sucursal', value: 'sucursal_producto' },
      { text: 'Precio', value: 'precio_producto' }
    ]

    const productListComputed = computed(() => {
      return productList.value.map(product => (
        product.id, 
        product.nombre
      
      ))
    })

    const searchProducts = async () => {
      loading.value = true
      errorMessage.value = ''
      try {
        const response = await axios.get('http://localhost:8080/inventory/list-products', {
          params: { value: searchValue.value },
          withCredentials: true,
        });
        productList.value = response.data
        console.log(productList)
      } catch (error) {
        console.error('Error fetching products:', error);
        errorMessage.value = 'Error al buscar productos. Por favor, intente de nuevo.'
      } finally {
        loading.value = false
      }
    }

    const debouncedSearchProducts = debounce(searchProducts, 300)

    const searchShelfProducts = async () => {
      shelfLoading.value = true
      try {
        const response = await axios.get('http://localhost:8080/inventory/find-products', {
          params: { valor: shelfSearchValue.value || "" },
          withCredentials: true,
        });
        shelfProducts.value = response.data
      } catch (error) {
        console.error('Error fetching shelf products:', error);
        showSnackbar('Error al buscar productos en estantería', 'error')
      } finally {
        shelfLoading.value = false
      }
    }

    const debouncedSearchShelfProducts = debounce(searchShelfProducts, 300)

    const loadShelfInventory = async () => {
      shelfLoading.value = true
      try {
        await searchShelfProducts()
        showShelfInventory.value = true
      } catch (error) {
        console.error('Error loading shelf inventory:', error);
        showSnackbar('Error al cargar el inventario de estantería', 'error')
      } finally {
        shelfLoading.value = false
      }
    }

    const addProduct = () => {
      if (selectedProduct.value && pasillo.value && quantity.value > 0) {
        addingProduct.value = true
        const product = selectedProduct.value
        console.log(selectedProduct.value)
      
        const foundProduct = productList.value.find(products => products.nombre === selectedProduct.value)
        console.log(foundProduct.id)

        inventoryItems.value.push({
          producto_id: foundProduct.id,
          nombre: product.nombre,
          cantidad: quantity.value,
          pasillo: pasillo.value
        })
        selectedProduct.value = null
        quantity.value = 1
        pasillo.value = null
        showSnackbar('Producto agregado al inventario', 'success')
        addingProduct.value = false
      }
    }

    const removeItem = (item) => {
      const index = inventoryItems.value.findIndex(i => i.producto_id === item.producto_id && i.pasillo === item.pasillo)
      if (index !== -1) {
        inventoryItems.value.splice(index, 1)
        showSnackbar('Producto removido del inventario', 'info')
      }
    }

    const finalizeInventory = async () => {
      finalizingInventory.value = true
      try {
        console.log(inventoryItems.value);
        const inventoryData = inventoryItems.value.map(item => ({
          pasillo: item.pasillo,
          cantidad: item.cantidad,
          producto_id: item.producto_id
        }))

        console.log(inventoryData);

        const response = await axios.post('http://localhost:8080/inventory/move-products', inventoryData, {
          withCredentials: true,
        })
        if (response.status === 200) {
          inventoryItems.value = []
          showSnackbar('Inventario actualizado exitosamente', 'success')
        }
      } catch (error) {
        console.error('Error submitting inventory:', error)
        showSnackbar('Error al actualizar el inventario. Por favor, intente de nuevo.', 'error')
      } finally {
        finalizingInventory.value = false
      }
    }

    const showSnackbar = (text, color) => {
      snackbarText.value = text
      snackbarColor.value = color
      snackbar.value = true
    }

    return {
      productList,
      productListComputed,
      selectedProduct,
      quantity,
      pasillo,
      inventoryItems,
      headers,
      searchValue,
      loading,
      errorMessage,
      snackbar,
      snackbarText,
      snackbarColor,
      activeTab,
      shelfProducts,
      shelfSearchValue,
      shelfLoading,
      shelfHeaders,
      addingProduct,
      finalizingInventory,
      showShelfInventory,
      debouncedSearchProducts,
      debouncedSearchShelfProducts,
      loadShelfInventory,
      addProduct,
      removeItem,
      finalizeInventory
    }
  }
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
</style>