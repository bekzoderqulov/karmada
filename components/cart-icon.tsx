"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/language-context"

export function CartIcon() {
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  // Load cart count from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const cartItems = localStorage.getItem("cartItems")
      if (cartItems) {
        setCartCount(JSON.parse(cartItems).length)
      }
    } catch (error) {
      console.error("Failed to load cart items:", error)
    }

    // Listen for cart updates
    const handleStorageChange = () => {
      try {
        const cartItems = localStorage.getItem("cartItems")
        if (cartItems) {
          setCartCount(JSON.parse(cartItems).length)
        } else {
          setCartCount(0)
        }
      } catch (error) {
        console.error("Failed to update cart count:", error)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("cartUpdated", handleStorageChange)
    }
  }, [])

  if (!mounted) return null

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
          {cartCount}
        </Badge>
      )}
      <span className="sr-only">{t("cart")}</span>
    </Link>
  )
}

export default CartIcon

