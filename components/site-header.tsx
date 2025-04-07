"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Search,
  BookOpen,
  Briefcase,
  Info,
  Phone,
  Home,
  MessageSquare,
  User,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageSwitcher from "@/components/language-switcher"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import CartIcon from "@/components/cart-icon"
import NotificationBell from "@/components/notification-bell"
import UserMenu from "@/components/user-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function SiteHeader() {
  // All hooks must be called at the top level
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const pathname = usePathname()

  // Call all context hooks unconditionally at the top level
  const languageContext = useLanguage()
  const authContext = useAuth()

  const { t } = languageContext || { t: (key: string) => key }
  const { user, isAuthenticated, logout, isAdmin } = authContext || {
    user: null,
    isAuthenticated: false,
    logout: () => {},
    isAdmin: false,
  }

  // Handle scroll effect
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  // Set mounted state and add scroll listener
  useEffect(() => {
    setMounted(true)
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Skip rendering header on admin pages
  const shouldSkipHeader = pathname?.startsWith("/admin")
  if (shouldSkipHeader) {
    return null
  }

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <header className="h-12 md:h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"></header>
    )
  }

  // If there was an error accessing the context, show a minimal header
  if (error) {
    return (
      <header className="h-12 md:h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <div className="flex h-12 md:h-14 items-center justify-between">
            <Link href="/" className="flex items-center space-x-1">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm md:text-base">IT English Academy</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  // Navigation links
  const navLinks = [
    { href: "/", label: t("home"), icon: <Home className="h-3 w-3 mr-1" /> },
    { href: "/courses", label: t("courses"), icon: <BookOpen className="h-3 w-3 mr-1" /> },
    { href: "/jobs", label: t("jobs"), icon: <Briefcase className="h-3 w-3 mr-1" /> },
    { href: "/about", label: t("about"), icon: <Info className="h-3 w-3 mr-1" /> },
    { href: "/contact", label: t("contact"), icon: <Phone className="h-3 w-3 mr-1" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-12 md:h-14 items-center justify-between">
          {/* Logo and mobile menu */}
          <div className="flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-2 border-b">
                    <Link
                      href="/"
                      className="flex items-center space-x-1 font-bold text-base"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span>IT English</span>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-auto py-2">
                    <nav className="flex flex-col space-y-1">
                      {navLinks.map((link) => (
                        <Button
                          key={link.href}
                          variant={pathname === link.href ? "secondary" : "ghost"}
                          className="justify-start h-8 text-xs"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href={link.href}>
                            {link.icon}
                            {link.label}
                          </Link>
                        </Button>
                      ))}

                      {isAuthenticated && (
                        <Button
                          variant={pathname === "/profile/chat" ? "secondary" : "ghost"}
                          className="justify-start h-8 text-xs"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/profile/chat">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Link>
                        </Button>
                      )}
                    </nav>
                  </div>

                  <div className="border-t py-2">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center px-2">
                          <Avatar className="h-7 w-7 mr-2">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 px-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start h-7 text-xs"
                            asChild
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Link href="/profile">
                              <User className="h-3 w-3 mr-1" />
                              {t("profile")}
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start h-7 text-xs"
                            onClick={() => {
                              logout()
                              setMobileMenuOpen(false)
                            }}
                          >
                            <LogOut className="h-3 w-3 mr-1" />
                            {t("logout")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 px-2">
                        <Button
                          variant="outline"
                          className="w-full h-7 text-xs"
                          asChild
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/login">{t("login")}</Link>
                        </Button>
                        <Button className="w-full h-7 text-xs" asChild onClick={() => setMobileMenuOpen(false)}>
                          <Link href="/register">{t("register")}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center space-x-1 ml-1 md:ml-0">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm hidden sm:inline-block">IT English</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2"
                asChild
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}

            {isAdmin && (
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2" asChild>
                <Link href="/admin">
                  <Settings className="h-3 w-3 mr-1" />
                  Admin
                </Link>
              </Button>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-1">
            {/* Search */}
            <div className={`transition-all duration-300 ${searchOpen ? "w-full md:w-48" : "w-0"}`}>
              {searchOpen && (
                <div className="relative">
                  <Input type="search" placeholder={t("search")} className="w-full h-7 pl-7 text-xs" autoFocus />
                  <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>

            {!searchOpen && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            {searchOpen && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            )}

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {isAuthenticated && <NotificationBell />}

            {/* Shopping cart */}
            <CartIcon />

            {/* User menu */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 hidden sm:flex" asChild>
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button size="sm" className="h-7 text-xs px-2 hidden sm:flex" asChild>
                  <Link href="/register">{t("register")}</Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:hidden" asChild>
                  <Link href="/login">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader

