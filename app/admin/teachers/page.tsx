"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Trash, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useNotification } from "@/context/notification-context"
import { useAdminLanguage } from "@/context/admin-language-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define teacher type for consistency
type Teacher = {
  id: number
  name: string
  position: string
  specialty: string
  experience: string
  bio: string
  email: string
  phone: string
  image: string
  avatar?: string
  courses: number[]
  status: string
  // Additional fields
  specialization?: string
  rating?: number
  joinedAt?: string
}

export default function AdminTeachersPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { addNotification } = useNotification()
  const { language, t } = useAdminLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null)

  // Load teachers from localStorage
  const loadTeachers = () => {
    try {
      const storedTeachers = localStorage.getItem("teachers")
      if (storedTeachers) {
        const parsedTeachers = JSON.parse(storedTeachers)
        // Normalize data for consistency
        const normalizedTeachers = parsedTeachers.map((teacher: any) => ({
          ...teacher,
          // Use avatar if available, otherwise use image
          avatar: teacher.avatar || teacher.image,
          // Use position if available, otherwise use specialization or default
          position: teacher.position || teacher.specialization || t("teacher"),
          // Use specialty if available, otherwise use specialization or default
          specialty: teacher.specialty || teacher.specialization || t("englishLanguage"),
          // Check all required fields
          experience: teacher.experience || t("unknown"),
          bio: teacher.bio || `${teacher.name} - ${t("teacherBio")}`,
          status: teacher.status || t("active"),
          // Ensure courses is always an array
          courses: teacher.courses || [],
        }))
        setTeachers(normalizedTeachers)
        setFilteredTeachers(normalizedTeachers)
      } else {
        // If no teachers in localStorage, use sample data
        const sampleTeachers = [
          {
            id: 1,
            name: "Aziza Karimova",
            position: t("seniorEnglishTeacher"),
            specialty: t("englishLanguage"),
            experience: "8 " + t("years"),
            bio: t("azizaBio"),
            email: "aziza@example.com",
            phone: "+998 90 123 45 67",
            image: "/placeholder.svg?height=400&width=400&text=Aziza",
            courses: [1, 2],
            status: t("active"),
          },
          {
            id: 2,
            name: "Bobur Aliyev",
            position: t("itEnglishSpecialist"),
            specialty: t("itEnglish"),
            experience: "5 " + t("years"),
            bio: t("boburBio"),
            email: "bobur@example.com",
            phone: "+998 90 234 56 78",
            image: "/placeholder.svg?height=400&width=400&text=Bobur",
            courses: [2],
            status: t("active"),
          },
          {
            id: 3,
            name: "Jasur Toshmatov",
            position: t("seniorWebDeveloper"),
            specialty: t("webDevelopment"),
            experience: "7 " + t("years"),
            bio: t("jasurBio"),
            email: "jasur@example.com",
            phone: "+998 90 345 67 89",
            image: "/placeholder.svg?height=400&width=400&text=Jasur",
            courses: [3],
            status: t("active"),
          },
          {
            id: 4,
            name: "Dilshod Rahimov",
            position: t("pythonDeveloper"),
            specialty: t("pythonProgramming"),
            experience: "4 " + t("years"),
            bio: t("dilshodBio"),
            email: "dilshod@example.com",
            phone: "+998 90 456 78 90",
            image: "/placeholder.svg?height=400&width=400&text=Dilshod",
            courses: [4],
            status: t("active"),
          },
          {
            id: 5,
            name: "Malika Umarova",
            position: t("javaDeveloper"),
            specialty: t("javaProgramming"),
            experience: "6 " + t("years"),
            bio: t("malikaBio"),
            email: "malika@example.com",
            phone: "+998 90 567 89 01",
            image: "/placeholder.svg?height=400&width=400&text=Malika",
            courses: [5],
            status: t("active"),
          },
        ]
        setTeachers(sampleTeachers)
        setFilteredTeachers(sampleTeachers)
        localStorage.setItem("teachers", JSON.stringify(sampleTeachers))
      }
    } catch (error) {
      console.error(t("teacherLoadError"), error)
      toast({
        title: t("error"),
        description: t("teacherLoadErrorMessage"),
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadTeachers()
  }, [language, toast, t])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredTeachers(teachers)
    } else {
      const filtered = teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(query) ||
          teacher.position.toLowerCase().includes(query) ||
          teacher.specialty.toLowerCase().includes(query) ||
          teacher.bio.toLowerCase().includes(query),
      )
      setFilteredTeachers(filtered)
    }
  }

  const handleAddTeacher = () => {
    router.push("/admin/teachers/add")
  }

  const openDeleteDialog = (id: number) => {
    setTeacherToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteTeacher = () => {
    if (teacherToDelete === null) return

    // Find the teacher to delete
    const teacherToDeleteObj = teachers.find((teacher) => teacher.id === teacherToDelete)
    if (!teacherToDeleteObj) return

    // Filter out the teacher with the given ID
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== teacherToDelete)

    // Update state
    setTeachers(updatedTeachers)
    setFilteredTeachers(
      updatedTeachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.bio.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )

    // Update localStorage
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers))

    // Close dialog
    setIsDeleteDialogOpen(false)
    setTeacherToDelete(null)

    // Show success message
    toast({
      title: t("teacherDeleted"),
      description: `"${teacherToDeleteObj.name}" ${t("teacherDeletedSuccess")}`,
    })

    // Send notification to users
    addNotification({
      userId: null, // null means for all users
      title: t("teacherDeleted"),
      message: `"${teacherToDeleteObj.name}" ${t("teacherDeletedNotification")}`,
      type: "teacher-deleted",
      time: new Date().toISOString(),
      read: false,
    })
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("manageTeachers")}</h1>
        <Button onClick={handleAddTeacher}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addNewTeacher")}
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("searchTeachers")} className="pl-10" value={searchQuery} onChange={handleSearch} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("teachersList")}</CardTitle>
          <CardDescription>{t("manageAllTeachers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">{t("name")}</th>
                  <th className="py-3 px-4 text-left font-medium">{t("position")}</th>
                  <th className="py-3 px-4 text-left font-medium">{t("specialization")}</th>
                  <th className="py-3 px-4 text-left font-medium">{t("experience")}</th>
                  <th className="py-3 px-4 text-left font-medium">{t("courses")}</th>
                  <th className="py-3 px-4 text-left font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher, i) => (
                  <tr key={teacher.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="py-3 px-4">{teacher.name}</td>
                    <td className="py-3 px-4">{teacher.position}</td>
                    <td className="py-3 px-4">{teacher.specialty}</td>
                    <td className="py-3 px-4">{teacher.experience}</td>
                    <td className="py-3 px-4">{teacher.courses?.length || 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/teachers/edit/${teacher.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {t("edit")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(teacher.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          {t("delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeleteTeacher")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteTeacherWarning")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeacher} className="bg-destructive text-destructive-foreground">
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

