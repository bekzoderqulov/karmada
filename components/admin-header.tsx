"use client"
import { useAdminLanguage } from "@/context/admin-language-context"
import { AdminThemeToggle } from "@/components/admin-theme-toggle"
import AdminLanguageSwitcher from "@/components/admin-language-switcher"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-is-mobile"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toggleSidebar } from "./admin-sidebar"

export function AdminHeader() {
  const { t } = useAdminLanguage()
  const isMobile = useIsMobile()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {/* Title - hidden on small mobile screens, visible on larger screens */}
      <div className="hidden sm:block text-lg font-semibold ml-8 md:ml-0">{t("adminPanel")}</div>

      {/* Mobile sidebar toggle - only visible on mobile */}
      {isMobile && (
        <div
          className="md:hidden h-10 w-10 rounded-md flex items-center justify-center cursor-pointer mr-auto"
          onClick={() => toggleSidebar()}
          style={{ touchAction: "manipulation" }}
        >
          <span className="sr-only">{t("toggleSidebar")}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">{t("notifications")}</span>
        </Button>

        {/* Language Switcher */}
        <AdminLanguageSwitcher />

        {/* Theme Toggle */}
        <AdminThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || t("user")}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">{t("profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">{t("settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>{t("logout")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

