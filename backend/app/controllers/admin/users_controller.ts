import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Get all users with optional filtering
   */
  async index({ request, response }: HttpContext) {
    try {
      const { is_approved, role } = request.qs()

      const query = User.query().preload('company')

      if (is_approved !== undefined) {
        query.where('is_approved', is_approved === 'true' || is_approved === '1')
      }

      if (role) {
        query.where('role', role)
      }

      const users = await query.orderBy('created_at', 'desc')

      return response.ok({
        data: users
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to fetch users'
      })
    }
  }

  /**
   * Approve a user
   */
  async approve({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      user.isApproved = true
      await user.save()

      return response.ok({
        message: 'User approved successfully',
        data: user
      })
    } catch (error) {
      return response.notFound({
        message: 'User not found'
      })
    }
  }

  /**
   * Reject/unapprove a user
   */
  async reject({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)

      user.isApproved = false
      await user.save()

      return response.ok({
        message: 'User approval revoked',
        data: user
      })
    } catch (error) {
      return response.notFound({
        message: 'User not found'
      })
    }
  }

  /**
   * Update user role
   */
  async updateRole({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const { role } = request.only(['role'])

      if (!['admin', 'customer', 'sales'].includes(role)) {
        return response.badRequest({
          message: 'Invalid role'
        })
      }

      user.role = role
      await user.save()

      return response.ok({
        message: 'User role updated successfully',
        data: user
      })
    } catch (error) {
      return response.notFound({
        message: 'User not found'
      })
    }
  }
}