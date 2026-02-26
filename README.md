# TUTIMI ADMIN DASHBOARD

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3fcf8e?style=for-the-badge&logo=supabase)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=tanstackquery)
![Express.js](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?style=for-the-badge&logo=vitest)

The Tutimi Admin Dashboard is a robust, production-grade administrative interface specifically designed for coffee & tea e-commerce businesses. Leveraging the power of Next.js, Supabase, and TanStack Query, it delivers a comprehensive suite of tools for efficient store management. From real-time inventory operations with atomic RPCs, bulk IN/OUT functionalities, and integrated receipt printing, to an intelligent AI assistant for actionable insights, Tutimi is built to empower operators with a responsive, intuitive, and secure experience. It features drawer-first edit flows and strictly enforced admin/RLS rules, ensuring seamless and protected administrative control.

## Table of Contents
- [✨ Highlights](#-highlights)
- [📈 Features at a Glance](#-features-at-a-glance)
- [🧠 Architecture Overview](#-architecture-overview)
- [🧭 Feature Tour](#-feature-tour)
- [⚠️ Error Handling Strategy](#-error-handling-strategy)
- [🛡️ Security Considerations](#-security-considerations)
- [⚡ Performance & Scalability Notes](#-performance--scalability-notes)
- [Technical Decisions and Trade-offs](#technical-decisions-and-trade-offs)
- [🧪 Engineering Quality & Testing](#-engineering-quality--testing)
- [Business Impact (Product Perspective)](#business-impact-product-perspective)
- [🛠️ Tech Stack](#-tech-stack)
- [Data Model Expectations (Supabase)](#data-model-expectations-supabase)
- [Authentication and Authorization](#authentication-and-authorization)
- [🚀 Local Setup](#-local-setup)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [🧩 Folder Responsibilities](#-folder-responsibilities)
- [👨‍💻 Key Contributions](#-key-contributions)
- [🔮 Future Enhancements](#-future-enhancements)
- [📝 Notes for Reviewers](#-notes-for-reviewers)
- [Screenshots](#screenshots)

# [LINK DEMO🔗](https://tutimi-admin-dashboard.vercel.app/)

**Test Credentials:** `admin@gmail.com` / `Admin@123456`

## ✨ Highlights

- End-to-end admin workflows across dashboard, products, inventory, vouchers, news, themes, and users.
- Realtime sync strategy using Supabase channels + TanStack Query invalidation.
- Inventory operations optimized for throughput: bulk IN/OUT, unit conversion, receipt history, and A4 print flows.
- Responsive operational UX: desktop data tables, mobile cards, drawer-based edit actions.
- AI dashboard assistant with quick actions, context-aware responses, and product card rendering.
- Feature-first code organization with tested hooks/services/components for long-term maintainability.
- Express.js API service for backend orchestration and typed request/response contracts.

## 📈 Features at a Glance
- **Comprehensive Admin Workflows:** Manage products, inventory, vouchers, news, themes, and users end-to-end.
- **Real-time Data Sync:** Powered by Supabase channels and TanStack Query for always up-to-date information.
- **Advanced Inventory Management:** Bulk IN/OUT with unit conversion, detailed history, and A4 receipt printing.
- **AI-Powered Assistant:** Gain operational insights and perform quick actions with an intelligent dashboard AI.
- **Optimized User Experience:** Responsive design with intuitive drawer-based edit flows for desktop and mobile.
- **Robust Security:** Supabase Auth, Row Level Security (RLS), and admin role gating ensure data protection.
- **Scalable Architecture:** Designed with feature-first organization and performance considerations for long-term growth.

## 🧠 Architecture Overview

### High-level architecture

![High-level architecture](./public/screenshots/architecture.png)

### Layer responsibilities

- `app/(admin)/*`: route shells and page composition.
- `app/features/*`: domain logic (services, hooks, components, types).
- `app/components/*`: shared cross-feature UI elements (drawers, previews, layout).
- `app/lib/*`: infrastructure utilities (Supabase client, storage helpers, formatters).
- `app/api/dashboard-ai/*`: AI orchestration and prompt/context assembly.
- `server/src/*`: Express.js API server (routes, repositories, validation, types).

### Data flow: inventory bulk write path

```mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "actorBorder": "#1e88e5",
    "actorBkg": "#e3f2fd",
    "actorTextColor": "#000000",
    "signalColor": "#555"
  }
}}%%
sequenceDiagram
  participant UI as Bulk IN/OUT UI
  participant SB as Supabase JS
  participant RPC as create_inventory_in/out
  participant DB as products + inventory_transactions

  UI->>UI: convert input unit -> quantity
  UI->>SB: rpc(create_inventory_in/out)
  SB->>RPC: execute atomic mutation
  RPC->>DB: update stock + insert transaction
  DB-->>SB: success/fail
  SB-->>UI: per-item result
  UI->>UI: show receipt summary + print option
```

## 🧭 Feature Tour

### Dashboard and Analytics

- KPI cards for revenue, orders, and low-stock status.
- Revenue line chart by bucket (day, week, month, year).
- Orders status and inventory IN/OUT trend charts.
- Recent orders, top-selling products, and latest news preview.
- Flexible range filter with manual from/to override.

### Dashboard AI Assistant

- Floating button opens full chat drawer.
- Quick actions: overview, revenue summary, low-stock alerts, top products.
- API route: `app/api/dashboard-ai/route.ts`.
- Context builders: `buildProductsSectionForAI` + `buildInventorySectionForAI`.
- Structured response capability with product-card JSON block.

### Inventory Management

- Inventory list with category filter, search, sorting, and history drawer.
- Bulk IN/OUT with reason presets and custom reason.
- Validation guard for OUT operation (cannot exceed current stock).
- Receipt lifecycle: generate -> list history -> reprint -> print-ready A4 view.

Unit conversion rules in bulk flow:
- `500 ml -> 1`
- `1 L -> 2`
- `100 g -> 1`
- `1 kg -> 10`
- `1 item -> 1`
- `1 pack -> 6`

### Product Management

- Create, edit, delete products.
- Manage mode with bulk ON/OFF visibility updates.
- Image upload or image-link input.
- Live product preview matching client-facing style.

### News and Promotions

- CRUD for news entries with type, active status, and media input.
- Live preview aligned with client card layout.

### Vouchers

- CRUD with fixed/percent discount type.
- Validation fields: minimum order, max usage per user, new-user targeting.
- Live voucher preview.

### Themes and Branding

- Activate app themes and login branding.
- Banner switching by theme key.
- Dedicated create flow for new themes/assets.

### Users

- Admin user management from `profiles` (excluding admin accounts).
- Realtime refresh through Supabase subscription.

## ⚠️ Error Handling Strategy

- Explicit `loading/error` UI states + debounced search.
- Bulk inventory supports per-item failure visibility.
- Query/RPC errors surfaced with safe fallbacks.
- AI route wrapped in `try/catch` to prevent crash cascades.
- Destructive actions require confirmation.
- Planned: centralized error boundary + structured logging (e.g., Sentry).

## 🛡️ Security Considerations

- Supabase Auth + admin role gate.
- RLS enforced on business tables (DB-level protection)
- Inventory RPC restricted to admin policies.
- `GEMINI_API_KEY` stored server-side (API route only).
- Planned: rate limiting + audit logging for destructive actions.

## ⚡ Performance & Scalability Notes

- The dashboard leverages TanStack Query caching with targeted invalidation triggered by Supabase Realtime events.  
- Search inputs are debounced to reduce unnecessary refetches, and dashboard workloads use aggregated RPC endpoints with bounded reads (top N / recent N) for predictable performance.
- Currently, most admin lists use full-fetch for simplicity and small-to-medium datasets.  
- For larger datasets, the architecture can evolve toward server-side pagination, indexed filtering, and table virtualization where needed.

## Technical Decisions and Trade-offs

| Decision                                                         | Why                                                            | Trade-off                                                      |
| :--------------------------------------------------------------- | :------------------------------------------------------------- | :------------------------------------------------------------- |
| **Supabase as unified backend** (Auth + DB + Storage + Realtime + RPC) | Accelerate product delivery with fewer moving parts.           | Tighter coupling to Supabase APIs and schema evolution.        |
| **TanStack Query + event-driven invalidation**                   | Consistent server-state model with predictable cache behavior. | Small eventual-consistency window between event and refetch.   |
| **RPC functions for inventory write paths**                      | Atomic stock updates and clearer audit trail.                  | Additional backend SQL/RPC maintenance overhead.               |
| **Feature-first architecture** (`app/features/*`)                | Scalable ownership boundaries and easier onboarding.           | Deeper folder structure compared to flat page-based layout.    |
| **Drawer-based operational UI pattern**                          | Faster edit/delete flows on both desktop and tablet/mobile devices. | Increased local UI state complexity.                           |

## 🧪 Engineering Quality & Testing 

- **35 test files** in repository (Vitest + Testing Library).
- Coverage prorities búiness-critical paths:
  - Dashboard query/services and AI context builders
  - Inventory bulk logic and unit conversion rules
  - Print receipt flow and reusable formatting utils
  - Core drawer and confirmation patterns.
- Shared utilities (query keys, storage, formatters) tested independently.
- Clear separation between route shells, domain services, and UI components to enable isolated testing.

## Business Impact (Product Perspective)

- Reduced manual effort for stock operations via bulk workflows and receipt automation.
- Improved data reliability using RPC-based inventory mutations and realtime sync.
- Faster operational decision-making through consolidated dashboard analytics + AI assistant.

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Express.js
- Tailwind CSS 4
- TanStack Query 5
- Zustand
- Supabase (Auth, Database, Storage, Realtime, RPC)
- Recharts
- FontAwesome, Lucide
- Google Gemini (GenAI SDK)
- Vitest + Testing Library.

## Data Model Expectations (Supabase)

Tables:

- `profiles`
- `products`
- `categories`
- `orders`
- `order_items`
- `vouchers`
- `news`
- `app_themes`
- `app_brandings`
- `banners`
- `app_banner_settings`
- `inventory_transactions`

Views:

- `inventory_receipts`

RPC functions:

- `create_inventory_in`
- `create_inventory_out`
- `get_revenue_vn`
- `get_orders_count_vn`
- `get_inventory_in_out_vn`

Storage buckets used by app:

- `products` (product images, news images, themes, banners, branding assets)

## Authentication and Authorization

- Supabase email and password login.
- Admin gate enforced by `profiles.role === "admin"`.
- Non-admin users are redirected to login.

## 🚀 Local Setup

Prerequisites:
- Node.js 18+
- Supabase project
- Express.js runtime (Node server)

1. Install dependencies
   - npm install

2. Configure environment
   - Create `.env.local`
   - Add:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - GEMINI_API_KEY

3. Run the app
   - npm run dev
   - npm run server:dev

## Scripts

- `npm run dev` - Start development server
- `npm run server:dev` - Start Express API server (watch mode)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run server:start` - Start Express API server (production)
- `npm run lint` - Run ESLint
- `npm run test` - Run unit/component tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Open Vitest UI

## Project Structure

Note: backend service lives in `server/` (Express.js API).

```
app/
├── (admin)/                        # Admin routes
│   ├── dashboard/                  # Admin dashboard
│   ├── products/
│   │   └── create/                 # Product management
│   ├── inventory/                  # Inventory module
│   │   ├── bulk/[type]/            # Bulk import/export
│   │   ├── history/                # Inventory history
│   │   └── print/[receiptId]/      # Print receipt
│   ├── news/
│   │   └── create/
│   ├── vouchers/
│   │   └── create/
│   ├── themes/
│   │   └── create/
│   └── users/
│
├── (auth)/
│   └── login/              # Authentication
│
├── api/
│   └── dashboard-ai/       # AI dashboard endpoint
│
├── components/             # Shared layout components
├── features/               # Business logic by domain
│   ├── dashboard/
│   ├── inventory/
│   ├── products/
│   ├── news/
│   ├── vouchers/
│   ├── themes/
│   └── users/
│
├── hooks/                  # Custom React hooks
├── lib/                    # App-level utilities (Supabase, query keys, formatters)
├── store/                  # Global state management
│
components/
└── ui/                     # Reusable UI components (design system)
│
lib/                        # Shared root utilities
│
server/
└── src/                    # Express API (routes/controllers/services/repositories)
│
public/
├── images/
└── screenshots/
│
test/                       # Unit & integration tests
```

## 🧩 Folder Responsibilities

- `app/(admin)/`, `app/(auth)/`, `app/api/` → Route groups and API endpoints (App Router)
- `app/features/` → Domain modules (api/services/hooks/components/types)
- `app/components/` → Shared admin UI blocks (drawers, previews, layout pieces)
- `app/lib/` + `app/hooks/` + `app/store/` → Client infrastructure (helpers, custom hooks, global UI state)
- `components/ui/` + `lib/` → Reusable base UI primitives and root shared utilities
- `server/src/` → Express backend layers (routes, controllers, services, repositories, providers, middlewares)
- `test/` + `*.test.ts(x)` → Test setup and unit/component coverage

## Screenshots

### 🤖 Dashboard AI Assistant
![Dashboard AI Assistant](./public/screenshots/dashboard_ai.png)

### 🛒 Create Product
![Create Product](./public/screenshots/product.png)

### 🧾 Bulk Inventory Input (IN)
![Bulk Inventory Input/Ouput](./public/screenshots/inventory_type.png)

### 📦 Inventory Receipt (Print A4)
![Inventory Receipt](./public/screenshots/inventory_receipt.png)

### 🎟️ Voucher Management
![Voucher Management](./public/screenshots/voucher.png)

### 🎨 Theme Management
![Theme Management](./public/screenshots/theme.png)

## 👨‍💻 Key Contributions

- **End-to-End Product Development:** Architected and implemented the entire admin dashboard as a solo developer.
- **Core Inventory Workflows:** Developed robust inventory management, including bulk operations, unit conversion, and A4 receipt printing.
- **Responsive UI/UX Design:** Crafted an intuitive and responsive user experience with reusable drawer patterns and live previews for efficient workflows.
- **Full-stack Integration:** Seamlessly integrated Supabase services (Authentication, Realtime Database, RPC functions, Storage) across the application.
- **Maintainable Codebase:** Established a clear, feature-first codebase structure (`app/features/*`) promoting modularity, testability, and long-term maintainability.

## 🔮 Future Enhancements
- **Centralized Notification System:** Implement an in-app notification system for critical events (e.g., low stock alerts, new orders).
- **Advanced Analytics & Reporting:** Expand dashboard analytics with more granular reporting options and customizable dashboards.
- **Multi-language Support:** Add internationalization (i18n) to support multiple languages for a broader user base.
- **User Role Management:** Implement more granular user roles and permissions beyond basic admin/non-admin.
- **Third-Party Integrations:** Explore integrations with payment gateways, shipping providers, or other e-commerce tools.
- **Improved AI Assistant Capabilities:** Enhance the AI assistant with more proactive suggestions, predictive analytics, and conversational capabilities.

## 📝 Notes for Reviewers

- Primary UI content is Vietnamese because target operators are local admin users.
- Replace environment values to connect to your own Supabase project.
