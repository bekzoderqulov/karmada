"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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

export default function AddJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addNotification } = useNotification()
  const { t } = useAdminLanguage()

  const [formData, setFormData] = useState<Omit<JobData, "id" | "createdAt" | "isActive">>({
    title: "",
    company: "TechGlobal Inc.",
    location: "",
    type: "full-time",
    salary: "",
    description: "",
    requirements: ["", "", ""],
  })

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements]
    updatedRequirements[index] = value
    setFormData({ ...formData, requirements: updatedRequirements })
  }

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ""],
    })
  }

  const removeRequirement = (index: number) => {
    const updatedRequirements = [...formData.requirements]
    updatedRequirements.splice(index, 1)
    setFormData({ ...formData, requirements: updatedRequirements })
  }

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup function
    }
  }, [])

  // Improve the handleSubmit function to handle errors better
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Filter out empty requirements
      const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "")

      if (filteredRequirements.length === 0) {
        toast({
          title: t("error"),
          description: t("requirementsError"),
          variant: "destructive",
        })
        return
      }

      // Create new job with ID and timestamp
      const newJob: JobData = {
        ...formData,
        id: Date.now().toString(),
        requirements: filteredRequirements,
        createdAt: new Date().toISOString(),
        isActive: true,
      }

      // Save to localStorage
      const storedJobs = localStorage.getItem("jobs")
      const jobs = storedJobs ? JSON.parse(storedJobs) : []
      jobs.push(newJob)
      localStorage.setItem("jobs", JSON.stringify(jobs))

      // Add notification for all users
      addNotification({
        userId: null, // null means for all users
        title: t("newJobListing"),
        message: `${t("newJobAdded")}: ${newJob.title}`,
        type: "job",
      })

      toast({
        title: t("jobAdded"),
        description: t("jobAddedSuccess"),
      })

      // Redirect to jobs management page
      router.push("/admin/jobs")
    } catch (error) {
      console.error("Failed to save job:", error)
      toast({
        title: t("error"),
        description: t("jobSaveError"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/admin/jobs">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t("addNewJobListing")}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("jobListingDetails")}</CardTitle>
            <CardDescription>{t("fillFormToCreateNewJob")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("positionName")}</Label>
                  <Input
                    id="title"
                    placeholder={t("positionNamePlaceholder") as string}
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">{t("company")}</Label>
                  <Input
                    id="company"
                    placeholder={t("companyPlaceholder") as string}
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t("location")}</Label>
                  <Input
                    id="location"
                    placeholder={t("locationPlaceholder") as string}
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t("jobType")}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as JobType })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder={t("selectJobType") as string} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">{t("fullTime")}</SelectItem>
                      <SelectItem value="part-time">{t("partTime")}</SelectItem>
                      <SelectItem value="contract">{t("contract")}</SelectItem>
                      <SelectItem value="remote">{t("remote")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">{t("salary")}</Label>
                <Input
                  id="salary"
                  placeholder={t("salaryPlaceholder") as string}
                  required
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("jobDescription")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("jobDescriptionPlaceholder") as string}
                  className="min-h-[120px]"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t("requirements")}</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addRequirement}>
                    <Plus className="h-4 w-4 mr-1" />
                    {t("addRequirement")}
                  </Button>
                </div>

                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`${t("requirement")} ${index + 1}`}
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                    />
                    {formData.requirements.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeRequirement(index)}>
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/jobs")}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("addJobListing")}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

