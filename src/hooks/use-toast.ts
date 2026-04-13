import type { ReactNode } from "react"
import { toast as sonnerToast } from "sonner"

type ToastVariant = "default" | "destructive"

interface ToastProps {
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  duration?: number
}

function callToast({ title, description, variant = "default", duration }: ToastProps) {
  const content = typeof title === "string" ? title : (title ? String(title) : "")
  const desc = typeof description === "string" ? description : (description ? String(description) : undefined)
  const opts = { description: desc, duration: duration || 5000 }

  if (variant === "destructive") {
    sonnerToast.error(content || desc || "Error", opts)
  } else {
    sonnerToast(content || desc || "Notification", opts)
  }
}

function useToast() {
  return {
    toast: callToast,
    dismiss: sonnerToast.dismiss,
    toasts: [] as any[],
  }
}

export { useToast, callToast as toast }
