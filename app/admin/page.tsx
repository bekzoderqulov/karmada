"use client"

import { useAdminLanguage } from "@/context/admin-language-context"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-is-mobile"

export default function AdminDashboard() {
  const { t } = useAdminLanguage()
  const isMobile = useIsMobile()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">{t("dashboard")}</h1>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 md:p-6">
          <div className="text-sm font-medium text-muted-foreground">{t("totalUsers")}</div>
          <div className="text-2xl md:text-3xl font-bold">1,234</div>
          <div className="text-xs md:text-sm text-green-500 mt-2">+12% {t("comparedToLastMonth")}</div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="text-sm font-medium text-muted-foreground">{t("totalCourses")}</div>
          <div className="text-2xl md:text-3xl font-bold">24</div>
          <div className="text-xs md:text-sm text-green-500 mt-2">+3 {t("comparedToLastMonth")}</div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="text-sm font-medium text-muted-foreground">{t("monthlyIncome")}</div>
          <div className="text-2xl md:text-3xl font-bold">24,560,000 so'm</div>
          <div className="text-xs md:text-sm text-green-500 mt-2">+8% {t("comparedToLastMonth")}</div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="text-sm font-medium text-muted-foreground">{t("activeStudents")}</div>
          <div className="text-2xl md:text-3xl font-bold">856</div>
          <div className="text-xs md:text-sm text-green-500 mt-2">+5% {t("comparedToLastMonth")}</div>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4">{t("recentRegistrations")}</h2>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200"></div>
                  <div className="ml-3">
                    <div className="text-sm md:text-base font-medium">User {i}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">user{i}@example.com</div>
                  </div>
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">2h ago</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-4">{t("recentPurchases")}</h2>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-gray-200"></div>
                  <div className="ml-3">
                    <div className="text-sm md:text-base font-medium">Course {i}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">User {i}</div>
                  </div>
                </div>
                <div className="text-xs md:text-sm font-medium">250,000 so'm</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

