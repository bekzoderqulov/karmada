"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Clock, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useAdminLanguage } from "@/context/admin-language-context"
import ConfirmDialog from "@/components/confirm-dialog"
import { useIsMobile } from "@/hooks/use-is-mobile"

export default function CoursesPage() {
  const { t } = useAdminLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const isMobile = useIsMobile()

  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null)

  // Load courses from localStorage
  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem("courses")
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses)
        setCourses(parsedCourses)
        setFilteredCourses(parsedCourses)
      } else {
        // Initialize with empty array if no courses found
        setCourses([])
        setFilteredCourses([])
        localStorage.setItem("courses", JSON.stringify([]))
      }
    } catch (error) {
      console.error("Failed to load courses:", error)
      toast({
        title: t("error"),
        description: t("failedToLoadCourses"),
        variant: "destructive",
      })
      setCourses([])
      setFilteredCourses([])
    } finally {
      setIsLoading(false)
    }
  }, [t, toast])

  // Apply filters when search query or filters change
  useEffect(() => {
    let filtered = courses

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter)
    }

    // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((course) => course.level === levelFilter)
    }

    setFilteredCourses(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, statusFilter, levelFilter, courses])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Handle delete course
  const handleDeleteClick = (courseId: number) => {
    setCourseToDelete(courseId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (courseToDelete) {
      const updatedCourses = courses.filter((course) => course.id !== courseToDelete)
      setCourses(updatedCourses)
      setFilteredCourses(updatedCourses)
      localStorage.setItem("courses", JSON.stringify(updatedCourses))
      toast({
        title: t("courseDeleted"),
        description: t("courseDeletedSuccessfully"),
      })
    }
    setShowDeleteConfirm(false)
    setCourseToDelete(null)
  }

  const handleDeleteCourse = (courseId: number) => {
    setCourseToDelete(courseId)
    setShowDeleteConfirm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight">{t("courses")}</h2>
        <Button size="sm" className="h-7 text-xs" onClick={() => router.push("/admin/courses/add")}>
          <Plus className="h-3 w-3 mr-1" /> {t("addCourse")}
        </Button>
      </div>

      <Card className="admin-card">
        <CardHeader className="p-3">
          <CardTitle className="text-base">{t("courseManagement")}</CardTitle>
          <CardDescription className="text-xs">{t("manageCoursesDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder={t("searchCourses")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 h-7 text-xs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="Faol">{t("active")}</SelectItem>
                <SelectItem value="Rejada">{t("planned")}</SelectItem>
                <SelectItem value="Arxivlangan">{t("archived")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder={t("level")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allLevels")}</SelectItem>
                <SelectItem value="Beginner">{t("beginner")}</SelectItem>
                <SelectItem value="Intermediate">{t("intermediate")}</SelectItem>
                <SelectItem value="Advanced">{t("advanced")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-7 text-xs flex items-center">
              <Filter className="h-3 w-3 mr-1" />
              {t("moreFilters")}
            </Button>
          </div>

          {/* Courses Table */}
          <div className="rounded-md border overflow-hidden">
            <Table className="admin-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">{t("id")}</TableHead>
                  <TableHead>{t("title")}</TableHead>
                  {!isMobile && <TableHead>{t("level")}</TableHead>}
                  {!isMobile && <TableHead>{t("duration")}</TableHead>}
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-4">
                      {t("loading")}
                    </TableCell>
                  </TableRow>
                ) : currentItems.length > 0 ? (
                  currentItems.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.id}</TableCell>
                      <TableCell>
                        <div className="font-medium truncate max-w-[150px] md:max-w-[200px]">{course.title}</div>
                      </TableCell>
                      {!isMobile && <TableCell>{course.level}</TableCell>}
                      {!isMobile && (
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {course.duration}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            course.status === "Faol"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : course.status === "Rejada"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                          }`}
                        >
                          {course.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Eye className="h-3 w-3" />
                              <span className="sr-only">{t("view")}</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                            <Link href={`/admin/courses/edit/${course.id}`}>
                              <Edit className="h-3 w-3" />
                              <span className="sr-only">{t("edit")}</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleDeleteClick(course.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">{t("delete")}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-4">
                      {t("noCoursesFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredCourses.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {t("showing")} {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCourses.length)} {t("of")}{" "}
                {filteredCourses.length} {t("courses")}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span className="sr-only">{t("previous")}</span>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handlePageChange(page)}
                  >
                    <span className="text-xs">{page}</span>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-3 w-3" />
                  <span className="sr-only">{t("next")}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 border-t flex justify-between">
          <div className="text-xs text-muted-foreground">
            {t("totalCourses")}: {filteredCourses.length}
          </div>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="h-7 w-[100px] text-xs">
              <SelectValue placeholder={t("perPage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 {t("perPage")}</SelectItem>
              <SelectItem value="10">10 {t("perPage")}</SelectItem>
              <SelectItem value="20">20 {t("perPage")}</SelectItem>
              <SelectItem value="50">50 {t("perPage")}</SelectItem>
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title={t("deleteCourse")}
        description={t("deleteCourseConfirmation")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </div>
  )
}

