<template>
    <v-col cols="12" md="0" sm="2">
        <v-btn class="custom-btn" @click="logout" block>
            <v-icon left>mdi-logout</v-icon> <!-- Puedes usar 'mdi-logout' si usas Material Design Icons -->
            Cerrar sesión
        </v-btn>
    </v-col>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const logout = async () => {
            try {
                // Hacer la petición POST para cerrar sesión
                await axios.post('http://localhost:8080/auth/logout');

                // Eliminar el rol del almacenamiento (en este caso de localStorage)
                localStorage.removeItem('userRole');

                // Redirigir al usuario a la página de inicio de sesión
                router.push('/home/secure');
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                // Manejar el error, mostrar un mensaje al usuario, etc.
            }
        };

        return {
            logout,
        };
    },
};
</script>

<style scoped>
.custom-btn {
    background-color: #e53935;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.custom-btn:hover {
    background-color: #b71c1c;
    transform: scale(1.05);
}

.custom-btn .v-icon {
    font-size: 1.5rem;
    margin-right: 8px;
}
</style>
