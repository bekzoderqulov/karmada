"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Clock, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

// Message type
type Message = {
  id: number
  userId: number | null
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  isAdmin: boolean
}

export default function ProfileChatPage() {
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load messages from localStorage
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      return
    }

    try {
      const storedMessages = localStorage.getItem(`userChat_${user?.id}`)
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages))
      } else {
        // Welcome message if no messages exist
        const welcomeMessage: Message = {
          id: 1,
          userId: null,
          userName: "Admin",
          userAvatar: "/placeholder.svg?height=40&width=40&text=A",
          content: "Xush kelibsiz! Qanday yordam bera olaman?",
          timestamp: new Date().toISOString(),
          isAdmin: true,
        }
        setMessages([welcomeMessage])
        localStorage.setItem(`userChat_${user?.id}`, JSON.stringify([welcomeMessage]))
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
      toast({
        title: t("error"),
        description: t("failedToLoadMessages"),
        variant: "destructive",
      })
    }
  }, [isAuthenticated, isLoading, user, toast, t])

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Check for scroll position to show/hide scroll button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)

      // If user scrolls up, count unread messages
      if (!isNearBottom) {
        setUnreadCount((prev) => prev + 1)
      } else {
        setUnreadCount(0)
      }
    }

    scrollArea.addEventListener("scroll", handleScroll)
    return () => scrollArea.removeEventListener("scroll", handleScroll)
  }, [])

  // Simulate admin responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && !lastMessage.isAdmin) {
      setIsTyping(true)

      // Simulate admin typing and responding
      const typingTimeout = setTimeout(
        () => {
          const adminResponses = [
            "Albatta, sizga qanday yordam bera olaman?",
            "Savolingiz uchun rahmat. Tez orada javob beraman.",
            "Bu haqida ko'proq ma'lumot bera olasizmi?",
            "Tushunarli. Muammoni hal qilish uchun harakat qilaman.",
            "Kurslarimiz haqida ko'proq ma'lumot olmoqchimisiz?",
            "Xavotir olmang, muammoni hal qilamiz.",
            "Iltimos, biroz kuting, ma'lumotlarni tekshiryapman.",
            "Sizga qo'shimcha ma'lumot kerak bo'lsa, so'rashingiz mumkin.",
          ]

          const randomResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)]

          const adminReply: Message = {
            id: Date.now(),
            userId: null,
            userName: "Admin",
            userAvatar: "/placeholder.svg?height=40&width=40&text=A",
            content: randomResponse,
            timestamp: new Date().toISOString(),
            isAdmin: true,
          }

          setMessages((prev) => {
            const updatedMessages = [...prev, adminReply]
            localStorage.setItem(`userChat_${user?.id}`, JSON.stringify(updatedMessages))
            return updatedMessages
          })

          setIsTyping(false)

          // Notify user about new message
          if (document.hidden) {
            // Browser notification if supported and page is not visible
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Yangi xabar", {
                body: "Administratordan yangi xabar keldi",
                icon: "/placeholder.svg?height=40&width=40&text=A",
              })
            }
          }
        },
        2000 + Math.random() * 2000,
      ) // Random delay between 2-4 seconds

      return () => clearTimeout(typingTimeout)
    }
  }, [messages, user?.id])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const userMessage: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: false,
    }

    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage]
      localStorage.setItem(`userChat_${user.id}`, JSON.stringify(updatedMessages))
      return updatedMessages
    })

    setNewMessage("")
    setUnreadCount(0)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for conversation list
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("yesterday")
    } else {
      return date.toLocaleDateString()
    }
  }

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      setUnreadCount(0)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("chatSupport")}</CardTitle>
            <CardDescription>{t("pleaseLoginToChat")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("loginRequired")}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => (window.location.href = "/login")}>{t("login")}</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40&text=A" alt="Admin" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{t("supportChat")}</CardTitle>
                <CardDescription className="text-xs">
                  {isTyping ? (
                    <span className="flex items-center text-green-500">
                      <span className="mr-1">{t("typing")}</span>
                      <span className="typing-animation">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
                      {t("online")}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.isAdmin ? "" : "flex-row-reverse"}`}>
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src={message.userAvatar} alt={message.userName} />
                      <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.isAdmin ? "bg-muted" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p>{message.content}</p>
                      <div
                        className={`flex items-center mt-1 text-xs ${
                          message.isAdmin ? "text-muted-foreground" : "text-primary-foreground/70"
                        }`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatMessageDate(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage src="/placeholder.svg?height=40&width=40&text=A" alt="Admin" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {showScrollButton && (
            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                className="rounded-full h-10 w-10 p-0 flex items-center justify-center shadow-lg"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-3 border-t">
          <div className="flex items-center gap-2 w-full">
            <Input
              placeholder={t("typeMessage")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-3">
              <Send className="h-4 w-4 mr-1" />
              <span>{t("send")}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <style jsx global>{`
        .typing-animation span {
          animation: typingDots 1.4s infinite ease-in-out;
          animation-fill-mode: both;
        }
        
        .typing-animation span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-animation span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-animation span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .typing-dots {
          display: flex;
          align-items: center;
          column-gap: 4px;
          height: 10px;
        }
        
        .typing-dots span {
          display: block;
          width: 5px;
          height: 5px;
          background-color: currentColor;
          border-radius: 50%;
          opacity: 0.6;
          animation: typingDots 1.4s infinite ease-in-out;
          animation-fill-mode: both;
        }
        
        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typingDots {
          0%, 80%, 100% { 
            transform: scale(0.6);
            opacity: 0.6;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

