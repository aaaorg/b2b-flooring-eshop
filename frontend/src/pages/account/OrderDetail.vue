<template>
  <q-page class="q-pa-md">
    <q-spinner v-if="loading" size="50px" color="primary" class="absolute-center" />

    <div v-else-if="order">
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h4">Order {{ order.orderNumber || order.order_number }}</div>
        <q-btn
          flat
          icon="arrow_back"
          label="Back to Orders"
          :to="{ name: 'orders' }"
        />
      </div>

      <div class="row q-col-gutter-md">
        <!-- Order Information -->
        <div class="col-12 col-md-8">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Order Information</div>

              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <div class="text-caption text-grey-7">Order Number</div>
                  <div class="text-subtitle1">{{ order.orderNumber || order.order_number }}</div>
                </div>

                <div class="col-6">
                  <div class="text-caption text-grey-7">Order Type</div>
                  <q-badge :color="getOrderType(order) === 'purchase' ? 'primary' : 'secondary'">
                    {{ getOrderType(order) === 'purchase' ? 'Purchase' : 'Reservation' }}
                  </q-badge>
                </div>

                <div class="col-6">
                  <div class="text-caption text-grey-7">Status</div>
                  <q-badge :color="getStatusColor(order.status)">
                    {{ order.status.replace('_', ' ').toUpperCase() }}
                  </q-badge>
                </div>

                <div class="col-6">
                  <div class="text-caption text-grey-7">Order Date</div>
                  <div class="text-subtitle1">{{ formatDate(order.createdAt || order.created_at) }}</div>
                </div>

                <div class="col-6" v-if="order.paymentStatus">
                  <div class="text-caption text-grey-7">Payment Status</div>
                  <q-badge :color="getPaymentStatusColor(order.paymentStatus)">
                    {{ order.paymentStatus.toUpperCase() }}
                  </q-badge>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Shipping Information -->
          <q-card class="q-mb-md" v-if="order.shippingAddress">
            <q-card-section>
              <div class="text-h6 q-mb-md">Shipping Information</div>
              <div>{{ order.shippingAddress }}</div>
              <div>{{ order.shippingCity }}, {{ order.shippingPostalCode }}</div>
              <div>{{ order.shippingCountry || 'Czech Republic' }}</div>
            </q-card-section>
          </q-card>

          <!-- Order Items -->
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Order Items</div>

              <q-table
                :rows="order.items"
                :columns="itemColumns"
                row-key="id"
                flat
                hide-pagination
              >
                <template v-slot:body-cell-productName="props">
                  <q-td :props="props">
                    <div>{{ props.row.productName }}</div>
                    <div class="text-caption text-grey-7">SKU: {{ props.row.productSku }}</div>
                  </q-td>
                </template>

                <template v-slot:body-cell-unitPrice="props">
                  <q-td :props="props">
                    {{ formatPrice(props.row.unitPrice || props.row.unit_price) }} CZK / {{ props.row.unit }}
                  </q-td>
                </template>

                <template v-slot:body-cell-subtotal="props">
                  <q-td :props="props">
                    {{ formatPrice(props.row.subtotal) }} CZK
                  </q-td>
                </template>
              </q-table>

              <q-separator class="q-my-md" />

              <div class="row justify-end">
                <div class="col-auto">
                  <div class="text-h6 text-primary">
                    Total: {{ formatPrice(order.totalAmount || order.total_amount) }} {{ order.currency || 'CZK' }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Notes -->
          <q-card v-if="order.notes" class="q-mt-md">
            <q-card-section>
              <div class="text-h6 q-mb-sm">Notes</div>
              <div>{{ order.notes }}</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Actions -->
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Actions</div>

              <q-btn
                label="Re-order"
                icon="shopping_cart"
                color="primary"
                class="full-width q-mb-sm"
                @click="reorder"
              />

              <q-btn
                label="Print Order"
                icon="print"
                outline
                class="full-width"
                @click="printOrder"
              />
            </q-card-section>
          </q-card>

          <!-- Company Information -->
          <q-card class="q-mt-md" v-if="order.company">
            <q-card-section>
              <div class="text-h6 q-mb-md">Company</div>
              <div class="text-subtitle1">{{ order.company.name }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersService, type Order } from '@/services/orders.service'
import { useCartStore } from '@/stores/cart'
import { Notify } from 'quasar'
import { date } from 'quasar'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const orderId = Number(route.params.id)
const order = ref<Order | null>(null)
const loading = ref(true)

const itemColumns = [
  { name: 'productName', label: 'Product', field: 'productName', align: 'left' },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center' },
  { name: 'unitPrice', label: 'Unit Price', field: 'unitPrice', align: 'right' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' }
]

onMounted(async () => {
  try {
    order.value = await ordersService.getOrder(orderId)
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to load order details',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
})

async function reorder() {
  if (!order.value?.items || order.value.items.length === 0) {
    Notify.create({
      type: 'warning',
      message: 'This order has no items',
      position: 'top'
    })
    return
  }

  let addedCount = 0
  for (const item of order.value.items) {
    const success = cartStore.addItem(item.product, item.quantity)
    if (success) addedCount++
  }

  if (addedCount > 0) {
    Notify.create({
      type: 'positive',
      message: `${addedCount} item(s) added to cart`,
      position: 'top'
    })
    router.push({ name: 'cart' })
  }
}

function printOrder() {
  window.print()
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending_sync': 'warning',
    'synced': 'positive',
    'failed': 'negative',
    'processing': 'info',
    'completed': 'positive',
    'cancelled': 'negative'
  }
  return colors[status] || 'grey'
}

function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'pending': 'warning',
    'paid': 'positive',
    'failed': 'negative',
    'refunded': 'info'
  }
  return colors[status] || 'grey'
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm')
  } catch (e) {
    return 'Invalid Date'
  }
}

function formatPrice(price: any): string {
  if (!price) return '0.00'
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}

function getOrderType(order: any): string {
  return order?.orderType || order?.order_type || ''
}
</script>
