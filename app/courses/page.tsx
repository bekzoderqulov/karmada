"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Clock, Filter, Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"

// Kurs tipini belgilash uchun
type Course = {
  id: number
  title: string
  description: string
  level: string
  duration: string
  lessons: number
  rating: number
  students: number
  image: string
  status: string
  price?: number
  translations?: {
    uz?: {
      title: string
      description: string
    }
    ru?: {
      title: string
      description: string
    }
    en?: {
      title: string
      description: string
    }
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [durationFilter, setDurationFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const { t, language } = useLanguage()

  useEffect(() => {
    // Kurslarni localStorage dan yuklash
    try {
      const storedCourses = localStorage.getItem("courses")
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses)
        // Faqat faol kurslarni foydalanuvchilarga ko'rsatish
        // Accept both "Faol" and "active" status values to handle different language settings
        const activeCourses = parsedCourses.filter(
          (course: Course) => course.status === "Faol" || course.status === "active" || course.status === t("active"),
        )

        // Ensure all courses have the required fields
        const processedCourses = activeCourses.map((course: Course) => ({
          ...course,
          price: course.price || course.priceNumeric, // Use either price or priceNumeric
          priceNumeric: course.priceNumeric || Number(course.price), // Ensure priceNumeric exists
          image: course.image || `/placeholder.svg?height=400&width=800&text=Course+${course.id}`,
          level: course.level || t("beginner"),
          duration: course.duration ? course.duration.toString() : "8",
          lessons: course.lessons || 24,
          rating: course.rating || 4.5,
          students: course.students || 0,
        }))

        setCourses(processedCourses)
        setFilteredCourses(processedCourses)
      } else {
        // Agar kurslar topilmasa, bo'sh massiv o'rnatish
        setCourses([])
        setFilteredCourses([])
      }
    } catch (error) {
      console.error("Kurslarni yuklashda xatolik:", error)
      setCourses([])
      setFilteredCourses([])
    } finally {
      setIsLoading(false)
    }
  }, [t])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    applyFilters(query, levelFilter, durationFilter)
  }

  const handleLevelChange = (value: string) => {
    setLevelFilter(value)
    applyFilters(searchQuery, value, durationFilter)
  }

  const handleDurationChange = (value: string) => {
    setDurationFilter(value)
    applyFilters(searchQuery, levelFilter, value)
  }

  const applyFilters = (query: string, level: string, duration: string) => {
    let filtered = courses

    // Qidiruv so'rovi filtri - barcha tillardagi matnlarni qidirish
    if (query) {
      filtered = filtered.filter((course) => {
        // Asosiy matnlarni tekshirish
        const mainTitleMatch = course.title.toLowerCase().includes(query)
        const mainDescMatch = course.description.toLowerCase().includes(query)

        // Tarjima qilingan matnlarni tekshirish
        const uzTitleMatch = course.translations?.uz?.title?.toLowerCase().includes(query) || false
        const uzDescMatch = course.translations?.uz?.description?.toLowerCase().includes(query) || false
        const ruTitleMatch = course.translations?.ru?.title?.toLowerCase().includes(query) || false
        const ruDescMatch = course.translations?.ru?.description?.toLowerCase().includes(query) || false
        const enTitleMatch = course.translations?.en?.title?.toLowerCase().includes(query) || false
        const enDescMatch = course.translations?.en?.description?.toLowerCase().includes(query) || false

        return (
          mainTitleMatch ||
          mainDescMatch ||
          uzTitleMatch ||
          uzDescMatch ||
          ruTitleMatch ||
          ruDescMatch ||
          enTitleMatch ||
          enDescMatch
        )
      })
    }

    // Daraja filtri
    if (level && level !== "all") {
      filtered = filtered.filter((course) => course.level === level)
    }

    // Davomiylik filtri
    if (duration && duration !== "all") {
      if (duration === "short") {
        filtered = filtered.filter((course) => Number.parseInt(course.duration) <= 4)
      } else if (duration === "medium") {
        filtered = filtered.filter(
          (course) => Number.parseInt(course.duration) > 4 && Number.parseInt(course.duration) <= 8,
        )
      } else if (duration === "long") {
        filtered = filtered.filter((course) => Number.parseInt(course.duration) > 8)
      }
    }

    setFilteredCourses(filtered)
  }

  // Darajani tarjima qilish uchun yordam funksiyasi
  const translateLevel = (level: string) => {
    const levelMap: Record<string, Record<string, string>> = {
      uz: {
        Beginner: "Boshlang'ich",
        Intermediate: "O'rta",
        Advanced: "Yuqori",
      },
      en: {
        Beginner: "Beginner",
        Intermediate: "Intermediate",
        Advanced: "Advanced",
      },
      ru: {
        Beginner: "Начальный",
        Intermediate: "Средний",
        Advanced: "Продвинутый",
      },
    }

    return levelMap[language]?.[level] || level
  }

  // Davomiylikni tarjima qilish uchun yordam funksiyasi
  const translateDuration = (duration: string) => {
    const weeks = duration.split(" ")[0]
    const weekText = {
      uz: "hafta",
      en: "weeks",
      ru: "недель",
    }

    return `${weeks} ${weekText[language as keyof typeof weekText]}`
  }

  // Kurs sarlavhasi va tavsifini joriy tilga tarjima qilish
  const getLocalizedCourseTitle = (course: Course) => {
    if (course.translations && course.translations[language as keyof typeof course.translations]?.title) {
      return course.translations[language as keyof typeof course.translations]?.title
    }
    return course.title
  }

  const getLocalizedCourseDescription = (course: Course) => {
    if (course.translations && course.translations[language as keyof typeof course.translations]?.description) {
      return course.translations[language as keyof typeof course.translations]?.description
    }
    return course.description
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 text-foreground py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("itEnglishCourses")}</h1>
          <p className="text-xl opacity-90 max-w-2xl mb-8">{t("specializedEnglishCourses")}</p>

          <div className="bg-card rounded-lg p-4 shadow-lg border">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t("searchCourses")} className="pl-10" value={searchQuery} onChange={handleSearch} />
              </div>
              <Select value={levelFilter} onValueChange={handleLevelChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("level")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allLevels")}</SelectItem>
                  <SelectItem value="Beginner">{t("beginner")}</SelectItem>
                  <SelectItem value="Intermediate">{t("intermediate")}</SelectItem>
                  <SelectItem value="Advanced">{t("advanced")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={durationFilter} onValueChange={handleDurationChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("duration")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allDurations")}</SelectItem>
                  <SelectItem value="short">{t("shortDuration")}</SelectItem>
                  <SelectItem value="medium">{t("mediumDuration")}</SelectItem>
                  <SelectItem value="long">{t("longDuration")}</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">{t("search")}</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{t("availableCourses")}</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t("filter")}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-muted">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={getLocalizedCourseTitle(course)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{getLocalizedCourseTitle(course)}</CardTitle>
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                      {translateLevel(course.level)}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">{getLocalizedCourseDescription(course)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {translateDuration(course.duration)}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.lessons} {t("lessons")}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {course.rating} ({course.students})
                    </span>
                  </div>
                  {course.price && (
                    <div className="mt-2 font-semibold text-primary">
                      {new Intl.NumberFormat(
                        language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "uz-UZ",
                      ).format(course.price)}{" "}
                      {t("currency")}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-muted/30 border-t mt-auto">
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full">{t("viewCourse")}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noCoursesFound")}</p>
          </div>
        )}
      </div>

      <footer className="bg-muted py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} IT English Academy. {t("allRightsReserved")}
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                {t("home")}
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                {t("about")}
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

