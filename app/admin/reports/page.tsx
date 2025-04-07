"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { usePurchase } from "@/context/purchase-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminLanguage } from "@/context/admin-language-context"

export default function AdminReportsPage() {
  const { toast } = useToast()
  const { getAllPurchases } = usePurchase()
  const { t } = useAdminLanguage()
  const allPurchases = getAllPurchases()

  // If there are no purchases in context, use sample data
  const [orders] = useState(
    allPurchases.length > 0
      ? allPurchases
      : [
          {
            id: "ORD-001",
            userId: 1,
            courseId: 1,
            courseTitle: "Ingliz tili asoslari",
            price: 1200000,
            date: "2023-05-15T10:30:00Z",
            status: "to'langan" as const,
            paymentMethod: "click",
          },
          {
            id: "ORD-002",
            userId: 2,
            courseId: 2,
            courseTitle: "IT ingliz tili",
            price: 1500000,
            date: "2023-05-16T14:20:00Z",
            status: "to'langan" as const,
            paymentMethod: "payme",
          },
          {
            id: "ORD-003",
            userId: 3,
            courseId: 3,
            courseTitle: "Web dasturlash",
            price: 1800000,
            date: "2023-05-17T09:15:00Z",
            status: "kutilmoqda" as const,
            paymentMethod: "bank",
          },
          {
            id: "ORD-004",
            userId: 4,
            courseId: 1,
            courseTitle: "Ingliz tili asoslari",
            price: 1200000,
            date: "2023-05-18T16:45:00Z",
            status: "bekor qilingan" as const,
            paymentMethod: "click",
          },
          {
            id: "ORD-005",
            userId: 3,
            courseId: 2,
            courseTitle: "IT ingliz tili",
            price: 1500000,
            date: "2023-05-19T11:10:00Z",
            status: "to'langan" as const,
            paymentMethod: "cash",
          },
        ],
  )

  const [timeRange, setTimeRange] = useState("all")
  const [reportType, setReportType] = useState("sales")

  const handleDownloadReport = () => {
    toast({
      title: t("downloadingReport"),
      description: `${reportType === "sales" ? t("salesReport") : t("userReport")} ${t("downloading")}...`,
    })
  }

  // Calculate revenue by course
  const revenueByCourse = orders
    .filter((order) => order.status === "to'langan")
    .reduce(
      (acc, order) => {
        const { courseTitle, price } = order
        if (!acc[courseTitle]) {
          acc[courseTitle] = 0
        }
        acc[courseTitle] += price
        return acc
      },
      {} as Record<string, number>,
    )

  // Calculate revenue by payment method
  const revenueByPaymentMethod = orders
    .filter((order) => order.status === "to'langan")
    .reduce(
      (acc, order) => {
        const { paymentMethod, price } = order
        if (!acc[paymentMethod]) {
          acc[paymentMethod] = 0
        }
        acc[paymentMethod] += price
        return acc
      },
      {} as Record<string, number>,
    )

  // Calculate monthly revenue for the chart
  const monthlyRevenueData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - i)
    month.setDate(1)
    month.setHours(0, 0, 0, 0)

    const nextMonth = new Date(month)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const revenue = orders
      .filter(
        (order) => order.status === "to'langan" && new Date(order.date) >= month && new Date(order.date) < nextMonth,
      )
      .reduce((sum, order) => sum + order.price, 0)

    return {
      month: month.toLocaleDateString("uz-UZ", { month: "short" }),
      revenue,
    }
  }).reverse()

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("reports")}</h1>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("timeRange")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t("lastWeek")}</SelectItem>
              <SelectItem value="month">{t("lastMonth")}</SelectItem>
              <SelectItem value="year">{t("lastYear")}</SelectItem>
              <SelectItem value="all">{t("allTime")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            {t("downloadReport")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sales">{t("salesReport")}</TabsTrigger>
          <TabsTrigger value="users">{t("userReport")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          {/* Revenue by Course */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("revenueByCourse")}</CardTitle>
                <CardDescription>{t("totalRevenuePerCourse")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(revenueByCourse).map(([course, revenue]) => (
                    <div key={course} className="flex justify-between items-center">
                      <span className="font-medium">{course}</span>
                      <span>
                        {new Intl.NumberFormat("uz-UZ").format(revenue)} {t("currency")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("revenueByPaymentMethod")}</CardTitle>
                <CardDescription>{t("totalRevenuePerPaymentMethod")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(revenueByPaymentMethod).map(([method, revenue]) => (
                    <div key={method} className="flex justify-between items-center">
                      <span className="font-medium capitalize">{method}</span>
                      <span>
                        {new Intl.NumberFormat("uz-UZ").format(revenue)} {t("currency")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t("monthlyRevenue")}</CardTitle>
              <CardDescription>{t("monthlyRevenueForLast12Months")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="flex h-full items-end gap-2">
                  {monthlyRevenueData.map((data, index) => {
                    const height = data.revenue
                      ? `${(data.revenue / Math.max(...monthlyRevenueData.map((d) => d.revenue))) * 100}%`
                      : "0%"
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-primary/20 rounded-t" style={{ height }}>
                          <div className="w-full h-full bg-primary opacity-80 rounded-t"></div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{data.month}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t("userStatistics")}</CardTitle>
              <CardDescription>{t("userActivityInformation")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{t("totalUsers")}</h3>
                  <p className="text-3xl font-bold">1,234</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{t("activeStudents")}</h3>
                  <p className="text-3xl font-bold">856</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{t("averageCourses")}</h3>
                  <p className="text-3xl font-bold">2.3</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">{t("mostPopularCourses")}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Ingliz tili asoslari</span>
                    <span className="font-medium">245 {t("students")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>IT ingliz tili</span>
                    <span className="font-medium">187 {t("students")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Web dasturlash</span>
                    <span className="font-medium">156 {t("students")}</span>
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

