"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Plus, Search, Trash, User, Edit, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useLanguage } from "@/context/language-context"
import { useNotification } from "@/context/notification-context"
import { useAdminLanguage } from "@/context/admin-language-context"

type JobType = "full-time" | "part-time" | "contract" | "remote"

interface JobData {
  id: string
  title: string
  company: string
  location: string
  type: JobType
  salary: string
  description: string
  requirements: string[]
  createdAt: string
  isActive: boolean
}

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
}

export default function AdminJobsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { t: languageT } = useLanguage()
  const { addNotification } = useNotification()
  const { t } = useAdminLanguage()

  const [searchQuery, setSearchQuery] = useState("")
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [activeTab, setActiveTab] = useState("jobs")
  const [jobs, setJobs] = useState<JobData[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)

  // Load jobs and applications from localStorage
  useEffect(() => {
    try {
      // Load jobs
      const storedJobs = localStorage.getItem("jobs")
      if (storedJobs) {
        const parsedJobs = JSON.parse(storedJobs)
        setJobs(parsedJobs)
        setFilteredJobs(parsedJobs)
      } else {
        setJobs([])
        setFilteredJobs([])
      }

      // Load applications
      const storedApplications = localStorage.getItem("jobApplications")
      if (storedApplications) {
        const parsedApplications = JSON.parse(storedApplications)
        setApplications(parsedApplications)
        setFilteredApplications(parsedApplications)
      } else {
        setApplications([])
        setFilteredApplications([])
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }, [toast, t])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (activeTab === "applications") {
      if (query.trim() === "") {
        setFilteredApplications(applications)
      } else {
        const filtered = applications.filter(
          (app) =>
            app.firstName.toLowerCase().includes(query) ||
            app.lastName.toLowerCase().includes(query) ||
            app.email.toLowerCase().includes(query) ||
            app.jobTitle.toLowerCase().includes(query),
        )
        setFilteredApplications(filtered)
      }
    } else {
      if (query.trim() === "") {
        setFilteredJobs(jobs)
      } else {
        const filtered = jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query),
        )
        setFilteredJobs(filtered)
      }
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchQuery("")

    if (value === "applications") {
      setFilteredApplications(applications)
    } else {
      setFilteredJobs(jobs)
    }
  }

  const viewApplication = (applicationId: string) => {
    // Instead of opening a dialog, navigate to a dedicated page
    router.push(`/admin/jobs/applications/${applicationId}`)
  }

  const confirmDeleteJob = (id: string) => {
    setJobToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const deleteJob = () => {
    if (!jobToDelete) return

    try {
      // Filter out the job to delete
      const updatedJobs = jobs.filter((job) => job.id !== jobToDelete)

      // Update state
      setJobs(updatedJobs)
      setFilteredJobs(
        updatedJobs.filter((job) => {
          // Apply current search filter
          return (
            searchQuery.trim() === "" ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }),
      )

      // Update localStorage
      localStorage.setItem("jobs", JSON.stringify(updatedJobs))

      // Add notification
      addNotification({
        userId: null,
        title: "Ish e'loni o'chirildi",
        message: "Ish e'loni tizimdan o'chirildi",
        type: "job",
      })

      toast({
        title: "Ish e'loni o'chirildi",
        description: "Ish e'loni muvaffaqiyatli o'chirildi",
      })
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast({
        title: "Xatolik",
        description: "Ish e'lonini o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setJobToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusBadge = (status: JobApplication["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">{t("new")}</Badge>
      case "reviewed":
        return <Badge className="bg-yellow-500">{t("reviewed")}</Badge>
      case "interviewed":
        return <Badge className="bg-purple-500">{t("interviewed")}</Badge>
      case "accepted":
        return <Badge className="bg-green-500">{t("accepted")}</Badge>
      case "rejected":
        return <Badge className="bg-red-500">{t("rejected")}</Badge>
      default:
        return <Badge>{t("unknown")}</Badge>
    }
  }

  const getJobTypeBadge = (type: JobType) => {
    switch (type) {
      case "full-time":
        return <Badge className="bg-green-500">{t("fullTime")}</Badge>
      case "part-time":
        return <Badge className="bg-blue-500">{t("partTime")}</Badge>
      case "contract":
        return <Badge className="bg-yellow-500">{t("contract")}</Badge>
      case "remote":
        return <Badge className="bg-purple-500">{t("remote")}</Badge>
      default:
        return <Badge>{t("unknown")}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="flex-1">
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{t("jobManagement")}</h1>
            </div>
            <Link href="/admin/jobs/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("addNewJob")}
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab === "applications" ? t("searchApplications") : t("searchJobs")}
                  className="pl-10"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="jobs" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="jobs">{t("jobListings")}</TabsTrigger>
              <TabsTrigger value="applications">{t("applications")}</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>{t("jobListings")}</CardTitle>
                  <CardDescription>{t("manageJobListings")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredJobs.length > 0 ? (
                    <div className="rounded-md border overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-left font-medium">{t("position")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("company")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("location")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("jobType")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("salary")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("status")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredJobs.map((job, i) => (
                            <tr key={job.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                              <td className="py-3 px-4">{job.title}</td>
                              <td className="py-3 px-4">{job.company}</td>
                              <td className="py-3 px-4">{job.location}</td>
                              <td className="py-3 px-4">{getJobTypeBadge(job.type)}</td>
                              <td className="py-3 px-4">{job.salary}</td>
                              <td className="py-3 px-4">
                                <Badge className={job.isActive ? "bg-green-500" : "bg-gray-500"}>
                                  {job.isActive ? t("active") : t("inactive")}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/admin/jobs/edit/${job.id}`)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    {t("edit")}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => confirmDeleteJob(job.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-1" />
                                    {t("delete")}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">{t("noJobListingsFound")}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{t("noJobListingsYet")}</p>
                      <Button className="mt-4" onClick={() => router.push("/admin/jobs/add")}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("addFirstJobListing")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>{t("applications")}</CardTitle>
                  <CardDescription>{t("manageApplications")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredApplications.length > 0 ? (
                    <div className="rounded-md border overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="py-3 px-4 text-left font-medium">{t("applicationID")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("name")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("position")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("date")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("status")}</th>
                            <th className="py-3 px-4 text-left font-medium">{t("actions")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredApplications.map((application, i) => (
                            <tr key={application.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                              <td className="py-3 px-4">#{application.id.slice(0, 8)}</td>
                              <td className="py-3 px-4">
                                {application.firstName} {application.lastName}
                              </td>
                              <td className="py-3 px-4">{application.jobTitle}</td>
                              <td className="py-3 px-4">{new Date(application.submittedAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4">{getStatusBadge(application.status)}</td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" onClick={() => viewApplication(application.id)}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    {t("view")}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">{t("noApplicationsFound")}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{t("noApplicationsYet")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t("deleteJobListing")}
        description={t("deleteJobConfirmation")}
        onConfirm={deleteJob}
      />
    </div>
  )
}

