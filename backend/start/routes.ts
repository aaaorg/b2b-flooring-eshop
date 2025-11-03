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
const ShoppingListsController = () => import('#controllers/shopping_lists_controller')
const AdminUsersController = () => import('#controllers/admin/users_controller')
const AdminProductsController = () => import('#controllers/admin/products_controller')

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

    // Shopping Lists
    router.get('/shopping-lists', [ShoppingListsController, 'index'])
    router.post('/shopping-lists', [ShoppingListsController, 'store'])
    router.get('/shopping-lists/:id', [ShoppingListsController, 'show'])
    router.put('/shopping-lists/:id', [ShoppingListsController, 'update'])
    router.delete('/shopping-lists/:id', [ShoppingListsController, 'destroy'])
    router.post('/shopping-lists/:id/items', [ShoppingListsController, 'addItem'])
    router.put('/shopping-lists/:id/items/:itemId', [ShoppingListsController, 'updateItem'])
    router.delete('/shopping-lists/:id/items/:itemId', [ShoppingListsController, 'removeItem'])
  })
  .prefix('/api/v1')
  .use(middleware.auth())

// Admin routes (requires authentication + admin role)
router
  .group(() => {
    // User Management
    router.get('/users', [AdminUsersController, 'index'])
    router.post('/users/:id/approve', [AdminUsersController, 'approve'])
    router.post('/users/:id/reject', [AdminUsersController, 'reject'])
    router.put('/users/:id/role', [AdminUsersController, 'updateRole'])

    // Product Management
    router.post('/products', [AdminProductsController, 'store'])
    router.put('/products/:id', [AdminProductsController, 'update'])
    router.delete('/products/:id', [AdminProductsController, 'destroy'])
    router.put('/products/:id/stock', [AdminProductsController, 'updateStock'])
  })
  .prefix('/api/v1/admin')
  .use([middleware.auth(), middleware.admin()])
