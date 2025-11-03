<template>
  <q-page class="q-pa-md">
    <q-spinner v-if="loading" size="50px" color="primary" class="absolute-center" />

    <div v-else-if="shoppingList">
      <div class="row justify-between items-center q-mb-md">
        <div>
          <div class="text-h4">{{ shoppingList.name }}</div>
          <div class="text-subtitle1 text-grey-7" v-if="shoppingList.description">
            {{ shoppingList.description }}
          </div>
        </div>
        <q-btn
          flat
          icon="arrow_back"
          label="Back to Lists"
          :to="{ name: 'shopping-lists' }"
        />
      </div>

      <div class="row q-col-gutter-md">
        <!-- Items Table --
>
        <div class="col-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="row justify-between items-center q-mb-md">
                <div class="text-h6">Items</div>
                <q-btn
                  label="Add Products"
                  icon="add"
                  color="primary"
                  @click="showAddProductDialog = true"
                />
              </div>

              <div v-if="!shoppingList.items || shoppingList.items.length === 0" class="text-center q-pa-lg">
                <q-icon name="inventory_2" size="64px" color="grey-5" />
                <div class="text-h6 text-grey-6 q-mt-md">No items in this list</div>
                <p class="text-grey-6">Add products to your shopping list</p>
              </div>

              <q-table
                v-else
                :rows="shoppingList.items"
                :columns="itemColumns"
                row-key="id"
                flat
                hide-pagination
              >
                <template v-slot:body-cell-productName="props">
                  <q-td :props="props">
                    <div>{{ props.row.product.name }}</div>
                    <div class="text-caption text-grey-7">SKU: {{ props.row.product.sku }}</div>
                  </q-td>
                </template>

                <template v-slot:body-cell-quantity="props">
                  <q-td :props="props">
                    <q-input
                      v-model.number="props.row.quantity"
                      type="number"
                      min="1"
                      dense
                      style="max-width: 80px"
                      @update:model-value="updateItemQuantity(props.row)"
                    />
                  </q-td>
                </template>

                <template v-slot:body-cell-unitPrice="props">
                  <q-td :props="props">
                    {{ props.row.product.basePrice.toFixed(2) }} CZK / {{ props.row.product.unit }}
                  </q-td>
                </template>

                <template v-slot:body-cell-subtotal="props">
                  <q-td :props="props">
                    {{ (props.row.quantity * props.row.product.basePrice).toFixed(2) }} CZK
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      dense
                      icon="delete"
                      color="negative"
                      @click="removeItem(props.row)"
                    >
                      <q-tooltip>Remove</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>

              <q-separator v-if="shoppingList.items && shoppingList.items.length > 0" class="q-my-md" />

              <div v-if="shoppingList.items && shoppingList.items.length > 0" class="row justify-end">
                <div class="col-auto">
                  <div class="text-h6 text-primary">
                    Total: {{ calculateTotal().toFixed(2) }} CZK
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Actions -->
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Actions</div>

              <q-btn
                label="Add All to Cart"
                icon="shopping_cart"
                color="primary"
                class="full-width q-mb-sm"
                :disable="!shoppingList.items || shoppingList.items.length === 0"
                @click="addAllToCart"
              />

              <q-btn
                label="Edit List Details"
                icon="edit"
                outline
                class="full-width"
                @click="editListDetails"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Add Product Dialog -->
    <q-dialog v-model="showAddProductDialog" full-width full-height>
      <q-card>
        <q-card-section>
          <div class="text-h6">Add Products to List</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="searchQuery"
            label="Search products"
            outlined
            clearable
            @update:model-value="searchProducts"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-spinner v-if="searchLoading" size="50px" color="primary" class="q-mt-md" />

          <q-list v-else separator class="q-mt-md">
            <q-item
              v-for="product in searchResults"
              :key="product.id"
              clickable
              @click="addProductToList(product)"
            >
              <q-item-section>
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption>SKU: {{ product.sku }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>{{ product.basePrice.toFixed(2) }} CZK</q-item-label>
                <q-item-label caption>{{ product.stockQuantity }} in stock</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shoppingListsService, type ShoppingList, type ShoppingListItem } from '@/services/shopping-lists.service'
import { productsService, type Product } from '@/services/products.service'
import { useCartStore } from '@/stores/cart'
import { Notify } from 'quasar'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const listId = Number(route.params.id)
const shoppingList = ref<ShoppingList | null>(null)
const loading = ref(true)
const showAddProductDialog = ref(false)
const searchQuery = ref('')
const searchResults = ref<Product[]>([])
const searchLoading = ref(false)

const itemColumns = [
  { name: 'productName', label: 'Product', field: 'productName', align: 'left' },
  { name: 'quantity', label: 'Quantity', field: 'quantity', align: 'center' },
  { name: 'unitPrice', label: 'Unit Price', field: 'unitPrice', align: 'right' },
  { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' },
  { name: 'actions', label: '', align: 'center' }
]

onMounted(async () => {
  await loadShoppingList()
})

async function loadShoppingList() {
  loading.value = true
  try {
    shoppingList.value = await shoppingListsService.getShoppingList(listId)
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to load shopping list',
      position: 'top'
    })
    router.push({ name: 'shopping-lists' })
  } finally {
    loading.value = false
  }
}

async function searchProducts() {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  searchLoading.value = true
  try {
    const response = await productsService.getProducts({ search: searchQuery.value, limit: 20 })
    searchResults.value = response.data
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'Failed to search products',
      position: 'top'
    })
  } finally {
    searchLoading.value = false
  }
}

async function addProductToList(product: Product) {
  try {
    await shoppingListsService.addItem(listId, {
      productId: product.id,
      quantity: 1
    })

    Notify.create({
      type: 'positive',
      message: 'Product added to list',
      position: 'top'
    })

    showAddProductDialog.value = false
    searchQuery.value = ''
    searchResults.value = []
    loadShoppingList()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to add product',
      position: 'top'
    })
  }
}

async function updateItemQuantity(item: ShoppingListItem) {
  if (item.quantity < 1) {
    item.quantity = 1
    return
  }

  try {
    await shoppingListsService.updateItem(listId, item.id, {
      quantity: item.quantity
    })

    Notify.create({
      type: 'positive',
      message: 'Quantity updated',
      position: 'top'
    })
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to update quantity',
      position: 'top'
    })
    loadShoppingList()
  }
}

async function removeItem(item: ShoppingListItem) {
  try {
    await shoppingListsService.removeItem(listId, item.id)

    Notify.create({
      type: 'positive',
      message: 'Item removed from list',
      position: 'top'
    })

    loadShoppingList()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to remove item',
      position: 'top'
    })
  }
}

function calculateTotal(): number {
  if (!shoppingList.value?.items) return 0
  return shoppingList.value.items.reduce(
    (total, item) => total + (item.quantity * item.product.basePrice),
    0
  )
}

function addAllToCart() {
  if (!shoppingList.value?.items || shoppingList.value.items.length === 0) {
    Notify.create({
      type: 'warning',
      message: 'This shopping list is empty',
      position: 'top'
    })
    return
  }

  let addedCount = 0
  for (const item of shoppingList.value.items) {
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

function editListDetails() {
  // Navigate back to shopping lists page, which will handle the edit
  router.push({ name: 'shopping-lists' })
}
</script>
