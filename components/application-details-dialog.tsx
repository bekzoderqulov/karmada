"use client"

import type React from "react"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type JobApplication = {
  id: string
  jobId: string
  jobTitle: string
  firstName: string
  lastName: string
  email: string
  phone: string
  coverLetter: string
  resume: string
  passport: string
  diploma: string
  certificates: string[]
  status: "new" | "reviewed" | "interviewed" | "accepted" | "rejected"
  submittedAt: string
}

interface ApplicationDetailsDialogProps {
  application: JobApplication
  open: boolean
  onOpenChange: (open: boolean) => void
  getStatusBadge: (status: JobApplication["status"]) => React.ReactNode
  updateApplicationStatus: (id: string, status: JobApplication["status"]) => void
}

export function ApplicationDetailsDialog({
  application,
  open,
  onOpenChange,
  getStatusBadge,
  updateApplicationStatus,
}: ApplicationDetailsDialogProps) {
  const dialogDescriptionId = `application-dialog-description-${application?.id || "default"}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby={dialogDescriptionId}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ariza ma'lumotlari</span>
            {getStatusBadge(application.status)}
          </DialogTitle>
          <DialogDescription id={dialogDescriptionId}>
            Ariza ID: #{application.id.slice(0, 8)} | Topshirilgan sana:{" "}
            {new Date(application.submittedAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Lavozim ma'lumotlari</h3>
            <p className="text-sm text-muted-foreground mt-1">{application.jobTitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium">Shaxsiy ma'lumotlar</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback>
                      {application.firstName[0]}
                      {application.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {application.firstName} {application.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{application.email}</p>
                  </div>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Telefon:</span> {application.phone}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Status</h3>
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={application.status === "new" ? "default" : "outline"}
                    onClick={() => updateApplicationStatus(application.id, "new")}
                  >
                    Yangi
                  </Button>
                  <Button
                    size="sm"
                    variant={application.status === "reviewed" ? "default" : "outline"}
                    onClick={() => updateApplicationStatus(application.id, "reviewed")}
                  >
                    Ko'rib chiqilgan
                  </Button>
                  <Button
                    size="sm"
                    variant={application.status === "interviewed" ? "default" : "outline"}
                    onClick={() => updateApplicationStatus(application.id, "interviewed")}
                  >
                    Suhbat o'tkazilgan
                  </Button>
                  <Button
                    size="sm"
                    variant={application.status === "accepted" ? "default" : "outline"}
                    className={application.status === "accepted" ? "bg-green-600" : ""}
                    onClick={() => updateApplicationStatus(application.id, "accepted")}
                  >
                    Qabul qilingan
                  </Button>
                  <Button
                    size="sm"
                    variant={application.status === "rejected" ? "default" : "outline"}
                    className={application.status === "rejected" ? "bg-red-600" : ""}
                    onClick={() => updateApplicationStatus(application.id, "rejected")}
                  >
                    Rad etilgan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Motivatsion xat</h3>
            <div className="mt-2 p-4 bg-muted rounded-md">
              <p className="whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Hujjatlar</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span>Rezyume</span>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Yuklab olish
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span>Passport</span>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Yuklab olish
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span>Diplom</span>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Yuklab olish
                </Button>
              </div>
              {application.certificates && application.certificates.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span>Sertifikatlar</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Yuklab olish
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

