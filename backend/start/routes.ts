/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const ProductsController = () => import('#controllers/products_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const OrdersController = () => import('#controllers/orders_controller')

// Health check
router.get('/', async () => {
  return {
    app: 'Karsis B2B e-shop API',
    version: '1.0.0',
    status: 'running',
  }
})

// Public routes
router.group(() => {
  // Auth
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])

  // Public product browsing
  router.get('/products', [ProductsController, 'index'])
  router.get('/products/filter-options', [ProductsController, 'filterOptions'])
  router.get('/products/:id', [ProductsController, 'show'])

  // Categories
  router.get('/categories', [CategoriesController, 'index'])
  router.get('/categories/:id', [CategoriesController, 'show'])
}).prefix('/api/v1')

// Protected routes (requires authentication)
router
  .group(() => {
    // Auth
    router.get('/me', [AuthController, 'me'])
    router.post('/logout', [AuthController, 'logout'])

    // Orders
    router.get('/orders', [OrdersController, 'index'])
    router.get('/orders/:id', [OrdersController, 'show'])
    router.post('/orders', [OrdersController, 'store'])
  })
  .prefix('/api/v1')
  .use(middleware.auth())
