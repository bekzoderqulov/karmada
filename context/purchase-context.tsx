"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type Purchase = {
  id: string
  userId: number
  courseId: number
  courseTitle: string
  price: number
  date: string
  status: "to'langan" | "kutilmoqda" | "bekor qilingan"
  paymentMethod: string
}

type PurchaseContextType = {
  purchases: Purchase[]
  addPurchase: (purchase: Omit<Purchase, "id" | "date" | "userId">, userId: number) => void
  getUserPurchases: (userId: number) => Purchase[]
  getAllPurchases: () => Purchase[]
}

const PurchaseContext = createContext<PurchaseContextType | null>(null)

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Set mounted state to true after initial render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load purchases from localStorage on component mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedPurchases = localStorage.getItem("purchases")
      if (savedPurchases) {
        setPurchases(JSON.parse(savedPurchases))
      } else {
        // Add demo purchases if none exist
        const demoPurchases = [
          {
            id: "ORD-001",
            userId: 1, // Demo user ID
            courseId: 1,
            courseTitle: "Ingliz tili asoslari",
            price: 1200000,
            date: new Date().toISOString(),
            status: "to'langan",
            paymentMethod: "Karta",
          },
          {
            id: "ORD-002",
            userId: 1, // Demo user ID
            courseId: 2,
            courseTitle: "IT ingliz tili",
            price: 1500000,
            date: new Date().toISOString(),
            status: "to'langan",
            paymentMethod: "Naqd",
          },
        ]
        setPurchases(demoPurchases)
        localStorage.setItem("purchases", JSON.stringify(demoPurchases))
      }
    } catch (error) {
      console.error("Failed to load purchases:", error)
    }
  }, [])

  // Save purchases to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return

    try {
      localStorage.setItem("purchases", JSON.stringify(purchases))
    } catch (error) {
      console.error("Failed to save purchases:", error)
    }
  }, [purchases, mounted])

  const addPurchase = (purchase: Omit<Purchase, "id" | "date" | "userId">, userId: number) => {
    if (!userId) {
      toast({
        title: "Xatolik",
        description: "Kurs sotib olish uchun tizimga kirishingiz kerak",
        variant: "destructive",
      })
      return
    }

    const newPurchase: Purchase = {
      ...purchase,
      id: `ORD-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      userId: userId,
      date: new Date().toISOString(),
    }

    console.log("Adding new purchase:", newPurchase)

    // Update state with the new purchase
    setPurchases((prev) => {
      const updated = [...prev, newPurchase]
      // Save to localStorage immediately
      if (typeof window !== "undefined") {
        localStorage.setItem("purchases", JSON.stringify(updated))
      }
      return updated
    })

    toast({
      title: "Xarid muvaffaqiyatli",
      description: `${purchase.courseTitle} kursi muvaffaqiyatli sotib olindi`,
    })
  }

  const getUserPurchases = (userId: number) => {
    if (!userId) return []

    // Ensure we're working with the latest data from localStorage
    let latestPurchases = purchases
    if (typeof window !== "undefined") {
      try {
        const savedPurchases = localStorage.getItem("purchases")
        if (savedPurchases) {
          latestPurchases = JSON.parse(savedPurchases)
        }
      } catch (error) {
        console.error("Error reading purchases from localStorage:", error)
      }
    }

    const userPurchases = latestPurchases.filter((purchase) => purchase.userId === userId)
    console.log(`Found ${userPurchases.length} purchases for user ${userId}:`, userPurchases)
    return userPurchases
  }

  const getAllPurchases = () => {
    // Ensure we're working with the latest data from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedPurchases = localStorage.getItem("purchases")
        if (savedPurchases) {
          return JSON.parse(savedPurchases)
        }
      } catch (error) {
        console.error("Error reading purchases from localStorage:", error)
      }
    }
    return purchases
  }

  // Only render the provider when mounted on client
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <PurchaseContext.Provider value={{ purchases, addPurchase, getUserPurchases, getAllPurchases }}>
      {children}
    </PurchaseContext.Provider>
  )
}

export function usePurchase() {
  const context = useContext(PurchaseContext)
  if (context === null) {
    throw new Error("usePurchase must be used within a PurchaseProvider")
  }
  return context
}

