import React, { createContext, useContext } from 'react';

const PurchaseContext = createContext(null);

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
  const purchaseValue = {}; // Replace with actual logic
  return (
    <PurchaseContext.Provider value={purchaseValue}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}

import { PurchaseProvider } from '@/context/purchase-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PurchaseProvider>
          {children}
        </PurchaseProvider>
      </body>
    </html>
  );
}

