"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Briefcase, Building2, Clock, Home, MapPin, Search } from "lucide-react"

// Define job type to match the admin panel job structure
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

export default function JobsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<JobData[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("")

  // Load jobs data from localStorage
  useEffect(() => {
    const fetchJobs = () => {
      try {
        // Get jobs from localStorage
        const storedJobs = localStorage.getItem("jobs")
        if (storedJobs) {
          const parsedJobs: JobData[] = JSON.parse(storedJobs)
          // Only show active jobs
          const activeJobs = parsedJobs.filter((job) => job.isActive)
          setJobs(activeJobs)
          setFilteredJobs(activeJobs)
        } else {
          // If no jobs in localStorage, set empty array
          setJobs([])
          setFilteredJobs([])
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setJobs([])
        setFilteredJobs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on search query, category, type, and location
  useEffect(() => {
    let result = jobs

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by job type
    if (selectedTypes.length > 0) {
      result = result.filter((job) => {
        // Convert job.type to match the format in selectedTypes
        const normalizedType = job.type.replace("-", "")
        return selectedTypes.includes(normalizedType)
      })
    }

    // Filter by location
    if (selectedLocation && selectedLocation !== "all") {
      result = result.filter((job) => job.location.toLowerCase() === selectedLocation.toLowerCase())
    }

    setFilteredJobs(result)
  }, [searchQuery, selectedCategory, selectedTypes, selectedLocation, jobs])

  // Handle job type selection
  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, type])
    } else {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    }
  }

  // Get unique locations from jobs
  const locations = Array.from(new Set(jobs.map((job) => job.location)))

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  // Map job type to display text
  const getJobTypeText = (type: JobType) => {
    switch (type) {
      case "full-time":
        return t("fullTime") || "To'liq stavka"
      case "part-time":
        return t("partTime") || "Yarim stavka"
      case "contract":
        return t("contract") || "Shartnoma asosida"
      case "remote":
        return t("remote") || "Masofaviy"
      default:
        return type
    }
  }

  return (
    <div className="container mx-auto py-10">
      {/* Back to Home Button */}
      <div className="flex justify-between items-center mb-8">
        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
        </Button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{t("internationalITJobOpportunities")}</h1>
        <p className="text-muted-foreground mt-2">{t("exploreExclusiveOpportunities")}</p>
      </div>

      {/* Search and filters */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("jobTitleOrKeyword")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder={t("location")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            className="w-full"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedTypes([])
              setSelectedLocation("")
              setFilteredJobs(jobs)
            }}
          >
            {t("search")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">{t("jobType")}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fulltime"
                  checked={selectedTypes.includes("fulltime")}
                  onCheckedChange={(checked) => handleTypeChange("fulltime", checked as boolean)}
                />
                <Label htmlFor="fulltime">{t("fullTime")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parttime"
                  checked={selectedTypes.includes("parttime")}
                  onCheckedChange={(checked) => handleTypeChange("parttime", checked as boolean)}
                />
                <Label htmlFor="parttime">{t("partTime")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contract"
                  checked={selectedTypes.includes("contract")}
                  onCheckedChange={(checked) => handleTypeChange("contract", checked as boolean)}
                />
                <Label htmlFor="contract">{t("contract")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={selectedTypes.includes("remote")}
                  onCheckedChange={(checked) => handleTypeChange("remote", checked as boolean)}
                />
                <Label htmlFor="remote">{t("remote")}</Label>
              </div>
            </div>
          </div>

          <Separator />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedTypes([])
              setSelectedLocation("")
              setFilteredJobs(jobs)
            }}
          >
            {t("filter")}
          </Button>

          {/* Added a second Back to Home button in the sidebar for better visibility */}
          <Button
            variant="default"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4" />
            {t("backToHome")}
          </Button>
        </div>

        {/* Jobs list */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">{t("availableJobs")}</h2>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building2 className="h-4 w-4 mr-1" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant={job.type === "full-time" ? "default" : "outline"}>
                        {getJobTypeText(job.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm mb-4">{job.description}</p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("requirements")}:</h4>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString()} {t("posted")}
                    </div>
                    <Link href={`/jobs/apply/${job.id}`}>
                      <Button>{t("apply")}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t("noJobsFound")}</h3>
              <p className="text-muted-foreground mt-1">{t("tryDifferentSearch")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

