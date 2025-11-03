# Technical Design Document: Karsis B2B e-shop MVP

## Overview

This document explains how we'll build the Karsis B2B e-shop using an approach that balances rapid development with the power of modern frameworks, leveraging AI to handle most of the coding.

## Recommended Approach

### 🎯 Best Path for You: Low-Code with AI Assistance

Based on your skills, goals, and desire for rapid development where "AI does everything, I test," here's the optimal strategy:

**Primary Approach: Low-Code with AI Assistance (AdonisJS & Quasar.js)**
- **Why this works:** This approach leverages your existing familiarity with Quasar.js and your desire to learn AdonisJS. AI will act as your primary developer, generating code for both frontend and backend, allowing you to focus on testing and integration. This provides the speed of a "no-code" approach with the flexibility and power of custom code, which is essential for complex features like ERP integration and advanced filtering.
- **Time to MVP:** Given your aggressive timeline and AI assistance, aiming for 4-6 weeks for a robust MVP is realistic, with core features potentially much faster. The "launch in a day" ambition will be met by focusing on the absolute core features first, with AI generating the necessary boilerplate and logic.
- **Learning curve:** Moderate, as you'll be learning AdonisJS in depth, but AI will accelerate your understanding by providing explanations and code examples.
- **Cost:** ~$20-50/month for AI tools (like Cursor/Claude), plus your existing hosting/services.

### Tech Stack (Optimized for AI-Assisted Development)

#### Frontend
- **Framework:** **Quasar.js** (built on Vue 3)
  - *Why:* You're comfortable with Quasar.js, and it offers a massive, high-quality component library (`QTable` for B2B data display) that AI can easily leverage to generate UIs quickly. It supports responsive web apps, fitting your "web app" requirement.
  - *Learning time:* Minimal, as you're already familiar. AI will help with advanced patterns.
  
#### Backend  
- **Framework:** **AdonisJS v6** (built on Node.js)
  - *Why:* You want to learn AdonisJS, and it's a powerful, "batteries-included" framework (ORM, Auth, Queues) that AI can leverage for rapid, structured backend development. It's a natural and productive evolution from Express.js, which you know.
  - *Learning time:* AI will accelerate your learning significantly by generating code and explanations.

#### Database
- **Database:** **PostgreSQL**
  - *Why:* You're comfortable with PostgreSQL, and it's ideal for B2B e-commerce due to its data integrity, powerful filtering capabilities (full-text search, JSONB), and first-class support with AdonisJS's Lucid ORM.

#### Queuing & Caching
- **Queuing:** **BullMQ** (via AdonisJS's first-party integration)
  - *Why:* Essential for resilient ERP integration, as recommended in the research. AI can help configure and implement jobs.
- **Cache:** **Redis** (used by BullMQ and for app caching)
  - *Why:* A fast, in-memory data store that complements BullMQ and can be used for general application caching.

#### Deployment
- **Frontend Hosting:** **Vercel / Netlify**
  - *Why:* Offers seamless, one-click deployment for Quasar.js builds directly from Git, with generous free tiers.
- **Backend Hosting:** **Existing Hardware / Docker Compose**
  - *Why:* You have existing hardware, and Docker Compose provides a robust way to manage your AdonisJS app, PostgreSQL, and Redis on your server, as recommended in the research.

#### AI Assistance
- **Primary:** **Cursor.sh** (AI-native IDE)
  - *Why:* As an AI-native IDE (a fork of VS Code), Cursor is "project-aware" and excellent for generating, refactoring, and debugging code directly within the editor, aligning perfectly with "AI does everything, I test."
- **Secondary:** **Claude Sonnet 4.5 / Claude Code** (Web UI)
  - *Why:* Superior reasoning, large context window for architectural planning, complex logic generation, and in-depth debugging. It acts as your "senior architect" for complex tasks like ERP integration.

## Project Structure

```
[karsis-b2b-eshop]/
├── frontend/          # Quasar.js project
│   ├── src/
│   │   ├── components/     # Reusable UI pieces (e.g., QTable for products)
│   │   ├── pages/          # App screens/routes (e.g., Catalog, Cart, Account)
│   │   ├── layouts/        # Main app layout (QLayout)
│   │   ├── boot/           # Quasar boot files (e.g., Axios setup)
│   │   ├── stores/         # Pinia stores (e.g., for cart)
│   │   └── css/            # Global styles
│   ├── public/             # Static assets
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
├── backend/           # AdonisJS v6 project
│   ├── app/
│   │   ├── Controllers/    # API endpoints (e.g., OrdersController, ProductsController)
│   │   ├── Models/         # Lucid ORM models (e.g., User, Product, Order)
│   │   ├── Jobs/           # BullMQ jobs (e.g., SyncOrderToErp)
│   │   ├── Services/       # Business logic, ERP integration
│   │   └── Validators/     # Request validation
│   ├── config/             # AdonisJS configuration (e.g., database, queue)
│   ├── database/           # Migrations, seeders
│   ├── start/              # Application lifecycle hooks
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
├── docker-compose.yml # For local/server deployment
└── README.md          # Project instructions
```

**Why this structure:**
- Separates frontend and backend for clear concerns and independent deployment.
- Follows standard AdonisJS and Quasar.js conventions, making it easy for AI to understand and generate code.
- Facilitates Dockerization for consistent deployment across environments.

## Building Each Feature

Based on your PRD, here's the implementation plan, with AI doing the heavy lifting:

### Feature 1: B2B Account Management

**Complexity:** ⭐⭐☆☆☆ (Easy with AdonisJS Auth)

#### Implementation Steps (AI-Driven)

1.  **Setup AdonisJS Auth:**
    *   **AI Prompt (Cursor/Claude):** "Set up AdonisJS v6 authentication with email/password. Include user registration, login, and logout endpoints. Use Lucid ORM for user management and ensure secure password hashing. Also, create a `Company` model and associate users with companies, allowing for admin approval of new registrations."
    *   **AI Output:** AdonisJS controllers, models, migrations, and routes for authentication and company management.
2.  **Create Registration/Login Components (Quasar):**
    *   **AI Prompt (Cursor):** "Create responsive Quasar.js components for user registration and login. Integrate these with the AdonisJS authentication API. Include form validation, error handling, and a simple dashboard view for authenticated users. Ensure the registration form includes company name."
    *   **AI Output:** Quasar Vue components for forms and basic dashboard.
3.  **Test (You):** Test authentication endpoints. Register a new user, log in, verify token, check admin approval flow.

**Learning Points:** AdonisJS authentication flow, Quasar form handling, API integration, basic user roles.

### Feature 2: Product Catalog & Fast Filtering/Search

**Complexity:** ⭐⭐⭐☆☆ (Medium, due to advanced filtering)

#### Data Model (AdonisJS Lucid)
```typescript
// app/Models/Product.ts
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import Category from './Category'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare sku: string

  @column()
  declare description: string

  @column()
  declare basePrice: number

  @column()
  declare stock: number

  @column()
  declare finish: string | null

  @column()
  declare wearLayer: string | null

  @column()
  declare categoryId: string

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

#### Implementation Approach (AI-Driven)
1.  **AdonisJS Product API:**
    *   **AI Prompt (Claude Sonnet 4.5):** "Create an AdonisJS v6 API for products with CRUD operations. Implement advanced filtering by category, in-stock status, price range, and full-text search on `name` and `description` using PostgreSQL's `to_tsquery`. Ensure the API is performant and handles pagination. Provide the controller and any necessary service logic."
    *   **AI Output:** `ProductsController.ts` with dynamic query building, `Product` model, and migrations.
2.  **Quasar Catalog Page:**
    *   **AI Prompt (Cursor):** "Develop a responsive Quasar.js catalog page using `QTable` to display products. Include a sidebar with `QSelect` for category, `QRange` for price, and `QInput` for search. All filters should connect to the AdonisJS product API and update the `QTable` dynamically. Implement client-side debounce for search input."
    *   **AI Output:** Quasar Vue component for the catalog page, including filtering UI and API integration.
3.  **Test (You):** Test product display, search, and filtering. Verify search functionality, apply various filters, check pagination and responsiveness.

**Learning Points:** Advanced database querying with Lucid, dynamic UI updates, client-side performance optimization.

### Feature 3: Cart & Dual-Path Checkout

**Complexity:** ⭐⭐⭐☆☆ (Medium)

#### Data Model (Frontend Pinia Store & AdonisJS Lucid)
```javascript
// Frontend Pinia Store (example structure)
// stores/cart.ts
interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// AdonisJS Order Model (simplified)
// app/Models/Order.ts
import { BaseModel, column, hasMany, HasMany } from '@adonisjs/lucid/orm'
import OrderItem from './OrderItem'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare status: 'pending_sync' | 'synced' | 'reserved' | 'failed'

  @column()
  declare totalAmount: number

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
```

#### Implementation Approach (AI-Driven)
1.  **Quasar Cart (Pinia Store):**
    *   **AI Prompt (Cursor):** "Create a Pinia store in Quasar.js for managing the shopping cart. It should include actions to add, remove, and update item quantities, and getters to calculate the total amount and number of items. Ensure persistence across sessions (e.g., using local storage)."
    *   **AI Output:** Pinia store definition and basic usage examples.
2.  **AdonisJS Checkout API:**
    *   **AI Prompt (Claude Code):** "Develop an AdonisJS v6 API endpoint for checkout. This endpoint should receive cart items, create an `Order` in the database, and then handle two distinct paths:
        *   **'Purchase':** Integrate with a payment gateway (e.g., Stripe) to process payment.
        *   **'Reserve & Request Quote':** Create a reservation and dispatch an `SyncOrderToErp` job to provisionally reserve inventory.
        Ensure robust transaction management and error handling."
    *   **AI Output:** `CheckoutController.ts` with payment integration logic and job dispatch.
3.  **Quasar Checkout UI:**
    *   **AI Prompt (Cursor):** "Design a responsive Quasar.js shopping cart page with a clear display of items, quantities, and total. Include prominent 'Purchase Now' and 'Reserve & Request Quote' buttons. Implement the UI flow for both options, including a payment form for 'Purchase' and a confirmation screen for 'Reserve'."
    *   **AI Output:** Quasar Vue components for the cart and checkout flows.
4.  **Test (You):** Test cart functionality, both checkout paths, and verify order creation and status. Add items to cart, choose purchase (with test payment), choose reserve, verify order creation and status.

**Learning Points:** State management with Pinia, complex API design, payment gateway integration, asynchronous job dispatch.

### Feature 4: Customer Account Portal

**Complexity:** ⭐⭐☆☆☆ (Easy)

#### Implementation Approach (AI-Driven)
1.  **AdonisJS Order History API:**
    *   **AI Prompt (Cursor):** "Create an AdonisJS v6 API endpoint for authenticated users to view a paginated list of their past orders and reservations. The API should return relevant details for each, including status and items."
    *   **AI Output:** `AccountController.ts` with order/reservation retrieval logic.
2.  **Quasar Account Portal UI:**
    *   **AI Prompt (Cursor):** "Build a responsive Quasar.js customer account portal with tabs for 'Order History' and 'Reservation History'. Use `QTable` to display the data from the AdonisJS API. Include a 'Quick Re-order' button for past orders that adds all items from that order to the current cart."
    *   **AI Output:** Quasar Vue components for the account portal.
3.  **Test (You):** Test account portal features. Log in, navigate to the account portal, view past orders/reservations, test the re-order button.

**Learning Points:** User-specific data retrieval, UI navigation, re-using existing cart logic.

### Feature 5: ERP Integration Service (Asynchronous & Resilient)

**Complexity:** ⭐⭐⭐⭐☆ (Complex, but AI will handle the core implementation)

#### Implementation Approach (AI-Driven)
1.  **AdonisJS Queue Configuration (BullMQ):**
    *   **AI Prompt (Claude Sonnet 4.5):** "Configure AdonisJS v6 to use BullMQ for a resilient queue service. Set up a dedicated queue named `erp_jobs` with retries (5 attempts) and exponential backoff (starting at 10 seconds). Ensure failed jobs are not removed immediately and can be moved to a Dead Letter Queue (DLQ) for manual review. Provide the `config/queue.ts` content." (Referencing the research document's code example)
    *   **AI Output:** `config/queue.ts` file.
2.  **`SyncOrderToErp` Job:**
    *   **AI Prompt (Claude Code):** "Generate the `SyncOrderToErp` job in AdonisJS v6, as described in the research document. This job should receive `orderId` and `customerErpId` as payload. It must fetch the order details, call a custom `ErpService` to send the order to the legacy ERP, and update the order status upon success. Implement robust error handling, including distinguishing between transient and permanent errors, and moving permanent failures to a DLQ. Include the `failed` method for handling jobs after all retries." (Referencing the research document's code example)
    *   **AI Output:** `app/Jobs/SyncOrderToErp.ts` file.
3.  **`ErpService`:**
    *   **AI Prompt (Cursor):** "Create a placeholder `ErpService` in AdonisJS v6. This service should have a `sendOrder` method that simulates calling a REST API (e.g., using `axios` or AdonisJS's HTTP client) to the legacy ERP. Also, include an `isPermanentError` helper function to identify errors that should not be retried."
    *   **AI Output:** `app/Services/ErpService.ts` file.
4.  **Consumer Process (Instructions):**
    *   **AI Prompt (Cursor):** "Provide the exact shell command to run the AdonisJS queue consumer for the `erp_jobs` queue as a separate process."
    *   **AI Output:** `node ace queue:work erp_jobs`
5.  **Test (You):** Test retry and DLQ mechanisms. Place an order (or reservation), verify it's queued. Simulate ERP success/failure to test retry and DLQ mechanisms.

**Learning Points:** Asynchronous processing, message queues, fault tolerance, microservices patterns.

## Development Setup

### Required Tools

1.  **Code Editor: VS Code**
    *   Install from: code.visualstudio.com
    *   Essential extensions:
        *   Prettier (formatting)
        *   ESLint (error checking)
        *   Vue.js Extension Pack (for Quasar/Vue)
        *   AdonisJS Extension Pack
        *   Docker (for Docker Compose)
2.  **AI Assistant: Cursor.sh**
    *   Install from: cursor.sh
    *   Settings for optimal "AI does everything, I test" workflow:
        ```json
        {
          "ai.model": "claude-sonnet-4-5", // Or other preferred model
          "ai.autoComplete": true,
          "ai.explainCode": true,
          "ai.chat.contextScope": "project" // Important for full project awareness
        }
        ```
3.  **Version Control: Git**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
4.  **Node.js & npm/yarn:** Ensure you have a recent version installed.

### Environment Setup

```bash
# 1. Clone template (or create new projects)
# For frontend:
# yarn create quasar
# For backend:
# npm init adonis-ts-app@latest backend

# 2. Install dependencies in both frontend/ and backend/ directories
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit .env files with your database credentials, API keys, etc.

# 4. Run development servers
# In frontend/ directory:
# quasar dev
# In backend/ directory:
# node ace serve --watch
```

## AI Prompting Guide

### Effective Prompts for Your "AI Does Everything, I Test" Workflow

#### For New Features (High-Level Generation)
```
I need to add [feature name] to my Karsis B2B e-shop.
My tech stack is Quasar.js (Vue 3) for frontend and AdonisJS v6 (Node.js) for backend, with PostgreSQL.
The feature should:
- [Requirement 1 from PRD]
- [Requirement 2 from PRD]
- [Requirement 3 from PRD]
Please provide all necessary code for both frontend and backend, including models, migrations, controllers, services, routes, and Quasar components. Explain the overall structure and how to integrate it.
```

#### For Complex Logic (e.g., ERP Integration, Advanced Filtering)
```
I'm implementing the ERP integration service for my AdonisJS v6 backend.
I need a resilient queue using BullMQ to sync orders to a legacy ERP.
Refer to the research document provided earlier for the architecture and code examples.
Specifically, generate the `config/queue.ts` and `app/Jobs/SyncOrderToErp.ts` files, and a placeholder `app/Services/ErpService.ts`.
Ensure retries, exponential backoff, and Dead Letter Queue handling are correctly implemented.
```

#### For Debugging
```
I'm getting this error in my AdonisJS backend: [paste exact error message and stack trace]
Context: I was trying to [what you were doing, e.g., "process a checkout order"].
Relevant code: [paste relevant controller/service/job code]
My tech stack is AdonisJS v6, PostgreSQL, BullMQ.
Please explain what's wrong, provide the corrected code, and explain why the fix works.
```

#### For UI Components
```
I need a responsive Quasar.js component for a product detail page.
It should display product name, SKU, description, price, stock, and attributes (finish, wear layer).
Include an "Add to Cart" button that dispatches to my Pinia cart store.
The data will come from an from an AdonisJS API.
```

## Simplified Architecture

### How Your App Works (AI-Generated & Tested)

```mermaid
graph TD
    A[B2B Customer (Web App)] -->|1. Browses/Searches| B(Quasar.js Frontend)
    B -->|2. API Requests (Products, Auth)| C(AdonisJS Backend)
    C -->|3. Data Storage/Retrieval| D(PostgreSQL Database)
    C -->|4. Queues ERP Jobs| E(Redis / BullMQ)
    E -->|5. Processes Jobs Asynchronously| F(AdonisJS Queue Consumer)
    F -->|6. Communicates with| G[Legacy ERP System]
    G -->|7. Sends Stock/Price Updates| F
    C -->|8. Payment Processing| H[Payment Gateway (e.g., Stripe)]
    B -->|9. User Sees Updates| A
```

### Key Concepts to Understand (AI will explain as needed)

1.  **Components (Quasar):** Reusable UI building blocks.
2.  **State Management (Pinia):** How data changes and updates the UI.
3.  **API Endpoints (AdonisJS):** How frontend and backend communicate.
4.  **ORM (Lucid):** How AdonisJS interacts with PostgreSQL.
5.  **Queues (BullMQ):** For background tasks and resilient ERP integration.
6.  **Environment Variables:** Managing secrets and configurations.

## Step-by-Step Implementation (AI-Driven, You Test)

### Week 1: Foundation & Core Backend
- [ ] **AI:** Set up AdonisJS v6 project with PostgreSQL.
- [ ] **AI:** Define core models (`User`, `Company`, `Product`, `Category`, `Order`, `OrderItem`).
- [ ] **AI:** Generate database migrations for all models.
- [ ] **AI:** Implement AdonisJS authentication (registration, login).
- [ ] **You:** Test authentication endpoints.
- [ ] **AI:** Configure BullMQ for ERP integration.
- [ ] **You:** Verify queue setup.

### Week 2-3: Frontend Shell & Product Catalog
- [ ] **AI:** Set up Quasar.js project.
- [ ] **AI:** Build the main app layout (`QLayout`) and navigation.
- [ ] **AI:** Create Quasar login/registration components, integrating with AdonisJS.
- [ ] **You:** Test frontend authentication flow.
- [ ] **AI:** Build AdonisJS API for products with advanced filtering/search.
- [ ] **AI:** Develop Quasar catalog page with `QTable` and filtering sidebar.
- [ ] **You:** Test product display, search, and filtering.

### Week 4-5: Cart, Checkout & ERP Integration
- [ ] **AI:** Implement Pinia store for shopping cart.
- [ ] **AI:** Build Quasar cart page and dual-path checkout UI.
- [ ] **AI:** Develop AdonisJS checkout API (Purchase with payment, Reserve with ERP job).
- [ ] **AI:** Generate `SyncOrderToErp` job and `ErpService`.
- [ ] **You:** Test cart functionality, both checkout paths, and monitor ERP queue.

### Week 6: Account Portal, Polish & Launch
- [ ] **AI:** Build AdonisJS API for order/reservation history.
- [ ] **AI:** Develop Quasar customer account portal with history and re-order.
- [ ] **You:** Test account portal features.
- [ ] **AI:** Generate Docker Compose files for deployment.
- [ ] **You:** Deploy to existing hardware and Vercel (frontend).
- [ ] **You:** Perform final end-to-end testing.

## Common Challenges & Solutions (AI-Assisted)

### "I don't understand this error"
**Solution:**
1.  Copy the exact error message and stack trace.
2.  **AI Prompt (Cursor/Claude):** "Explain this error in simple terms: \[error message]. My tech stack is \[AdonisJS/Quasar/PostgreSQL]. Provide the corrected code and explain why the fix works."

### "Feature seems too complex"
**Solution:**
1.  Break the feature into smaller, manageable sub-tasks.
2.  **AI Prompt (Claude Sonnet 4.5):** "I need to implement [complex feature]. My tech stack is [stack]. How can I break this down into simpler, AI-generatable steps? Provide a step-by-step plan."

### "Code works but I don't understand it"
**Solution:**
1.  **AI Prompt (Cursor/Claude):** "Explain this code line by line for a beginner. [paste code]. What are the key concepts being used here?"
2.  **AI Prompt (Cursor/Claude):** "Can you add detailed comments to this code explaining its functionality and purpose?"

## Deployment Guide

### Frontend Deployment (Vercel / Netlify)

1.  **Push to GitHub:** Ensure your `frontend/` directory is a separate Git repository or a sub-directory in your main repo.
2.  **Connect to Vercel/Netlify:** Go to vercel.com or netlify.com, import your repository, and select the `frontend/` directory as the project root.
3.  **Configure Environment:** Add necessary environment variables (e.g., `VITE_API_URL` pointing to your AdonisJS backend).
4.  **Deploy:** Vercel/Netlify will automatically build and deploy your Quasar.js app.

### Backend Deployment (Existing Hardware with Docker Compose)

1.  **Generate Dockerfile:**
    *   **AI Prompt (Cursor):** "Generate a `Dockerfile` for my AdonisJS v6 application, optimized for production. It should include installing dependencies, building the application, and running the queue consumer as a separate process."
2.  **Generate Docker Compose:**
    *   **AI Prompt (Claude Sonnet 4.5):** "Generate a `docker-compose.yml` file for my AdonisJS v6 backend. It should include services for:
        *   The AdonisJS web application (using the Dockerfile from above).
        *   A PostgreSQL database (`postgres:16`).
        *   A Redis instance (`redis:7`).
        *   A separate AdonisJS queue consumer service (using the same app image but with `node ace queue:work erp_jobs` command).
        *   Ensure proper networking and volume mounts for data persistence."
3.  **Nginx Reverse Proxy:**
    *   **AI Prompt (Claude Sonnet 4.5):** "Generate an `nginx.conf` configuration for a reverse proxy on my server. It should:
        *   Proxy requests to my AdonisJS backend (running in Docker).
        *   Handle SSL termination using Let's Encrypt (Certbot).
        *   Serve static Quasar.js build files (if deployed on the same server).
        *   Include security headers and rate limiting."
4.  **Deploy (You):**
    *   Install Docker and Docker Compose on your server.
    *   Copy `docker-compose.yml` and `nginx.conf` to your server.
    *   Run `docker-compose up -d`.
    *   Configure Certbot for SSL.
    *   Set up Cloudflare as your front door for DNS, SSL (Full Strict), and WAF.

## Cost Breakdown

### Development Phase (Building)
| Service | Free Tier | Paid Tier | You Need |
|---------|-----------|-----------|----------|
| Cursor.sh | Trial | $20/mo | Paid (highly recommended for "AI does everything") |
| Claude API | Limited | $20-50/mo | Paid (for complex reasoning) |
| AdonisJS/Quasar | Yes | Free | Free |
| PostgreSQL | Yes | Free | Free |
| Redis | Yes | Free | Free |
| **Total** | **$0** | **$40-70/mo** | **$40-70/mo** |

### Production Phase (After Launch)
| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Hosting (Existing Hardware) | ~€0 | Your existing setup |
| Vercel/Netlify (Frontend) | €0-20 | Free tier likely sufficient for MVP |
| Azure S3 / Local S3 | ~€0 | Existing services, minimal impact |
| Exchange 365 | ~€0 | Existing service, minimal impact |
| **Total** | **€0-20** | **Well within your €1500/month budget** |

## Learning Resources

### Your Learning Path (AI-Assisted)

#### This Week: AdonisJS Fundamentals
- **AI Prompt (Cursor/Claude):** "Explain the core concepts of AdonisJS v6 (MVC, Lucid ORM, Middleware, Providers) for someone familiar with Express.js. Provide simple code examples."
- **Official Docs:** adonisjs.com/docs
- **Practice:** Have AI generate simple CRUD APIs and test them.

#### Next Week: Advanced Quasar & Pinia
- **AI Prompt (Cursor/Claude):** "Explain how to use `QTable` for displaying data with pagination and filtering in Quasar.js. Also, explain Pinia for state management and how to integrate it with a Quasar app."
- **Official Docs:** quasar.dev, pinia.vuejs.org
- **Practice:** Have AI generate complex Quasar components and Pinia stores.

#### Ongoing: BullMQ & Resilient Systems
- **AI Prompt (Claude Sonnet 4.5):** "Explain the principles of message queues, retries, and Dead Letter Queues using BullMQ. How does this improve system resilience?"
- **Official Docs:** docs.bullmq.io
- **Practice:** Have AI generate different types of jobs and test their resilience.

### When Stuck (Leverage AI)
1.  **Cursor Chat:** Use the built-in chat in Cursor for context-aware help, code generation, and debugging.
2.  **Claude Sonnet 4.5:** For architectural questions, complex problem-solving, and reviewing larger code blocks.
3.  **Official Documentation:** AdonisJS, Quasar, BullMQ docs are comprehensive.

## Success Metrics

Your technical implementation is successful when:
- [ ] The web app runs without crashing.
- [ ] All P0 features from the PRD (B2B Account, Product Catalog, Filtering, Cart, Dual Checkout, Customer Portal, ERP Integration) are implemented and working.
- [ ] You can deploy updates quickly and reliably.
- [ ] You understand the core architecture and can test the AI-generated code effectively.
- [ ] Monthly costs are under budget.
- [ ] The app is accessible and functional for B2B customers.

---
*Created for: Karsis B2B e-shop*  
*Your Path: Low-Code with AI Assistance*  
*Estimated Time: 4-6 weeks for robust MVP*  
*Support: AI-driven development + official documentation*
