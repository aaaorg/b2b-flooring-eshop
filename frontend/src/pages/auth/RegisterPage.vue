<template>
  <q-card>
    <q-card-section>
      <div class="text-h5 text-center">Register B2B Account</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="handleRegister">
        <q-input
          v-model="formData.companyName"
          label="Company Name"
          required
          outlined
          :rules="[(val) => !!val || 'Company name is required']"
        />

        <q-input
          v-model="formData.fullName"
          label="Full Name"
          required
          outlined
          class="q-mt-md"
          :rules="[(val) => !!val || 'Full name is required']"
        />

        <q-input
          v-model="formData.email"
          label="Email"
          type="email"
          required
          outlined
          class="q-mt-md"
          :rules="[(val) => !!val || 'Email is required']"
        />

        <q-input
          v-model="formData.phone"
          label="Phone (optional)"
          outlined
          class="q-mt-md"
        />

        <q-input
          v-model="formData.password"
          label="Password"
          type="password"
          required
          outlined
          class="q-mt-md"
          :rules="[(val) => val.length >= 6 || 'Password must be at least 6 characters']"
        />

        <q-btn
          type="submit"
          label="Register"
          color="primary"
          class="full-width q-mt-md"
          :loading="authStore.loading"
        />
      </q-form>
    </q-card-section>

    <q-card-section>
      <div class="text-center">
        Already have an account?
        <router-link to="/auth/login">Login here</router-link>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const formData = reactive({
  companyName: '',
  fullName: '',
  email: '',
  phone: '',
  password: ''
})

async function handleRegister() {
  const success = await authStore.register(formData)

  if (success) {
    router.push({ name: 'login' })
  }
}
</script>
