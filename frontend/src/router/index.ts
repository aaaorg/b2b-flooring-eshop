import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/products/ProductCatalog.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/pages/products/ProductCatalog.vue')
      },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('@/pages/products/ProductDetail.vue')
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/pages/cart/CartPage.vue')
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('@/pages/cart/CheckoutPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'order-confirmation/:id',
        name: 'order-confirmation',
        component: () => import('@/pages/cart/OrderConfirmation.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'account',
        component: () => import('@/pages/account/AccountPage.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            redirect: { name: 'orders' }
          },
          {
            path: 'orders',
            name: 'orders',
            component: () => import('@/pages/account/OrderHistory.vue')
          },
          {
            path: 'orders/:id',
            name: 'order-detail',
            component: () => import('@/pages/account/OrderDetail.vue')
          },
          {
            path: 'shopping-lists',
            name: 'shopping-lists',
            component: () => import('@/pages/account/ShoppingLists.vue')
          },
          {
            path: 'shopping-lists/:id',
            name: 'shopping-list-detail',
            component: () => import('@/pages/account/ShoppingListDetail.vue')
          }
        ]
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/pages/admin/UserApproval.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
