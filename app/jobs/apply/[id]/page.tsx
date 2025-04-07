"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Upload } from "lucide-react"
import { useLanguage } from "@/context/language-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    passport: null,
    diploma: null,
    certificates: null,
  })

  // This would normally fetch the job details based on the ID
  const jobTitle = "Senior Frontend Developer"
  const company = "TechGlobal Inc."
  const jobId = params.id // Access id directly, not as params.id

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Form submitted:", formData)

    // Create a new job application
    const newApplication = {
      id: Date.now().toString(),
      jobId: jobId, // Use the extracted jobId
      jobTitle: jobTitle,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      coverLetter: formData.coverLetter,
      resume: formData.resume ? "resume.pdf" : "",
      passport: formData.passport ? "passport.pdf" : "",
      diploma: formData.diploma ? "diploma.pdf" : "",
      certificates: formData.certificates ? ["certificate.pdf"] : [],
      status: "new" as const,
      submittedAt: new Date().toISOString(),
    }

    // Save to localStorage
    try {
      const storedApplications = localStorage.getItem("jobApplications")
      const applications = storedApplications ? JSON.parse(storedApplications) : []
      applications.push(newApplication)
      localStorage.setItem("jobApplications", JSON.stringify(applications))
    } catch (error) {
      console.error("Failed to save application:", error)
    }

    // Show success message
    toast({
      title: t("applicationSubmitted"),
      description: t("applicationSubmittedSuccessfully"),
    })

    // Set submitted state to show confirmation
    setSubmitted(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      })
    }
  }

  if (submitted) {
    return (
      <div className="container py-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">{t("applicationSubmitted")}</CardTitle>
            <CardDescription>{t("thankYouForApplication", { jobTitle, company })}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">{t("applicationReceivedDescription")}</p>
            <div className="flex justify-center gap-4">
              <Link href="/jobs">
                <Button variant="outline">{t("viewOtherJobs")}</Button>
              </Link>
              <Link href="/">
                <Button>{t("backToHome")}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <Link href="/jobs" className="flex items-center text-blue-600 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToJobs")}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{t("applyForPosition", { jobTitle })}</CardTitle>
          <CardDescription>{t("fillFormToApply", { company })}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("personalInformation")}</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phoneNumber")}</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">{t("motivationLetter")}</Label>
                <Textarea
                  id="coverLetter"
                  placeholder={t("motivationLetterPlaceholder")}
                  className="min-h-[150px]"
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t("documents")}</h3>
              <p className="text-sm text-gray-500">{t("documentsDescription")}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">{t("resumeCV")}</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="resume"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "resume")}
                    />
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passport">{t("passportCopy")}</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="passport"
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "passport")}
                    />
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diploma">{t("diplomaCertificate")}</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="diploma"
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "diploma")}
                    />
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificates">{t("additionalCertificates")}</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="certificates"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "certificates")}
                    />
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("submitApplication")}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

