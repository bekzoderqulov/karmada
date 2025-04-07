"use client"
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

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  cancelText?: string
  confirmText?: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Amaliyotni tasdiqlaysizmi?",
  description = "Bu amal qaytarib bo'lmaydi. Davom etishni istaysizmi?",
  cancelText = "Bekor qilish",
  confirmText = "Tasdiqlash",
}: ConfirmDialogProps) {
  const dialogDescriptionId = "confirm-dialog-description"

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent aria-describedby={dialogDescriptionId}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription id={dialogDescriptionId}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmDialog

