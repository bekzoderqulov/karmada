"use client";

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"
import { SiteHeader } from "@/components/site-header"
import { PurchaseProvider } from "@/context/purchase-context";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IT English Academy",
  description: "Learn English for IT professionals",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to apply theme before page load to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply dark mode if saved in localStorage
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Apply language if saved in localStorage
                  const language = localStorage.getItem('language');
                  if (language && ['uz', 'ru', 'en'].includes(language)) {
                    document.documentElement.lang = language;
                  }
                } catch (e) {
                  console.error('Error applying theme or language:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <SiteHeader />
          <main className="min-h-screen">
            <PurchaseProvider>{children}</PurchaseProvider>
          </main>
        </ClientProviders>
      </body>
    </html>
  )
}