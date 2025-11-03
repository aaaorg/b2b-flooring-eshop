import api from './api'

export interface OrderItem {
  productId: number
  quantity: number
}

export interface CreateOrderData {
  orderType: 'purchase' | 'reservation'
  items: OrderItem[]
  shippingAddress?: string
  shippingCity?: string
  shippingPostalCode?: string
  notes?: string
}

export interface Order {
  id: number
  userId: number
  companyId: number
  orderNumber: string
  orderType: 'purchase' | 'reservation'
  status: string
  totalAmount: number
  currency: string
  paymentStatus: string | null
  createdAt: string
  items?: any[]
  company?: any
}

export const ordersService = {
  async getOrders(params?: { page?: number; limit?: number; order_type?: string }) {
    console.log('[ordersService] getOrders called with params:', params)
    const response = await api.get('/orders', { params })
    console.log('[ordersService] getOrders response:', response)
    return response.data
  },

  async getOrder(id: number) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async createOrder(data: CreateOrderData) {
    const response = await api.post('/orders', data)
    return response.data
  }
}
