"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Mic, Video, Phone, X, MoreVertical, Flag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  id: string
  text: string
  sender: "user" | "teacher"
  timestamp: string
  status: "sent" | "delivered" | "read"
  attachments?: {
    type: "image" | "audio" | "video" | "file"
    url: string
    name: string
  }[]
}

type CourseTeacher = {
  id: number
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  lastSeen?: string
}

type CourseTeacherWithMessages = CourseTeacher & {
  messages: Message[]
}

type CourseTeachers = {
  [courseId: number]: CourseTeacherWithMessages[]
}

export default function CourseChat({
  courseId,
  courseTitle,
}: {
  courseId: number
  courseTitle: string
}) {
  const [message, setMessage] = useState("")
  const [teachers, setTeachers] = useState<CourseTeacherWithMessages[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<CourseTeacherWithMessages | null>(null)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [isRecordingVideo, setIsRecordingVideo] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [showTeachDialog, setShowTeachDialog] = useState(false)
  const [teachApplication, setTeachApplication] = useState("")
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [callType, setCallType] = useState<"audio" | "video" | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const { t } = useLanguage()

  // Load teachers and messages from localStorage
  useEffect(() => {
    try {
      const storedTeachers = localStorage.getItem("courseTeachers")
      if (storedTeachers) {
        const allTeachers: CourseTeachers = JSON.parse(storedTeachers)
        const courseTeachers = allTeachers[courseId] || []

        // If no teachers for this course, create a default one
        if (courseTeachers.length === 0) {
          const defaultTeacher: CourseTeacherWithMessages = {
            id: 1,
            name: "Aziza Karimova",
            avatar: "/placeholder.svg?height=40&width=40",
            status: "online",
            messages: [],
          }

          const updatedAllTeachers = {
            ...allTeachers,
            [courseId]: [defaultTeacher],
          }

          localStorage.setItem("courseTeachers", JSON.stringify(updatedAllTeachers))
          setTeachers([defaultTeacher])
          setSelectedTeacher(defaultTeacher)
        } else {
          setTeachers(courseTeachers)
          setSelectedTeacher(courseTeachers[0])
        }
      } else {
        // Initialize with a default teacher if no data exists
        const defaultTeacher: CourseTeacherWithMessages = {
          id: 1,
          name: "Aziza Karimova",
          avatar: "/placeholder.svg?height=40&width=40",
          status: "online",
          messages: [],
        }

        const initialTeachers: CourseTeachers = {
          [courseId]: [defaultTeacher],
        }

        localStorage.setItem("courseTeachers", JSON.stringify(initialTeachers))
        setTeachers([defaultTeacher])
        setSelectedTeacher(defaultTeacher)
      }
    } catch (error) {
      console.error("Failed to load course teachers:", error)
      // Initialize with a default teacher if error
      const defaultTeacher: CourseTeacherWithMessages = {
        id: 1,
        name: "Aziza Karimova",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
        messages: [],
      }
      setTeachers([defaultTeacher])
      setSelectedTeacher(defaultTeacher)
    }
  }, [courseId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedTeacher?.messages])

  // Clean up media streams when component unmounts
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop())
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [audioStream, videoStream])

  const handleSendMessage = () => {
    if (!message.trim() && !isRecordingAudio && !isRecordingVideo) return
    if (!selectedTeacher) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    // Update the selected teacher's messages
    const updatedTeacher = {
      ...selectedTeacher,
      messages: [...selectedTeacher.messages, newMessage],
    }

    // Update the teachers array
    const updatedTeachers = teachers.map((teacher) => (teacher.id === selectedTeacher.id ? updatedTeacher : teacher))

    // Update state
    setTeachers(updatedTeachers)
    setSelectedTeacher(updatedTeacher)
    setMessage("")

    // Save to localStorage
    try {
      const storedTeachers = localStorage.getItem("courseTeachers")
      const allTeachers: CourseTeachers = storedTeachers ? JSON.parse(storedTeachers) : {}

      const updatedAllTeachers = {
        ...allTeachers,
        [courseId]: updatedTeachers,
      }

      localStorage.setItem("courseTeachers", JSON.stringify(updatedAllTeachers))
    } catch (error) {
      console.error("Failed to save message:", error)
    }

    // Simulate teacher response after a delay
    setTimeout(
      () => {
        const responseMessage: Message = {
          id: Date.now().toString(),
          text: getRandomResponse(),
          sender: "teacher",
          timestamp: new Date().toISOString(),
          status: "sent",
        }

        const teacherWithResponse = {
          ...updatedTeacher,
          messages: [...updatedTeacher.messages, responseMessage],
        }

        const teachersWithResponse = updatedTeachers.map((teacher) =>
          teacher.id === selectedTeacher.id ? teacherWithResponse : teacher,
        )

        setTeachers(teachersWithResponse)
        setSelectedTeacher(teacherWithResponse)

        // Save to localStorage
        try {
          const storedTeachers = localStorage.getItem("courseTeachers")
          const allTeachers: CourseTeachers = storedTeachers ? JSON.parse(storedTeachers) : {}

          const updatedAllTeachers = {
            ...allTeachers,
            [courseId]: teachersWithResponse,
          }

          localStorage.setItem("courseTeachers", JSON.stringify(updatedAllTeachers))
        } catch (error) {
          console.error("Failed to save teacher response:", error)
        }
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  const getRandomResponse = () => {
    const responses = [
      "Savolingiz uchun rahmat! Sizga yordam berishdan xursandman.",
      "Bu juda yaxshi savol. Keling, batafsil ko'rib chiqaylik.",
      "Albatta, bu mavzu bo'yicha sizga yordam beraman.",
      "Bu savolga javob berish uchun bir necha minut kerak bo'ladi.",
      "Qiziqishingiz uchun rahmat! Bu kursning muhim qismi.",
      "Yaxshi savol! Bu ko'pchilik o'quvchilarni qiziqtiradi.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleStartAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)
      setIsRecordingAudio(true)
      toast({
        title: t("audioRecordingStarted"),
        description: t("pressStopToFinishRecording"),
      })
    } catch (error) {
      console.error("Failed to start audio recording:", error)
      toast({
        title: t("error"),
        description: t("failedToStartAudioRecording"),
        variant: "destructive",
      })
    }
  }

  const handleStopAudioRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop())
      setAudioStream(null)
      setIsRecordingAudio(false)

      // Simulate sending an audio message
      if (selectedTeacher) {
        const audioMessage: Message = {
          id: Date.now().toString(),
          text: "",
          sender: "user",
          timestamp: new Date().toISOString(),
          status: "sent",
          attachments: [
            {
              type: "audio",
              url: "/placeholder.svg?height=40&width=200&text=Audio+Recording",
              name: "audio_recording.mp3",
            },
          ],
        }

        const updatedTeacher = {
          ...selectedTeacher,
          messages: [...selectedTeacher.messages, audioMessage],
        }

        const updatedTeachers = teachers.map((teacher) =>
          teacher.id === selectedTeacher.id ? updatedTeacher : teacher,
        )

        setTeachers(updatedTeachers)
        setSelectedTeacher(updatedTeacher)

        // Save to localStorage
        try {
          const storedTeachers = localStorage.getItem("courseTeachers")
          const allTeachers: CourseTeachers = storedTeachers ? JSON.parse(storedTeachers) : {}

          const updatedAllTeachers = {
            ...allTeachers,
            [courseId]: updatedTeachers,
          }

          localStorage.setItem("courseTeachers", JSON.stringify(updatedAllTeachers))
        } catch (error) {
          console.error("Failed to save audio message:", error)
        }
      }

      toast({
        title: t("audioRecordingStopped"),
        description: t("audioMessageSent"),
      })
    }
  }

  const handleStartVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setVideoStream(stream)
      setIsRecordingVideo(true)
      toast({
        title: t("videoRecordingStarted"),
        description: t("pressStopToFinishRecording"),
      })
    } catch (error) {
      console.error("Failed to start video recording:", error)
      toast({
        title: t("error"),
        description: t("failedToStartVideoRecording"),
        variant: "destructive",
      })
    }
  }

  const handleStopVideoRecording = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
      setVideoStream(null)
      setIsRecordingVideo(false)

      // Simulate sending a video message
      if (selectedTeacher) {
        const videoMessage: Message = {
          id: Date.now().toString(),
          text: "",
          sender: "user",
          timestamp: new Date().toISOString(),
          status: "sent",
          attachments: [
            {
              type: "video",
              url: "/placeholder.svg?height=200&width=300&text=Video+Recording",
              name: "video_recording.mp4",
            },
          ],
        }

        const updatedTeacher = {
          ...selectedTeacher,
          messages: [...selectedTeacher.messages, videoMessage],
        }

        const updatedTeachers = teachers.map((teacher) =>
          teacher.id === selectedTeacher.id ? updatedTeacher : teacher,
        )

        setTeachers(updatedTeachers)
        setSelectedTeacher(updatedTeacher)

        // Save to localStorage
        try {
          const storedTeachers = localStorage.getItem("courseTeachers")
          const allTeachers: CourseTeachers = storedTeachers ? JSON.parse(storedTeachers) : {}

          const updatedAllTeachers = {
            ...allTeachers,
            [courseId]: updatedTeachers,
          }

          localStorage.setItem("courseTeachers", JSON.stringify(updatedAllTeachers))
        } catch (error) {
          console.error("Failed to save video message:", error)
        }
      }

      toast({
        title: t("videoRecordingStopped"),
        description: t("videoMessageSent"),
      })
    }
  }

  const handleStartCall = async (type: "audio" | "video") => {
    try {
      const constraints = type === "audio" ? { audio: true } : { audio: true, video: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (type === "audio") {
        setAudioStream(stream)
      } else {
        setVideoStream(stream)
      }

      setCallType(type)
      setIsInCall(true)

      toast({
        title: t(type === "audio" ? "audioCallStarted" : "videoCallStarted"),
        description: t("callWithTeacher", { teacher: selectedTeacher?.name }),
      })
    } catch (error) {
      console.error(`Failed to start ${type} call:`, error)
      toast({
        title: t("error"),
        description: t(`failedToStart${type === "audio" ? "Audio" : "Video"}Call`),
        variant: "destructive",
      })
    }
  }

  const handleEndCall = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop())
      setAudioStream(null)
    }

    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
      setVideoStream(null)
    }

    setIsInCall(false)
    setCallType(null)

    toast({
      title: t("callEnded"),
      description: t("callWithTeacherEnded", { teacher: selectedTeacher?.name }),
    })
  }

  const handleReportProblem = () => {
    if (!reportReason.trim()) {
      toast({
        title: t("error"),
        description: t("pleaseEnterReportReason"),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("reportSubmitted"),
      description: t("thankYouForYourReport"),
    })

    setReportReason("")
    setShowReportDialog(false)
  }

  const handleTeachApplication = () => {
    if (!teachApplication.trim()) {
      toast({
        title: t("error"),
        description: t("pleaseEnterApplicationDetails"),
        variant: "destructive",
      })
      return
    }

    toast({
      title: t("applicationSubmitted"),
      description: t("thankYouForYourApplication"),
    })

    setTeachApplication("")
    setShowTeachDialog(false)
  }

  if (!selectedTeacher) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t("loadingChat")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
            <AvatarFallback>{selectedTeacher.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{selectedTeacher.name}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedTeacher.status === "online" ? t("online") : t("offline")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleStartCall("audio")}
            disabled={isInCall || isRecordingAudio || isRecordingVideo}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleStartCall("video")}
            disabled={isInCall || isRecordingAudio || isRecordingVideo}
          >
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                <Flag className="h-4 w-4 mr-2" />
                {t("reportProblem")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTeachDialog(true)}>
                <User className="h-4 w-4 mr-2" />
                {t("applyToTeach")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Call overlay */}
      {isInCall && (
        <div className="absolute inset-0 bg-background/95 z-10 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-2">{callType === "audio" ? t("audioCall") : t("videoCall")}</h3>
            <p className="text-muted-foreground mb-4">{t("withTeacher", { teacher: selectedTeacher.name })}</p>
            {callType === "video" && (
              <div className="w-64 h-48 bg-muted rounded-lg mx-auto mb-4 overflow-hidden">
                <img
                  src="/placeholder.svg?height=192&width=256&text=Video+Call"
                  alt="Video call"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-center">
              <Button variant="destructive" onClick={handleEndCall}>
                {t("endCall")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedTeacher.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mb-2">{t("startConversation")}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("startConversationDescription", { course: courseTitle })}
            </p>
          </div>
        ) : (
          selectedTeacher.messages.map((msg) => (
            <div key={msg.id} className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "teacher" && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarImage src={selectedTeacher.avatar} alt={selectedTeacher.name} />
                  <AvatarFallback>{selectedTeacher.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {msg.text && <p className="mb-1">{msg.text}</p>}

                {msg.attachments?.map((attachment, index) => (
                  <div key={index} className="mt-2">
                    {attachment.type === "image" && (
                      <img
                        src={attachment.url || "/placeholder.svg"}
                        alt={attachment.name}
                        className="rounded-md max-w-full"
                      />
                    )}
                    {attachment.type === "audio" && (
                      <div className="bg-background/20 p-2 rounded-md flex items-center">
                        <Mic className="h-4 w-4 mr-2" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                    )}
                    {attachment.type === "video" && (
                      <div className="bg-background/20 p-2 rounded-md flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <span className="text-sm">{attachment.name}</span>
                      </div>
                    )}
                  </div>
                ))}

                <div
                  className={`text-xs mt-1 ${
                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        {isRecordingAudio || isRecordingVideo ? (
          <div className="flex items-center">
            <div className="flex-1 bg-muted rounded-md p-3 flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3" />
              <span>{isRecordingAudio ? t("recordingAudio") : t("recordingVideo")}...</span>
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="ml-2"
              onClick={isRecordingAudio ? handleStopAudioRecording : handleStopVideoRecording}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Input
              placeholder={t("typeMessage")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={handleStartAudioRecording}
              disabled={isInCall}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={handleStartVideoRecording}
              disabled={isInCall}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="ml-2" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Report Problem Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("reportProblem")}</DialogTitle>
            <DialogDescription>{t("reportProblemDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder={t("describeProblem")}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleReportProblem}>{t("submitReport")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply to Teach Dialog */}
      <Dialog open={showTeachDialog} onOpenChange={setShowTeachDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("applyToTeach")}</DialogTitle>
            <DialogDescription>{t("applyToTeachDescription", { course: courseTitle })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder={t("describeExperience")}
              value={teachApplication}
              onChange={(e) => setTeachApplication(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeachDialog(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleTeachApplication}>{t("submitApplication")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

