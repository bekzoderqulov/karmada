"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import AddToCartButton from "@/components/add-to-cart-button"
import { useLanguage } from "@/context/language-context"

interface TrialLessonDialogProps {
  isOpen: boolean
  onClose: () => void
  course: any
}

export default function TrialLessonDialog({ isOpen, onClose, course }: TrialLessonDialogProps) {
  const { t } = useLanguage()
  const dialogDescriptionId = `trial-lesson-dialog-description-${course?.id || "default"}`

  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl" aria-describedby={dialogDescriptionId}>
        <DialogHeader>
          <DialogTitle>{course.trialLesson?.title || t("trialLesson")}</DialogTitle>
          <DialogDescription id={dialogDescriptionId}>
            {course.trialLesson?.description || t("trialLessonDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="aspect-video w-full overflow-hidden rounded-md">
          <iframe
            src={course.trialLesson?.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={course.trialLesson?.title || t("trialLesson")}
          ></iframe>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-muted-foreground">
              {t("duration")}: {course.trialLesson?.duration || t("tenMinutes")}
            </p>
          </div>
          <AddToCartButton courseId={course.id} courseTitle={course.title} coursePrice={course.priceNumeric} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

