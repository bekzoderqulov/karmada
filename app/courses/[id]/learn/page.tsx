"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, PlayCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

type Lesson = {
  title: string
  completed: boolean
  content?: string
  videoUrl?: string
}

type Module = {
  title: string
  lessons: Lesson[]
}

type CourseData = {
  courseId: number
  modules: Module[]
}

export default function CourseLearnPage() {
  const params = useParams()
  const courseId = Number.parseInt(params.id as string)
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated, isLoading, user } = useAuth()
  const { t, language } = useLanguage()

  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("video")
  const [courseTitle, setCourseTitle] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Load course data
    try {
      // Get course title
      const allCourses = JSON.parse(localStorage.getItem("courses") || "[]")
      const courseDetails = allCourses.find((c: any) => c.id === courseId)
      if (courseDetails) {
        setCourseTitle(courseDetails.title)
      }

      // Get learning data
      const learningData = localStorage.getItem(`course_${courseId}_learning_page`)

      if (learningData) {
        const parsedData = JSON.parse(learningData)
        setCourseData(parsedData)
      } else {
        // Create default learning data if it doesn't exist
        const defaultData: CourseData = {
          courseId,
          modules: [
            {
              title: t("Kirish moduli"),
              lessons: [
                {
                  title: t("Kirish darsi"),
                  completed: false,
                  content: t(
                    "Bu kursning kirish darsi. Bu darsda kurs haqida umumiy ma'lumot beriladi va kursning maqsadlari tushuntiriladi.",
                  ),
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: t("Asosiy tushunchalar"),
                  completed: false,
                  content: t("Bu darsda kursning asosiy tushunchalari bilan tanishasiz."),
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: t("Amaliy mashg'ulot"),
                  completed: false,
                  content: t("Bu darsda o'rganilgan bilimlarni amalda qo'llash bo'yicha mashqlar bajariladi."),
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
              ],
            },
            {
              title: t("Asosiy modul"),
              lessons: [
                {
                  title: t("Mavzu 1"),
                  completed: false,
                  content: t("Bu darsda birinchi mavzu bo'yicha ma'lumotlar beriladi."),
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: t("Mavzu 2"),
                  completed: false,
                  content: t("Bu darsda ikkinchi mavzu bo'yicha ma'lumotlar beriladi."),
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
                {
                  title: t("Amaliy mashg'ulot"),
                  completed: false,
                  content: t("Bu darsda o'rganilgan bilimlarni amalda qo'llash bo'yicha mashqlar bajariladi."),
                  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                },
              ],
            },
          ],
        }

        setCourseData(defaultData)
        localStorage.setItem(`course_${courseId}_learning_page`, JSON.stringify(defaultData))
      }

      // Get user's current position in the course
      const userCourses = JSON.parse(localStorage.getItem("userCourses") || "[]")
      const userCourse = userCourses.find((c: any) => c.id === courseId)

      if (userCourse) {
        if (typeof userCourse.moduleIndex === "number" && typeof userCourse.lessonIndex === "number") {
          setCurrentModule(userCourse.moduleIndex)
          setCurrentLesson(userCourse.lessonIndex)
        }
        setProgress(userCourse.progress || 0)
      }
    } catch (error) {
      console.error(t("Kurs ma'lumotlarini yuklashda xatolik:"), error)
      toast({
        title: t("Xatolik"),
        description: t("Kurs ma'lumotlarini yuklashda xatolik yuz berdi"),
        variant: "destructive",
      })
    }
  }, [courseId, isAuthenticated, isLoading, router, toast, t, language])

  const markLessonComplete = useCallback(() => {
    if (!courseData) return

    // Update course data
    const updatedCourseData = { ...courseData }
    updatedCourseData.modules[currentModule].lessons[currentLesson].completed = true
    setCourseData(updatedCourseData)

    // Save to localStorage
    localStorage.setItem(`course_${courseId}_learning_page`, JSON.stringify(updatedCourseData))

    // Calculate new progress
    const totalLessons = updatedCourseData.modules.reduce((total, module) => total + module.lessons.length, 0)
    const completedLessons = updatedCourseData.modules.reduce(
      (total, module) => total + module.lessons.filter((lesson) => lesson.completed).length,
      0,
    )

    const newProgress = Math.round((completedLessons / totalLessons) * 100)
    setProgress(newProgress)

    // Update user courses
    const userCourses = JSON.parse(localStorage.getItem("userCourses") || "[]")
    const updatedUserCourses = userCourses.map((course: any) => {
      if (course.id === courseId) {
        return {
          ...course,
          progress: newProgress,
          moduleIndex: currentModule,
          lessonIndex: currentLesson,
          completed: newProgress === 100,
          nextLesson: getNextLessonTitle(updatedCourseData, currentModule, currentLesson),
        }
      }
      return course
    })

    localStorage.setItem("userCourses", JSON.stringify(updatedUserCourses))

    toast({
      title: t("Dars tugatildi"),
      description: t("Dars muvaffaqiyatli tugatildi va progress saqlandi"),
    })
  }, [courseData, currentModule, currentLesson, courseId, toast, t])

  const getNextLessonTitle = useCallback(
    (courseData: CourseData, moduleIndex: number, lessonIndex: number) => {
      const module = courseData.modules[moduleIndex]

      // If there are more lessons in the current module
      if (lessonIndex + 1 < module.lessons.length) {
        return `${module.title}: ${module.lessons[lessonIndex + 1].title}`
      }

      // If there are more modules
      if (moduleIndex + 1 < courseData.modules.length) {
        const nextModule = courseData.modules[moduleIndex + 1]
        return `${nextModule.title}: ${nextModule.lessons[0].title}`
      }

      // If this is the last lesson of the last module
      return t("Kurs tugatildi")
    },
    [t],
  )

  const navigateToNextLesson = useCallback(() => {
    if (!courseData) return

    const module = courseData.modules[currentModule]

    // If there are more lessons in the current module
    if (currentLesson + 1 < module.lessons.length) {
      setCurrentLesson(currentLesson + 1)
    }
    // If there are more modules
    else if (currentModule + 1 < courseData.modules.length) {
      setCurrentModule(currentModule + 1)
      setCurrentLesson(0)
    }
    // If this is the last lesson of the last module
    else {
      toast({
        title: t("Kurs tugatildi"),
        description: t("Siz kursning barcha darslarini tugatdingiz!"),
      })

      // Mark course as completed
      const userCourses = JSON.parse(localStorage.getItem("userCourses") || "[]")
      const updatedUserCourses = userCourses.map((course: any) => {
        if (course.id === courseId) {
          return {
            ...course,
            progress: 100,
            completed: true,
          }
        }
        return course
      })

      localStorage.setItem("userCourses", JSON.stringify(updatedUserCourses))

      // Redirect to certificates page
      router.push("/profile/certificates")
    }
  }, [courseData, currentModule, currentLesson, toast, router, courseId, t])

  const navigateToPreviousLesson = useCallback(() => {
    if (!courseData) return

    // If there are previous lessons in the current module
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
    }
    // If there are previous modules
    else if (currentModule > 0) {
      setCurrentModule(currentModule - 1)
      const previousModuleLessons = courseData.modules[currentModule - 1].lessons.length
      setCurrentLesson(previousModuleLessons - 1)
    }
  }, [courseData, currentModule, currentLesson])

  if (isLoading || !courseData) {
    return (
      <div className="container mx-auto py-10">
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  const currentModuleData = courseData.modules[currentModule]
  const currentLessonData = currentModuleData?.lessons[currentLesson]

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.push("/profile/courses")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("Mening kurslarim")}
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{courseTitle}</h1>
            <p className="text-muted-foreground">
              {currentModuleData.title} - {currentLessonData.title}
            </p>
          </div>
          <div className="w-[100px]"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with lessons */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t("Kurs tarkibi")}</CardTitle>
                <CardDescription>
                  {t("Umumiy progress")}: {progress}%
                </CardDescription>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent className="max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {courseData.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="space-y-2">
                      <h3 className="font-medium">{module.title}</h3>
                      <ul className="space-y-1">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex}>
                            <Button
                              variant={
                                moduleIndex === currentModule && lessonIndex === currentLesson ? "default" : "ghost"
                              }
                              className={`w-full justify-start ${lesson.completed ? "text-green-500" : ""}`}
                              onClick={() => {
                                setCurrentModule(moduleIndex)
                                setCurrentLesson(lessonIndex)
                              }}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="mr-2 h-4 w-4" />
                              ) : (
                                <BookOpen className="mr-2 h-4 w-4" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{currentLessonData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="video">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {t("Video dars")}
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <FileText className="mr-2 h-4 w-4" />
                      {t("Matn")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="video">
                    <div className="aspect-video">
                      <iframe
                        src={currentLessonData.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                        className="w-full h-full"
                        allowFullScreen
                        title={currentLessonData.title}
                      ></iframe>
                    </div>
                  </TabsContent>

                  <TabsContent value="text">
                    <div className="prose max-w-none">
                      <p>{currentLessonData.content || t("Bu dars uchun matn mavjud emas.")}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={navigateToPreviousLesson}
                  disabled={currentModule === 0 && currentLesson === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("Oldingi dars")}
                </Button>
                <Button onClick={markLessonComplete} disabled={currentLessonData.completed}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {currentLessonData.completed ? t("Tugatilgan") : t("Tugatildi deb belgilash")}
                </Button>
                <Button onClick={navigateToNextLesson}>
                  {t("Keyingi dars")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

