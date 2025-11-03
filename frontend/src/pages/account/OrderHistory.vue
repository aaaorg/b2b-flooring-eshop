<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h6">Order History</div>
        <q-btn-toggle
          v-model="filterType"
          toggle-color="primary"
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Purchases', value: 'purchase' },
            { label: 'Reservations', value: 'reservation' }
          ]"
          @update:model-value="loadOrders"
        />
      </div>

      <q-table
        :rows="orders"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        @row-click="viewOrder"
      >
        <template v-slot:body-cell-orderNumber="props">
          <q-td :props="props">
            <router-link :to="{ name: 'order-detail', params: { id: props.row.id } }">
              {{ props.row.orderNumber }}
            </router-link>
          </q-td>
        </template>

        <template v-slot:body-cell-orderType="props">
          <q-td :props="props">
            <q-badge :color="props.row.orderType === 'purchase' ? 'primary' : 'secondary'">
              {{ props.row.orderType === 'purchase' ? 'Purchase' : 'Reservation' }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ props.row.status.replace('_', ' ').toUpperCase() }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-totalAmount="props">
          <q-td :props="props">
            {{ props.row.totalAmount.toFixed(2) }} {{ props.row.currency }}
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              icon="visibility"
              color="primary"
              :to="{ name: 'order-detail', params: { id: props.row.id } }"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="shopping_cart"
              color="secondary"
              @click.stop="reorder(props.row)"
            >
              <q-tooltip>Re-order</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ordersService, type Order } from '@/services/orders.service'
import { useCartStore } from '@/stores/cart'
import { Notify } from 'quasar'
import { date } from 'quasar'

const router = useRouter()
const cartStore = useCartStore()

const orders = ref<Order[]>([])
const loading = ref(false)
const filterType = ref('all')

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const columns = [
  { name: 'orderNumber', label: 'Order #', field: 'orderNumber', align: 'left', sortable: true },
  { name: 'orderType', label: 'Type', field: 'orderType', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'totalAmount', label: 'Total', field: 'totalAmount', align: 'right', sortable: true },
  { name: 'createdAt', label: 'Date', field: 'createdAt', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

onMounted(() => {
  loadOrders()
})

async function loadOrders() {
  console.log('[OrderHistory] Starting loadOrders')
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage
    }

    if (filterType.value !== 'all') {
      params.order_type = filterType.value
    }

    console.log('[OrderHistory] Calling ordersService.getOrders with params:', params)
    const response = await ordersService.getOrders(params)
    console.log('[OrderHistory] Got response:', response)

    // Use markRaw to prevent Vue reactivity issues with complex nested structures
    const rawData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data || [])
    orders.value = rawData.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber || order.order_number,
      orderType: order.orderType || order.order_type,
      status: order.status,
      totalAmount: order.totalAmount || order.total_amount,
      createdAt: order.createdAt || order.created_at,
      items: order.items || []
    }))

    pagination.value.rowsNumber = response.meta?.total || 0
    console.log('[OrderHistory] Orders loaded successfully, count:', orders.value.length)
  } catch (error) {
    console.error('[OrderHistory] Error loading orders:', error)
    Notify.create({
      type: 'negative',
      message: 'Failed to load orders',
      position: 'top'
    })
  } finally {
    loading.value = false
    console.log('[OrderHistory] loadOrders finished')
  }
}

function viewOrder(evt: Event, row: Order) {
  router.push({ name: 'order-detail', params: { id: row.id } })
}

async function reorder(order: Order) {
  try {
    // Fetch full order details with items
    const fullOrder = await ordersService.getOrder(order.id)

    if (!fullOrder.items || fullOrder.items.length === 0) {
      Notify.create({
        type: 'warning',
        message: 'This order has no items',
        position: 'top'
      })
      return
    }

    // Add all items to cart
    let addedCount = 0
    for (const item of fullOrder.items) {
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
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to re-order',
      position: 'top'
    })
  }
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

function formatDate(dateString: string): string {
  return date.formatDate(new Date(dateString), 'DD.MM.YYYY HH:mm')
}
</script>
