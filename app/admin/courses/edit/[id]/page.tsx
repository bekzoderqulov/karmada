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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useNotification } from "@/context/notification-context"
import { useTranslation } from "react-i18next"
import { PurchaseProvider } from '@/context/purchase-context';

export default function App({ Component, pageProps }) {
  return (
    <PurchaseProvider>
      <Component {...pageProps} />
    </PurchaseProvider>
  );
}

export function EditCoursePage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { addNotification } = useNotification()
  const courseId = Number.parseInt(params.id)
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    level: "Boshlang'ich",
    duration: "",
    lessons: "",
    price: "",
    instructor: "",
    instructorTitle: "",
    status: "Rejada",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load course data
    const loadCourse = () => {
      try {
        const courses = JSON.parse(localStorage.getItem("courses") || "[]")
        const course = courses.find((c: any) => c.id === courseId)

        if (course) {
          setFormData({
            title: course.title || "",
            description: course.description || "",
            longDescription: course.longDescription || "",
            level: course.level || "Boshlang'ich",
            duration: course.duration || "",
            lessons: course.lessons?.toString() || "",
            price: course.price || "",
            instructor: course.instructor || "",
            instructorTitle: course.instructorTitle || "",
            status: course.status || "Rejada",
          })
        } else {
          toast({
            title: "Xatolik",
            description: "Kurs topilmadi",
            variant: "destructive",
          })
          router.push("/admin/courses")
        }
      } catch (error) {
        console.error("Failed to load course:", error)
        toast({
          title: "Xatolik",
          description: "Kursni yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseId, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.description || !formData.price) {
      toast({
        title: "Xatolik",
        description: "Kurs nomi, tavsifi va narxi to'ldirilishi shart",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, this would be an API call to update the course
    setTimeout(() => {
      try {
        // Get existing courses from localStorage
        const courses = JSON.parse(localStorage.getItem("courses") || "[]")

        // Find course index
        const courseIndex = courses.findIndex((c: any) => c.id === courseId)

        if (courseIndex !== -1) {
          // Check if status changed from Rejada to Faol
          const wasPlanned = courses[courseIndex].status === "Rejada"
          const isNowActive = formData.status === "Faol"

          // Update course
          const updatedCourse = {
            ...courses[courseIndex],
            ...formData,
            priceNumeric: Number.parseInt(formData.price.replace(/[^\d]/g, "")),
            updatedAt: new Date().toISOString(),
          }

          courses[courseIndex] = updatedCourse
          localStorage.setItem("courses", JSON.stringify(courses))

          // Send notification if course status changed from planned to active
          if (wasPlanned && isNowActive) {
            addNotification({
              userId: null, // null means for all users
              title: "Yangi kurs qo'shildi!",
              message: `"${formData.title}" kursi endi platformada mavjud. Hoziroq ro'yxatdan o'ting!|${courseId}`,
              type: "new-course",
            })
          }

          toast({
            title: "Kurs yangilandi",
            description: "Kurs ma'lumotlari muvaffaqiyatli yangilandi",
          })
        } else {
          throw new Error("Course not found")
        }
      } catch (error) {
        console.error("Failed to update course:", error)
        toast({
          title: "Xatolik",
          description: "Kursni yangilashda xatolik yuz berdi",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
        router.push("/admin/courses")
      }
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin/courses">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t("editCourse")}</h1>
          </div>
          <Card>
            <CardContent className="py-10 flex justify-center">
              <p>{t("loadingCourseData")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin/courses">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{t("editCourse")}</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{t("courseInformation")}</CardTitle>
              <CardDescription>{t("editCourseInfo")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t("courseName")}</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masalan: IT ingliz tili"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("shortDescription")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Kurs haqida qisqacha ma'lumot"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">{t("detailedDescription")}</Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  placeholder="Kurs haqida batafsil ma'lumot"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="level">{t("level")}</Label>
                  <Select value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Darajani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boshlang'ich">Boshlang'ich</SelectItem>
                      <SelectItem value="O'rta">O'rta</SelectItem>
                      <SelectItem value="Yuqori">Yuqori</SelectItem>
                      <SelectItem value="Barcha darajalar">Barcha darajalar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">{t("duration")}</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Masalan: 8 hafta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lessons">{t("numberOfLessons")}</Label>
                  <Input
                    id="lessons"
                    name="lessons"
                    value={formData.lessons}
                    onChange={handleInputChange}
                    placeholder="Masalan: 24"
                    type="number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{t("priceInSom")}</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Masalan: 1,200,000 so'm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instructor">{t("instructor")}</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="O'qituvchi ismi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructorTitle">{t("instructorPosition")}</Label>
                  <Input
                    id="instructorTitle"
                    name="instructorTitle"
                    value={formData.instructorTitle}
                    onChange={handleInputChange}
                    placeholder="Masalan: Senior ingliz tili o'qituvchisi"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t("status")}</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Holatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faol">Faol</SelectItem>
                    <SelectItem value="Rejada">Rejada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/admin/courses")}>
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
      </div>
    </div>
  )
}

