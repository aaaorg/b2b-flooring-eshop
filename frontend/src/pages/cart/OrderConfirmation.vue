<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section class="text-center">
            <q-icon name="check_circle" size="80px" color="positive" />
            <div class="text-h4 q-mt-md">Order Confirmed!</div>
            <p class="text-subtitle1 text-grey-7">
              Thank you for your {{ order && getOrderType(order) === 'purchase' ? 'purchase' : 'reservation request' }}
            </p>
          </q-card-section>

          <q-separator />

          <q-card-section v-if="order">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="text-subtitle2 q-mb-sm">Order Number</div>
                <div class="text-h6">{{ order.orderNumber || order.order_number }}</div>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle2 q-mb-sm">Order Type</div>
                <q-badge :color="getOrderType(order) === 'purchase' ? 'primary' : 'secondary'">
                  {{ getOrderType(order) === 'purchase' ? 'Purchase' : 'Reservation' }}
                </q-badge>
              </div>

              <div class="col-12">
                <q-separator class="q-my-md" />
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle2 q-mb-sm">Total Amount</div>
                <div class="text-h6 text-primary">{{ formatPrice(order.totalAmount || order.total_amount) }} {{ order.currency || 'CZK' }}</div>
              </div>

              <div class="col-12 col-md-6">
                <div class="text-subtitle2 q-mb-sm">Status</div>
                <q-badge color="info">{{ order.status.replace('_', ' ').toUpperCase() }}</q-badge>
              </div>
            </div>

            <div v-if="getOrderType(order) === 'reservation'" class="q-mt-md">
              <q-banner class="bg-info text-white">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>
                Our sales team will contact you within 24 hours to discuss your reservation and provide a detailed quote.
              </q-banner>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center" class="q-pa-md">
            <q-btn
              label="View Order Details"
              color="primary"
              :to="{ name: 'order-detail', params: { id: orderId } }"
            />
            <q-btn
              label="Continue Shopping"
              flat
              :to="{ name: 'products' }"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ordersService, type Order } from '@/services/orders.service'

const route = useRoute()
const orderId = Number(route.params.id)
const order = ref<Order | null>(null)

onMounted(async () => {
  try {
    order.value = await ordersService.getOrder(orderId)
  } catch (error) {
    console.error('Failed to load order:', error)
  }
})

function getOrderType(order: any): string {
  return order?.orderType || order?.order_type || ''
}

function formatPrice(price: any): string {
  if (!price) return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}
</script>
