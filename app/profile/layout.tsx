import type React from "react"
import { PurchaseProvider } from "@/context/purchase-context"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No need to manually set profileLanguage here anymore
  // This is now handled in the language-context.tsx

  return (
    <div className="flex flex-col min-h-screen">
      <PurchaseProvider>
        <main className="flex-1">{children}</main>
      </PurchaseProvider>
    </div>
  )
}

