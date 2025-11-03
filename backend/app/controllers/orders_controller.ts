import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import Product from '#models/product'
import db from '@adonisjs/lucid/services/db'

export default class OrdersController {
  async index({ auth, request, response }: HttpContext) {
    try {
      console.log('[ORDERS] Starting index - Getting orders')
      const user = auth.user!
      console.log('[ORDERS] User ID:', user.id)

      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const orderType = request.input('order_type')
      console.log('[ORDERS] Query params - page:', page, 'limit:', limit, 'orderType:', orderType)

      console.log('[ORDERS] Building query')
      const query = Order.query()
        .where('user_id', user.id)
        .preload('items')
        .preload('company')

      if (orderType) {
        query.where('order_type', orderType)
      }

      console.log('[ORDERS] Executing query')
      const orders = await query.orderBy('created_at', 'desc').paginate(page, limit)
      console.log('[ORDERS] Query executed, found', orders.length, 'orders')

      console.log('[ORDERS] Serializing response')
      const serialized = orders.serialize()
      console.log('[ORDERS] Sending response')

      return response.ok(serialized)
    } catch (error) {
      console.error('[ORDERS] ERROR:', error)
      return response.internalServerError({
        message: 'Failed to fetch orders',
        error: error.message
      })
    }
  }

  async show({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      const order = await Order.query()
        .where('id', params.id)
        .where('user_id', user.id)
        .preload('items', (query) => {
          query.preload('product')
        })
        .preload('company')
        .firstOrFail()

      return response.ok(order.serialize())
    } catch (error) {
      console.error('Error fetching order:', error)
      return response.notFound({
        message: 'Order not found'
      })
    }
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    await user.load('company')

    const { orderType, items, shippingAddress, shippingCity, shippingPostalCode, notes } =
      request.only([
        'orderType',
        'items',
        'shippingAddress',
        'shippingCity',
        'shippingPostalCode',
        'notes',
      ])

    // Validate items
    if (!items || items.length === 0) {
      return response.badRequest({ message: 'Order must contain at least one item' })
    }

    // Use transaction
    const order = await db.transaction(async (trx) => {
      // Generate order number
      const orderCount = await Order.query({ client: trx }).count('* as total')
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(Number(orderCount[0].$extras.total) + 1).padStart(5, '0')}`

      // Calculate total
      let totalAmount = 0
      const orderItems = []

      for (const item of items) {
        const product = await Product.findOrFail(item.productId)

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`)
        }

        // Convert basePrice to number (PostgreSQL returns DECIMAL as string)
        const price = typeof product.basePrice === 'string' ? parseFloat(product.basePrice) : product.basePrice
        const subtotal = price * item.quantity
        totalAmount += subtotal

        orderItems.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: item.quantity,
          unitPrice: price,
          subtotal: subtotal,
          unit: product.unit,
          productAttributes: {
            finish: product.finish,
            wearLayer: product.wearLayer,
            material: product.material,
          },
        })
      }

      // Create order
      const newOrder = await Order.create(
        {
          userId: user.id,
          companyId: user.companyId,
          orderNumber: orderNumber,
          orderType: orderType,
          status: 'pending_sync',
          totalAmount: totalAmount,
          currency: 'CZK',
          paymentStatus: orderType === 'purchase' ? 'pending' : null,
          shippingAddress: shippingAddress,
          shippingCity: shippingCity,
          shippingPostalCode: shippingPostalCode,
          shippingCountry: 'Czech Republic',
          notes: notes,
          syncRetries: 0,
        },
        { client: trx }
      )

      // Create order items
      for (const itemData of orderItems) {
        await OrderItem.create(
          {
            orderId: newOrder.id,
            ...itemData,
          },
          { client: trx }
        )
      }

      return newOrder
    })

    // Load relationships
    await order.load('items')

    return response.created({
      message: `${orderType === 'purchase' ? 'Order' : 'Reservation'} created successfully`,
      order: order,
    })
  }
}
