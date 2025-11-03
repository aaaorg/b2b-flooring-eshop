<template>
  <q-card>
    <q-card-section>
      <div class="text-h5 text-center">Login to Karsis B2B</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleLogin">
        <q-input
          v-model="email"
          label="Email"
          type="email"
          required
          outlined
          :rules="[(val) => !!val || 'Email is required']"
        />

        <q-input
          v-model="password"
          label="Password"
          type="password"
          required
          outlined
          class="q-mt-md"
          :rules="[(val) => !!val || 'Password is required']"
        />

        <q-btn
          type="submit"
          label="Login"
          color="primary"
          class="full-width q-mt-md"
          :loading="authStore.loading"
        />
      </q-form>
    </q-card-section>

    <q-card-section>
      <div class="text-center">
        Don't have an account?
        <router-link to="/auth/register">Register here</router-link>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login({ email: email.value, password: password.value })

  if (success) {
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  }
}
</script>
