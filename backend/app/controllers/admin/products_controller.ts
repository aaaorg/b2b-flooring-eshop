import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  /**
   * Create a new product
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'name',
        'sku',
        'description',
        'basePrice',
        'unit',
        'stockQuantity',
        'categoryId',
        'erpProductCode',
        'material',
        'finish',
        'wearLayer',
        'thickness',
        'dimensions'
      ])

      if (!data.name || !data.sku || !data.basePrice) {
        return response.badRequest({
          message: 'Name, SKU, and base price are required'
        })
      }

      const product = await Product.create(data)

      return response.created({
        message: 'Product created successfully',
        data: product
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to create product'
      })
    }
  }

  /**
   * Update a product
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)

      const data = request.only([
        'name',
        'sku',
        'description',
        'basePrice',
        'unit',
        'stockQuantity',
        'categoryId',
        'erpProductCode',
        'material',
        'finish',
        'wearLayer',
        'thickness',
        'dimensions'
      ])

      product.merge(data)
      await product.save()

      return response.ok({
        message: 'Product updated successfully',
        data: product
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found'
      })
    }
  }

  /**
   * Delete a product
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.delete()

      return response.ok({
        message: 'Product deleted successfully'
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found'
      })
    }
  }

  /**
   * Update product stock
   */
  async updateStock({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const { stockQuantity } = request.only(['stockQuantity'])

      if (stockQuantity === undefined || stockQuantity < 0) {
        return response.badRequest({
          message: 'Valid stock quantity is required'
        })
      }

      product.stockQuantity = stockQuantity
      await product.save()

      return response.ok({
        message: 'Stock updated successfully',
        data: product
      })
    } catch (error) {
      return response.notFound({
        message: 'Product not found'
      })
    }
  }
}