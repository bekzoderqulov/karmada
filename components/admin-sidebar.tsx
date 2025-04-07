"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, Briefcase,
  Calendar, MessageSquare, BarChart2, FileText, Settings,
  Globe, HelpCircle, LogOut, Menu, X, ChevronRight,
} from "lucide-react"
import { useAdminLanguage } from "@/context/admin-language-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

let globalSetSidebarOpen: ((isOpen: boolean) => void) | null = null

export function toggleSidebar() {
  if (globalSetSidebarOpen) {
    globalSetSidebarOpen(prev => !prev)
  }
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useAdminLanguage()
  const { logout } = useAuth()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    globalSetSidebarOpen = setIsOpen

    const handleToggleEvent = () => {
      setIsOpen(prev => !prev)
    }

    window.addEventListener("toggleAdminSidebar", handleToggleEvent)
    return () => {
      globalSetSidebarOpen = null
      window.removeEventListener("toggleAdminSidebar", handleToggleEvent)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  useOnClickOutside(
    sidebarRef,
    () => {
      if (isMobile && isOpen) {
        setIsOpen(false)
      }
    },
    [toggleButtonRef]
  )

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.classList.add("sidebar-open")
      } else {
        document.body.classList.remove("sidebar-open")
      }
    }

    return () => {
      document.body.classList.remove("sidebar-open")
    }
  }, [isOpen, isMobile])

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(`${path}/`)

  const handleLogout = () => {
    logout()
    toast({
      title: t("logoutSuccess"),
      description: t("logoutSuccessMessage"),
    })
    router.push("/")
  }

  if (!mounted) return null

  const sidebarItems = [
    { key: "dashboard", label: t("dashboard"), icon: <LayoutDashboard className="h-5 w-5" />, href: "/admin" },
    { key: "users", label: t("users"), icon: <Users className="h-5 w-5" />, href: "/admin/users" },
    { key: "courses", label: t("courses"), icon: <BookOpen className="h-5 w-5" />, href: "/admin/courses" },
    { key: "teachers", label: t("teachers"), icon: <GraduationCap className="h-5 w-5" />, href: "/admin/teachers" },
    { key: "jobs", label: t("jobs"), icon: <Briefcase className="h-5 w-5" />, href: "/admin/jobs" },
    { key: "schedule", label: t("schedule"), icon: <Calendar className="h-5 w-5" />, href: "/admin/schedule" },
    { key: "chat", label: t("chat"), icon: <MessageSquare className="h-5 w-5" />, href: "/admin/chat" },
    { key: "analytics", label: t("analytics"), icon: <BarChart2 className="h-5 w-5" />, href: "/admin/analytics" },
    { key: "reports", label: t("reports"), icon: <FileText className="h-5 w-5" />, href: "/admin/reports" },
    { key: "settings", label: t("settings"), icon: <Settings className="h-5 w-5" />, href: "/admin/settings" },
    { key: "website", label: t("website"), icon: <Globe className="h-5 w-5" />, href: "/admin/website" },
    { key: "help", label: t("help"), icon: <HelpCircle className="h-5 w-5" />, href: "/admin/help" },
  ]

  const mobileToggle = (
    <button
      ref={toggleButtonRef}
      className="fixed md:hidden top-3 left-3 z-[1000] h-10 w-10 rounded-md shadow-md bg-background border border-border flex items-center justify-center"
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? t("closeSidebar") : t("openSidebar")}
      type="button"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("adminPanel")}</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-1">
        <div className="py-2">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center px-3 py-3 text-sm rounded-md transition-colors ${
                  isActive(item.href) ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                }`}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-3 text-base">{item.label}</span>
                {isActive(item.href) && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start text-sm" asChild>
          <Link href="/" onClick={() => isMobile && setIsOpen(false)}>
            <Globe className="h-5 w-5 mr-3" />
            {t("viewSite")}
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-3" />
          {t("logout")}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {mobileToggle}
        <div
          className={`fixed inset-0 z-[900] bg-background/80 backdrop-blur-sm transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden="true"
        >
          <div
            ref={sidebarRef}
            className="fixed inset-y-0 left-0 z-[950] w-72 bg-background shadow-xl transform transition-transform duration-300 ease-in-out"
            style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
          >
            {sidebarContent}
          </div>
        </div>
      </>
    )
  }

  return <div className="h-full hidden md:block">{sidebarContent}</div>
}
