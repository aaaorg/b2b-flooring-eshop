<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Product Catalog</div>

    <!-- Filters -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.search"
              label="Search products..."
              outlined
              dense
              debounce="500"
              @update:model-value="applyFilters"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="col-6 col-md-2">
            <q-select
              v-model="filters.category_id"
              :options="categoryOptions"
              label="Category"
              outlined
              dense
              clearable
              @update:model-value="applyFilters"
            />
          </div>

          <div class="col-6 col-md-2">
            <q-select
              v-model="filters.material"
              :options="productsStore.filterOptions.materials"
              label="Material"
              outlined
              dense
              clearable
              @update:model-value="applyFilters"
            />
          </div>

          <div class="col-6 col-md-2">
            <q-select
              v-model="filters.finish"
              :options="productsStore.filterOptions.finishes"
              label="Finish"
              outlined
              dense
              clearable
              @update:model-value="applyFilters"
            />
          </div>

          <div class="col-6 col-md-2">
            <q-checkbox
              v-model="filters.in_stock"
              label="In Stock Only"
              @update:model-value="applyFilters"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Products Table -->
    <q-table
      :rows="productsStore.products"
      :columns="columns"
      row-key="id"
      :loading="productsStore.loading"
      :pagination="pagination"
      @request="onTableRequest"
      binary-state-sort
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <router-link :to="{ name: 'product-detail', params: { id: props.row.id } }">
            {{ props.row.name }}
          </router-link>
        </q-td>
      </template>

      <template v-slot:body-cell-stock="props">
        <q-td :props="props">
          <q-badge :color="props.row.stock > 0 ? 'positive' : 'negative'">
            {{ props.row.stock }} {{ props.row.unit }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          {{ formatPrice(props.row.basePrice) }} CZK / {{ props.row.unit }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            label="Add to Cart"
            size="sm"
            @click="addToCart(props.row)"
            :disable="props.row.stock === 0"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/services/products.service'

const productsStore = useProductsStore()
const cartStore = useCartStore()

const filters = ref({
  search: '',
  category_id: null as number | null,
  material: null as string | null,
  finish: null as string | null,
  in_stock: false
})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0
})

const columns = [
  { name: 'sku', label: 'SKU', field: 'sku', align: 'left', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'material', label: 'Material', field: 'material', align: 'left' },
  { name: 'finish', label: 'Finish', field: 'finish', align: 'left' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center' },
  { name: 'price', label: 'Price', field: 'basePrice', align: 'right', sortable: true },
  { name: 'actions', label: 'Actions', align: 'center' }
]

const categoryOptions = computed(() => {
  return productsStore.categories.map(c => ({ label: c.name, value: c.id }))
})

onMounted(async () => {
  await Promise.all([
    productsStore.fetchCategories(),
    productsStore.fetchFilterOptions()
  ])
  await loadProducts()
})

async function loadProducts() {
  const filterParams: any = {
    page: pagination.value.page,
    limit: pagination.value.rowsPerPage
  }

  if (filters.value.search) filterParams.search = filters.value.search
  if (filters.value.category_id) filterParams.category_id = typeof filters.value.category_id === 'object' ? filters.value.category_id.value : filters.value.category_id
  if (filters.value.material) filterParams.material = filters.value.material
  if (filters.value.finish) filterParams.finish = filters.value.finish
  if (filters.value.in_stock) filterParams.in_stock = true

  await productsStore.fetchProducts(filterParams)
}

function applyFilters() {
  pagination.value.page = 1
  loadProducts()
}

function onTableRequest(props: any) {
  pagination.value.page = props.pagination.page
  pagination.value.rowsPerPage = props.pagination.rowsPerPage
  loadProducts()
}

function addToCart(product: Product) {
  cartStore.addItem(product, 1)
}

function formatPrice(price: number) {
  return price.toFixed(2)
}
</script>
