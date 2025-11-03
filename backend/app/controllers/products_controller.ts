import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search', '')
    const categoryId = request.input('category_id')
    const inStock = request.input('in_stock')
    const finish = request.input('finish')
    const wearLayer = request.input('wear_layer')
    const material = request.input('material')
    const minPrice = request.input('min_price')
    const maxPrice = request.input('max_price')

    const query = Product.query().where('isActive', true).preload('category')

    // Full-text search for PostgreSQL
    if (search) {
      query.whereRaw(
        `to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', ?)`,
        [search]
      )
    }

    // Filters
    if (categoryId) {
      query.where('categoryId', categoryId)
    }

    if (inStock === 'true' || inStock === true) {
      query.where('stock', '>', 0)
    }

    if (finish) {
      query.where('finish', finish)
    }

    if (wearLayer) {
      query.where('wearLayer', wearLayer)
    }

    if (material) {
      query.where('material', material)
    }

    if (minPrice) {
      query.where('basePrice', '>=', minPrice)
    }

    if (maxPrice) {
      query.where('basePrice', '<=', maxPrice)
    }

    const products = await query.orderBy('name', 'asc').paginate(page, limit)

    return response.ok(products)
  }

  async show({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category')
      .firstOrFail()

    return response.ok(product)
  }

  async filterOptions({ response }: HttpContext) {
    // Get unique filter values for dropdowns
    const finishes = await db
      .from('products')
      .distinct('finish')
      .whereNotNull('finish')
      .orderBy('finish')

    const wearLayers = await db
      .from('products')
      .distinct('wear_layer')
      .whereNotNull('wear_layer')
      .orderBy('wear_layer')

    const materials = await db
      .from('products')
      .distinct('material')
      .whereNotNull('material')
      .orderBy('material')

    return response.ok({
      finishes: finishes.map((f) => f.finish),
      wearLayers: wearLayers.map((w) => w.wear_layer),
      materials: materials.map((m) => m.material),
    })
  }
}
