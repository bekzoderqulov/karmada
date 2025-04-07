"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useEffect, useState } from "react"

export function AdminSidebarToggle() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isMobile) {
    return null
  }

  const handleToggleSidebar = () => {
    // Dispatch a custom event to toggle the sidebar
    window.dispatchEvent(new CustomEvent("toggleAdminSidebar"))
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden h-10 w-10 rounded-md flex items-center justify-center"
      onClick={handleToggleSidebar}
      aria-label="Toggle sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

