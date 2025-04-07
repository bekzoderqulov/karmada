"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useAdminLanguage } from "@/context/admin-language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Plus } from "lucide-react"
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

type ScheduleItem = {
  id: number
  courseId: number
  teacherId: number
  dayOfWeek: string
  startTime: string
  endTime: string
  room: string
}

type Course = {
  id: number
  title: string
}

type Teacher = {
  id: number
  name: string
}

export default function SchedulePage() {
  const { toast } = useToast()
  const { hasPermission } = useAuth()
  const { t } = useAdminLanguage()
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeDay, setActiveDay] = useState("monday")
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    id: 0,
    courseId: 0,
    teacherId: 0,
    dayOfWeek: "monday",
    startTime: "09:00",
    endTime: "10:30",
    room: "A101",
  })

  const daysOfWeek = [
    { value: "monday", label: t("monday") },
    { value: "tuesday", label: t("tuesday") },
    { value: "wednesday", label: t("wednesday") },
    { value: "thursday", label: t("thursday") },
    { value: "friday", label: t("friday") },
    { value: "saturday", label: t("saturday") },
    { value: "sunday", label: t("sunday") },
  ]

  useEffect(() => {
    // Load schedule, courses, and teachers from localStorage
    try {
      const storedSchedule = localStorage.getItem("schedule")
      const storedCourses = localStorage.getItem("courses")
      const storedTeachers = localStorage.getItem("teachers")

      if (storedCourses) {
        setCourses(JSON.parse(storedCourses))
      } else {
        // Sample courses data
        const sampleCourses = [
          { id: 1, title: "English for Beginners" },
          { id: 2, title: "Business English" },
          { id: 3, title: "IELTS Preparation" },
          { id: 4, title: "English Grammar" },
        ]
        setCourses(sampleCourses)
        localStorage.setItem("courses", JSON.stringify(sampleCourses))
      }

      if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers))
      } else {
        // Sample teachers data
        const sampleTeachers = [
          { id: 1, name: "John Smith" },
          { id: 2, name: "Sarah Johnson" },
          { id: 3, name: "Michael Brown" },
        ]
        setTeachers(sampleTeachers)
        localStorage.setItem("teachers", JSON.stringify(sampleTeachers))
      }

      if (storedSchedule) {
        setSchedule(JSON.parse(storedSchedule))
      } else {
        // Sample data if no schedule found
        const sampleSchedule: ScheduleItem[] = [
          {
            id: 1,
            courseId: 1,
            teacherId: 1,
            dayOfWeek: "monday",
            startTime: "09:00",
            endTime: "10:30",
            room: "A101",
          },
          {
            id: 2,
            courseId: 2,
            teacherId: 1,
            dayOfWeek: "monday",
            startTime: "11:00",
            endTime: "12:30",
            room: "A102",
          },
          {
            id: 3,
            courseId: 3,
            teacherId: 2,
            dayOfWeek: "tuesday",
            startTime: "09:00",
            endTime: "10:30",
            room: "B201",
          },
          {
            id: 4,
            courseId: 1,
            teacherId: 1,
            dayOfWeek: "wednesday",
            startTime: "09:00",
            endTime: "10:30",
            room: "A101",
          },
          {
            id: 5,
            courseId: 2,
            teacherId: 1,
            dayOfWeek: "wednesday",
            startTime: "11:00",
            endTime: "12:30",
            room: "A102",
          },
          {
            id: 6,
            courseId: 3,
            teacherId: 2,
            dayOfWeek: "thursday",
            startTime: "09:00",
            endTime: "10:30",
            room: "B201",
          },
        ]
        setSchedule(sampleSchedule)
        localStorage.setItem("schedule", JSON.stringify(sampleSchedule))
      }
    } catch (error) {
      console.error("Failed to load schedule data:", error)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddSchedule = () => {
    setIsEditing(false)
    setFormData({
      id: 0,
      courseId: courses.length > 0 ? courses[0].id : 0,
      teacherId: teachers.length > 0 ? teachers[0].id : 0,
      dayOfWeek: activeDay,
      startTime: "09:00",
      endTime: "10:30",
      room: "A101",
    })
    setIsDialogOpen(true)
  }

  const handleEditSchedule = (item: ScheduleItem) => {
    setIsEditing(true)
    setFormData({
      id: item.id,
      courseId: item.courseId,
      teacherId: item.teacherId,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
    })
    setIsDialogOpen(true)
  }

  const confirmDeleteSchedule = (id: number) => {
    setItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteSchedule = () => {
    if (!hasPermission("manage_courses") || itemToDelete === null) {
      toast({
        title: t("accessDenied"),
        description: t("failedToSaveData"),
        variant: "destructive",
      })
      return
    }

    const updatedSchedule = schedule.filter((item) => item.id !== itemToDelete)
    setSchedule(updatedSchedule)
    localStorage.setItem("schedule", JSON.stringify(updatedSchedule))

    toast({
      title: t("success"),
      description: t("deletedSuccessfully"),
    })

    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const handleSaveSchedule = () => {
    if (!hasPermission("manage_courses")) {
      toast({
        title: t("accessDenied"),
        description: t("failedToSaveData"),
        variant: "destructive",
      })
      return
    }

    try {
      let updatedSchedule: ScheduleItem[]

      if (isEditing) {
        // Update existing schedule item
        updatedSchedule = schedule.map((item) => (item.id === formData.id ? { ...formData } : item))
      } else {
        // Add new schedule item
        const newId = Math.max(0, ...schedule.map((item) => item.id)) + 1
        updatedSchedule = [...schedule, { ...formData, id: newId }]
      }

      setSchedule(updatedSchedule)
      localStorage.setItem("schedule", JSON.stringify(updatedSchedule))

      toast({
        title: t("success"),
        description: isEditing ? t("savedSuccessfully") : t("addSchedule"),
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save schedule:", error)
      toast({
        title: t("error"),
        description: t("failedToSaveData"),
        variant: "destructive",
      })
    }
  }

  const getCourseTitle = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId)
    return course ? course.title : t("noResults")
  }

  const getTeacherName = (teacherId: number) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? teacher.name : t("noResults")
  }

  const getScheduleForDay = (day: string) => {
    return schedule.filter((item) => item.dayOfWeek === day)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("scheduleManagement")}</h1>
        <Button onClick={handleAddSchedule}>
          <Plus className="mr-2 h-4 w-4" /> {t("addNewClass")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("weeklySchedule")}</CardTitle>
          <CardDescription>{t("manageCoursesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monday" value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="grid grid-cols-7">
              {daysOfWeek.map((day) => (
                <TabsTrigger key={day.value} value={day.value}>
                  {day.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {daysOfWeek.map((day) => (
              <TabsContent key={day.value} value={day.value}>
                <Card>
                  <CardHeader>
                    <CardTitle>{day.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getScheduleForDay(day.value).length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("time")}</TableHead>
                            <TableHead>{t("course")}</TableHead>
                            <TableHead>{t("instructor")}</TableHead>
                            <TableHead>{t("room")}</TableHead>
                            <TableHead>{t("actions")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getScheduleForDay(day.value)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.startTime} - {item.endTime}
                                </TableCell>
                                <TableCell>{getCourseTitle(item.courseId)}</TableCell>
                                <TableCell>{getTeacherName(item.teacherId)}</TableCell>
                                <TableCell>{item.room}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => handleEditSchedule(item)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => confirmDeleteSchedule(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">{t("noClassesForDay")}</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? t("editSchedule") : t("addSchedule")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="dayOfWeek" className="text-right">
                {t("day")}
              </label>
              <Select value={formData.dayOfWeek} onValueChange={(value) => handleSelectChange("dayOfWeek", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("selectDay")} />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startTime" className="text-right">
                {t("startTime")}
              </label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endTime" className="text-right">
                {t("endTime")}
              </label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="courseId" className="text-right">
                {t("course")}
              </label>
              <Select
                value={formData.courseId.toString()}
                onValueChange={(value) => handleSelectChange("courseId", Number.parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("selectCourse")} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="teacherId" className="text-right">
                {t("instructor")}
              </label>
              <Select
                value={formData.teacherId.toString()}
                onValueChange={(value) => handleSelectChange("teacherId", Number.parseInt(value))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("selectTeacher")} />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="room" className="text-right">
                {t("room")}
              </label>
              <Input id="room" name="room" value={formData.room} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveSchedule}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDeleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchedule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

