"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, UserPlus, Mail, Phone, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAdminLanguage } from "@/context/admin-language-context"

export default function AdminUsersPage() {
  const { toast } = useToast()
  const { getAllUsers, updateUserPermissions, toggleUserActive } = useAuth()
  const { t } = useAdminLanguage()
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

  // Load users only once when component mounts
  useEffect(() => {
    // Load registered users
    const registeredUsers = getAllUsers()
    if (registeredUsers.length > 0) {
      setUsers(registeredUsers)
      setFilteredUsers(registeredUsers)
    } else {
      // Fallback to demo data if no registered users
      const demoUsers = [
        {
          id: 1,
          name: "Alisher Karimov",
          email: "alisher@example.com",
          phone: "+998 90 123 45 67",
          courses: 2,
          registeredAt: "2023-05-15T10:30:00Z",
          role: "user",
          active: true,
        },
        {
          id: 2,
          name: "Dilnoza Rahimova",
          email: "dilnoza@example.com",
          phone: "+998 90 234 56 78",
          courses: 1,
          registeredAt: "2023-06-20T14:45:00Z",
          role: "user",
          active: true,
        },
        {
          id: 3,
          name: "Bobur Aliyev",
          email: "bobur@example.com",
          phone: "+998 90 345 67 89",
          courses: 3,
          registeredAt: "2023-07-10T09:15:00Z",
          role: "user",
          active: true,
        },
        {
          id: 4,
          name: "Malika Umarova",
          email: "malika@example.com",
          phone: "+998 90 456 78 90",
          courses: 0,
          registeredAt: "2023-08-05T16:30:00Z",
          role: "user",
          active: true,
        },
        {
          id: 5,
          name: "Jasur Toshmatov",
          email: "jasur@example.com",
          phone: "+998 90 567 89 01",
          courses: 1,
          registeredAt: "2023-09-12T11:20:00Z",
          role: "user",
          active: true,
        },
      ]
      setUsers(demoUsers)
      setFilteredUsers(demoUsers)
    }
    setIsLoading(false)
  }, [getAllUsers])

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const lowercaseQuery = searchQuery.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.phone.includes(searchQuery),
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleAddUser = () => {
    toast({
      title: t("addUser"),
      description: t("noPermissionAddUsers"),
    })
  }

  const handleToggleActive = (userId: number, currentActive: boolean) => {
    toggleUserActive(userId, !currentActive)

    // Update local state to reflect the change
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, active: !currentActive } : user)))
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("users")}</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("addUser")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("userManagement")} ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("registeredAt")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {t("loading")}
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.role || t("user")}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Phone className="mr-1 h-4 w-4" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(user.registeredAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? t("active") : t("inactive")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("actions")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: t("edit"),
                                description: `${user.name} ${t("userEmail")}: ${user.email}`,
                              })
                            }}
                          >
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: t("permissions"),
                                description: `${t("permissions")} ${user.name}`,
                              })
                            }}
                          >
                            {t("permissions")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(user.id, user.active)}>
                            {user.active ? t("deactivate") : t("activate")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

