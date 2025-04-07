"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Globe, Image, FileText, Layout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import AdminSidebar from "@/components/admin-sidebar"
import { PERMISSIONS } from "@/context/auth-context"
import { useAdminLanguage } from "@/context/admin-language-context"

export default function WebsitePage() {
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const { t } = useAdminLanguage()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "IT English Academy",
    siteDescription: "IT mutaxassislari uchun ingliz tili va IT kurslari",
    contactEmail: "info@itenglish.academy",
    contactPhone: "+998 90 123 45 67",
    address: "Toshkent sh., IT City, 3-bino",
  })

  const [homePageSettings, setHomePageSettings] = useState({
    heroTitle: "Ingliz tili va IT kurslarini o'rganing",
    heroDescription: "IT mutaxassislari uchun ingliz tilini o'rganing va xalqaro ish imkoniyatlariga ega bo'ling",
    showFeaturedCourses: true,
    showTestimonials: true,
    showPartners: true,
  })

  const [socialMediaSettings, setSocialMediaSettings] = useState({
    facebook: "https://facebook.com/itenglishacademy",
    instagram: "https://instagram.com/itenglishacademy",
    telegram: "https://t.me/itenglishacademy",
    youtube: "https://youtube.com/itenglishacademy",
  })

  useEffect(() => {
    setMounted(true)

    // Check if user has permission to manage website settings
    if (!hasPermission(PERMISSIONS.MANAGE_SETTINGS)) {
      toast({
        title: t("accessDenied"),
        description: t("noPermissionWebsite"),
        variant: "destructive",
      })
    }

    // Load settings from localStorage
    try {
      const storedGeneralSettings = localStorage.getItem("websiteGeneralSettings")
      const storedHomePageSettings = localStorage.getItem("websiteHomePageSettings")
      const storedSocialMediaSettings = localStorage.getItem("websiteSocialMediaSettings")

      if (storedGeneralSettings) {
        setGeneralSettings(JSON.parse(storedGeneralSettings))
      }

      if (storedHomePageSettings) {
        setHomePageSettings(JSON.parse(storedHomePageSettings))
      }

      if (storedSocialMediaSettings) {
        setSocialMediaSettings(JSON.parse(storedSocialMediaSettings))
      }
    } catch (error) {
      console.error("Failed to load website settings:", error)
    }
  }, [hasPermission, toast, t])

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleHomePageSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setHomePageSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleHomePageToggleChange = (name: string, checked: boolean) => {
    setHomePageSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSocialMediaSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialMediaSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = (settingsType: string) => {
    setIsSubmitting(true)

    try {
      // Save settings to localStorage based on type
      if (settingsType === "general") {
        localStorage.setItem("websiteGeneralSettings", JSON.stringify(generalSettings))
      } else if (settingsType === "homePage") {
        localStorage.setItem("websiteHomePageSettings", JSON.stringify(homePageSettings))
      } else if (settingsType === "socialMedia") {
        localStorage.setItem("websiteSocialMediaSettings", JSON.stringify(socialMediaSettings))
      }

      toast({
        title: t("settingsSaved"),
        description: t("allSettingsSavedSuccessfully"),
      })
    } catch (error) {
      console.error("Failed to save website settings:", error)
      toast({
        title: t("error"),
        description: t("failedToSaveData"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If not mounted yet, return a placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-muted/20">
        <div className="w-64 bg-card border-r"></div>
        <div className="flex-1"></div>
      </div>
    )
  }

  // If user doesn't have permission, show access denied message
  if (!hasPermission(PERMISSIONS.MANAGE_SETTINGS)) {
    return (
      <div className="flex min-h-screen bg-muted/20">
        <AdminSidebar />
        <div className="flex-1">
          <div className="container py-8">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{t("websiteManagement")}</h1>
            </div>

            <Card>
              <CardContent className="py-10 text-center">
                <h2 className="text-xl font-bold mb-2">{t("accessDenied")}</h2>
                <p className="text-muted-foreground">{t("noPermissionWebsite")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="flex-1">
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t("websiteManagement")}</h1>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 gap-1">
              <TabsTrigger value="general">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("general")}</span>
                <span className="sm:hidden">{t("general")}</span>
              </TabsTrigger>
              <TabsTrigger value="homePage">
                <Layout className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("homePage")}</span>
                <span className="sm:hidden">{t("homePage")}</span>
              </TabsTrigger>
              <TabsTrigger value="socialMedia">
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("socialMedia")}</span>
                <span className="sm:hidden">{t("socialMedia")}</span>
              </TabsTrigger>
              <TabsTrigger value="media">
                <Image className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t("media")}</span>
                <span className="sm:hidden">{t("media")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>{t("generalSettings")}</CardTitle>
                  <CardDescription>{t("changeBasicInformationForSite")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">{t("siteName")}</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">{t("siteDescription")}</Label>
                    <Textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">{t("contactPhone")}</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t("address")}</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralSettingsChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("general")} disabled={isSubmitting}>
                    {isSubmitting ? (
                      t("saving")
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("save")}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="homePage">
              <Card>
                <CardHeader>
                  <CardTitle>{t("homepageSettings")}</CardTitle>
                  <CardDescription>{t("configureHomepage")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">{t("heroTitle")}</Label>
                    <Input
                      id="heroTitle"
                      name="heroTitle"
                      value={homePageSettings.heroTitle}
                      onChange={handleHomePageSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroDescription">{t("heroDescription")}</Label>
                    <Textarea
                      id="heroDescription"
                      name="heroDescription"
                      value={homePageSettings.heroDescription}
                      onChange={handleHomePageSettingsChange}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <Label htmlFor="showFeaturedCourses">{t("showFeaturedCourses")}</Label>
                      <p className="text-sm text-muted-foreground">{t("showFeaturedCoursesDescription")}</p>
                    </div>
                    <Switch
                      id="showFeaturedCourses"
                      checked={homePageSettings.showFeaturedCourses}
                      onCheckedChange={(checked) => handleHomePageToggleChange("showFeaturedCourses", checked)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <Label htmlFor="showTestimonials">{t("showTestimonials")}</Label>
                      <p className="text-sm text-muted-foreground">{t("showTestimonialsDescription")}</p>
                    </div>
                    <Switch
                      id="showTestimonials"
                      checked={homePageSettings.showTestimonials}
                      onCheckedChange={(checked) => handleHomePageToggleChange("showTestimonials", checked)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <Label htmlFor="showPartners">{t("showPartners")}</Label>
                      <p className="text-sm text-muted-foreground">{t("showPartnersDescription")}</p>
                    </div>
                    <Switch
                      id="showPartners"
                      checked={homePageSettings.showPartners}
                      onCheckedChange={(checked) => handleHomePageToggleChange("showPartners", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("homePage")} disabled={isSubmitting}>
                    {isSubmitting ? (
                      t("saving")
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("save")}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="socialMedia">
              <Card>
                <CardHeader>
                  <CardTitle>{t("socialMediaSettings")}</CardTitle>
                  <CardDescription>{t("configureSocialLinks")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={socialMediaSettings.facebook}
                      onChange={handleSocialMediaSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={socialMediaSettings.instagram}
                      onChange={handleSocialMediaSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      name="telegram"
                      value={socialMediaSettings.telegram}
                      onChange={handleSocialMediaSettingsChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      name="youtube"
                      value={socialMediaSettings.youtube}
                      onChange={handleSocialMediaSettingsChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveSettings("socialMedia")} disabled={isSubmitting}>
                    {isSubmitting ? (
                      t("saving")
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t("save")}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>{t("mediaSettings")}</CardTitle>
                  <CardDescription>{t("manageMediaFiles")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-10">{t("mediaManagementComingSoon")}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

