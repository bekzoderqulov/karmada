"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, Star, Users, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddToCartButton from "@/components/add-to-cart-button"
import CourseChat from "@/components/course-chat"
import { useToast } from "@/hooks/use-toast"
import TrialLessonDialog from "@/components/trial-lesson-dialog"
import { useLanguage } from "@/context/language-context"

type CourseType = {
  id: number
  title: string
  description: string
  longDescription: string
  level: string
  duration: string
  lessons: number
  rating: number
  students: number
  price: string
  priceNumeric: number
  instructor: string
  instructorTitle: string
  instructorImage: string
  image: string
  topics: string[]
  syllabus: {
    week: number
    title: string
    lessons: string[]
  }[]
  status: string
  trialLesson: {
    title: string
    description: string
    videoUrl: string
    duration: string
  }
  translations?: {
    uz?: {
      title: string
      description: string
      longDescription: string
      topics: string[]
      syllabus: {
        week: number
        title: string
        lessons: string[]
      }[]
      instructor: string
      instructorTitle: string
    }
    ru?: {
      title: string
      description: string
      longDescription: string
      topics: string[]
      syllabus: {
        week: number
        title: string
        lessons: string[]
      }[]
      instructor: string
      instructorTitle: string
    }
    en?: {
      title: string
      description: string
      longDescription: string
      topics: string[]
      syllabus: {
        week: number
        title: string
        lessons: string[]
      }[]
      instructor: string
      instructorTitle: string
    }
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = Number.parseInt((params?.id as string) || "0")

  const [course, setCourse] = useState<CourseType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTrialLesson, setShowTrialLesson] = useState(false)
  const { toast } = useToast()
  const { t, language } = useLanguage()

  useEffect(() => {
    // Load course data from localStorage
    const loadCourse = async () => {
      try {
        setIsLoading(true)
        const storedCourses = localStorage.getItem("courses")
        if (storedCourses) {
          const courses = JSON.parse(storedCourses)
          const foundCourse = courses.find((c: any) => c.id === courseId)

          if (foundCourse) {
            setCourse(foundCourse)
          } else {
            // Fallback to sample data if course not found
            const sampleCourse = {
              id: courseId,
              title: `Kurs ${courseId}`,
              description: "Bu kurs haqida ma'lumot topilmadi.",
              longDescription: "Bu kurs haqida batafsil ma'lumot topilmadi.",
              level: "Boshlang'ich",
              duration: "8 hafta",
              lessons: 24,
              rating: 4.8,
              students: 1245,
              price: "1,200,000 so'm",
              priceNumeric: 1200000,
              instructor: "O'qituvchi",
              instructorTitle: "O'qituvchi",
              instructorImage: "/placeholder.svg?height=100&width=100",
              image: `/placeholder.svg?height=400&width=800&text=Kurs+${courseId}`,
              topics: ["Mavzu 1", "Mavzu 2", "Mavzu 3"],
              syllabus: [
                {
                  week: 1,
                  title: "Kirish",
                  lessons: ["Dars 1", "Dars 2", "Dars 3"],
                },
              ],
              status: "Faol",
              trialLesson: {
                title: "Sinov darsi",
                description: "Bu kursning sinov darsi. Kursni sotib olishdan oldin tanishib chiqishingiz mumkin.",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video
                duration: "10 daqiqa",
              },
              translations: {
                uz: {
                  title: `Kurs ${courseId}`,
                  description: "Bu kurs haqida ma'lumot topilmadi.",
                  longDescription: "Bu kurs haqida batafsil ma'lumot topilmadi.",
                  topics: ["Mavzu 1", "Mavzu 2", "Mavzu 3"],
                  syllabus: [
                    {
                      week: 1,
                      title: "Kirish",
                      lessons: ["Dars 1", "Dars 2", "Dars 3"],
                    },
                  ],
                  instructor: "O'qituvchi",
                  instructorTitle: "O'qituvchi",
                },
                ru: {
                  title: `Курс ${courseId}`,
                  description: "Информация о курсе не найдена.",
                  longDescription: "Подробная информация о курсе не найдена.",
                  topics: ["Тема 1", "Тема 2", "Тема 3"],
                  syllabus: [
                    {
                      week: 1,
                      title: "Введение",
                      lessons: ["Урок 1", "Урок 2", "Урок 3"],
                    },
                  ],
                  instructor: "Преподаватель",
                  instructorTitle: "Преподаватель",
                },
                en: {
                  title: `Course ${courseId}`,
                  description: "Course information not found.",
                  longDescription: "Detailed course information not found.",
                  topics: ["Topic 1", "Topic 2", "Topic 3"],
                  syllabus: [
                    {
                      week: 1,
                      title: "Introduction",
                      lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
                    },
                  ],
                  instructor: "Instructor",
                  instructorTitle: "Instructor",
                },
              },
            }
            setCourse(sampleCourse)
          }
        } else {
          // Fallback to sample data if no courses found
          const sampleCourse = {
            id: courseId,
            title: `Kurs ${courseId}`,
            description: "Bu kurs haqida ma'lumot topilmadi.",
            longDescription: "Bu kurs haqida batafsil ma'lumot topilmadi.",
            level: "Boshlang'ich",
            duration: "8 hafta",
            lessons: 24,
            rating: 4.8,
            students: 1245,
            price: "1,200,000 so'm",
            priceNumeric: 1200000,
            instructor: "O'qituvchi",
            instructorTitle: "O'qituvchi",
            instructorImage: "/placeholder.svg?height=100&width=100",
            image: `/placeholder.svg?height=400&width=800&text=Kurs+${courseId}`,
            topics: ["Mavzu 1", "Mavzu 2", "Mavzu 3"],
            syllabus: [
              {
                week: 1,
                title: "Kirish",
                lessons: ["Dars 1", "Dars 2", "Dars 3"],
              },
            ],
            status: "Faol",
            trialLesson: {
              title: "Sinov darsi",
              description: "Bu kursning sinov darsi. Kursni sotib olishdan oldin tanishib chiqishingiz mumkin.",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder video
              duration: "10 daqiqa",
            },
            translations: {
              uz: {
                title: `Kurs ${courseId}`,
                description: "Bu kurs haqida ma'lumot topilmadi.",
                longDescription: "Bu kurs haqida batafsil ma'lumot topilmadi.",
                topics: ["Mavzu 1", "Mavzu 2", "Mavzu 3"],
                syllabus: [
                  {
                    week: 1,
                    title: "Kirish",
                    lessons: ["Dars 1", "Dars 2", "Dars 3"],
                  },
                ],
                instructor: "O'qituvchi",
                instructorTitle: "O'qituvchi",
              },
              ru: {
                title: `Курс ${courseId}`,
                description: "Информация о курсе не найдена.",
                longDescription: "Подробная информация о курсе не найдена.",
                topics: ["Тема 1", "Тема 2", "Тема 3"],
                syllabus: [
                  {
                    week: 1,
                    title: "Введение",
                    lessons: ["Урок 1", "Урок 2", "Урок 3"],
                  },
                ],
                instructor: "Преподаватель",
                instructorTitle: "Преподаватель",
              },
              en: {
                title: `Course ${courseId}`,
                description: "Course information not found.",
                longDescription: "Detailed course information not found.",
                topics: ["Topic 1", "Topic 2", "Topic 3"],
                syllabus: [
                  {
                    week: 1,
                    title: "Introduction",
                    lessons: ["Lesson 1", "Lesson 2", "Lesson 3"],
                  },
                ],
                instructor: "Instructor",
                instructorTitle: "Instructor",
              },
            },
          }
          setCourse(sampleCourse)
        }
      } catch (error) {
        console.error("Failed to load course:", error)
        toast({
          title: "Xatolik",
          description: "Kurs ma'lumotlarini yuklashda xatolik yuz berdi",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadCourse()
  }, [courseId, toast])

  // Kurs ma'lumotlarini joriy tilga tarjima qilish
  const getLocalizedCourseTitle = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.title) {
      return course.translations[language as keyof typeof course.translations]?.title
    }
    return course?.title || ""
  }

  const getLocalizedCourseDescription = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.description) {
      return course.translations[language as keyof typeof course.translations]?.description
    }
    return course?.description || ""
  }

  const getLocalizedCourseLongDescription = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.longDescription) {
      return course.translations[language as keyof typeof course.translations]?.longDescription
    }
    return course?.longDescription || ""
  }

  const getLocalizedCourseTopics = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.topics) {
      return course.translations[language as keyof typeof course.translations]?.topics
    }
    return course?.topics || []
  }

  const getLocalizedCourseSyllabus = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.syllabus) {
      return course.translations[language as keyof typeof course.translations]?.syllabus
    }
    return course?.syllabus || []
  }

  const getLocalizedInstructor = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.instructor) {
      return course.translations[language as keyof typeof course.translations]?.instructor
    }
    return course?.instructor || ""
  }

  const getLocalizedInstructorTitle = () => {
    if (course?.translations && course.translations[language as keyof typeof course.translations]?.instructorTitle) {
      return course.translations[language as keyof typeof course.translations]?.instructorTitle
    }
    return course?.instructorTitle || ""
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="container py-12 text-center">
          <p>{t("loadingCourseData")}</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("courseNotFound")}</h1>
          <p className="mb-6">{t("courseNotFoundDescription")}</p>
          <Link href="/courses">
            <Button>{t("backToAllCourses")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container py-12">
        <Link href="/courses" className="flex items-center text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToAllCourses")}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={course.image || "/placeholder.svg"}
                alt={getLocalizedCourseTitle()}
                className="w-full h-auto object-cover"
              />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                <TabsTrigger value="syllabus">{t("syllabus")}</TabsTrigger>
                <TabsTrigger value="instructor">{t("instructor")}</TabsTrigger>
                <TabsTrigger value="chat">{t("chat")}</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4 border rounded-lg mt-4">
                <h2 className="text-2xl font-bold mb-4">{t("aboutCourse")}</h2>
                <p className="text-muted-foreground mb-6">{getLocalizedCourseLongDescription()}</p>

                <h3 className="text-xl font-bold mb-3">{t("whatYouWillLearn")}</h3>
                <ul className="space-y-2 mb-6">
                  {getLocalizedCourseTopics().map((topic: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 text-primary">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="syllabus" className="p-4 border rounded-lg mt-4">
                <h2 className="text-2xl font-bold mb-4">{t("syllabus")}</h2>
                <div className="space-y-6">
                  {getLocalizedCourseSyllabus().map((week: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-2">
                        {t("week")} {week.week}: {week.title}
                      </h3>
                      <ul className="space-y-2">
                        {week.lessons &&
                          week.lessons.map((lesson: string, lessonIndex: number) => (
                            <li key={lessonIndex} className="flex items-start">
                              <span className="mr-2 mt-1 text-primary">•</span>
                              <span>{lesson}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="p-4 border rounded-lg mt-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={course.instructorImage || "/placeholder.svg"}
                      alt={getLocalizedInstructor()}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{getLocalizedInstructor()}</h2>
                    <p className="text-primary mb-4">{getLocalizedInstructorTitle()}</p>
                    <p className="text-muted-foreground">{t("instructorBio")}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="chat" className="p-4 border rounded-lg mt-4">
                <CourseChat courseId={course.id} courseTitle={getLocalizedCourseTitle()} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">{course.price}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{t("duration")}</span>
                  </div>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{t("lessons")}</span>
                  </div>
                  <span className="font-medium">
                    {course.lessons} {language === "en" ? "" : t("count")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>{t("rating")}</span>
                  </div>
                  <span className="font-medium">{course.rating} (★★★★★)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{t("students")}</span>
                  </div>
                  <span className="font-medium">
                    {course.students} {language === "en" ? "" : t("count")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <AddToCartButton
                  courseId={course.id}
                  courseTitle={getLocalizedCourseTitle()}
                  coursePrice={course.priceNumeric}
                  courseImage={course.image}
                />
                <Button variant="outline" className="w-full" onClick={() => setShowTrialLesson(true)}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {t("watchTrialLesson")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Sinov darsi modali - alohida komponentga chiqarildi */}
      {course && (
        <TrialLessonDialog isOpen={showTrialLesson} onClose={() => setShowTrialLesson(false)} course={course} />
      )}
    </div>
  )
}

