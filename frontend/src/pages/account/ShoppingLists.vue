<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h6">Shopping Lists</div>
        <q-btn
          label="Create New List"
          icon="add"
          color="primary"
          @click="showCreateDialog = true"
        />
      </div>

      <q-spinner v-if="loading" size="50px" color="primary" class="q-mt-md" />

      <div v-else-if="shoppingLists.length === 0" class="text-center q-pa-lg">
        <q-icon name="shopping_basket" size="64px" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">No shopping lists yet</div>
        <p class="text-grey-6">Create your first shopping list to save products for recurring orders</p>
      </div>

      <q-list v-else separator>
        <q-item
          v-for="list in shoppingLists"
          :key="list.id"
          clickable
          :to="{ name: 'shopping-list-detail', params: { id: list.id } }"
        >
          <q-item-section>
            <q-item-label class="text-h6">{{ list.name }}</q-item-label>
            <q-item-label caption v-if="list.description">{{ list.description }}</q-item-label>
            <q-item-label caption class="q-mt-xs">
              {{ list.items?.length || 0 }} item(s) • Updated {{ formatDate(list.updatedAt || list.updated_at) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-sm">
              <q-btn
                flat
                dense
                icon="shopping_cart"
                color="primary"
                @click.stop="addListToCart(list)"
              >
                <q-tooltip>Add all to cart</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                icon="edit"
                color="secondary"
                @click.stop="editList(list)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                @click.stop="confirmDelete(list)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editingList ? 'Edit' : 'Create' }} Shopping List</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="formData.name"
            label="List Name *"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
            class="q-mb-md"
          />

          <q-input
            v-model="formData.description"
            label="Description (optional)"
            type="textarea"
            outlined
            rows="3"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            label="Save"
            color="primary"
            :loading="saving"
            @click="saveList"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Delete Shopping List</div>
        </q-card-section>

        <q-card-section>
          Are you sure you want to delete "{{ listToDelete?.name }}"? This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            label="Delete"
            color="negative"
            :loading="deleting"
            @click="deleteList"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { shoppingListsService, type ShoppingList } from '@/services/shopping-lists.service'
import { useCartStore } from '@/stores/cart'
import { Notify } from 'quasar'
import { date } from 'quasar'

const router = useRouter()
const cartStore = useCartStore()

const shoppingLists = ref<ShoppingList[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const editingList = ref<ShoppingList | null>(null)
const listToDelete = ref<ShoppingList | null>(null)

const formData = reactive({
  name: '',
  description: ''
})

onMounted(() => {
  loadShoppingLists()
})

async function loadShoppingLists() {
  console.log('[ShoppingLists] Starting loadShoppingLists')
  loading.value = true
  try {
    const response = await shoppingListsService.getShoppingLists()
    console.log('[ShoppingLists] Got response:', response)

    // Simple assignment
    shoppingLists.value = response || []
    console.log('[ShoppingLists] Shopping lists loaded, count:', shoppingLists.value.length)
  } catch (error) {
    console.error('[ShoppingLists] Error loading shopping lists:', error)
    Notify.create({
      type: 'negative',
      message: 'Failed to load shopping lists',
      position: 'top'
    })
  } finally {
    loading.value = false
    console.log('[ShoppingLists] loadShoppingLists finished')
  }
}

function editList(list: ShoppingList) {
  editingList.value = list
  formData.name = list.name
  formData.description = list.description || ''
  showCreateDialog.value = true
}

function confirmDelete(list: ShoppingList) {
  listToDelete.value = list
  showDeleteDialog.value = true
}

async function saveList() {
  if (!formData.name) {
    Notify.create({
      type: 'warning',
      message: 'Please enter a list name',
      position: 'top'
    })
    return
  }

  saving.value = true
  try {
    if (editingList.value) {
      await shoppingListsService.updateShoppingList(editingList.value.id, {
        name: formData.name,
        description: formData.description
      })
      Notify.create({
        type: 'positive',
        message: 'Shopping list updated successfully',
        position: 'top'
      })
    } else {
      await shoppingListsService.createShoppingList({
        name: formData.name,
        description: formData.description
      })
      Notify.create({
        type: 'positive',
        message: 'Shopping list created successfully',
        position: 'top'
      })
    }

    showCreateDialog.value = false
    editingList.value = null
    formData.name = ''
    formData.description = ''
    loadShoppingLists()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to save shopping list',
      position: 'top'
    })
  } finally {
    saving.value = false
  }
}

async function deleteList() {
  if (!listToDelete.value) return

  deleting.value = true
  try {
    await shoppingListsService.deleteShoppingList(listToDelete.value.id)
    Notify.create({
      type: 'positive',
      message: 'Shopping list deleted successfully',
      position: 'top'
    })
    showDeleteDialog.value = false
    listToDelete.value = null
    loadShoppingLists()
  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to delete shopping list',
      position: 'top'
    })
  } finally {
    deleting.value = false
  }
}

async function addListToCart(list: ShoppingList) {
  if (!list.items || list.items.length === 0) {
    Notify.create({
      type: 'warning',
      message: 'This shopping list is empty',
      position: 'top'
    })
    return
  }

  let addedCount = 0
  for (const item of list.items) {
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

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  try {
    return date.formatDate(new Date(dateString), 'DD.MM.YYYY')
  } catch (e) {
    return 'Invalid Date'
  }
}
</script>
