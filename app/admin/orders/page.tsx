"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { usePurchase } from "@/context/purchase-context"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminOrdersPage() {
  // usePurchase qismini o'zgartirish kerak
  const { toast } = useToast()
  const { getAllPurchases } = usePurchase()
  const allPurchases = getAllPurchases()

  // [orders] qismini o'zgartirish kerak
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

  // Foydalanuvchi ismlarini olish (haqiqiy ilovada bu ma'lumotlar bazasidan kelar edi)
  const getUserName = (userId: number) => {
    const users = {
      1: "Alisher Karimov",
      2: "Dilnoza Rahimova",
      3: "Bobur Aliyev",
      4: "Jasur Toshmatov",
    }
    return users[userId as keyof typeof users] || "Foydalanuvchi"
  }

  const handleViewOrder = (id: string) => {
    toast({
      title: "Buyurtma ma'lumotlari",
      description: `ID: ${id} - Buyurtma ma'lumotlari ko'rilmoqda`,
    })
  }

  // Jami daromadni hisoblash
  const totalRevenue = orders
    .filter((order) => order.status === "to'langan")
    .reduce((sum, order) => sum + order.price, 0)

  // Oylik daromadni hisoblash (so'nggi 30 kun)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const monthlyRevenue = orders
    .filter((order) => order.status === "to'langan" && new Date(order.date) >= thirtyDaysAgo)
    .reduce((sum, order) => sum + order.price, 0)

  // Haftalik daromadni hisoblash (so'nggi 7 kun)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const weeklyRevenue = orders
    .filter((order) => order.status === "to'langan" && new Date(order.date) >= sevenDaysAgo)
    .reduce((sum, order) => sum + order.price, 0)

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />

      <div className="flex-1">
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Buyurtmalarni boshqarish</h1>
          </div>

          {/* Daromad statistikasi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Haftalik daromad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat("uz-UZ").format(weeklyRevenue)} so'm</div>
                <p className="text-xs text-muted-foreground mt-1">So'nggi 7 kun</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Oylik daromad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat("uz-UZ").format(monthlyRevenue)} so'm</div>
                <p className="text-xs text-muted-foreground mt-1">So'nggi 30 kun</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Jami daromad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat("uz-UZ").format(totalRevenue)} so'm</div>
                <p className="text-xs text-muted-foreground mt-1">Barcha vaqt davomida</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buyurtmalar ro'yxati</CardTitle>
              <CardDescription>Barcha kurs buyurtmalarini boshqaring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Foydalanuvchi</th>
                      <th className="py-3 px-4 text-left font-medium">Kurs</th>
                      <th className="py-3 px-4 text-left font-medium">Narxi</th>
                      <th className="py-3 px-4 text-left font-medium">Sana</th>
                      <th className="py-3 px-4 text-left font-medium">Holati</th>
                      <th className="py-3 px-4 text-left font-medium">To'lov usuli</th>
                      <th className="py-3 px-4 text-left font-medium">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={order.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="py-3 px-4">{order.id}</td>
                        <td className="py-3 px-4">{getUserName(order.userId)}</td>
                        <td className="py-3 px-4">{order.courseTitle}</td>
                        <td className="py-3 px-4">{new Intl.NumberFormat("uz-UZ").format(order.price)} so'm</td>
                        <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "to'langan"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : order.status === "kutilmoqda"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{order.paymentMethod}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Batafsil
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

