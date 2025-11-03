<template>
  <q-page class="q-pa-md">
    <q-spinner v-if="loading" size="50px" color="primary" class="absolute-center" />

    <div v-else-if="product">
      <div class="text-h4 q-mb-md">{{ product.name }}</div>

      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-8">
              <div class="text-h6">Product Details</div>
              <p>{{ product.description || 'No description available' }}</p>

              <div class="q-mt-md">
                <div><strong>SKU:</strong> {{ product.sku }}</div>
                <div><strong>Category:</strong> {{ product.category?.name }}</div>
                <div><strong>Material:</strong> {{ product.material }}</div>
                <div><strong>Finish:</strong> {{ product.finish }}</div>
                <div><strong>Thickness:</strong> {{ product.thickness }}</div>
                <div><strong>Dimensions:</strong> {{ product.dimensions }}</div>
                <div><strong>Manufacturer:</strong> {{ product.manufacturer }}</div>
              </div>
            </div>

            <div class="col-12 col-md-4">
              <div class="text-h5 q-mb-md">{{ formatPrice(product.basePrice) }} CZK / {{ product.unit }}</div>

              <q-badge :color="product.stock > 0 ? 'positive' : 'negative'" class="q-mb-md">
                {{ product.stock > 0 ? `${product.stock} ${product.unit} in stock` : 'Out of stock' }}
              </q-badge>

              <div class="q-mt-md">
                <q-input
                  v-model.number="quantity"
                  type="number"
                  label="Quantity"
                  outlined
                  :min="1"
                  :max="product.stock"
                  class="q-mb-md"
                />

                <q-btn
                  color="primary"
                  label="Add to Cart"
                  icon="add_shopping_cart"
                  class="full-width"
                  :disable="product.stock === 0"
                  @click="addToCart"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/products.service'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const quantity = ref(1)

onMounted(async () => {
  const id = Number(route.params.id)
  product.value = await productsStore.fetchProduct(id)
  loading.value = false
})

function addToCart() {
  if (product.value) {
    cartStore.addItem(product.value, quantity.value)
  }
}

function formatPrice(price: number | string) {
  return typeof price === 'string' ? parseFloat(price).toFixed(2) : price.toFixed(2)
}
</script>
