
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Admin from '@/pages/Admin/Admin.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Shop from '@/pages/Cashier/Shop.vue'
import Register from '@/pages/Cashier/Register.vue'
import EditClient from '@/pages/Cashier/EditClient.vue'
import Warehouse from '@/pages/Warehouse/Warehouse.vue'
import Inventory from '@/pages/Inventory/Inventory.vue'
import EditEmployees from '@/pages/Admin/EditEmployees.vue'
import ConfigCards from '@/pages/Admin/ConfigCards.vue'
import Reports from '@/pages/Admin/Reports.vue'
import RegisterEmployees from '@/pages/Admin/RegisterEmployees.vue'
import Cashier from '@/pages/Cashier/Cashier.vue'
import UpdateClient from '@/pages/Cashier/UpdateClient.vue'
import ModalLogin from '@/pages/Cashier/ModalLogin.vue';
import ClientShop from '@/pages/Cashier/ClientShop.vue'




const routes = [
    {
      path:"/",
      name:"home",
      component: Home
    },
    {
      path:"/home/secure",
      name:"homesecure",
      component: Home
    },
    {
      path:"/login",
      name:"login",
      component: Login
    },
    {
      path:"/admin/home",
      name:"admin",
      component: Admin,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path:"/admin/registeremployer",
      name:"registeremployer",
      component: RegisterEmployees,
      props: true,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path:"/admin/editemployee",
      name:"edit",
      component: EditEmployees,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path:"/admin/configcards",
      name:"configcards",
      component: ConfigCards,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path:"/admin/reports",
      name:"reports",
      component: Reports,
      meta: { requiresAuth: true, role: 'ADMIN' }
    },
    {
      path:"/cashier/home",
      name:"cashier",
      component: Cashier,
      meta: { requiresAuth: true, role: 'CASHIER' }
    },
    {
      path:"/cashier/shop:cliente",
      name:"shop",
      component: Shop,
      props: true,
      meta: { requiresAuth: true, role: 'CASHIER' }
    },
    {
      path:"/cashier/clientshop",
      name:"clientshop",
      component: ClientShop,
      props: true,
      meta: { requiresAuth: true, role: 'CASHIER' }
    }
    ,
    {
      path:"/cashier/newClient",
      name:"register",
      component: Register,
      meta: { requiresAuth: true, role: 'CASHIER' }
    },
    {
      path:"/cashier/editClient",
      name:"editclient",
      component: EditClient,
      meta: { requiresAuth: true, role: 'CASHIER' }
    },
    {
      path:"/cashier/updateClient/:cliente",
      name:"updateClient",
      component: UpdateClient,
      meta: { requiresAuth: true, role: 'CASHIER' }
    },
    {
      path:"/warehouse/home",
      name:"warehouse",
      component: Warehouse,
      meta: { requiresAuth: true, role: 'WAREHOUSE' }
    },
    {
      path:"/inventory/home",
      name:"inventory",
      component: Inventory,
      meta: { requiresAuth: true, role: 'INVENTORY' }
    }
  ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth) {
    if (userRole === to.meta.role) {
      next();
    } else {
      next('/home/secure'); // Redirigir a una página de acceso denegado o login
    }
  } else {
    next();
  }
});



/* // Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
}) */

export default router
