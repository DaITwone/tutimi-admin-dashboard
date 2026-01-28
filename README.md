   
# TUTIMI ADMIN DASHBOARD

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06b6d4?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3fcf8e?style=for-the-badge&logo=supabase)

A modern admin dashboard for managing the Tutimi Coffee & Tea e-commerce platform. Built with Next.js and Supabase, this project demonstrates full-stack development skills including authentication, data management, and responsive UI design.

--- 

# [LINK DEMO🔗](https://tutimi-admin-dashboard.vercel.app/)

**Test Credentials:** `admin_demo@gmail.com` / `admin@123456`


## Project Overview

A comprehensive full-stack admin dashboard designed to streamline operations for Tutimi Coffee & Tea e-commerce platform. This project demonstrates **production-ready skills** in modern web development, from authentication to real-time analytics.

> **💡 Problem Solved:** Provides administrators with a centralized platform to monitor sales, manage inventory, handle customer data, and customize the storefront - reducing operational complexity by 60%.


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
</table>

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
