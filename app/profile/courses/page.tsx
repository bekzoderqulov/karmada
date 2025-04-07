"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { usePurchase } from "@/context/purchase-context"
import { BookOpen } from "lucide-react"

type UserCourse = {
  id: number
  title: string
  image: string
  progress: number
  nextLesson: string
  nextLessonDate: string
  instructor: string
  category: string
  purchaseDate: string
  completed?: boolean
  moduleIndex?: number
  lessonIndex?: number
}

export default function CoursesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const { t, language } = useLanguage()
  const { getUserPurchases } = usePurchase()
  const [activeTab, setActiveTab] = useState("active")
  const [userCourses, setUserCourses] = useState<UserCourse[]>([])
  const [activeCourses, setActiveCourses] = useState<UserCourse[]>([])
  const [completedCourses, setCompletedCourses] = useState<UserCourse[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // First check if we have user progress data
        const storedUserCourses = localStorage.getItem("userCourses")
        const existingUserCourses: UserCourse[] = storedUserCourses ? JSON.parse(storedUserCourses) : []

        // Get purchases and convert to courses
        const purchases = getUserPurchases(user.id)
        const courses: UserCourse[] = []

        // Only add courses that were actually purchased
        purchases.forEach((purchase) => {
          if (purchase.status === "to'langan") {
            // Get course details from courses in localStorage
            const allCourses = JSON.parse(localStorage.getItem("courses") || "[]")
            const courseDetails = allCourses.find((c: any) => c.id === purchase.courseId)

            if (courseDetails) {
              // Check if course already exists in user courses
              const existingCourse = existingUserCourses.find((c) => c.id === purchase.courseId)

              if (existingCourse) {
                // Use existing course data to maintain progress
                courses.push(existingCourse)
              } else {
                // Create new course entry
                courses.push({
                  id: purchase.courseId,
                  title: purchase.courseTitle,
                  image: courseDetails.image || "/placeholder.svg",
                  progress: 0,
                  nextLesson: t("Kirish darsi"),
                  nextLessonDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                  instructor: courseDetails.instructor || t("O'qituvchi"),
                  category: t("IT ingliz tili"),
                  purchaseDate: purchase.date,
                  completed: false,
                  moduleIndex: 0,
                  lessonIndex: 0,
                })
              }
            }
          }
        })

        // Save updated courses to localStorage
        localStorage.setItem("userCourses", JSON.stringify(courses))

        // Update state
        setUserCourses(courses)

        // Split into active and completed
        setActiveCourses(courses.filter((course) => !course.completed))
        setCompletedCourses(courses.filter((course) => course.completed))
      } catch (error) {
        console.error("Foydalanuvchi kurslarini yuklashda xatolik:", error)
      }
    }
  }, [isAuthenticated, user, getUserPurchases, t, language])

  const handleContinueLearning = useCallback(
    (courseId: number, moduleIndex = 0, lessonIndex = 0) => {
      try {
        // Create the course learning page if it doesn't exist yet
        if (!localStorage.getItem(`course_${courseId}_learning_page`)) {
          // Create a simple learning page structure in localStorage
          const learningPageData = {
            courseId,
            modules: [
              {
                title: t("Kirish moduli"),
                lessons: [
                  { title: t("Kirish darsi"), completed: false },
                  { title: t("Asosiy tushunchalar"), completed: false },
                  { title: t("Amaliy mashg'ulot"), completed: false },
                ],
              },
              {
                title: t("Asosiy modul"),
                lessons: [
                  { title: t("Mavzu 1"), completed: false },
                  { title: t("Mavzu 2"), completed: false },
                  { title: t("Amaliy mashg'ulot"), completed: false },
                ],
              },
            ],
          }
          localStorage.setItem(`course_${courseId}_learning_page`, JSON.stringify(learningPageData))
        }

        // Update user's progress in localStorage
        const updatedCourses = userCourses.map((course) => {
          if (course.id === courseId) {
            // Update the course with current module and lesson
            return {
              ...course,
              moduleIndex,
              lessonIndex,
              nextLesson: `${t("Modul")} ${moduleIndex + 1}, ${t("Dars")} ${lessonIndex + 1}`,
            }
          }
          return course
        })

        setUserCourses(updatedCourses)
        localStorage.setItem("userCourses", JSON.stringify(updatedCourses))

        // Navigate to course content page
        router.push(`/courses/${courseId}/learn`)
      } catch (error) {
        console.error(t("O'rganishni davom ettirishda xatolik:"), error)
        // Fallback to course details page
        router.push(`/courses/${courseId}`)
      }
    },
    [userCourses, router, t],
  )

  if (isLoading || !isAuthenticated) {
    return <div className="container mx-auto py-10">Yuklanmoqda...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("my_courses")}</h1>
          <p className="text-muted-foreground">{t("manage_your_account_settings")}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">{t("active_courses")}</TabsTrigger>
            <TabsTrigger value="completed">{t("completed_courses")}</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-6 mt-6">
            {activeCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                  <p className="text-muted-foreground text-center">{t("noActiveCourses")}</p>
                  <Button onClick={() => router.push("/courses")}>{t("browseCourses")}</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <Badge className="absolute top-2 right-2">{course.category}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription className="mt-1">{t("IT sohasida ingliz tilini o'rganing")}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("O'zlashtirish")}</span>
                            <span className="text-sm text-muted-foreground">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">{t("Keyingi dars")}</h4>
                          <div className="flex items-center text-sm">
                            <BookOpen className="h-4 w-4 mr-1 text-primary" />
                            <p>{course.nextLesson}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{t("O'qituvchi")}:</span> {course.instructor}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${course.id}`)}>
                        {t("aboutCourse")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleContinueLearning(course.id, course.moduleIndex, course.lessonIndex)}
                      >
                        {t("continueLearning")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="completed" className="space-y-6 mt-6">
            {completedCourses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                  <p className="text-muted-foreground text-center">{t("noCompletedCourses")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription className="mt-1">{t("IT sohasida ingliz tilini o'rganing")}</CardDescription>
                        </div>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">{t("Tugatilgan sana")}</h4>
                          <p className="text-sm">{new Date(course.purchaseDate).toLocaleDateString("uz-UZ")}</p>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{t("O'qituvchi")}:</span> {course.instructor}
                        </div>
                        <Badge variant="secondary">{t("Sertifikat mavjud")}</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${course.id}`)}>
                        {t("aboutCourse")}
                      </Button>
                      <Button size="sm" onClick={() => router.push("/profile/certificates")}>
                        {t("viewCertificate")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

