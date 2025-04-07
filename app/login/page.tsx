"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      setError(t("usernameAndPasswordRequired"))
      return
    }

    setLoading(true)
    setError("")

    try {
      // Save current language before login attempt
      if (typeof window !== "undefined") {
        try {
          const currentLanguage = localStorage.getItem("language") || "uz"
          localStorage.setItem("profileLanguage", currentLanguage)
        } catch (error) {
          console.error("Error saving language preference:", error)
        }
      }

      const success = await login(formData.username, formData.password)

      if (success) {
        toast({
          title: t("loginSuccess"),
          description: formData.username === "admin" ? t("adminPanelOpening") : t("loginSuccessful"),
        })

        // Use setTimeout to avoid state updates after component unmount
        setTimeout(() => {
          try {
            if (formData.username === "admin") {
              router.push("/admin")
            } else if (formData.username === "hr") {
              router.push("/admin/jobs")
            } else if (formData.username === "english" || formData.username === "it") {
              router.push("/admin/courses")
            } else {
              router.push("/profile")
            }
          } catch (error) {
            console.error("Error during navigation:", error)
          }
        }, 500)
      } else {
        setError(t("usernameOrPasswordIncorrect"))
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(t("loginError"))
      toast({
        title: t("error"),
        description: t("loginError"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <CardDescription>{t("enterYourCredentials")}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t("usernamePlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("password")}</Label>
                <Link href="/forgot-password" className="text-sm text-primary">
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? t("loggingIn") : t("login")}
            </Button>
            <div className="mt-4 text-center text-sm">
              {t("noAccount")}{" "}
              <Link href="/register" className="underline text-primary">
                {t("register")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

