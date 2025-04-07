"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { registerUser, getAllUsers } = useAuth()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id === "first-name"
        ? "firstName"
        : id === "last-name"
          ? "lastName"
          : id === "confirm-password"
            ? "confirmPassword"
            : id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast({
        title: t("error"),
        description: t("fillAllFields"),
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwordsDoNotMatch"),
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t("error"),
        description: t("invalidEmailFormat"),
        variant: "destructive",
      })
      return
    }

    // Validate phone format (simple check)
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: t("error"),
        description: t("invalidPhoneFormat"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save current language before registration
      if (typeof window !== "undefined") {
        try {
          const currentLanguage = localStorage.getItem("language") || "uz"
          localStorage.setItem("profileLanguage", currentLanguage)
        } catch (error) {
          console.error("Error saving language preference:", error)
        }
      }

      // Generate username from email if not provided
      const username = formData.email.split("@")[0]

      // Check if username already exists
      const users = getAllUsers()
      const usernameExists = users.some((user) => user.username === username)

      if (usernameExists) {
        toast({
          title: t("error"),
          description: t("usernameAlreadyExists"),
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Check if email already exists
      const emailExists = users.some((user) => user.email === formData.email)

      if (emailExists) {
        toast({
          title: t("error"),
          description: t("emailAlreadyExists"),
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Register user
      const newUser = registerUser({
        username: username,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        role: "user",
      })

      if (newUser && newUser.id) {
        toast({
          title: t("success"),
          description: t("registrationSuccessful"),
        })

        // Redirect to login page after successful registration
        setTimeout(() => {
          try {
            router.push("/login")
          } catch (error) {
            console.error("Error during navigation:", error)
          }
        }, 500)
      } else {
        toast({
          title: t("error"),
          description: t("registrationError"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: t("error"),
        description: t("registrationError"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("register")}</CardTitle>
            <CardDescription>{t("enterYourInformation")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">{t("firstName")}</Label>
                <Input
                  id="first-name"
                  placeholder={t("firstNamePlaceholder")}
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">{t("lastName")}</Label>
                <Input
                  id="last-name"
                  placeholder={t("lastNamePlaceholder")}
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                placeholder={t("phonePlaceholder")}
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" required value={formData.password} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("registering") : t("register")}
            </Button>
            <div className="mt-4 text-center text-sm">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/login" className="underline text-primary">
                {t("login")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

