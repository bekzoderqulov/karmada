"use client"

import type React from "react"

import { ThemeProvider } from "@/context/theme-context"
import { LanguageProvider } from "@/context/language-context"
import { AuthProvider } from "@/context/auth-context"
import { PurchaseProvider } from "@/context/purchase-context"
import { NotificationProvider } from "@/context/notification-context"
import { Toaster } from "@/components/ui/toaster"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <PurchaseProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </PurchaseProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

