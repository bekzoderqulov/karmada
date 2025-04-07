"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the notification type
export type Notification = {
  id: string
  userId: number | null
  title: string
  message: string
  time?: string
  read?: boolean
  type?: string
}

// Define the context type
type NotificationContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Provider component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("notifications")
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      } else {
        // Add some demo notifications if none exist
        const demoNotifications = [
          {
            id: "1",
            userId: null,
            title: "Yangi kurs qo'shildi",
            message: "Advanced IT English kursi endi mavjud|3",
            time: new Date().toISOString(),
            read: false,
            type: "course",
          },
          {
            id: "2",
            userId: null,
            title: "Chegirma",
            message: "Barcha kurslarga 20% chegirma!",
            time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            read: false,
            type: "promo",
          },
          {
            id: "3",
            userId: null,
            title: "Yangi ish o'rni",
            message: "Yangi IT ingliz tili o'qituvchisi ish o'rni e'lon qilindi",
            time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            read: true,
            type: "job",
          },
        ]
        setNotifications(demoNotifications)
        localStorage.setItem("notifications", JSON.stringify(demoNotifications))
      }
    } catch (error) {
      console.error("Error loading notifications from localStorage:", error)
    }
  }, [])

  // Save notifications to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications to localStorage:", error)
    }
  }, [notifications])

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "time" | "read">) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...notification,
      time: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => {
      const updated = [newNotification, ...prev]
      // Save to localStorage immediately
      try {
        localStorage.setItem("notifications", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving notifications to localStorage:", error)
      }
      return updated
    })
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )

    setNotifications(updatedNotifications)

    try {
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])

    try {
      localStorage.setItem("notifications", JSON.stringify([]))
    } catch (error) {
      console.error("Error clearing notifications:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use the notification context
export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

