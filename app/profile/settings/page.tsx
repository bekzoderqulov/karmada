"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return <div className="container mx-auto py-10">{t("loading")}</div>
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "uz" | "ru" | "en")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1>
          <p className="text-muted-foreground">{t("manage account settings")}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
            <TabsTrigger value="account">{t("account")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profile information")}</CardTitle>
                <CardDescription>{t("update profile information")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      {t("change avatar")}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t("remove avatar")}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("first name")}</Label>
                    <Input id="firstName" defaultValue={user?.name?.split(" ")[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("last name")}</Label>
                    <Input id="lastName" defaultValue={user?.name?.split(" ")[1]} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t("bio")}</Label>
                  <Textarea id="bio" placeholder={t("tell us about yourself")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t("preferred language")}</Label>
                  <Select defaultValue={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t("select language")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="uz">O'zbek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">{t("cancel")}</Button>
                <Button>{t("save changes")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="account" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("account settings")}</CardTitle>
                <CardDescription>{t("update account settings")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("change password")}</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t("current password")}</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("new password")}</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("confirm password")}</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("danger zone")}</h3>
                  <p className="text-sm text-muted-foreground">{t("danger zone description")}</p>
                  <Button variant="destructive">{t("delete account")}</Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">{t("cancel")}</Button>
                <Button>{t("save changes")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("notification settings")}</CardTitle>
                <CardDescription>{t("manage notification preferences")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: "email", title: t("email notifications"), description: t("receive email notifications") },
                    { id: "push", title: t("push notifications"), description: t("receive push notifications") },
                    { id: "marketing", title: t("marketing emails"), description: t("receive marketing emails") },
                    { id: "updates", title: t("course updates"), description: t("receive course updates") },
                    { id: "reminders", title: t("lesson reminders"), description: t("receive lesson reminders") },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.title}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch id={item.id} defaultChecked={item.id !== "marketing"} />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">{t("cancel")}</Button>
                <Button>{t("save changes")}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

