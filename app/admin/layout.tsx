"use client"

import type React from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { AdminThemeProvider } from "@/context/admin-theme-context"
import { AdminLanguageProvider } from "@/context/admin-language-context"
import { PurchaseProvider } from "@/context/purchase-context"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"

// Script to initialize language from localStorage
const initLanguageScript = `
try {
  const savedLanguage = localStorage.getItem('admin-language-preference');
  if (savedLanguage && ['en', 'ru', 'uz'].includes(savedLanguage)) {
    document.documentElement.lang = savedLanguage;
    
    // Set data attribute for easier styling based on language
    document.documentElement.setAttribute('data-language', savedLanguage);
    
    // Apply RTL if needed (for future language support)
    if (['ar', 'he'].includes(savedLanguage)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }
} catch (e) {
  console.error('Error setting initial language:', e);
}
`

// Script to initialize theme from localStorage
const initThemeScript = `
try {
  const savedTheme = localStorage.getItem('admin-theme');
  if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (savedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(savedTheme);
    }
  }
} catch (e) {
  console.error('Error setting initial theme:', e);
}
`

// Script to ensure sidebar toggle button works
const sidebarToggleScript = `
try {
  // Add click event listener to document to handle sidebar toggle
  document.addEventListener('click', function(e) {
    // Check if the clicked element has the sidebar-toggle-button class or is a child of it
    const toggle = e.target.closest('.sidebar-toggle-button');
    if (toggle) {
      // Dispatch a custom event to toggle the sidebar
      const event = new CustomEvent('toggleAdminSidebar');
      window.dispatchEvent(event);
    }
  });
} catch (e) {
  console.error('Error setting up sidebar toggle:', e);
}
`

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  // Add event listener to update language when changed
  // This will ensure all components re-render with the new language
  useEffect(() => {
    setMounted(true)

    // Function to handle language change event
    const handleLanguageChange = () => {
      // Force re-render by updating a state
      setMounted(false)
      setTimeout(() => setMounted(true), 0)
    }

    // Add event listener
    window.addEventListener("languageChanged", handleLanguageChange)

    // Listen for sidebar toggle events
    const handleToggleSidebar = () => {
      // This event will be caught by the AdminSidebar component
      window.dispatchEvent(new CustomEvent("toggleAdminSidebar"))
    }

    window.addEventListener("toggleSidebar", handleToggleSidebar)

    // Clean up
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange)
      window.removeEventListener("toggleSidebar", handleToggleSidebar)
      window.removeEventListener("toggleAdminSidebar", handleToggleSidebar)
    }
  }, [])

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    const handleBodyClass = () => {
      const sidebarOpen = document.body.classList.contains("sidebar-open")
      if (sidebarOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }

    // Set up a mutation observer to watch for the sidebar-open class
    const observer = new MutationObserver(handleBodyClass)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })

    return () => {
      observer.disconnect()
      document.body.style.overflow = ""
    }
  }, [])

  if (!mounted) {
    return null // Prevent hydration issues
  }

  return (
    <div className="admin-section">
      {/* Add script to set language before page load */}
      <script dangerouslySetInnerHTML={{ __html: initLanguageScript }} />
      <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
      <script dangerouslySetInnerHTML={{ __html: sidebarToggleScript }} />

      <AdminThemeProvider>
        <AdminLanguageProvider>
          <PurchaseProvider>
            <div id="admin-root" className="flex min-h-screen bg-background">
              {/* AdminSidebar handles its own visibility based on screen size */}
              <AdminSidebar />

              <div className="flex-1 flex flex-col w-full">
                <AdminHeader />
                <main className="flex-1 p-3 md:p-6 overflow-auto">{children}</main>
              </div>
            </div>
          </PurchaseProvider>
        </AdminLanguageProvider>
      </AdminThemeProvider>
    </div>
  )
}

