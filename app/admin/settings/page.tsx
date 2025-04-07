"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAdminLanguage } from "@/context/admin-language-context"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const { t } = useAdminLanguage()

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "IT English Academy",
    siteDescription: "IT mutaxassislari uchun ingliz tili va IT kurslari",
    contactEmail: "info@itenglish.academy",
    contactPhone: "+998 90 123 45 67",
    address: "Toshkent sh., IT City, 3-bino",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserNotifications: true,
    newOrderNotifications: true,
    marketingEmails: false,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    clickEnabled: true,
    clickMerchantId: "12345",
    clickSecretKey: "********",
    paymeEnabled: true,
    paymeMerchantId: "67890",
    paymeSecretKey: "********",
    bankTransferEnabled: true,
    bankDetails: "Hamkorbank\nHisob raqami: 12345678901234567890\nMFO: 12345",
    cashEnabled: true,
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPaymentSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentToggle = (setting: string, value: boolean) => {
    setPaymentSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleSaveSettings = () => {
    toast({
      title: t("settingsSaved"),
      description: t("allSettingsSavedSuccessfully"),
    })
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="flex-1">
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{t("systemSettings")}</h1>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-4 gap-1">
              <TabsTrigger value="general" className="text-xs">
                {t("generalSettings")}
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs">
                {t("notificationSettings")}
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs">
                {t("paymentSettings")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{t("generalSettings")}</CardTitle>
                  <CardDescription className="text-xs">{t("changeBasicInformationForSite")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="siteName">{t("siteName")}</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralSettingsChange}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="siteDescription">{t("siteDescription")}</Label>
                    <Textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralSettingsChange}
                      className="text-xs min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralSettingsChange}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contactPhone">{t("contactPhone")}</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={handleGeneralSettingsChange}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="address">{t("address")}</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralSettingsChange}
                      className="text-xs min-h-[60px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} size="sm" className="text-xs h-8">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    {t("save")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{t("notificationSettings")}</CardTitle>
                  <CardDescription className="text-xs">{t("chooseNotificationsToReceive")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-xs">{t("emailNotifications")}</h3>
                      <p className="text-[10px] text-muted-foreground">{t("receiveSystemNotificationsViaEmail")}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-xs">{t("newUserNotifications")}</h3>
                      <p className="text-[10px] text-muted-foreground">
                        {t("receiveNotificationWhenNewUserRegisters")}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newUserNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("newUserNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-xs">{t("newOrderNotifications")}</h3>
                      <p className="text-[10px] text-muted-foreground">{t("receiveNotificationWhenNewOrderPlaced")}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newOrderNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange("newOrderNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-xs">{t("marketingEmails")}</h3>
                      <p className="text-[10px] text-muted-foreground">{t("receiveMarketingAndNewsEmails")}</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationSettingChange("marketingEmails", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} size="sm" className="text-xs h-8">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    {t("save")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{t("paymentSettings")}</CardTitle>
                  <CardDescription className="text-xs">{t("configurePaymentMethods")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-xs">Click</h3>
                      </div>
                      <Switch
                        checked={paymentSettings.clickEnabled}
                        onCheckedChange={(checked) => handlePaymentToggle("clickEnabled", checked)}
                      />
                    </div>

                    {paymentSettings.clickEnabled && (
                      <div className="space-y-3 pl-0 sm:pl-4 border-l-0 sm:border-l-2 sm:border-muted">
                        <div className="space-y-1">
                          <Label htmlFor="clickMerchantId">Merchant ID</Label>
                          <Input
                            id="clickMerchantId"
                            name="clickMerchantId"
                            value={paymentSettings.clickMerchantId}
                            onChange={handlePaymentSettingsChange}
                            className="h-8 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="clickSecretKey">Secret Key</Label>
                          <Input
                            id="clickSecretKey"
                            name="clickSecretKey"
                            type="password"
                            value={paymentSettings.clickSecretKey}
                            onChange={handlePaymentSettingsChange}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-xs">Payme</h3>
                      </div>
                      <Switch
                        checked={paymentSettings.paymeEnabled}
                        onCheckedChange={(checked) => handlePaymentToggle("paymeEnabled", checked)}
                      />
                    </div>

                    {paymentSettings.paymeEnabled && (
                      <div className="space-y-3 pl-0 sm:pl-4 border-l-0 sm:border-l-2 sm:border-muted">
                        <div className="space-y-1">
                          <Label htmlFor="paymeMerchantId">Merchant ID</Label>
                          <Input
                            id="paymeMerchantId"
                            name="paymeMerchantId"
                            value={paymentSettings.paymeMerchantId}
                            onChange={handlePaymentSettingsChange}
                            className="h-8 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="paymeSecretKey">Secret Key</Label>
                          <Input
                            id="paymeSecretKey"
                            name="paymeSecretKey"
                            type="password"
                            value={paymentSettings.paymeSecretKey}
                            onChange={handlePaymentSettingsChange}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-xs">{t("bankTransfer")}</h3>
                      </div>
                      <Switch
                        checked={paymentSettings.bankTransferEnabled}
                        onCheckedChange={(checked) => handlePaymentToggle("bankTransferEnabled", checked)}
                      />
                    </div>

                    {paymentSettings.bankTransferEnabled && (
                      <div className="space-y-3 pl-0 sm:pl-4 border-l-0 sm:border-l-2 sm:border-muted">
                        <div className="space-y-1">
                          <Label htmlFor="bankDetails">{t("bankDetails")}</Label>
                          <Textarea
                            id="bankDetails"
                            name="bankDetails"
                            value={paymentSettings.bankDetails}
                            onChange={handlePaymentSettingsChange}
                            className="text-xs min-h-[60px]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-xs">{t("cash")}</h3>
                    </div>
                    <Switch
                      checked={paymentSettings.cashEnabled}
                      onCheckedChange={(checked) => handlePaymentToggle("cashEnabled", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} size="sm" className="text-xs h-8">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    {t("save")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

