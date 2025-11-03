import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/services/products.service'
import { Notify } from 'quasar'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // Load cart from localStorage on init
  const storedCart = localStorage.getItem('karsis-cart')
  if (storedCart) {
    try {
      items.value = JSON.parse(storedCart)
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e)
    }
  }

  // Persist cart to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('karsis-cart', JSON.stringify(newItems))
  }, { deep: true })

  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => {
      const price = typeof item.product.basePrice === 'string'
        ? parseFloat(item.product.basePrice)
        : item.product.basePrice
      return total + (price * item.quantity)
    }, 0)
  })

  function addItem(product: Product, quantity: number = 1) {
    // Check stock
    if (product.stock < quantity) {
      Notify.create({
        type: 'negative',
        message: `Only ${product.stock} units available`,
        position: 'top'
      })
      return false
    }

    const existingItem = items.value.find(item => item.product.id === product.id)

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      if (product.stock < newQuantity) {
        Notify.create({
          type: 'negative',
          message: `Only ${product.stock} units available`,
          position: 'top'
        })
        return false
      }

      existingItem.quantity = newQuantity
    } else {
      items.value.push({ product, quantity })
    }

    Notify.create({
      type: 'positive',
      message: `${product.name} added to cart`,
      position: 'top'
    })

    return true
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.product.id === productId)

    if (!item) return

    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    if (item.product.stock < quantity) {
      Notify.create({
        type: 'negative',
        message: `Only ${item.product.stock} units available`,
        position: 'top'
      })
      return
    }

    item.quantity = quantity
  }

  function removeItem(productId: number) {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)

      Notify.create({
        type: 'info',
        message: 'Item removed from cart',
        position: 'top'
      })
    }
  }

  function clearCart() {
    items.value = []
    Notify.create({
      type: 'info',
      message: 'Cart cleared',
      position: 'top'
    })
  }

  return {
    items,
    itemCount,
    totalAmount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  }
})
