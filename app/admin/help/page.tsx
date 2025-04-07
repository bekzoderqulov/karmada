"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Mail,
  MessageSquare,
  Phone,
  BookOpen,
  Users,
  FileText,
  CreditCard,
  Settings,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAdminLanguage } from "@/context/admin-language-context"

export default function HelpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useAdminLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: t("messageSent"),
      description: t("messageSuccessfullySent"),
    })
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{t("helpAndSupport")}</h1>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchHelpPlaceholder")}
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">{t("faq")}</TabsTrigger>
          <TabsTrigger value="guides">{t("guides")}</TabsTrigger>
          <TabsTrigger value="contact">{t("contactSupport")}</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("faq")}</CardTitle>
              <CardDescription>{t("faqDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>{t("howToAddCourse")}</AccordionTrigger>
                  <AccordionContent>{t("howToAddCourseAnswer")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>{t("howToChangeUserPermissions")}</AccordionTrigger>
                  <AccordionContent>{t("howToChangeUserPermissionsAnswer")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>{t("howToDownloadReports")}</AccordionTrigger>
                  <AccordionContent>{t("howToDownloadReportsAnswer")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>{t("whatToDoWhenError")}</AccordionTrigger>
                  <AccordionContent>{t("whatToDoWhenErrorAnswer")}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>{t("howToChangeLanguage")}</AccordionTrigger>
                  <AccordionContent>{t("howToChangeLanguageAnswer")}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("guides")}</CardTitle>
              <CardDescription>{t("guidesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: t("courseManagementGuide"),
                    description: t("courseManagementGuideDescription"),
                    icon: <BookOpen className="h-8 w-8 text-primary" />,
                  },
                  {
                    title: t("userManagementGuide"),
                    description: t("userManagementGuideDescription"),
                    icon: <Users className="h-8 w-8 text-primary" />,
                  },
                  {
                    title: t("reportsGuide"),
                    description: t("reportsGuideDescription"),
                    icon: <FileText className="h-8 w-8 text-primary" />,
                  },
                  {
                    title: t("paymentsGuide"),
                    description: t("paymentsGuideDescription"),
                    icon: <CreditCard className="h-8 w-8 text-primary" />,
                  },
                  {
                    title: t("messagesGuide"),
                    description: t("messagesGuideDescription"),
                    icon: <MessageSquare className="h-8 w-8 text-primary" />,
                  },
                  {
                    title: t("systemSettingsGuide"),
                    description: t("systemSettingsGuideDescription"),
                    icon: <Settings className="h-8 w-8 text-primary" />,
                  },
                ].map((guide, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <div className="h-8 w-8 flex items-center justify-center">{guide.icon}</div>
                      </div>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        {t("viewGuide")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("contactSupport")}</CardTitle>
              <CardDescription>{t("contactSupportDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t("byEmail")}</h3>
                      <p className="text-sm text-muted-foreground">support@itenglish.uz</p>
                      <p className="text-sm text-muted-foreground">{t("responseTime24Hours")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t("byPhone")}</h3>
                      <p className="text-sm text-muted-foreground">+998 90 123 45 67</p>
                      <p className="text-sm text-muted-foreground">{t("workingHours")}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">{t("byChat")}</h3>
                      <p className="text-sm text-muted-foreground">{t("byChatDescription")}</p>
                      <p className="text-sm text-muted-foreground">{t("forQuickResponse")}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          {t("yourName")}
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          {t("email")}
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        {t("subject")}
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        {t("message")}
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={handleContactFormChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {t("sendMessage")}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

