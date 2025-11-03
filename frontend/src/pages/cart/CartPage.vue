<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Shopping Cart</div>

    <div v-if="cartStore.items.length === 0" class="text-center q-mt-xl">
      <q-icon name="shopping_cart" size="100px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">Your cart is empty</div>
      <q-btn
        label="Browse Products"
        color="primary"
        :to="{ name: 'products' }"
        class="q-mt-md"
      />
    </div>

    <div v-else>
      <q-table
        :rows="cartStore.items"
        :columns="columns"
        row-key="product.id"
        flat
        bordered
      >
        <template v-slot:body-cell-quantity="props">
          <q-td :props="props">
            <q-input
              v-model.number="props.row.quantity"
              type="number"
              dense
              outlined
              :min="1"
              :max="props.row.product.stock"
              @update:model-value="(val) => cartStore.updateQuantity(props.row.product.id, val)"
              style="width: 80px"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-subtotal="props">
          <q-td :props="props">
            {{ (parseFloat(props.row.product.basePrice) * props.row.quantity).toFixed(2) }} CZK
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              icon="delete"
              flat
              color="negative"
              @click="cartStore.removeItem(props.row.product.id)"
            />
          </q-td>
        </template>
      </q-table>

      <div class="row justify-end q-mt-md">
        <q-card class="col-12 col-md-4">
          <q-card-section>
            <div class="text-h6">Cart Summary</div>
            <q-separator class="q-my-md" />
            <div class="row justify-between q-mb-sm">
              <div>Total Items:</div>
              <div><strong>{{ cartStore.itemCount }}</strong></div>
            </div>
            <div class="row justify-between text-h6 text-primary">
              <div>Total:</div>
              <div><strong>{{ cartStore.totalAmount.toFixed(2) }} CZK</strong></div>
            </div>
          </q-card-section>

          <q-card-actions vertical>
            <q-btn
              label="Proceed to Checkout"
              color="primary"
              :to="{ name: 'checkout' }"
              class="full-width"
            />
            <q-btn
              label="Clear Cart"
              flat
              color="negative"
              @click="cartStore.clearCart"
              class="full-width"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}

const columns = [
  { name: 'name', label: 'Product', field: (row: any) => row.product.name, align: 'left' },
  { name: 'sku', label: 'SKU', field: (row: any) => row.product.sku, align: 'left' },
  { name: 'price', label: 'Price', field: (row: any) => `${formatPrice(row.product.basePrice)} CZK`, align: 'right' },
  { name: 'quantity', label: 'Quantity', align: 'center' },
  { name: 'subtotal', label: 'Subtotal', align: 'right' },
  { name: 'actions', label: '', align: 'center' }
]
</script>
