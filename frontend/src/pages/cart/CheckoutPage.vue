<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Checkout</div>

    <div class="row q-col-gutter-md">
      <!-- Order Summary -->
      <div class="col-12 col-md-8">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Order Summary</div>
            <q-separator class="q-my-md" />

            <q-list>
              <q-item v-for="item in cartStore.items" :key="item.product.id">
                <q-item-section>
                  <q-item-label>{{ item.product.name }}</q-item-label>
                  <q-item-label caption>SKU: {{ item.product.sku }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ item.quantity }} x {{ formatPrice(item.product.basePrice) }} CZK</q-item-label>
                  <q-item-label caption>{{ (item.quantity * parseFloat(item.product.basePrice)).toFixed(2) }} CZK</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="row justify-between text-h6 text-primary">
              <div>Total:</div>
              <div><strong>{{ cartStore.totalAmount.toFixed(2) }} CZK</strong></div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Shipping Information -->
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Shipping Information</div>

            <q-form @submit="handleSubmit">
              <q-input
                v-model="formData.shippingAddress"
                label="Address"
                outlined
                :rules="[(val) => !!val || 'Address is required']"
                class="q-mb-md"
              />

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-6">
                  <q-input
                    v-model="formData.shippingCity"
                    label="City"
                    outlined
                    :rules="[(val) => !!val || 'City is required']"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    v-model="formData.shippingPostalCode"
                    label="Postal Code"
                    outlined
                    :rules="[(val) => !!val || 'Postal code is required']"
                  />
                </div>
              </div>

              <q-input
                v-model="formData.notes"
                label="Notes (optional)"
                type="textarea"
                outlined
                rows="3"
                class="q-mb-md"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Order Type Selection -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">Select Order Type</div>

            <q-option-group
              v-model="orderType"
              :options="orderTypeOptions"
              color="primary"
            />

            <q-separator class="q-my-md" />

            <div v-if="orderType === 'purchase'" class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">Purchase Order</div>
              <p class="text-caption text-grey-7">
                Complete your purchase now. Payment will be processed and order will be shipped.
              </p>
            </div>

            <div v-else class="q-mb-md">
              <div class="text-subtitle2 q-mb-sm">Reservation & Quote Request</div>
              <p class="text-caption text-grey-7">
                Reserve products and request a quote. Our sales team will contact you within 24 hours.
              </p>
            </div>

            <q-btn
              :label="orderType === 'purchase' ? 'Complete Purchase' : 'Submit Reservation'"
              color="primary"
              class="full-width"
              size="lg"
              :loading="loading"
              @click="handleSubmit"
            />

            <q-btn
              label="Back to Cart"
              flat
              :to="{ name: 'cart' }"
              class="full-width q-mt-sm"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { ordersService } from '@/services/orders.service'
import { Notify } from 'quasar'

const cartStore = useCartStore()
const router = useRouter()

function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}

const orderType = ref<'purchase' | 'reservation'>('purchase')
const loading = ref(false)

const orderTypeOptions = [
  { label: 'Purchase Now', value: 'purchase' },
  { label: 'Reserve & Request Quote', value: 'reservation' }
]

const formData = reactive({
  shippingAddress: '',
  shippingCity: '',
  shippingPostalCode: '',
  notes: ''
})

async function handleSubmit() {
  if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingPostalCode) {
    Notify.create({
      type: 'negative',
      message: 'Please fill in all required shipping fields',
      position: 'top'
    })
    return
  }

  loading.value = true

  try {
    const items = cartStore.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }))

    const response = await ordersService.createOrder({
      orderType: orderType.value,
      items,
      shippingAddress: formData.shippingAddress,
      shippingCity: formData.shippingCity,
      shippingPostalCode: formData.shippingPostalCode,
      notes: formData.notes
    })

    Notify.create({
      type: 'positive',
      message: response.message || 'Order created successfully!',
      position: 'top'
    })

    // Clear cart
    cartStore.clearCart()

    // Redirect to order confirmation
    router.push({ name: 'order-confirmation', params: { id: response.order.id } })
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to create order',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>
