"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"
import { useAdminLanguage } from "@/context/admin-language-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

type JobApplication = {
  id: string
  jobId: string
  jobTitle: string
  firstName: string
  lastName: string
  email: string
  phone: string
  coverLetter: string
  resume: string
  passport: string
  diploma: string
  certificates: string[]
  status: "new" | "reviewed" | "interviewed" | "accepted" | "rejected"
  submittedAt: string
  userId?: string
  position?: string
  statusHistory?: { status: string; date: string; by: string }[]
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { t, language } = useAdminLanguage()
  const { toast } = useToast()
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const applicationId = params.id // Access id directly

  useEffect(() => {
    const loadApplication = () => {
      try {
        const storedApplications = localStorage.getItem("jobApplications")

        if (storedApplications) {
          const parsedApplications: JobApplication[] = JSON.parse(storedApplications)
          const foundApplication = parsedApplications.find((app) => app.id === applicationId)

          if (foundApplication) {
            setApplication(foundApplication)
          } else {
            toast({
              title: t("error"),
              description: t("applicationNotFound"),
              variant: "destructive",
            })
            router.push("/admin/jobs")
          }
        } else {
          toast({
            title: t("error"),
            description: t("noApplicationsFound"),
            variant: "destructive",
          })
          router.push("/admin/jobs")
        }
      } catch (error) {
        console.error("Failed to load application:", error)
        toast({
          title: t("error"),
          description: t("failedToLoadApplication"),
          variant: "destructive",
        })
        router.push("/admin/jobs")
      } finally {
        setIsLoading(false)
      }
    }

    loadApplication()
  }, [applicationId, router, toast, t])

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      // Get applications from localStorage
      const storedApplications = localStorage.getItem("jobApplications")
      if (storedApplications) {
        const applications = JSON.parse(storedApplications)

        // Find and update the application
        const updatedApplications = applications.map((app: any) => {
          if (app.id === params.id) {
            return {
              ...app,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...(app.statusHistory || []),
                {
                  status: newStatus,
                  date: new Date().toISOString(),
                  by: "Admin", // In a real app, use the actual admin name
                },
              ],
            }
          }
          return app
        })

        // Save updated applications
        localStorage.setItem("jobApplications", JSON.stringify(updatedApplications))

        // Update local state
        setApplication((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                statusHistory: [
                  ...(prev.statusHistory || []),
                  {
                    status: newStatus,
                    date: new Date().toISOString(),
                    by: "Admin", // In a real app, use the actual admin name
                  },
                ],
              }
            : null,
        )

        // Add notification for the applicant
        try {
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
          notifications.push({
            id: Date.now(),
            userId: application?.userId || null,
            title: t("applicationStatusUpdated"),
            message: `${t("yourApplicationFor")} ${application?.position || t("job")} ${t("hasBeenUpdatedTo")} ${newStatus}`,
            type: "job",
            read: false,
            createdAt: new Date().toISOString(),
          })
          localStorage.setItem("notifications", JSON.stringify(notifications))
        } catch (e) {
          console.error("Failed to create notification:", e)
        }

        toast({
          title: t("statusUpdated"),
          description: t("applicationStatusUpdatedSuccessfully"),
        })
      }
    } catch (error) {
      console.error("Failed to update application status:", error)
      toast({
        title: t("error"),
        description: t("failedToUpdateApplicationStatus"),
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const updateApplicationStatus = (status: JobApplication["status"]) => {
    handleStatusChange(status)
  }

  const getStatusBadge = (status: JobApplication["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">{t("statusNew")}</Badge>
      case "reviewed":
        return <Badge className="bg-yellow-500">{t("statusReviewed")}</Badge>
      case "interviewed":
        return <Badge className="bg-purple-500">{t("statusInterviewed")}</Badge>
      case "accepted":
        return <Badge className="bg-green-500">{t("statusAccepted")}</Badge>
      case "rejected":
        return <Badge className="bg-red-500">{t("statusRejected")}</Badge>
      default:
        return <Badge>{t("statusUnknown")}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p>{t("loading")}</p>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p>{t("applicationNotFound")}</p>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-2" onClick={() => router.push("/admin/jobs")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{t("applicationDetails")}</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              <div className="flex items-center gap-2">
                <span>#{application.id.slice(0, 8)}</span>
                {getStatusBadge(application.status)}
              </div>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {t("submittedDate")}: {new Date(application.submittedAt).toLocaleString()}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t("positionDetails")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{application.jobTitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium">{t("personalInformation")}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>
                        {application.firstName[0]}
                        {application.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {application.firstName} {application.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{application.email}</p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{t("phone")}:</span> {application.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">{t("status")}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={application.status === "new" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus("new")}
                    >
                      {t("statusNew")}
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "reviewed" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus("reviewed")}
                    >
                      {t("statusReviewed")}
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "interviewed" ? "default" : "outline"}
                      onClick={() => updateApplicationStatus("interviewed")}
                    >
                      {t("statusInterviewed")}
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "accepted" ? "default" : "outline"}
                      className={application.status === "accepted" ? "bg-green-600" : ""}
                      onClick={() => updateApplicationStatus("accepted")}
                    >
                      {t("statusAccepted")}
                    </Button>
                    <Button
                      size="sm"
                      variant={application.status === "rejected" ? "default" : "outline"}
                      className={application.status === "rejected" ? "bg-red-600" : ""}
                      onClick={() => updateApplicationStatus("rejected")}
                    >
                      {t("statusRejected")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">{t("motivationLetter")}</h3>
              <div className="mt-2 p-4 bg-muted rounded-md">
                <p className="whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">{t("documents")}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>{t("resume")}</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    {t("download")}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>{t("passport")}</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    {t("download")}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>{t("diploma")}</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    {t("download")}
                  </Button>
                </div>
                {application.certificates && application.certificates.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span>{t("certificates")}</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      {t("download")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

