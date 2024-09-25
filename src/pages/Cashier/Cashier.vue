<template>
    <v-app>
        <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
            <div class="translucent-background d-flex flex-column align-center justify-start w-100 h-100">
                <div class="d-flex flex-row align-start justify-space-between w-100">
                    <v-icon class="mr-2">mdi-gamepad</v-icon>
                    <h1>Cajero de Videojuegos</h1>
                    <Logout />
                </div>
                <div class="d-flex flex-column align-center justify-center w-100 h-100">
                    <v-row class="button-grid w-100 h-100" dense>
                        <v-col cols="6" class="d-flex justify-center mb-4">
                            <v-btn class="custom-btn" block @click="newClient">
                                <v-icon left>mdi-account-plus</v-icon>
                                Registrar Cliente
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-center mb-4">
                            <v-btn class="custom-btn" block @click="editClient">
                                <v-icon left>mdi-account-edit</v-icon>
                                Editar Cliente
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-center">
                            <v-btn class="custom-btn" block @click="shop">
                                <v-icon left>mdi-cart</v-icon>
                                Venta
                            </v-btn>
                        </v-col>
                        <v-col cols="6" class="d-flex justify-center">
                            <v-btn class="custom-btn" block>
                                <v-icon left>mdi-lock</v-icon>
                                Configuraciones
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-container>
    </v-app>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const newClient = () => {
            router.push('/cashier/newclient');
        };

        const editClient = () => {
            router.push('/cashier/editclient');
        };

        const shop = () => {
            router.push('/cashier/clientshop');
        };

        return {
            newClient,
            editClient,
            shop,
        };
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
    background: linear-gradient(135deg, rgba(18, 18, 18, 0.8), rgba(255, 0, 0, 0.2)); 
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

h1,
p {
    color: #e53935; 
    font-size: 2rem;
}

.button-grid {
    flex-grow: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 20px;
}

.custom-btn {
    background: linear-gradient(135deg, #FF0000, #C8102E); 
    color: white;
    font-weight: bold;
    border-radius: 12px;
    transition: transform 0.3s ease, background 0.3s ease;
    width: 90%;
    height: 250px;
    font-size: 1.5rem;
}

.custom-btn:hover {
    background: linear-gradient(135deg, #C8102E, #A40000);
    transform: scale(1.05);
}

.v-icon {
    margin-right: 12px;
    font-size: 2rem;
}
</style>
