"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { Download, Eye } from "lucide-react"

export default function CertificatesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  // Mock data for certificates
  const certificates = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      issueDate: "2023-01-15",
      expiryDate: "2026-01-15",
      credentialId: "JS-FUND-123456",
      issuer: "IT English Academy",
      category: "Programming",
    },
    {
      id: 2,
      title: "IT English Vocabulary",
      issueDate: "2023-03-10",
      expiryDate: "2026-03-10",
      credentialId: "IT-ENG-789012",
      issuer: "IT English Academy",
      category: "Language",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("my_certificates")}</h1>
          <p className="text-muted-foreground">{t("view_and_download_certificates")}</p>
        </div>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
              <p className="text-muted-foreground text-center">{t("no_certificates")}</p>
              <Button onClick={() => router.push("/courses")}>{t("browse_courses")}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{certificate.title}</CardTitle>
                      <CardDescription className="mt-1">{t("certificate_of_completion")}</CardDescription>
                    </div>
                    <Badge>{certificate.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">{t("issue_date")}</p>
                        <p className="text-muted-foreground">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">{t("expiry_date")}</p>
                        <p className="text-muted-foreground">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{t("credential_id")}</p>
                      <p className="text-muted-foreground">{certificate.credentialId}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{t("issuer")}</p>
                      <p className="text-muted-foreground">{certificate.issuer}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    {t("view")}
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    {t("download")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

