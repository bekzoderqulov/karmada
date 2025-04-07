"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Check, Landmark, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { usePurchase } from "@/context/purchase-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type CartItem = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

type PaymentMethod = "card" | "click" | "bank" | "cash"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVC, setCardCVC] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showSMSVerification, setShowSMSVerification] = useState(false)
  const [smsCode, setSMSCode] = useState("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { t, language } = useLanguage()
  const { addPurchase } = usePurchase()

  // Memoized function to load cart items to prevent recreation on every render
  const loadCartItems = useCallback(() => {
    try {
      const savedCartItems = localStorage.getItem("cartItems")
      if (savedCartItems) {
        const parsedItems = JSON.parse(savedCartItems)
        return Array.isArray(parsedItems) ? parsedItems : []
      }
      return []
    } catch (error) {
      console.error("Failed to load cart items:", error)
      return []
    }
  }, [])

  // Initial load of cart items
  useEffect(() => {
    if (isInitialLoad) {
      setIsLoading(true)
      try {
        const items = loadCartItems()
        setCartItems(items)
      } catch (error) {
        console.error("Failed to load cart items:", error)
        toast({
          title: t("error"),
          description: t("failedToLoadCart"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }
  }, [isInitialLoad, loadCartItems, toast, t])

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      // Don't set loading state again to avoid re-renders
      if (!isInitialLoad) {
        const items = loadCartItems()
        // Only update if items are different to avoid infinite loops
        if (JSON.stringify(items) !== JSON.stringify(cartItems)) {
          setCartItems(items)
        }
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [cartItems, isInitialLoad, loadCartItems])

  // Save cart items to localStorage when they change due to user actions
  useEffect(() => {
    // Skip during initial load or loading state
    if (!isInitialLoad && !isLoading) {
      try {
        const currentCartItemsStr = localStorage.getItem("cartItems")
        const currentCartItems = currentCartItemsStr ? JSON.parse(currentCartItemsStr) : []

        // Only update localStorage if the cart items have actually changed
        if (JSON.stringify(currentCartItems) !== JSON.stringify(cartItems)) {
          localStorage.setItem("cartItems", JSON.stringify(cartItems))

          // Don't dispatch event here to avoid loops
          // The event should only be dispatched by direct user actions
        }
      } catch (error) {
        console.error("Failed to save cart items:", error)
      }
    }
  }, [cartItems, isLoading, isInitialLoad])

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedItems)

    // Save to localStorage and dispatch event
    try {
      localStorage.setItem("cartItems", JSON.stringify(updatedItems))
      const event = new CustomEvent("cartUpdated")
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Failed to update cart after removal:", error)
    }

    toast({
      title: t("itemRemoved"),
      description: t("itemRemovedFromCart"),
      variant: "default",
    })
  }

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedItems)

    // Save to localStorage and dispatch event
    try {
      localStorage.setItem("cartItems", JSON.stringify(updatedItems))
      const event = new CustomEvent("cartUpdated")
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Failed to update cart quantity:", error)
    }
  }

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToContinue"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }
  }

  const handlePaymentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToContinue"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (paymentMethod === "card" || paymentMethod === "click") {
      // Validate card details
      if (!cardNumber || !cardExpiry || !cardCVC || !phoneNumber) {
        toast({
          title: t("error"),
          description: t("pleaseEnterAllCardDetails"),
          variant: "destructive",
        })
        return
      }

      // Simulate SMS verification
      setIsProcessingPayment(true)
      setTimeout(() => {
        setIsProcessingPayment(false)
        setShowSMSVerification(true)
      }, 1500)
    } else {
      // For bank transfer and cash, proceed directly
      completePayment()
    }
  }

  const handleSMSVerification = () => {
    if (!smsCode || smsCode.length < 4) {
      toast({
        title: t("error"),
        description: t("pleaseEnterValidSMSCode"),
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)
    // Simulate verification process
    setTimeout(() => {
      setIsProcessingPayment(false)
      completePayment()
    }, 1500)
  }

  const completePayment = () => {
    try {
      if (!user || !user.id) {
        toast({
          title: t("error"),
          description: t("userNotAuthenticated"),
          variant: "destructive",
        })
        return
      }

      // Add each course as a purchase
      cartItems.forEach((item) => {
        addPurchase(
          {
            courseId: item.id,
            courseTitle: item.title,
            price: item.price,
            status: "to'langan",
            paymentMethod: paymentMethod,
          },
          user.id,
        )
      })

      // Add purchased courses to user's courses
      try {
        // Get existing user courses or create empty array
        const userCoursesStr = localStorage.getItem("userCourses") || "[]"
        const userCourses = JSON.parse(userCoursesStr)

        // Add all cart items to user courses
        const updatedUserCourses = [
          ...userCourses,
          ...cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            purchaseDate: new Date().toISOString(),
            progress: 0,
            nextLesson: "Introduction",
            nextLessonDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            instructor: "Aziza Karimova",
            category: "IT English",
            completed: false,
            lastAccessed: new Date().toISOString(),
          })),
        ]

        // Save updated user courses to localStorage
        localStorage.setItem("userCourses", JSON.stringify(updatedUserCourses))
      } catch (error) {
        console.error("Failed to update user courses:", error)
      }

      // Clear cart
      setCartItems([])
      localStorage.removeItem("cartItems")

      // Dispatch cart updated event
      const event = new CustomEvent("cartUpdated")
      window.dispatchEvent(event)

      // Show success message
      setPaymentComplete(true)

      // Redirect to profile/courses after a delay
      setTimeout(() => {
        router.push("/profile/courses")
      }, 3000)
    } catch (error) {
      console.error("Failed to process purchase:", error)
      toast({
        title: t("error"),
        description: t("paymentProcessingError"),
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "uz-UZ").format(amount)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("paymentSuccessful")}</h1>
          <p className="text-muted-foreground mb-6">{t("redirectingToCourses")}</p>
          <Button asChild>
            <Link href="/profile/courses">{t("goToCourses")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex items-center mb-8">
        <Button variant="outline" size="icon" className="mr-2" asChild>
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{t("shoppingCart")}</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/4 h-40 bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-primary font-medium">
                        {formatCurrency(item.price)} {t("currency")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="mx-3">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
                <CardDescription>{t("reviewYourOrder")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t("subtotal")}</span>
                  <span>
                    {formatCurrency(calculateTotal())} {t("currency")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("discount")}</span>
                  <span>0 {t("currency")}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-semibold">
                  <span>{t("total")}</span>
                  <span className="text-primary">
                    {formatCurrency(calculateTotal())} {t("currency")}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleProceedToCheckout}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("checkout")}
                </Button>
              </CardFooter>
            </Card>

            {isAuthenticated && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{t("paymentMethod")}</CardTitle>
                  <CardDescription>{t("selectPaymentMethod")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="card">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t("card")}</span>
                      </TabsTrigger>
                      <TabsTrigger value="click">
                        <img src="/placeholder.svg?height=16&width=16" alt="Click" className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Click</span>
                      </TabsTrigger>
                      <TabsTrigger value="bank">
                        <Landmark className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t("bank")}</span>
                      </TabsTrigger>
                      <TabsTrigger value="cash">
                        <Banknote className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t("cash")}</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">{t("expiryDate")}</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC/CVV</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ""))}
                            maxLength={3}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("phoneNumber")}</Label>
                        <Input
                          id="phone"
                          placeholder="+998 90 123 45 67"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={handlePaymentSubmit} disabled={isProcessingPayment}>
                          {isProcessingPayment ? t("processing") : t("payNow")}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="click" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="clickCardNumber">{t("cardNumber")}</Label>
                        <Input
                          id="clickCardNumber"
                          placeholder="8600 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clickExpiry">{t("expiryDate")}</Label>
                          <Input
                            id="clickExpiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clickPhone">{t("phoneNumber")}</Label>
                          <Input
                            id="clickPhone"
                            placeholder="+998 90 123 45 67"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={handlePaymentSubmit} disabled={isProcessingPayment}>
                          {isProcessingPayment ? t("processing") : t("payNow")}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="bank" className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">{t("bankTransferInstructions")}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t("bankTransferDescription")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{t("accountName")}:</span>
                            <span>IT English Academy</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">{t("accountNumber")}:</span>
                            <span>1234 5678 9012 3456</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">{t("bank")}:</span>
                            <span>National Bank of Uzbekistan</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">{t("reference")}:</span>
                            <span>
                              Order #
                              {Math.floor(Math.random() * 10000)
                                .toString()
                                .padStart(3, "0")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={handlePaymentSubmit} disabled={isProcessingPayment}>
                          {isProcessingPayment ? t("processing") : t("confirmOrder")}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="cash" className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">{t("cashPaymentInstructions")}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t("cashPaymentDescription")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{t("address")}:</span>
                            <span>123 IT Street, Tashkent</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">{t("workingHours")}:</span>
                            <span>9:00 - 18:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">{t("orderNumber")}:</span>
                            <span>#{Math.floor(Math.random() * 10000)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button className="w-full" onClick={handlePaymentSubmit} disabled={isProcessingPayment}>
                          {isProcessingPayment ? t("processing") : t("confirmOrder")}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">{t("cartEmpty")}</h2>
          <p className="text-muted-foreground mb-8">{t("browseCoursesToAddToCart")}</p>
          <Button asChild>
            <Link href="/courses">{t("browseCourses")}</Link>
          </Button>
        </div>
      )}

      {/* SMS Verification Dialog */}
      <Dialog
        open={showSMSVerification}
        onOpenChange={(open) => {
          // Only allow closing if not processing payment
          if (!isProcessingPayment) {
            setShowSMSVerification(open)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("smsVerification")}</DialogTitle>
            <DialogDescription>{t("smsVerificationDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="smsCode">{t("enterSMSCode")}</Label>
              <Input
                id="smsCode"
                placeholder="1234"
                value={smsCode}
                onChange={(e) => setSMSCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSMSVerification} disabled={isProcessingPayment}>
              {isProcessingPayment ? t("verifying") : t("verify")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

