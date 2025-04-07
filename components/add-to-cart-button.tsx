"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

type CartItem = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

export default function AddToCartButton({
  courseId,
  courseTitle,
  coursePrice,
  courseImage = "/placeholder.svg",
}: {
  courseId: number
  courseTitle: string
  coursePrice: number
  courseImage?: string
}) {
  const [isInCart, setIsInCart] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Check if course is already in cart
  useEffect(() => {
    const checkCartStatus = () => {
      try {
        const cartItems = localStorage.getItem("cartItems")
        if (cartItems) {
          const items = JSON.parse(cartItems) as CartItem[]
          const itemExists = items.some((item) => item.id === courseId)
          if (itemExists !== isInCart) {
            setIsInCart(itemExists)
          }
        } else if (isInCart) {
          setIsInCart(false)
        }
      } catch (error) {
        console.error("Failed to check cart:", error)
      }
    }

    checkCartStatus()
    // We don't need to add isInCart as a dependency since we're checking its current value
    // inside the effect and only updating if necessary
  }, [courseId])

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const cartItems = localStorage.getItem("cartItems")
        if (cartItems) {
          const items = JSON.parse(cartItems) as CartItem[]
          const itemExists = items.some((item) => item.id === courseId)
          if (itemExists !== isInCart) {
            setIsInCart(itemExists)
          }
        } else if (isInCart) {
          setIsInCart(false)
        }
      } catch (error) {
        console.error("Failed to update cart status:", error)
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [courseId, isInCart])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToContinue"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsAdding(true)

    try {
      // Get existing cart items or create empty array
      const cartItemsStr = localStorage.getItem("cartItems") || "[]"
      const cartItems = JSON.parse(cartItemsStr) as CartItem[]

      // Check if course is already in cart
      const existingItemIndex = cartItems.findIndex((item) => item.id === courseId)

      if (existingItemIndex !== -1) {
        // Update quantity if already in cart
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Add new item to cart
        cartItems.push({
          id: courseId,
          title: courseTitle,
          price: coursePrice,
          image: courseImage || `/placeholder.svg?height=400&width=800&text=Course+${courseId}`,
          quantity: 1,
        })
      }

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems))

      // Dispatch custom event to notify other components about cart update
      const event = new CustomEvent("cartUpdated")
      window.dispatchEvent(event)

      setIsInCart(true)
      setIsAdding(false)

      toast({
        title: t("addedToCart"),
        description: t("courseAddedToCart"),
      })
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast({
        title: t("error"),
        description: t("failedToAddToCart"),
        variant: "destructive",
      })
      setIsAdding(false)
    }
  }

  const handleViewCart = () => {
    router.push("/cart")
  }

  return (
    <Button className="w-full" onClick={isInCart ? handleViewCart : handleAddToCart} disabled={isAdding}>
      {isInCart ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          {t("viewCart")}
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("addToCart")}
        </>
      )}
    </Button>
  )
}

