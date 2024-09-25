<template>
    <v-app>
        <v-container class="d-flex flex-column align-center justify-center h-100" fluid>
            <div class="translucent-background d-flex flex-column align-start justify-start w-100">
                <div class=" d-flex flex-row align-start justify-space-between w-100">
                    <h1>Admin ConfigCards</h1>
                </div>
            </div>    
        </v-container>
    </v-app>
</template>

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