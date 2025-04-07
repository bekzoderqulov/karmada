"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

export function MobileNav() {
  // State
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Get auth context
  const auth = useAuth()
  const { isAuthenticated, user, logout } = auth
  const { language, t } = useLanguage()

  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[400px]">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl" onClick={() => setOpen(false)}>
              IT English Academy
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-lg font-medium py-2 flex items-center" onClick={() => setOpen(false)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("home")}
            </Link>
            <Link href="/courses" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
              {t("courses")}
            </Link>
            <Link href="/jobs" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
              {t("jobs")}
            </Link>
            <Link href="/about" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
              {t("about")}
            </Link>
            <Link href="/contact" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
              {t("contact")}
            </Link>
            {isAuthenticated && (
              <Link href="/profile/chat" className="text-lg font-medium py-2" onClick={() => setOpen(false)}>
                <MessageSquare className="mr-2 h-4 w-4 inline" />
                Chat
              </Link>
            )}
          </nav>
          <div className="flex flex-col gap-2 mt-auto">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t("profile")}
                  </Button>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t("adminPanel")}
                    </Button>
                  </Link>
                )}
                <Button
                  className="w-full"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">{t("register")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

