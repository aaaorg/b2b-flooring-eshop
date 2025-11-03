import api from './api'

export interface User {
  id: number
  email: string
  fullName: string
  role: 'admin' | 'customer' | 'sales'
  isApproved: boolean
  companyId: number
  company: {
    id: number
    name: string
    erpCustomerId: string | null
  }
  createdAt: string
  updatedAt: string
}

class AdminService {
  /**
   * Get all users with optional filtering
   */
  async getUsers(params?: { is_approved?: boolean, role?: string }): Promise<User[]> {
    const response = await api.get('/admin/users', { params })
    return response.data.data
  }

  /**
   * Approve a user
   */
  async approveUser(userId: number): Promise<{ message: string, data: User }> {
    const response = await api.post(`/admin/users/${userId}/approve`)
    return response.data
  }

  /**
   * Reject/unapprove a user
   */
  async rejectUser(userId: number): Promise<{ message: string, data: User }> {
    const response = await api.post(`/admin/users/${userId}/reject`)
    return response.data
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: number, role: string): Promise<{ message: string, data: User }> {
    const response = await api.put(`/admin/users/${userId}/role`, { role })
    return response.data
  }

  /**
   * Create a product
   */
  async createProduct(data: any): Promise<{ message: string, data: any }> {
    const response = await api.post('/admin/products', data)
    return response.data
  }

  /**
   * Update a product
   */
  async updateProduct(productId: number, data: any): Promise<{ message: string, data: any }> {
    const response = await api.put(`/admin/products/${productId}`, data)
    return response.data
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: number): Promise<{ message: string }> {
    const response = await api.delete(`/admin/products/${productId}`)
    return response.data
  }

  /**
   * Update product stock
   */
  async updateProductStock(productId: number, stockQuantity: number): Promise<{ message: string, data: any }> {
    const response = await api.put(`/admin/products/${productId}/stock`, { stockQuantity })
    return response.data
  }
}

export const adminService = new AdminService()
