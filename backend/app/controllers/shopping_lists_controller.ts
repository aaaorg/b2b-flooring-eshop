import type { HttpContext } from '@adonisjs/core/http'
import ShoppingList from '#models/shopping_list'
import ShoppingListItem from '#models/shopping_list_item'
import Product from '#models/product'

export default class ShoppingListsController {
  /**
   * Get all shopping lists for the authenticated user
   */
  async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingLists = await ShoppingList.query()
        .where('user_id', user.id)
        .preload('items', (itemsQuery) => {
          itemsQuery.preload('product')
        })
        .orderBy('updated_at', 'desc')

      return response.ok({
        data: shoppingLists
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch shopping lists'
      })
    }
  }

  /**
   * Create a new shopping list
   */
  async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { name, description } = request.only(['name', 'description'])

      if (!name) {
        return response.badRequest({
          message: 'Name is required'
        })
      }

      const shoppingList = await ShoppingList.create({
        name,
        description,
        userId: user.id
      })

      return response.created({
        message: 'Shopping list created successfully',
        data: shoppingList
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to create shopping list'
      })
    }
  }

  /**
   * Get a specific shopping list with items
   */
  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingList = await ShoppingList.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .preload('items', (itemsQuery) => {
          itemsQuery.preload('product')
        })
        .firstOrFail()

      return response.ok({
        data: shoppingList
      })
    } catch (error) {
      return response.notFound({
        message: 'Shopping list not found'
      })
    }
  }

  /**
   * Update a shopping list
   */
  async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingList = await ShoppingList.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const { name, description } = request.only(['name', 'description'])

      if (name) shoppingList.name = name
      if (description !== undefined) shoppingList.description = description

      await shoppingList.save()

      return response.ok({
        message: 'Shopping list updated successfully',
        data: shoppingList
      })
    } catch (error) {
      return response.notFound({
        message: 'Shopping list not found'
      })
    }
  }

  /**
   * Delete a shopping list
   */
  async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingList = await ShoppingList.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      await shoppingList.delete()

      return response.ok({
        message: 'Shopping list deleted successfully'
      })
    } catch (error) {
      return response.notFound({
        message: 'Shopping list not found'
      })
    }
  }

  /**
   * Add an item to a shopping list
   */
  async addItem({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingList = await ShoppingList.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const { productId, quantity } = request.only(['productId', 'quantity'])

      if (!productId) {
        return response.badRequest({
          message: 'Product ID is required'
        })
      }

      // Verify product exists
      await Product.findOrFail(productId)

      // Check if item already exists
      const existingItem = await ShoppingListItem.query()
        .where('shopping_list_id', shoppingList.id)
        .where('product_id', productId)
        .first()

      if (existingItem) {
        existingItem.quantity = quantity || existingItem.quantity + 1
        await existingItem.save()
        await existingItem.load('product')

        return response.ok({
          message: 'Item quantity updated',
          data: existingItem
        })
      }

      // Create new item
      const item = await ShoppingListItem.create({
        shoppingListId: shoppingList.id,
        productId,
        quantity: quantity || 1
      })

      await item.load('product')

      return response.created({
        message: 'Item added to shopping list',
        data: item
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to add item to shopping list'
      })
    }
  }

  /**
   * Update item quantity in shopping list
   */
  async updateItem({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingList = await ShoppingList.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const item = await ShoppingListItem.query()
        .where('id', params.itemId)
        .where('shopping_list_id', shoppingList.id)
        .firstOrFail()

      const { quantity } = request.only(['quantity'])

      if (!quantity || quantity < 1) {
        return response.badRequest({
          message: 'Valid quantity is required'
        })
      }

      item.quantity = quantity
      await item.save()
      await item.load('product')

      return response.ok({
        message: 'Item quantity updated',
        data: item
      })
    } catch (error) {
      return response.notFound({
        message: 'Item not found'
      })
    }
  }

  /**
   * Remove item from shopping list
   */
  async removeItem({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const shoppingList = await ShoppingList.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .firstOrFail()

      const item = await ShoppingListItem.query()
        .where('id', params.itemId)
        .where('shopping_list_id', shoppingList.id)
        .firstOrFail()

      await item.delete()

      return response.ok({
        message: 'Item removed from shopping list'
      })
    } catch (error) {
      return response.notFound({
        message: 'Item not found'
      })
    }
  }
}