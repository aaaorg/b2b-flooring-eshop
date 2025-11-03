import api from './api'

export interface ShoppingListItem {
  id: number
  shoppingListId: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    sku: string
    basePrice: number
    unit: string
    stockQuantity: number
  }
  createdAt: string
  updatedAt: string
}

export interface ShoppingList {
  id: number
  name: string
  description: string | null
  userId: number
  items?: ShoppingListItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateShoppingListDto {
  name: string
  description?: string
}

export interface UpdateShoppingListDto {
  name?: string
  description?: string
}

export interface AddItemDto {
  productId: number
  quantity?: number
}

export interface UpdateItemDto {
  quantity: number
}

class ShoppingListsService {
  /**
   * Get all shopping lists for the authenticated user
   */
  async getShoppingLists(): Promise<ShoppingList[]> {
    const response = await api.get('/shopping-lists')
    return response.data.data
  }

  /**
   * Get a specific shopping list with items
   */
  async getShoppingList(id: number): Promise<ShoppingList> {
    const response = await api.get(`/shopping-lists/${id}`)
    return response.data.data
  }

  /**
   * Create a new shopping list
   */
  async createShoppingList(data: CreateShoppingListDto): Promise<{ message: string, data: ShoppingList }> {
    const response = await api.post('/shopping-lists', data)
    return response.data
  }

  /**
   * Update a shopping list
   */
  async updateShoppingList(id: number, data: UpdateShoppingListDto): Promise<{ message: string, data: ShoppingList }> {
    const response = await api.put(`/shopping-lists/${id}`, data)
    return response.data
  }

  /**
   * Delete a shopping list
   */
  async deleteShoppingList(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/shopping-lists/${id}`)
    return response.data
  }

  /**
   * Add an item to a shopping list
   */
  async addItem(listId: number, data: AddItemDto): Promise<{ message: string, data: ShoppingListItem }> {
    const response = await api.post(`/shopping-lists/${listId}/items`, data)
    return response.data
  }

  /**
   * Update item quantity in shopping list
   */
  async updateItem(listId: number, itemId: number, data: UpdateItemDto): Promise<{ message: string, data: ShoppingListItem }> {
    const response = await api.put(`/shopping-lists/${listId}/items/${itemId}`, data)
    return response.data
  }

  /**
   * Remove item from shopping list
   */
  async removeItem(listId: number, itemId: number): Promise<{ message: string }> {
    const response = await api.delete(`/shopping-lists/${listId}/items/${itemId}`)
    return response.data
  }
}

export const shoppingListsService = new ShoppingListsService()
