import type { Metadata } from "next"; // TypeScript type Next.js dùng để khai báo SEO info: title, desc, icon,...
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Providers from "./providers";

// Prevent fontawesome from dynamically adding its CSS since we dit it manually above
config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TUTIMI Admin Dashboard",
  description: "Internal admin dashboard for efficient product and inventory management, featuring fast CRUD workflows and a polished, mobile-friendly UI/UX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

