<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Verify session on app load
onMounted(async () => {
  if (authStore.isAuthenticated) {
    // If user exists in localStorage, verify the session is still valid
    await authStore.fetchUser()
  }
})
</script>
