import api from './api'

export interface Product {
  id: number
  categoryId: number
  name: string
  sku: string
  slug: string
  description: string | null
  basePrice: number
  stock: number
  unit: string
  isActive: boolean
  finish: string | null
  wearLayer: string | null
  thickness: string | null
  dimensions: string | null
  color: string | null
  material: string | null
  manufacturer: string | null
  category?: Category
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  isActive: boolean
  displayOrder: number
}

export interface ProductFilters {
  search?: string
  category_id?: number
  in_stock?: boolean
  material?: string
  finish?: string
  wear_layer?: string
  min_price?: number
  max_price?: number
  page?: number
  limit?: number
}

export interface FilterOptions {
  finishes: string[]
  wearLayers: string[]
  materials: string[]
}

export const productsService = {
  async getProducts(filters?: ProductFilters) {
    const response = await api.get('/products', { params: filters })
    return response.data
  },

  async getProduct(id: number) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async getFilterOptions(): Promise<FilterOptions> {
    const response = await api.get('/products/filter-options')
    return response.data
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories')
    return response.data
  },

  async getCategory(id: number) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  }
}
