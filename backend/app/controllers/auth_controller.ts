import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Company from '#models/company'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password', 'phone', 'companyName'])

    // Create company first
    const company = await Company.create({
      name: data.companyName,
      isActive: true,
      country: 'Czech Republic',
    })

    // Create user
    const user = await User.create({
      companyId: company.id,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'customer',
      isActive: true,
      isApproved: false, // Requires admin approval
    })

    return response.created({
      message: 'Registration successful. Waiting for admin approval.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isApproved: user.isApproved,
      },
    })
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    if (!user.isApproved) {
      return response.forbidden({
        message: 'Your account is pending approval.',
      })
    }

    if (!user.isActive) {
      return response.forbidden({
        message: 'Your account is inactive.',
      })
    }

    // Actually log in the user and create session
    await auth.use('web').login(user)

    // Load company relationship
    await user.load('company')

    return response.ok({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      },
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('company')

    return response.ok({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isApproved: user.isApproved,
        company: {
          id: user.company.id,
          name: user.company.name,
        },
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out successfully' })
  }
}
