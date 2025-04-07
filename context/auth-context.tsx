"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

// Define all possible permissions
export const PERMISSIONS = {
  // View permissions
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_COURSES: "view_courses",
  VIEW_STUDENTS: "view_students",
  VIEW_TEACHERS: "view_teachers",
  VIEW_JOBS: "view_jobs",
  VIEW_CHAT: "view_chat",
  VIEW_PAYMENTS: "view_payments",
  VIEW_DOCUMENTS: "view_documents",
  VIEW_SETTINGS: "view_settings",
  VIEW_PROGRAMMING: "view_programming",
  VIEW_ENGLISH: "view_english",
  VIEW_CANDIDATES: "view_candidates",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_REPORTS: "view_reports",

  // Management permissions
  MANAGE_USERS: "manage_users",
  MANAGE_COURSES: "manage_courses",
  MANAGE_STUDENTS: "manage_students",
  MANAGE_TEACHERS: "manage_teachers",
  MANAGE_JOBS: "manage_jobs",
  MANAGE_PAYMENTS: "manage_payments",
  MANAGE_DOCUMENTS: "manage_documents",
  MANAGE_SETTINGS: "manage_settings",
}

// Define role types
export type UserRole = "admin" | "hr_manager" | "english_teacher" | "it_teacher" | "user"

export type User = {
  id: number
  username: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar?: string
  registeredAt?: string
  permissions: string[]
  active: boolean
}

export type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updatedUser: User) => void
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
  hasPermission: (permission: string) => boolean
  getAllUsers: () => User[]
  registerUser: (user: Omit<User, "id" | "registeredAt" | "permissions" | "active">) => User
  updateUserPermissions: (userId: number, permissions: string[]) => void
  toggleUserActive: (userId: number, active: boolean) => void
}

// Define default permissions for each role
const DEFAULT_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  hr_manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_TEACHERS,
    PERMISSIONS.VIEW_JOBS,
    PERMISSIONS.VIEW_CANDIDATES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_JOBS,
  ],
  english_teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_ENGLISH,
    PERMISSIONS.VIEW_CHAT,
    PERMISSIONS.MANAGE_COURSES,
  ],
  it_teacher: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.VIEW_PROGRAMMING,
    PERMISSIONS.VIEW_CHAT,
    PERMISSIONS.MANAGE_COURSES,
  ],
  user: [],
}

// Create auth context with default values
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  hasPermission: () => false,
  getAllUsers: () => [],
  registerUser: () => ({
    id: 0,
    username: "",
    name: "",
    email: "",
    phone: "",
    role: "user",
    permissions: [],
    active: false,
  }),
  updateUserPermissions: () => {},
  toggleUserActive: () => {},
}

// Xavfsizlik uchun JWT token yaratish funksiyasi
const generateToken = (user: User): string => {
  // Amaliy loyihada bu server tomonida amalga oshirilishi kerak
  // Bu yerda oddiy misol sifatida ko'rsatilmoqda
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  }

  // Amaliy loyihada maxfiy kalit bilan imzolanishi kerak
  return btoa(JSON.stringify(payload))
}

// Token tekshirish funksiyasi
const verifyToken = (token: string): any => {
  try {
    // Amaliy loyihada bu server tomonida tekshirilishi kerak
    return JSON.parse(atob(token))
  } catch (error) {
    console.error("Token verification failed", error)
    return null
  }
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user is logged in from token in sessionStorage
      try {
        const token = sessionStorage.getItem("authToken")
        if (token) {
          const userData = verifyToken(token)
          if (userData) {
            // Get full user data from localStorage (in real app, this would be from API)
            const users = getAllUsers()
            const foundUser = users.find((u) => u.id === userData.id)
            if (foundUser && foundUser.active) {
              setUser(foundUser)
            } else {
              // Token valid but user not found or inactive
              sessionStorage.removeItem("authToken")
            }
          } else {
            // Invalid token
            sessionStorage.removeItem("authToken")
          }
        }
      } catch (error) {
        console.error("Failed to parse stored token", error)
        sessionStorage.removeItem("authToken")
      }
    }

    setIsLoading(false)
  }, [])

  // Get all registered users from localStorage
  const getAllUsers = (): User[] => {
    if (typeof window === "undefined") return []

    try {
      const storedUsers = localStorage.getItem("registeredUsers")
      if (storedUsers) {
        return JSON.parse(storedUsers)
      }
    } catch (error) {
      console.error("Failed to get registered users", error)
    }
    return []
  }

  // Register a new user
  const registerUser = (newUser: Omit<User, "id" | "registeredAt" | "permissions" | "active">) => {
    if (typeof window === "undefined") {
      return {
        id: 0,
        username: "",
        name: "",
        email: "",
        phone: "",
        role: "user",
        permissions: [],
        active: false,
      }
    }

    try {
      const users = getAllUsers()
      const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

      // Assign default permissions based on role
      const permissions = DEFAULT_PERMISSIONS[newUser.role] || []

      const userWithId: User = {
        ...newUser,
        id,
        registeredAt: new Date().toISOString(),
        permissions,
        active: true,
      }

      const updatedUsers = [...users, userWithId]
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      return userWithId
    } catch (error) {
      console.error("Failed to register user", error)
      return {
        id: 0,
        username: "",
        name: "",
        email: "",
        phone: "",
        role: "user",
        permissions: [],
        active: false,
      }
    }
  }

  // Modify the login function to only allow existing users or predefined credentials
  const login = async (username: string, password: string): Promise<boolean> => {
    if (typeof window === "undefined") return false

    setIsLoading(true)

    try {
      // Get all registered users
      const users = getAllUsers()

      // Check if user exists
      const existingUser = users.find((u) => u.username === username)

      if (existingUser) {
        // In a real app, you would check the password here
        // For demo purposes, we're just checking if the user exists

        // Check if user is active
        if (!existingUser.active) {
          toast({
            title: t("accountInactive"),
            description: t("accountInactiveDescription"),
            variant: "destructive",
          })
          setIsLoading(false)
          return false
        }

        // Create and store JWT token
        const token = generateToken(existingUser)
        sessionStorage.setItem("authToken", token)

        setUser(existingUser)

        // Restore language preference after login
        const userLanguage = localStorage.getItem("profileLanguage") || localStorage.getItem("language") || "uz"
        localStorage.setItem("language", userLanguage)

        // Trigger language change event
        if (typeof window !== "undefined") {
          const event = new CustomEvent("languageChanged", { detail: userLanguage })
          window.dispatchEvent(event)
        }

        setIsLoading(false)
        return true
      }

      // If this is a first-time login with predefined credentials
      if (username === "admin" && password === "admin123") {
        const adminUser: User = {
          id: 1,
          username: "admin",
          name: "Admin User",
          email: "admin@example.com",
          phone: "+998 90 123 45 67",
          role: "admin",
          avatar: "/placeholder.svg?height=100&width=100",
          registeredAt: new Date().toISOString(),
          permissions: DEFAULT_PERMISSIONS.admin,
          active: true,
        }

        setUser(adminUser)

        // Create and store JWT token
        const token = generateToken(adminUser)
        sessionStorage.setItem("authToken", token)

        // Add admin to registered users if not already there
        if (!users.some((u) => u.username === "admin")) {
          const updatedUsers = [...users, adminUser]
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        }

        setIsLoading(false)
        return true
      } else if (username === "hr" && password === "hr123") {
        const hrUser: User = {
          id: 2,
          username: "hr",
          name: "HR Manager",
          email: "hr@example.com",
          phone: "+998 90 234 56 78",
          role: "hr_manager",
          avatar: "/placeholder.svg?height=100&width=100",
          registeredAt: new Date().toISOString(),
          permissions: DEFAULT_PERMISSIONS.hr_manager,
          active: true,
        }

        setUser(hrUser)

        // Create and store JWT token
        const token = generateToken(hrUser)
        sessionStorage.setItem("authToken", token)

        // Add HR to registered users if not already there
        if (!users.some((u) => u.username === "hr")) {
          const updatedUsers = [...users, hrUser]
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        }

        setIsLoading(false)
        return true
      } else if (username === "english" && password === "english123") {
        const englishTeacher: User = {
          id: 3,
          username: "english",
          name: "English Teacher",
          email: "english@example.com",
          phone: "+998 90 345 67 89",
          role: "english_teacher",
          avatar: "/placeholder.svg?height=100&width=100",
          registeredAt: new Date().toISOString(),
          permissions: DEFAULT_PERMISSIONS.english_teacher,
          active: true,
        }

        setUser(englishTeacher)

        // Create and store JWT token
        const token = generateToken(englishTeacher)
        sessionStorage.setItem("authToken", token)

        // Add English teacher to registered users if not already there
        if (!users.some((u) => u.username === "english")) {
          const updatedUsers = [...users, englishTeacher]
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        }

        setIsLoading(false)
        return true
      } else if (username === "it" && password === "it123") {
        const itTeacher: User = {
          id: 4,
          username: "it",
          name: "IT Teacher",
          email: "it@example.com",
          phone: "+998 90 456 78 90",
          role: "it_teacher",
          avatar: "/placeholder.svg?height=100&width=100",
          registeredAt: new Date().toISOString(),
          permissions: DEFAULT_PERMISSIONS.it_teacher,
          active: true,
        }

        setUser(itTeacher)

        // Create and store JWT token
        const token = generateToken(itTeacher)
        sessionStorage.setItem("authToken", token)

        // Add IT teacher to registered users if not already there
        if (!users.some((u) => u.username === "it")) {
          const updatedUsers = [...users, itTeacher]
          localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        }

        setIsLoading(false)
        return true
      }

      // If we get here, the login failed
      toast({
        title: t("loginFailed"),
        description: t("usernameOrPasswordIncorrect"),
        variant: "destructive",
      })

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const updateUser = (updatedUser: User) => {
    if (typeof window === "undefined") return

    setUser(updatedUser)

    // Update token with new user data
    const token = generateToken(updatedUser)
    sessionStorage.setItem("authToken", token)

    // Also update the user in the registered users list
    try {
      const users = getAllUsers()
      const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
    } catch (error) {
      console.error("Failed to update user in registered users", error)
    }
  }

  const updateUserPermissions = (userId: number, permissions: string[]) => {
    if (typeof window === "undefined") return

    try {
      const users = getAllUsers()
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          return { ...u, permissions }
        }
        return u
      })

      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      // If the current user's permissions are being updated, update the current user state
      if (user && user.id === userId) {
        const updatedUser = { ...user, permissions }
        setUser(updatedUser)

        // Update token with new permissions
        const token = generateToken(updatedUser)
        sessionStorage.setItem("authToken", token)
      }

      toast({
        title: "Ruxsatlar yangilandi",
        description: "Foydalanuvchi ruxsatlari muvaffaqiyatli yangilandi",
      })
    } catch (error) {
      console.error("Failed to update user permissions:", error)
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi ruxsatlarini yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const toggleUserActive = (userId: number, active: boolean) => {
    if (typeof window === "undefined") return

    try {
      const users = getAllUsers()
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          return { ...u, active }
        }
        return u
      })

      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      toast({
        title: active ? "Foydalanuvchi faollashtirildi" : "Foydalanuvchi o'chirildi",
        description: active
          ? "Foydalanuvchi muvaffaqiyatli faollashtirildi"
          : "Foydalanuvchi muvaffaqiyatli o'chirildi",
      })
    } catch (error) {
      console.error("Failed to toggle user active state:", error)
      toast({
        title: "Xatolik",
        description: "Foydalanuvchi holatini o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const logout = () => {
    if (typeof window === "undefined") return

    setUser(null)
    sessionStorage.removeItem("authToken")
    router.push("/")
    toast({
      title: "Chiqish",
      description: "Siz tizimdan muvaffaqiyatli chiqdingiz",
    })
  }

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isStaff:
          user?.role === "admin" ||
          user?.role === "hr_manager" ||
          user?.role === "english_teacher" ||
          user?.role === "it_teacher",
        hasPermission,
        getAllUsers,
        registerUser,
        updateUserPermissions,
        toggleUserActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

