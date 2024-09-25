<template>
    <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
        <div class="translucent-background d-flex flex-column align-center justify-start w-100">
            <div class=" d-flex flex-row align-start justify-space-between w-100">
                <h1>Inventory Register</h1>
                <Logout />
            </div>
            <div class="w-100">

                <v-autocomplete v-model="selectedProduct" :items="productList" item-text="name" item-value="id"
                    label="Buscar producto" @change="addProduct"></v-autocomplete>


                <v-btn @click="addRow">Agregar fila manual</v-btn>
                <v-btn @click="">Finalizar</v-btn>
                <v-table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in items" :key="index">
                            <td>
                                <v-text-field v-model="item.name" solo></v-text-field>
                            </td>
                            <td>
                                <v-text-field v-model="item.age" type="number" solo></v-text-field>
                            </td>
                            <td>
                                <v-btn icon @click="removeRow(index)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

            </div>
        </div>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            items: [
                { name: 'Juan', age: 30 },
                { name: 'Ana', age: 25 },
            ],
            selectedProduct: null,
            productList: [
                { id: 1, name: 'Producto 1' },
                { id: 2, name: 'Producto 2' },
                { id: 3, name: 'Producto 3' },
            ],
        };
    },
    methods: {
        addRow() {
            this.items.push({ name: 'Nuevo', age: 0 });
        },
        addProduct() {
            const product = this.productList.find(p => p.id === this.selectedProduct);
            if (product) {
                this.items.push({ name: product.name, age: '' });
                this.selectedProduct = null;
            }
        },
        removeRow(index) {
            this.items.splice(index, 1);
        },
    },
};
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