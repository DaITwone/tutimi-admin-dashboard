   
# TUTIMI ADMIN DASHBOARD

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06b6d4?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3fcf8e?style=for-the-badge&logo=supabase)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=tanstackquery)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand)

A modern admin dashboard for managing the Tutimi Coffee & Tea e-commerce platform. Built with Next.js and Supabase, this project demonstrates full-stack development skills including authentication, data management, and responsive UI design.

--- 

# [LINK DEMO🔗](https://tutimi-admin-dashboard.vercel.app/)

**Test Credentials:** `admin@gmail.com` / `Admin@123456`


## Project Overview

A comprehensive full-stack admin dashboard designed to streamline operations for Tutimi Coffee & Tea e-commerce platform. This project demonstrates **production-ready skills** in modern web development, from authentication to real-time analytics.

> **💡 Problem Solved:** Provides administrators with a centralized platform to monitor sales, manage inventory, handle customer data, and customize the storefront - reduces manual operations and improves inventory tracking efficiency.


## Key Features

<table>
<tr>
<td width="50%">

### 📊 **Analytics & Insights**
- Real-time revenue tracking
- Order statistics with time filters
- Cancellation rate monitoring
- Visual data representation

</td>
<td width="50%">

### 🛍️ **Product Management**
- Full CRUD operations
- Image upload & storage
- Category-based filtering
- Smart search functionality

</td>
</tr>

<tr>
<td width="50%">

### 👱 **User Administration**
- Profile management
- Role-based access control
- Email communication system
- Activity monitoring

</td>
<td width="50%">

### 🎟️ **Promotion Engine**
- Dynamic voucher creation
- Flexible discount rules
- Usage limit controls
- News & updates management

</td>
</tr>

<tr>
<td width="50%">

### 📦 **Inventory Management**
- Stock overview for products
- Bulk inventory IN/OUT workflows
- Inventory history per product
- Receipt history tracking (inventory receipts)
- Print receipts (A4 layout)

</td>
<td width="50%">

### ⚡ **Performance & Data Consistency**
- Client-side caching & background refetching (TanStack Query)
- Optimistic UI patterns for smoother UX
- Lightweight global UI state management (Zustand)
- Realtime sync with Supabase for inventory updates

</td>
</tr>

</table>

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Server-state caching, refetching, invalidation strategy
- **Zustand** - Global UI state
- **FontAwesome & Lucide React** - Icon libraries

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, file storage, and Row Level Security (RLS) policies
- **Supabase RPC (PostgreSQL Functions)** - Inventory stock updates with transaction recording
- **Supabase Realtime** - Sync UI after inventory/product changes
- **Next.js API Routes** - Serverless functions for admin tasks

### Development Tools
- **ESLint** - Code linting
- **Vercel** - Deployment platform

## Architecture Highlights

- **State Management**: TanStack Query handles server state with caching, background refetching, and optimistic UI patterns for seamless inventory updates; Zustand manages lightweight global UI state.
- **Inventory Transactions**: Supabase RPC functions (`create_inventory_in`, `create_inventory_out`, `apply_stock_delta`) ensure atomic stock changes, leveraging PostgreSQL transactions for data integrity.
- **Data Consistency**: `inventory_transactions` table serves as the single source of truth; atomic updates prevent race conditions and maintain accurate stock levels.
- **Receipts View**: `inventory_receipts` (database view) aggregates transaction data for efficient receipt generation and printing without redundant queries.
- **Realtime Integration**: Supabase realtime triggers query invalidation on inventory changes, enabling live UI sync across clients.

**Inventory Transaction Flow (ASCII Diagram):**
```
User Action (IN/OUT) → RPC (transaction) → insert inventory_transactions → Update products.stock → Realtime Event → Invalidate Queries → UI Refetch
```

## My Contribution

- **Designed and implemented** the admin dashboard as a solo developer, focusing on clean architecture and real-world admin workflows.
- **Built the inventory management module** end-to-end: bulk IN/OUT actions, transaction history, receipt generation, and A4 printing.
- **Integrated Supabase** for authentication, database operations, and image storage with Row Level Security (RLS).
- **Implemented Supabase RPC functions** for inventory updates and recording transactions, improving data integrity and consistency.
- **Applied realtime syncing** with Supabase + TanStack Query invalidation to keep inventory UI up-to-date across sessions.
- **Developed responsive UI/UX patterns**: bottom sheets, swipe-to-delete, edit drawers, and mobile-friendly layouts.
- **Organized the codebase** using feature-based modules, TypeScript typing, and ESLint for maintainability.
- **Optimized client data fetching** with TanStack Query and managed lightweight global UI state via Zustand.

## Security

- **Access Control**: Supabase Auth handles authentication; Row Level Security (RLS) is enabled on core tables (`products`, `categories`, `orders`, `vouchers`, `news`, `themes`, `inventory_transactions`).
- **Admin Role Enforcement**: Access is enforced at the database level via RLS policies (role stored in `profiles.role`). Client-side checks are used for UX only (UI gating).
- **Principle of Least Privilege**: Users can only read/write records permitted by their role, minimizing unauthorized access.
- **Storage Security**: Product images are stored in a public Supabase Storage bucket. Public access is enabled for image display; upload/delete restrictions are handled by admin-only workflows (policies to be enforced).
- **RPC Functions**: Inventory actions use Supabase RPC (`create_inventory_in`, `create_inventory_out`, `apply_stock_delta`) executed inside PostgreSQL transactions to ensure consistent stock updates and reliable transaction logging.

**Security Checklist:**
- [ ] Enable RLS on all tables
- [x] Configure admin role checks in RLS policies
- [x] Set up Storage bucket policies for image access
- [x] Use HTTPS for all communications
- [x] Regularly audit user permissions and logs

## Screenshots

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

## Quick Start Guide

### Prerequisites
```bash
✅ Node.js 18+
✅ npm or yarn
✅ Supabase account
```

### Installation Steps

**1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/tutimi-admin-dashboard.git
cd tutimi-admin-dashboard
```

**2️⃣ Install Dependencies**
```bash
npm install
```

**3️⃣ Environment Configuration**

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4️⃣ Database Setup**

Configure Supabase tables:
- `profiles`, `products`, `categories`, `orders`
- `order_items`, `vouchers`, `news`, `themes`

Inventory tables:
- `inventory_transactions`, `inventory_receipts (view)`

Supabase RPC functions:
- `create_inventory_in`, `create_inventory_out`, `apply_stock_delta`, trigger: `auto_toggle_product_active`

**5️⃣ Run Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

### 📦 Production Build
```bash
npm run build
npm start
```

### 🌐 Deploy to Vercel
```bash
npm install -g vercel
vercel
```
---

## Project Structure

```
app/
├── (admin)/                 # Admin pages
│   ├── dashboard/           # Analytics dashboard
│   ├── products/            # Product management
│   ├── users/               # User profiles
│   ├── news/                # News & promotions
│   ├── vouchers/            # Voucher management
│   ├── themes/              # Theme settings
│   └── inventory/           # Inventory pages (IN/OUT, history, print)
├── (auth)/                  # Authentication pages
├── api/                     # API routes
│   └── admin/
│       └── users-emails/    # Email sending API
├── components/              # Reusable UI components
├── features/                # Feature-based modules
│   └── inventory/
│       ├── hooks/           # React Query hooks + realtime sync
│       ├── services/        # Supabase RPC services
│       └── store/           # Zustand store
├── hooks/                   # Shared hooks
├── lib/                     # Utilities and services
│   ├── supabase.ts          # Database client
│   ├── storage.ts           # File upload helpers
│   ├── queryKeys.ts         # React Query keys management
│   └── dashboardService.ts  # Analytics logic
└── globals.css              # Global styles

```

*This project showcases skills in modern web development, including full-stack JavaScript/TypeScript, database design, authentication flows, and responsive UI/UX design. 
