"use client";

import { ReactNode } from "react";
import { ClientProviders } from "@/components/client-providers";
import { SiteHeader } from "@/components/site-header";
import { PurchaseProvider } from "@/context/purchase-context";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ClientProviders>
      <SiteHeader />
      <main className="min-h-screen">
        <PurchaseProvider>{children}</PurchaseProvider>
      </main>
    </ClientProviders>
  );
}