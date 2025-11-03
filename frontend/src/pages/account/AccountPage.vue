<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">My Account</div>

    <q-tabs
      v-model="activeTab"
      class="q-mb-md"
      active-color="primary"
      indicator-color="primary"
      align="left"
    >
      <q-tab name="orders" label="Orders" icon="receipt" :to="{ name: 'orders' }" />
      <q-tab name="shopping-lists" label="Shopping Lists" icon="list_alt" :to="{ name: 'shopping-lists' }" />
    </q-tabs>

    <router-view :key="route.path" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref('orders')

// Update active tab based on current route
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'orders' || newRouteName === 'order-detail') {
      activeTab.value = 'orders'
    } else if (newRouteName === 'shopping-lists' || newRouteName === 'shopping-list-detail') {
      activeTab.value = 'shopping-lists'
    }
  },
  { immediate: true }
)
</script>
