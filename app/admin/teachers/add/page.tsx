"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useAdminLanguage } from "@/context/admin-language-context"
import { Checkbox } from "@/components/ui/checkbox"

export default function AddTeacherPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { hasPermission } = useAuth()
  const { language, t } = useAdminLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courses, setCourses] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    status: "active",
    selectedCourses: [] as number[],
  })

  useEffect(() => {
    // Check permissions
    if (!hasPermission("manage_teachers")) {
      toast({
        title: t("noPermission"),
        description: t("noPermissionAddTeachers"),
        variant: "destructive",
      })
      router.push("/admin")
      return
    }

    // Load courses
    try {
      const storedCourses = localStorage.getItem("courses")
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses))
      }
    } catch (error) {
      console.error(t("coursesLoadError"), error)
    }

    // Update status based on language change
    setFormData((prev) => ({
      ...prev,
      status: t("activeValue"),
    }))
  }, [hasPermission, router, toast, language, t])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCourseToggle = (courseId: number) => {
    setFormData((prev) => {
      const selectedCourses = [...prev.selectedCourses]
      if (selectedCourses.includes(courseId)) {
        return {
          ...prev,
          selectedCourses: selectedCourses.filter((id) => id !== courseId),
        }
      } else {
        return {
          ...prev,
          selectedCourses: [...selectedCourses, courseId],
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: t("error"),
        description: t("requiredFieldsError"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get existing teachers from localStorage
      const storedTeachers = localStorage.getItem("teachers")
      const teachers = storedTeachers ? JSON.parse(storedTeachers) : []

      // Create new teacher
      const newTeacher = {
        id: teachers.length > 0 ? Math.max(...teachers.map((t: any) => t.id)) + 1 : 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: `/placeholder.svg?height=100&width=100&text=${formData.name
          .split(" ")
          .map((n) => n[0])
          .join("")}`,
        specialization: formData.specialization,
        courses: formData.selectedCourses,
        status: formData.status,
        rating: 5.0, // Default rating for new teachers
        joinedAt: new Date().toISOString(),
        // Additional fields for consistency
        position: formData.specialization || t("teacher"),
        specialty: formData.specialization || t("englishLanguage"),
        experience: t("new"),
        bio: `${formData.name} - ${t("teacherBio")}`,
      }

      // Add to teachers list
      const updatedTeachers = [...teachers, newTeacher]
      localStorage.setItem("teachers", JSON.stringify(updatedTeachers))

      toast({
        title: t("teacherAdded"),
        description: t("teacherAddedSuccess"),
      })

      // Return to teachers list
      router.push("/admin/teachers")
    } catch (error) {
      console.error(t("addTeacherError"), error)
      toast({
        title: t("error"),
        description: t("addTeacherErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/teachers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t("addNewTeacher")}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("teacherInformation")}</CardTitle>
            <CardDescription>{t("fillAllTeacherInfo")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("namePlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("emailPlaceholder")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("phonePlaceholder")}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">{t("specialization")}</Label>
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                placeholder={t("specializationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("status")}</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("courses")}</Label>
              <div className="border rounded-md p-4 space-y-2">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={formData.selectedCourses.includes(course.id)}
                        onCheckedChange={() => handleCourseToggle(course.id)}
                      />
                      <Label htmlFor={`course-${course.id}`} className="cursor-pointer">
                        {course.title}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">{t("noCourseAvailable")}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/teachers")}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                t("saving")
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("save")}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}

