# TUTIMI ADMIN DASHBOARD

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06b6d4?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3fcf8e?style=for-the-badge&logo=supabase)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=tanstackquery)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand)

A production-grade admin dashboard for a coffee and tea e-commerce platform. The goal is to help admins run daily operations with speed and accuracy: manage products, control inventory, publish news and promotions, configure themes, and monitor sales and orders.

# [LINK DEMO🔗](https://tutimi-admin-dashboard.vercel.app/)

**Test Credentials:** `admin@gmail.com` / `Admin@123456`

## ✨ Highlights

- Full admin workflow across products, inventory, vouchers, news, themes, and users.
- Realtime data sync with Supabase and TanStack Query cache invalidation.
- Inventory system with bulk IN/OUT, unit conversion, receipt history, and A4 print-ready receipts.
- Responsive UI with desktop tables and mobile cards, plus drawer-based editing flows.
- Analytics dashboard with KPI cards and multiple chart types.

## Feature Tour

## Dashboard and Analytics

- KPI cards for total orders, revenue, confirmed orders, and low-stock count.
- Revenue line chart with bucketed ranges (day, week, month, year).
- Orders status distribution and inventory in/out trends.
- Recent orders list, top-selling products, and latest news preview.
- Date range filter with optional manual from/to selection.

## Inventory Management

- Inventory list with category filters, sorting, and search.
- Low stock state and per-product inventory history drawer.
- Bulk IN and OUT workflows with unit conversion rules.
- Receipt history table with search, filters, and reprint actions.
- Print-ready A4 receipts with company header and signatures.

Unit conversion rules implemented in bulk flow:
- 500 ml -> 1
- 1 L -> 2
- 100 g -> 1
- 1 kg -> 10
- 1 item -> 1
- 1 pack -> 6

## Product Management

- Create, edit, delete products.
- Manage mode with bulk ON/OFF for visibility.
- Image upload or image link input.
- Live product preview for the client app UI.

## News and Promotions

- CRUD for news items with type (News or Promotion), tags, and active status.
- Image upload or image link input.
- Live news preview card that mirrors the client app layout.

## Vouchers

- Create, edit, delete vouchers.
- Percent or fixed discounts, minimum order value, and per-user usage limit.
- Option to restrict vouchers to new users only.
- Live voucher preview card.

## Themes and Branding

- Switch active app themes.
- Manage login branding (background and logo).
- Configure banner sets by theme key.

## Users

- User list from profiles, excluding admins.
- Realtime updates via Supabase channel subscription.

## 🛠️ Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query 5
- Zustand
- Supabase (Auth, Database, Storage, Realtime, RPC)
- Recharts
- FontAwesome, Lucide

## Architecture Notes

- Feature-based structure under `app/features/*` for dashboard and inventory domains.
- React Query handles server state, with targeted cache invalidation and stale time tuning.
- Supabase Realtime channels trigger dashboard and inventory refreshes.
- Inventory writes are implemented via Supabase RPC functions for atomicity.
- A4 printing uses dedicated print styles in `app/globals.css`.

## Decisions & Trade-offs

- **Supabase for Auth + Data + Realtime**: Chosen to move fast and keep backend ops minimal. The trade-off is tighter coupling to Supabase APIs and RLS rules, but the impact is quicker delivery of production-like features (auth, storage, realtime) without building a separate backend.
- **React Query + Realtime invalidation instead of custom WebSocket store**: Keeps cache and UI consistent with a small mental model. The trade-off is eventual consistency windows between events and refetch, but the impact is simpler correctness across multiple lists and charts.
- **RPC functions for inventory writes**: Inventory updates are atomic and audited. The trade-off is added database-side logic to maintain, but the impact is fewer stock inconsistencies and clearer transaction history.
- **Bulk inventory with unit conversion in UI**: Optimizes for admin speed. The trade-off is more client logic and validation, but the impact is faster stock intake and fewer manual mistakes during warehouse operations.
- **Drawer-based editing and mobile-first cards**: Improves throughput on small screens. The trade-off is more UI state to manage, but the impact is a smoother workflow for on-site staff using tablets or phones.
- **Feature-based folder structure**: Easier to scale as features grow. The trade-off is more folder depth, but the impact is clearer ownership boundaries and faster onboarding.

### 📈 Impact summary:
- Reduced manual steps for inventory operations with bulk IN/OUT and receipt printing.
- Higher data consistency via RPC-based stock updates and realtime refresh.
- Faster admin workflows with unified CRUD patterns and preview-driven UI.
## Data Model Expectations (Supabase)

Tables used by the app:
- profiles
- products
- categories
- orders
- order_items
- vouchers
- news
- app_themes
- app_brandings
- banners
- app_banner_settings
- inventory_transactions

Views used by the app:
- inventory_receipts

RPC functions called by the app:
- create_inventory_in
- create_inventory_out
- get_revenue_vn
- get_orders_count_vn
- get_inventory_in_out_vn

Storage buckets used by the app:
- products (product images, news images, themes, banners, branding assets)

## Authentication and Authorization

- Supabase email and password login.
- Admin gate enforced by `profiles.role === "admin"`.
- Non-admin users are redirected to login.

## 🚀 Local Setup

Prerequisites:
- Node.js 18+
- Supabase project

1. Install dependencies
   - npm install

2. Configure environment
   - Create `.env.local`
   - Add:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY

3. Run the app
   - npm run dev

## Scripts

- npm run dev
- npm run build
- npm run start
- npm run lint

## Project Structure

```
app/
  (admin)/
    dashboard/
    products/
    inventory/
    users/
    news/
    vouchers/
    themes/
  (auth)/
    login/
  components/
  features/
    dashboard/
    inventory/
  hooks/
  lib/
components/
  ui/
public/
  screenshots/
```

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

## 👨‍💻 My Role

- Built the full admin product as a solo developer.
- Implemented inventory and receipt workflows end to end.
- Designed responsive UI with reusable drawer patterns and previews.
- Integrated Supabase services (Auth, Realtime, RPC, Storage).
- Structured the codebase for maintainability and fast iteration.

## 📝 Notes for Reviewers

- UI text is currently in Vietnamese because the product targets local admins.
- All data operations are wired to Supabase. Swap the URL and key to point to your own project.
