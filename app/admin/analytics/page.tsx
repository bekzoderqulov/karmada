"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Users, BookOpen, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAdminLanguage } from "@/context/admin-language-context"

export default function AnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useAdminLanguage()
  const [activeTab, setActiveTab] = useState("overview")

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: t("downloadReport"),
      description: `${reportType} ${t("downloadReport")}...`,
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{t("analytics")}</h1>
        </div>
        <Button onClick={() => handleDownloadReport(t("overview"))}>
          <Download className="mr-2 h-4 w-4" />
          {t("downloadReport")}
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="courses">{t("courses")}</TabsTrigger>
          <TabsTrigger value="revenue">{t("revenue")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t("totalUsers")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+12%</span> {t("comparedToLastMonth")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t("activeStudents")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">789</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+5%</span> {t("comparedToLastMonth")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t("totalCourses")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+3</span> {t("comparedToLastMonth")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t("monthlyIncome")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,560,000 so'm</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+8%</span> {t("comparedToLastMonth")}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("statistics")}</CardTitle>
              <CardDescription>{t("activityLast30Days")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">{t("chartWillBeDisplayedHere")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("userStatistics")}</CardTitle>
              <CardDescription>{t("userAnalytics")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">{t("chartWillBeDisplayedHere")}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("userStatistics")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          <Users className="h-4 w-4 inline mr-2" />
                          {t("recentRegistrations")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("today")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          <Users className="h-4 w-4 inline mr-2" />
                          {t("activeUsers")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">789</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("activityLast30Days")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-2" />
                          {t("averageCourses")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3.2 {t("courses")}</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("perPage")}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("courseStatistics")}</CardTitle>
              <CardDescription>{t("courseAnalytics")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">{t("chartWillBeDisplayedHere")}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("mostPopularCourses")}</h3>
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left font-medium">{t("courseTitle")}</th>
                          <th className="py-3 px-4 text-left font-medium">{t("students")}</th>
                          <th className="py-3 px-4 text-left font-medium">{t("rating")}</th>
                          <th className="py-3 px-4 text-left font-medium">{t("revenue")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Ingliz tili asoslari", students: 245, rating: 4.8, revenue: "294,000,000" },
                          { name: "IT ingliz tili", students: 187, rating: 4.9, revenue: "280,500,000" },
                          { name: "Web dasturlash", students: 156, rating: 4.7, revenue: "280,800,000" },
                          { name: "Python asoslari", students: 98, rating: 4.6, revenue: "137,200,000" },
                          { name: "Java dasturlash", students: 76, rating: 4.5, revenue: "121,600,000" },
                        ].map((course, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                            <td className="py-3 px-4">{course.name}</td>
                            <td className="py-3 px-4">{course.students}</td>
                            <td className="py-3 px-4">{course.rating} / 5</td>
                            <td className="py-3 px-4">{course.revenue} so'm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("revenueStatistics")}</CardTitle>
              <CardDescription>{t("revenueAnalytics")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">{t("chartWillBeDisplayedHere")}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("revenueStatistics")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          <DollarSign className="h-4 w-4 inline mr-2" />
                          {t("totalCourses")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,114,100,000 so'm</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("allTime")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          <DollarSign className="h-4 w-4 inline mr-2" />
                          {t("monthlyIncome")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">24,560,000 so'm</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("currentMonth")}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          <BookOpen className="h-4 w-4 inline mr-2" />
                          {t("revenueByCourse")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">46,420,000 so'm</div>
                        <p className="text-xs text-muted-foreground mt-1">{t("average")}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

