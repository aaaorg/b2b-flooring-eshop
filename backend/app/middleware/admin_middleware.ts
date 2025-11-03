import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware to check if the authenticated user is an admin
 */
export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        message: 'Unauthorized access'
      })
    }

    if (user.role !== 'admin') {
      return response.forbidden({
        message: 'Admin access required'
      })
    }

    return next()
  }
}
