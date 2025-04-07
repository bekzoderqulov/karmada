"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/context/notification-context"
import { useLanguage } from "@/context/language-context"

export function NotificationBell() {
  const [mounted, setMounted] = useState(false)
  const { notifications, markAllAsRead, markAsRead } = useNotifications()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use default values if context values are undefined
  const notificationsList = notifications || []
  const unreadCount = notificationsList.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">{t("notifications")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t("notifications")}</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal" onClick={markAllAsRead}>
              {t("mark_all_as_read")}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notificationsList.length > 0 ? (
            notificationsList.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start py-3 cursor-pointer"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-2 w-full">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time ? new Date(notification.time).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">{t("no_notifications")}</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationBell

