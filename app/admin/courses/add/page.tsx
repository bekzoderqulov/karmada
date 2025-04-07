"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useNotification } from "@/context/notification-context"
import { useAdminLanguage } from "@/context/admin-language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  FileQuestion,
  Edit,
  Check,
  Clock,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function AddCoursePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addNotification } = useNotification()
  const { t, language } = useAdminLanguage()

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    level: t("beginner"),
    duration: "",
    lessons: "",
    price: "",
    image: "/placeholder.svg?height=200&width=400&text=Kurs+Rasmi",
    status: t("active"),
    modules: [
      {
        title: `${t("moduleTitle")} 1`,
        lessons: [
          {
            title: `${t("lessonTitle")} 1`,
            content: "",
            duration: "30",
            videoUrl: "",
            practiceExercises: [],
          },
        ],
      },
    ],
    instructor: "",
    instructorTitle: "",
    instructorImage: "/placeholder.svg?height=100&width=100&text=O'qituvchi",
    tests: [],
    materials: [],
    translations: {
      uz: {
        title: "",
        description: "",
        longDescription: "",
        topics: [],
        syllabus: [],
      },
      ru: {
        title: "",
        description: "",
        longDescription: "",
        topics: [],
        syllabus: [],
      },
      en: {
        title: "",
        description: "",
        longDescription: "",
        topics: [],
        syllabus: [],
      },
    },
    topics: [t("itTerminology"), t("professionalCommunication"), t("technicalDocumentation")],
    longDescription: t("courseDetailedDescription"),
  })

  // State for test editing
  const [currentTest, setCurrentTest] = useState<any>(null)
  const [currentTestIndex, setCurrentTestIndex] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)

  // State for test creation dialog
  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false)
  const [newTestData, setNewTestData] = useState({
    title: "",
    description: t("testDescription"),
    questionCount: 5,
    timeLimit: 30,
    passingScore: 70,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCourseData({ ...courseData, [name]: value })

    // Current language translation is automatically updated when main fields change
    if (name === "title" || name === "description" || name === "longDescription") {
      setCourseData((prev) => ({
        ...prev,
        translations: {
          ...prev.translations,
          [language]: {
            ...prev.translations[language],
            [name]: value,
          },
        },
      }))
    }
  }

  const handleNewTestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTestData({ ...newTestData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCourseData({ ...courseData, [name]: value })
  }

  const handleAddModule = () => {
    const newModules = [...courseData.modules]
    newModules.push({
      title: `${t("moduleTitle")} ${newModules.length + 1}`,
      lessons: [
        {
          title: `${t("lessonTitle")} 1`,
          content: "",
          duration: "30",
          videoUrl: "",
          practiceExercises: [],
        },
      ],
    })
    setCourseData({ ...courseData, modules: newModules })
  }

  const handleRemoveModule = (index: number) => {
    const newModules = [...courseData.modules]
    newModules.splice(index, 1)
    setCourseData({ ...courseData, modules: newModules })
  }

  const handleModuleChange = (index: number, value: string) => {
    const newModules = [...courseData.modules]
    newModules[index].title = value
    setCourseData({ ...courseData, modules: newModules })
  }

  const handleAddLesson = (moduleIndex: number) => {
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons.push({
      title: `${t("lessonTitle")} ${newModules[moduleIndex].lessons.length + 1}`,
      content: "",
      duration: "30",
      videoUrl: "",
      practiceExercises: [],
    })
    setCourseData({ ...courseData, modules: newModules })
  }

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons.splice(lessonIndex, 1)
    setCourseData({ ...courseData, modules: newModules })
  }

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons[lessonIndex][field] = value
    setCourseData({ ...courseData, modules: newModules })
  }

  // Create a new test with specified number of questions
  const handleCreateTest = () => {
    // Create questions array with the specified number of questions
    const questions = []
    for (let i = 0; i < Number.parseInt(newTestData.questionCount.toString()); i++) {
      questions.push({
        id: Date.now() + i,
        question: `${t("question")} ${i + 1}`,
        options: [`${t("answer")} 1`, `${t("answer")} 2`, `${t("answer")} 3`, `${t("answer")} 4`],
        correctAnswer: 0,
        explanation: t("correctAnswerExplanation"),
      })
    }

    // Create the new test
    const newTest = {
      id: Date.now(),
      title: newTestData.title || `${t("test")} ${(courseData.tests || []).length + 1}`,
      description: newTestData.description,
      questions: questions,
      timeLimit: Number.parseInt(newTestData.timeLimit.toString()),
      passingScore: Number.parseInt(newTestData.passingScore.toString()),
      createdAt: new Date().toISOString(),
    }

    // Add the new test to the course data
    const newTests = [...(courseData.tests || []), newTest]
    setCourseData({ ...courseData, tests: newTests })

    // Reset the new test data form
    setNewTestData({
      title: "",
      description: t("testDescription"),
      questionCount: 5,
      timeLimit: 30,
      passingScore: 70,
    })

    // Close the dialog
    setIsAddTestDialogOpen(false)
  }

  const handleUpdateTest = (updatedTest: any) => {
    if (currentTestIndex === null) return

    const newTests = [...(courseData.tests || [])]
    newTests[currentTestIndex] = updatedTest
    setCourseData({ ...courseData, tests: newTests })
  }

  const handleRemoveTest = (index: number) => {
    const newTests = [...(courseData.tests || [])]
    newTests.splice(index, 1)
    setCourseData({ ...courseData, tests: newTests })
  }

  const handleEditTest = (test: any, index: number) => {
    setCurrentTest({ ...test })
    setCurrentTestIndex(index)
  }

  const handleAddQuestion = () => {
    if (!currentTest) return

    const newQuestion = {
      id: Date.now(),
      question: t("newQuestion"),
      options: [`${t("answer")} 1`, `${t("answer")} 2`, `${t("answer")} 3`, `${t("answer")} 4`],
      correctAnswer: 0,
      explanation: t("correctAnswerExplanation"),
    }

    const updatedTest = {
      ...currentTest,
      questions: [...(currentTest.questions || []), newQuestion],
    }

    handleUpdateTest(updatedTest)
    setCurrentTest(updatedTest)

    // Set as current question for editing
    setCurrentQuestion(newQuestion)
    setCurrentQuestionIndex(updatedTest.questions.length - 1)
  }

  const handleUpdateQuestion = (updatedQuestion: any) => {
    if (!currentTest || currentQuestionIndex === null) return

    const updatedQuestions = [...currentTest.questions]
    updatedQuestions[currentQuestionIndex] = updatedQuestion

    const updatedTest = {
      ...currentTest,
      questions: updatedQuestions,
    }

    handleUpdateTest(updatedTest)
    setCurrentTest(updatedTest)
  }

  const handleRemoveQuestion = (index: number) => {
    if (!currentTest) return

    const updatedQuestions = [...currentTest.questions]
    updatedQuestions.splice(index, 1)

    const updatedTest = {
      ...currentTest,
      questions: updatedQuestions,
    }

    handleUpdateTest(updatedTest)
    setCurrentTest(updatedTest)

    if (currentQuestionIndex === index) {
      setCurrentQuestion(null)
      setCurrentQuestionIndex(null)
    }
  }

  const handleEditQuestion = (question: any, index: number) => {
    setCurrentQuestion({ ...question })
    setCurrentQuestionIndex(index)
  }

  const handleQuestionChange = (field: string, value: any) => {
    if (!currentQuestion) return

    const updatedQuestion = {
      ...currentQuestion,
      [field]: value,
    }

    setCurrentQuestion(updatedQuestion)
    handleUpdateQuestion(updatedQuestion)
  }

  const handleOptionChange = (index: number, value: string) => {
    if (!currentQuestion) return

    const updatedOptions = [...currentQuestion.options]
    updatedOptions[index] = value

    const updatedQuestion = {
      ...currentQuestion,
      options: updatedOptions,
    }

    setCurrentQuestion(updatedQuestion)
    handleUpdateQuestion(updatedQuestion)
  }

  const handleAddOption = () => {
    if (!currentQuestion) return

    const updatedQuestion = {
      ...currentQuestion,
      options: [...currentQuestion.options, `${t("answer")} ${currentQuestion.options.length + 1}`],
    }

    setCurrentQuestion(updatedQuestion)
    handleUpdateQuestion(updatedQuestion)
  }

  const handleRemoveOption = (index: number) => {
    if (!currentQuestion || currentQuestion.options.length <= 2) return

    const updatedOptions = [...currentQuestion.options]
    updatedOptions.splice(index, 1)

    // Adjust correctAnswer if needed
    let correctAnswer = currentQuestion.correctAnswer
    if (correctAnswer === index) {
      correctAnswer = 0
    } else if (correctAnswer > index) {
      correctAnswer--
    }

    const updatedQuestion = {
      ...currentQuestion,
      options: updatedOptions,
      correctAnswer,
    }

    setCurrentQuestion(updatedQuestion)
    handleUpdateQuestion(updatedQuestion)
  }

  const handleTestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentTest) return

    const { name, value } = e.target
    const updatedTest = {
      ...currentTest,
      [name]: value,
    }

    setCurrentTest(updatedTest)
    handleUpdateTest(updatedTest)
  }

  // Material handling functions
  const handleAddMaterial = () => {
    const newMaterials = [...(courseData.materials || [])]
    newMaterials.push({
      id: Date.now(),
      title: `${t("material")} ${newMaterials.length + 1}`,
      description: t("additionalLearningMaterial"),
      type: "pdf",
      url: "",
    })
    setCourseData({ ...courseData, materials: newMaterials })
  }

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = [...(courseData.materials || [])]
    newMaterials.splice(index, 1)
    setCourseData({ ...courseData, materials: newMaterials })
  }

  const handleMaterialChange = (index: number, field: string, value: string) => {
    const newMaterials = [...(courseData.materials || [])]
    newMaterials[index] = {
      ...newMaterials[index],
      [field]: value,
    }
    setCourseData({ ...courseData, materials: newMaterials })
  }

  const handleAddTopic = () => {
    const newTopics = [...courseData.topics, t("newTopic")]
    setCourseData({ ...courseData, topics: newTopics })

    // Update current language translation
    setCourseData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          topics: newTopics,
        },
      },
    }))
  }

  const handleRemoveTopic = (index: number) => {
    const newTopics = [...courseData.topics]
    newTopics.splice(index, 1)
    setCourseData({ ...courseData, topics: newTopics })

    // Update current language translation
    setCourseData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          topics: newTopics,
        },
      },
    }))
  }

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...courseData.topics]
    newTopics[index] = value
    setCourseData({ ...courseData, topics: newTopics })

    // Update current language translation
    setCourseData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations[language],
          topics: newTopics,
        },
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.duration ||
      !courseData.lessons ||
      !courseData.price
    ) {
      toast({
        title: t("error"),
        description: t("fillAllRequiredFields"),
        variant: "destructive",
      })
      return
    }

    // Ensure translations are set
    const updatedCourseData = {
      ...courseData,
      translations: {
        ...courseData.translations,
        [language]: {
          title: courseData.title,
          description: courseData.description,
          longDescription: courseData.longDescription,
          topics: courseData.topics,
          syllabus: courseData.modules.map((module) => ({
            week: courseData.modules.indexOf(module) + 1,
            title: module.title,
            lessons: module.lessons.map((lesson) => lesson.title),
          })),
          instructor: courseData.instructor,
          instructorTitle: courseData.instructorTitle,
        },
      },
    }

    // Save course to localStorage
    try {
      const existingCourses = localStorage.getItem("courses")
      let courses = []

      if (existingCourses) {
        courses = JSON.parse(existingCourses)
      }

      const newCourse = {
        ...updatedCourseData,
        id: Date.now(),
        rating: 4.5, // Default rating for new courses
        students: 0,
        createdAt: new Date().toISOString(),
        status: "Faol", // Ensure status is set to active
        price: Number.parseInt(updatedCourseData.price), // Ensure price is a number for the user interface
        priceNumeric: Number.parseInt(updatedCourseData.price), // Add priceNumeric field for cart functionality
      }

      courses.push(newCourse)
      localStorage.setItem("courses", JSON.stringify(courses))

      // Add notification about new course
      addNotification({
        userId: null,
        title: t("newCourseAdded"),
        message: `${courseData.title} ${t("courseNowAvailable")}|${newCourse.id}`,
        type: "course",
      })

      toast({
        title: t("success"),
        description: t("courseAddedSuccessfully"),
      })

      router.push("/admin/courses")
    } catch (error) {
      console.error(t("errorSavingCourse"), error)
      toast({
        title: t("error"),
        description: t("errorSavingCourse"),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{t("addNewCourse")}</h1>
        </div>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          {t("save")}
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-5">
          <TabsTrigger value="details">{t("courseBasicInfo")}</TabsTrigger>
          <TabsTrigger value="content">{t("courseContent")}</TabsTrigger>
          <TabsTrigger value="topics">{t("courseTopics")}</TabsTrigger>
          <TabsTrigger value="tests">{t("courseTests")}</TabsTrigger>
          <TabsTrigger value="settings">{t("courseSettings")}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("courseInformation")}</CardTitle>
              <CardDescription>{t("enterCourseBasicInfo")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t("courseName")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    placeholder={t("courseNamePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">{t("imageUrl")}</Label>
                  <Input
                    id="image"
                    name="image"
                    value={courseData.image}
                    onChange={handleInputChange}
                    placeholder="/placeholder.svg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("shortDescription")} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder={t("shortDescriptionPlaceholder")}
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">
                  {t("detailedDescription")} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  value={courseData.longDescription}
                  onChange={handleInputChange}
                  placeholder={t("detailedDescriptionPlaceholder")}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">{t("level")}</Label>
                  <Select value={courseData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder={t("selectLevel")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">{t("beginner")}</SelectItem>
                      <SelectItem value="Intermediate">{t("intermediate")}</SelectItem>
                      <SelectItem value="Advanced">{t("advanced")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    {t("duration")} ({t("weeks")}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    placeholder="8"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessons">
                    {t("numberOfLessons")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lessons"
                    name="lessons"
                    value={courseData.lessons}
                    onChange={handleInputChange}
                    type="number"
                    min="1"
                    placeholder="24"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {t("priceInSom")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    type="number"
                    min="0"
                    placeholder="1200000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">{t("instructor")}</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    value={courseData.instructor}
                    onChange={handleInputChange}
                    placeholder={t("instructorNamePlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructorTitle">{t("instructorPosition")}</Label>
                  <Input
                    id="instructorTitle"
                    name="instructorTitle"
                    value={courseData.instructorTitle}
                    onChange={handleInputChange}
                    placeholder={t("instructorPositionPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructorImage">{t("instructorImageUrl")}</Label>
                  <Input
                    id="instructorImage"
                    name="instructorImage"
                    value={courseData.instructorImage}
                    onChange={handleInputChange}
                    placeholder="/placeholder.svg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("courseContent")}</CardTitle>
              <CardDescription>{t("addModulesAndLessons")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {courseData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-2">
                      <Input
                        value={module.title}
                        onChange={(e) => handleModuleChange(moduleIndex, e.target.value)}
                        placeholder={t("moduleNamePlaceholder")}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveModule(moduleIndex)}
                      disabled={courseData.modules.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-muted">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                            <Input
                              value={lesson.title}
                              onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)}
                              placeholder={t("lessonNamePlaceholder")}
                            />
                            <Input
                              value={lesson.content}
                              onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "content", e.target.value)}
                              placeholder={t("lessonContentPlaceholder")}
                            />
                            <div className="flex items-center space-x-2">
                              <Input
                                value={lesson.duration}
                                onChange={(e) =>
                                  handleLessonChange(moduleIndex, lessonIndex, "duration", e.target.value)
                                }
                                type="number"
                                min="1"
                                placeholder={t("durationMinutes")}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                                disabled={module.lessons.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <Input
                            value={lesson.videoUrl || ""}
                            onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, "videoUrl", e.target.value)}
                            placeholder={t("videoUrlPlaceholder")}
                            className="flex-1"
                          />
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Upload className="h-3 w-3" />
                            <span>{t("upload")}</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" size="sm" onClick={() => handleAddLesson(moduleIndex)} className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("addLesson")}
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={handleAddModule}>
                <Plus className="h-4 w-4 mr-2" />
                {t("addModule")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("courseTopics")}</CardTitle>
              <CardDescription>{t("enterMainTopicsCovered")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {courseData.topics.map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      placeholder={t("topicNamePlaceholder")}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveTopic(index)}
                      disabled={courseData.topics.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddTopic}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("addTopic")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("testsAndMaterials")}</CardTitle>
              <CardDescription>{t("addTestsAndMaterials")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tests Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t("tests")}</h3>
                  <Dialog open={isAddTestDialogOpen} onOpenChange={setIsAddTestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileQuestion className="h-4 w-4 mr-2" />
                        {t("addTest")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("addNewTest")}</DialogTitle>
                        <DialogDescription>{t("enterTestInfoAndQuestionCount")}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-test-title">{t("testName")}</Label>
                          <Input
                            id="new-test-title"
                            name="title"
                            value={newTestData.title}
                            onChange={handleNewTestInputChange}
                            placeholder={`${t("test")} ${(courseData.tests || []).length + 1}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-test-description">{t("testDescription")}</Label>
                          <Input
                            id="new-test-description"
                            name="description"
                            value={newTestData.description}
                            onChange={handleNewTestInputChange}
                            placeholder={t("testDescriptionPlaceholder")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-test-question-count">
                            <FileQuestion className="h-4 w-4 inline mr-1" />
                            {t("questionCount")}
                          </Label>
                          <Input
                            id="new-test-question-count"
                            name="questionCount"
                            type="number"
                            min="1"
                            max="50"
                            value={newTestData.questionCount}
                            onChange={handleNewTestInputChange}
                            placeholder="5"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-test-time-limit">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {t("timeLimit")} ({t("minutes")})
                            </Label>
                            <Input
                              id="new-test-time-limit"
                              name="timeLimit"
                              type="number"
                              min="1"
                              value={newTestData.timeLimit}
                              onChange={handleNewTestInputChange}
                              placeholder="30"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-test-passing-score">
                              <Award className="h-4 w-4 inline mr-1" />
                              {t("passingScore")} (%)
                            </Label>
                            <Input
                              id="new-test-passing-score"
                              name="passingScore"
                              type="number"
                              min="1"
                              max="100"
                              value={newTestData.passingScore}
                              onChange={handleNewTestInputChange}
                              placeholder="70"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTestDialogOpen(false)}>
                          {t("cancel")}
                        </Button>
                        <Button onClick={handleCreateTest}>
                          <Plus className="h-4 w-4 mr-2" />
                          {t("createTest")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {courseData.tests && courseData.tests.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.tests.map((test, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{test.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditTest(test, index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>{t("editTest")}</DialogTitle>
                                  <DialogDescription>{t("editTestInfoAndQuestions")}</DialogDescription>
                                </DialogHeader>

                                {currentTest && (
                                  <div className="space-y-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="test-title">{t("testName")}</Label>
                                        <Input
                                          id="test-title"
                                          name="title"
                                          value={currentTest.title}
                                          onChange={handleTestInputChange}
                                          placeholder={t("testNamePlaceholder")}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="test-description">{t("testDescription")}</Label>
                                        <Input
                                          id="test-description"
                                          name="description"
                                          value={currentTest.description}
                                          onChange={handleTestInputChange}
                                          placeholder={t("testDescriptionPlaceholder")}
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="test-timeLimit">
                                          <Clock className="h-4 w-4 inline mr-1" />
                                          {t("timeLimit")} ({t("minutes")})
                                        </Label>
                                        <Input
                                          id="test-timeLimit"
                                          name="timeLimit"
                                          type="number"
                                          min="1"
                                          value={currentTest.timeLimit}
                                          onChange={handleTestInputChange}
                                          placeholder="30"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="test-passingScore">
                                          <Award className="h-4 w-4 inline mr-1" />
                                          {t("passingScore")} (%)
                                        </Label>
                                        <Input
                                          id="test-passingScore"
                                          name="passingScore"
                                          type="number"
                                          min="1"
                                          max="100"
                                          value={currentTest.passingScore}
                                          onChange={handleTestInputChange}
                                          placeholder="70"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">{t("questions")}</h3>
                                        <Button variant="outline" size="sm" onClick={handleAddQuestion}>
                                          <Plus className="h-4 w-4 mr-2" />
                                          {t("addQuestion")}
                                        </Button>
                                      </div>

                                      {currentTest.questions && currentTest.questions.length > 0 ? (
                                        <Accordion type="single" collapsible className="w-full">
                                          {currentTest.questions.map((question, qIndex) => (
                                            <AccordionItem key={qIndex} value={`question-${qIndex}`}>
                                              <AccordionTrigger className="hover:no-underline">
                                                <div className="flex items-center justify-between w-full pr-4">
                                                  <span className="text-left">{question.question}</span>
                                                  <span className="text-xs text-muted-foreground">
                                                    {question.options.length} {t("options")}
                                                  </span>
                                                </div>
                                              </AccordionTrigger>
                                              <AccordionContent>
                                                <div className="space-y-4 p-2">
                                                  <div className="space-y-2">
                                                    <Label htmlFor={`question-text-${qIndex}`}>
                                                      {t("questionText")}
                                                    </Label>
                                                    <Input
                                                      id={`question-text-${qIndex}`}
                                                      value={question.question}
                                                      onChange={(e) => {
                                                        const updatedQuestion = {
                                                          ...question,
                                                          question: e.target.value,
                                                        }
                                                        handleEditQuestion(updatedQuestion, qIndex)
                                                        handleQuestionChange("question", e.target.value)
                                                      }}
                                                      placeholder={t("questionTextPlaceholder")}
                                                    />
                                                  </div>

                                                  <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                      <Label>{t("answerOptions")}</Label>
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                          handleEditQuestion(question, qIndex)
                                                          handleAddOption()
                                                        }}
                                                      >
                                                        <Plus className="h-3 w-3 mr-1" />
                                                        {t("addOption")}
                                                      </Button>
                                                    </div>

                                                    <RadioGroup
                                                      value={question.correctAnswer.toString()}
                                                      onValueChange={(value) => {
                                                        const updatedQuestion = {
                                                          ...question,
                                                          correctAnswer: Number.parseInt(value),
                                                        }
                                                        handleEditQuestion(updatedQuestion, qIndex)
                                                        handleQuestionChange("correctAnswer", Number.parseInt(value))
                                                      }}
                                                    >
                                                      {question.options.map((option, oIndex) => (
                                                        <div key={oIndex} className="flex items-center space-x-2 mb-2">
                                                          <RadioGroupItem
                                                            value={oIndex.toString()}
                                                            id={`option-${qIndex}-${oIndex}`}
                                                          />
                                                          <div className="flex-1">
                                                            <Input
                                                              value={option}
                                                              onChange={(e) => {
                                                                handleEditQuestion(question, qIndex)
                                                                handleOptionChange(oIndex, e.target.value)
                                                              }}
                                                              placeholder={`${t("answer")} ${oIndex + 1}`}
                                                            />
                                                          </div>
                                                          {question.options.length > 2 && (
                                                            <Button
                                                              variant="ghost"
                                                              size="sm"
                                                              className="h-8 w-8 p-0"
                                                              onClick={() => {
                                                                handleEditQuestion(question, qIndex)
                                                                handleRemoveOption(oIndex)
                                                              }}
                                                            >
                                                              <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </RadioGroup>
                                                  </div>

                                                  <div className="space-y-2">
                                                    <Label htmlFor={`explanation-${qIndex}`}>
                                                      {t("correctAnswerExplanation")}
                                                    </Label>
                                                    <Textarea
                                                      id={`explanation-${qIndex}`}
                                                      value={question.explanation}
                                                      onChange={(e) => {
                                                        const updatedQuestion = {
                                                          ...question,
                                                          explanation: e.target.value,
                                                        }
                                                        handleEditQuestion(updatedQuestion, qIndex)
                                                        handleQuestionChange("explanation", e.target.value)
                                                      }}
                                                      placeholder={t("whyCorrectAnswerExplanation")}
                                                      rows={2}
                                                    />
                                                  </div>

                                                  <div className="flex justify-end">
                                                    <Button
                                                      variant="destructive"
                                                      size="sm"
                                                      onClick={() => handleRemoveQuestion(qIndex)}
                                                    >
                                                      <Trash2 className="h-4 w-4 mr-2" />
                                                      {t("deleteQuestion")}
                                                    </Button>
                                                  </div>
                                                </div>
                                              </AccordionContent>
                                            </AccordionItem>
                                          ))}
                                        </Accordion>
                                      ) : (
                                        <div className="text-center py-8 border rounded-lg">
                                          <p className="text-muted-foreground">{t("noQuestionsYet")}</p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddQuestion}
                                            className="mt-2"
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t("addQuestion")}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <DialogFooter>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setCurrentTest(null)
                                      setCurrentTestIndex(null)
                                      setCurrentQuestion(null)
                                      setCurrentQuestionIndex(null)
                                    }}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    {t("save")}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleRemoveTest(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>
                              {test.questions?.length || 0} {t("questions")}
                            </span>
                            <span>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {test.timeLimit} {t("minutes")}
                            </span>
                          </div>
                          <span>
                            <Award className="h-3 w-3 inline mr-1" />
                            {t("passingScore")}: {test.passingScore}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground">{t("noTestsYet")}</p>
                    <Button variant="outline" size="sm" onClick={() => setIsAddTestDialogOpen(true)} className="mt-2">
                      <FileQuestion className="h-4 w-4 mr-2" />
                      {t("addTest")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Materials Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{t("additionalMaterials")}</h3>
                  <Button variant="outline" size="sm" onClick={handleAddMaterial}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t("addMaterial")}
                  </Button>
                </div>

                {courseData.materials && courseData.materials.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.materials.map((material, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="space-y-2 flex-1 mr-4">
                            <Input
                              value={material.title}
                              onChange={(e) => handleMaterialChange(index, "title", e.target.value)}
                              placeholder={t("materialNamePlaceholder")}
                            />
                            <div className="flex items-center space-x-2">
                              <Select
                                value={material.type}
                                onValueChange={(value) => handleMaterialChange(index, "type", value)}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder={t("fileType")} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="doc">Word</SelectItem>
                                  <SelectItem value="ppt">PowerPoint</SelectItem>
                                  <SelectItem value="xls">Excel</SelectItem>
                                  <SelectItem value="zip">{t("archive")}</SelectItem>
                                  <SelectItem value="link">{t("link")}</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={material.url}
                                onChange={(e) => handleMaterialChange(index, "url", e.target.value)}
                                placeholder={t("fileUrlOrLinkPlaceholder")}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveMaterial(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={material.description}
                          onChange={(e) => handleMaterialChange(index, "description", e.target.value)}
                          placeholder={t("materialDescriptionPlaceholder")}
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground">{t("noAdditionalMaterialsYet")}</p>
                    <Button variant="outline" size="sm" onClick={handleAddMaterial} className="mt-2">
                      <FileText className="h-4 w-4 mr-2" />
                      {t("addMaterial")}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("courseSettings")}</CardTitle>
              <CardDescription>{t("adjustAdditionalSettings")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="status">{t("courseStatus")}</Label>
                  <p className="text-sm text-muted-foreground">{t("isCourseVisibleToUsers")}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={courseData.status === t("active")}
                    onCheckedChange={(checked) => handleSelectChange("status", checked ? t("active") : t("inactive"))}
                  />
                  <Label htmlFor="status">{courseData.status === t("active") ? t("active") : t("inactive")}</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

