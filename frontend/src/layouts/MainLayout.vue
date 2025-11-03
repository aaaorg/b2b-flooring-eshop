<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/" class="text-white text-decoration-none">
            <strong>Karsis</strong> B2B e-shop
          </router-link>
        </q-toolbar-title>

        <q-space />

        <q-btn
          flat
          dense
          label="Products"
          :to="{ name: 'products' }"
        />

        <q-btn
          flat
          dense
          icon="shopping_cart"
          :label="cartStore.itemCount > 0 ? `Cart (${cartStore.itemCount})` : 'Cart'"
          :to="{ name: 'cart' }"
        >
          <q-badge v-if="cartStore.itemCount > 0" color="red" floating>
            {{ cartStore.itemCount }}
          </q-badge>
        </q-btn>

        <template v-if="authStore.isAuthenticated">
          <q-btn
            v-if="authStore.user?.role === 'admin'"
            flat
            dense
            label="Admin"
            icon="admin_panel_settings"
            :to="{ name: 'admin' }"
          />
          <q-btn
            flat
            dense
            label="Account"
            :to="{ name: 'account' }"
          />
          <q-btn
            flat
            dense
            icon="logout"
            label="Logout"
            @click="handleLogout"
          />
        </template>
        <template v-else>
          <q-btn
            flat
            dense
            label="Login"
            :to="{ name: 'login' }"
          />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
