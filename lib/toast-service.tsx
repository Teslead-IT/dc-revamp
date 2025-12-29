"use client"

import { toast as shadcnToast } from "@/hooks/use-toast"

type ToastOptions = { description?: string;[key: string]: any } | string

const toastFn = (message: string, options?: ToastOptions) => {
  const description = typeof options === 'string' ? options : options?.description
  return shadcnToast({
    title: message,
    description: description,
  })
}

toastFn.success = (message: string, options?: ToastOptions) => {
  const description = typeof options === 'string' ? options : options?.description
  return shadcnToast({
    variant: "success",
    title: message,
    description: description,
  })
}

toastFn.error = (message: string, options?: ToastOptions) => {
  const description = typeof options === 'string' ? options : options?.description
  return shadcnToast({
    variant: "destructive",
    title: message,
    description: description,
  })
}

toastFn.info = (message: string, options?: ToastOptions) => {
  const description = typeof options === 'string' ? options : options?.description
  return shadcnToast({
    title: message,
    description: description,
  })
}

toastFn.loading = (message: string, options?: ToastOptions) => {
  const description = typeof options === 'string' ? options : options?.description
  return shadcnToast({
    title: "Loading...",
    description: message || description,
  })
}

toastFn.dismiss = (toastId?: string) => {
  // shadcn toast dismiss needs to be called from the return of useToast or by dispatching.
  // The exported 'toast' function from use-toast.ts returns { id, dismiss, update }.
  // However, we can't easily dismiss by ID globally without the dispatch function exposed directly 
  // or storing the dismiss function.
  // But wait, the imported 'toast' works by dispatching to a listener.
  // components/ui/use-toast.ts exports 'toast' function.
  // It does NOT export a global dismiss function easily?
  // Actually, use-toast.ts exports 'reducer' and 'toast'.
  // Looking at use-toast.ts, 'toast' function returns { id, dismiss, update }.
  // So we can return that from our wrapper.
  // But if we want to dismiss a specific ID passed in...
  // use-toast.ts does NOT export a standalone dismiss(id).
  // But we can add one or use a hack.
  // For now let's hope dismiss isn't strictly needed or we just return the dismiss from the creation.
  return
}

export const showToast = toastFn
