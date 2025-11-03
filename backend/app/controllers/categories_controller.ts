import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    const categories = await Category.query()
      .where('isActive', true)
      .orderBy('displayOrder', 'asc')
      .orderBy('name', 'asc')

    return response.ok(categories)
  }

  async show({ params, response }: HttpContext) {
    const category = await Category.query()
      .where('id', params.id)
      .preload('products', (query) => {
        query.where('isActive', true)
      })
      .firstOrFail()

    return response.ok(category)
  }
}
