import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productsService, type Product, type Category, type ProductFilters, type FilterOptions } from '@/services/products.service'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const filterOptions = ref<FilterOptions>({ finishes: [], wearLayers: [], materials: [] })
  const loading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const limit = ref(20)

  async function fetchProducts(filters?: ProductFilters) {
    loading.value = true
    try {
      const response = await productsService.getProducts(filters)
      products.value = response.data
      currentPage.value = response.meta?.current_page || 1
      totalPages.value = response.meta?.last_page || 1
      return true
    } catch (error) {
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await productsService.getCategories()
      return true
    } catch (error) {
      return false
    }
  }

  async function fetchFilterOptions() {
    try {
      filterOptions.value = await productsService.getFilterOptions()
      return true
    } catch (error) {
      return false
    }
  }

  async function fetchProduct(id: number): Promise<Product | null> {
    loading.value = true
    try {
      const product = await productsService.getProduct(id)
      return product
    } catch (error) {
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    categories,
    filterOptions,
    loading,
    currentPage,
    totalPages,
    limit,
    fetchProducts,
    fetchCategories,
    fetchFilterOptions,
    fetchProduct
  }
})
