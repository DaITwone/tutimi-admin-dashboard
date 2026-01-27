# Tutimi Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

A modern admin dashboard for managing the Tutimi Coffee & Tea e-commerce platform. Built with Next.js and Supabase, this project demonstrates full-stack development skills including authentication, data management, and responsive UI design.

## Link Demo **[🔗](https://tutimi-admin-dashboard.vercel.app/)**

### Test Credentials
```
Email: admin_demo@gmail.com
Password: admin@123456
```
## Overview

This project solves the need for efficient administration of an online coffee and tea shop. It provides administrators with tools to monitor sales, manage inventory, handle user data, create promotions, and customize the app's appearance. The dashboard is designed for Vietnamese users with bilingual support.

## Features

- **Dashboard Analytics**: Real-time metrics for orders, revenue, and cancel rates with time filters (today/week/month)
- **Product Management**: CRUD operations for products with image uploads, category filtering, and search functionality
- **User Management**: View and manage user profiles (excluding admin accounts)
- **Promotions & News**: Create and edit news articles and promotional content
- **Voucher System**: Manage discount codes with flexible rules (percentage/fixed discounts, usage limits)
- **Theme Customization**: Adjust app appearance settings
- **Email Integration**: API for sending newsletters or notifications to users
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar navigation

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **FontAwesome & Lucide React** - Icon libraries

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, file storage, and Row Level Security (RLS) policies.
- **Next.js API Routes** - Serverless functions for admin tasks

### Development Tools
- **ESLint** - Code linting
- **Vercel** - Deployment platform

## Screenshots

### 🛒 Create Product
![Create Product](./public/screenshots/product.png)

### 🎟️ Voucher Management
![Voucher Management](./public/screenshots/voucher.png)

### 🎨 Theme Management
![Theme Management](./public/screenshots/theme.png)


## Setup

### Requirements
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tutimi-admin-dashboard.git
cd tutimi-admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and set up the following tables:
   - `profiles` (user data and roles)
   - `products` (inventory with categories)
   - `categories` (product grouping)
   - `orders` (sales data)
   - `order_items` (order details)
   - `vouchers` (discount codes)
   - `news` (promotions and updates)
   - `themes` (app customization settings)

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build & Deploy

Build for production:
```bash
npm run build
npm start
```

Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

## Project Structure

```
app/
├── (admin)/           # Admin pages
│   ├── dashboard/     # Analytics dashboard
│   ├── products/      # Product management
│   ├── users/         # User profiles
│   ├── news/          # News & promotions
│   ├── vouchers/      # Voucher management
│   └── themes/        # Theme settings
├── (auth)/            # Authentication pages
├── api/               # API routes
│   └── admin/
│       └── users-emails/  # Email sending API
├── components/        # Reusable UI components
├── lib/               # Utilities and services
│   ├── supabase.ts    # Database client
│   ├── storage.ts     # File upload helpers
│   └── dashboardService.ts  # Analytics logic
└── globals.css        # Global styles
```

*This project showcases skills in modern web development, including full-stack JavaScript/TypeScript, database design, authentication flows, and responsive UI/UX design. Perfect for junior frontend developer portfolios!*
