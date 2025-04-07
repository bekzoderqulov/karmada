"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)

  // After component mounts, we can access translations
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated || !mounted) {
    return <div className="container mx-auto py-10">Loading...</div>
  }

  // Function to get completed lesson text with number
  const getCompletedLessonText = (number: number) => {
    return `${t("completed_lesson")} ${number}`
  }

  // Function to get days ago text with count
  const getDaysAgoText = (count: number) => {
    return `${count} ${t("days_ago")}`
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("profile_completion")}</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{t("student")}</Badge>
                  <Badge variant="outline">{t("english_b2")}</Badge>
                  <Badge variant="outline">{t("it_beginner")}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/profile/settings")}>
                {t("edit_profile")}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("quick_links")}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid gap-2">
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/courses")}>
                  {t("my_courses")}
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/certificates")}>
                  {t("certificates")}
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/profile/chat")}>
                  {t("support_chat")}
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => router.push("/courses")}>
                  {t("browse_courses")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="progress">{t("progress")}</TabsTrigger>
              <TabsTrigger value="achievements">{t("achievements")}</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("welcome_back")}</CardTitle>
                  <CardDescription>{t("welcome_message", { name: user?.name || "" })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{t("active_courses")}</h3>
                        <p className="text-3xl font-bold">3</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{t("completed_courses")}</h3>
                        <p className="text-3xl font-bold">2</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">{t("next_lesson")}</h3>
                      <p className="font-medium">Advanced JavaScript - Functions</p>
                      <p className="text-sm text-muted-foreground">Today at 18:00</p>
                      <Button size="sm" className="mt-2">
                        {t("join_now")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("recent_activity")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="rounded-full bg-primary/10 p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{getCompletedLessonText(i)}</p>
                          <p className="text-sm text-muted-foreground">{getDaysAgoText(i)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    {t("view_all_activity")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("learning_progress")}</CardTitle>
                  <CardDescription>{t("progress_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { course: "JavaScript Fundamentals", progress: 100 },
                      { course: "React for Beginners", progress: 75 },
                      { course: "Advanced English for IT", progress: 60 },
                    ].map((course, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{course.course}</span>
                          <span className="text-sm text-muted-foreground">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("your_achievements")}</CardTitle>
                  <CardDescription>{t("achievements_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: t("first_course"),
                        description: t("completed_first_course"),
                        date: "2023-01-15",
                      },
                      {
                        title: t("coding_streak"),
                        description: t("seven_day_streak"),
                        date: "2023-02-10",
                      },
                      {
                        title: t("quiz_master"),
                        description: t("perfect_score"),
                        date: "2023-03-05",
                      },
                      {
                        title: t("fast_learner"),
                        description: t("completed_course_quickly"),
                        date: "2023-04-20",
                      },
                    ].map((achievement, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-500"
                          >
                            <circle cx="12" cy="8" r="7" />
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                          </svg>
                          <h3 className="font-medium">{achievement.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

