"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Loader2, Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"

interface LoginProps {
  onLoginSuccess?: () => void
}

type LoginStep = "userId" | "password" | "loading"

export function Login({ onLoginSuccess }: LoginProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<LoginStep>("userId")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle loading step completion - redirect after 2 seconds
  useEffect(() => {
    if (step === "loading") {
      const timer = setTimeout(async () => {
        try {
          // Invalidate and refetch session to ensure user data is cached
          await queryClient.invalidateQueries({ queryKey: ["session"] })
          await queryClient.refetchQueries({ queryKey: ["session"] })
          
          // Call callback if provided
          onLoginSuccess?.()
          
          // Force redirect to dashboard
          router.push("/dashboard")
        } catch (err) {
          console.error("Error during redirect:", err)
          router.push("/dashboard")
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [step, onLoginSuccess, router, queryClient])

  // Handle user ID submission
  const handleUserIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (userId.trim()) {
      setIsLoading(true)
      try {
        const response = await fetch("/api/auth/verify-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId.trim() }),
        })
        const data = await response.json()
        if (data.success) {
          setStep("password")
        } else {
          setError(data.message || "User ID not found")
        }
      } catch (err) {
        setError("Failed to verify user ID. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password) {
      setIsLoading(true)
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
        })
        const data = await response.json()
        if (data.success) {
          setStep("loading")
        } else {
          setError(data.message || "Login failed. Please try again.")
        }
      } catch (err) {
        setError("Failed to login. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle back button
  const handleBack = () => {
    setError(null)
    setPassword("")
    setShowPassword(false)
    setStep("userId")
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-4 md:p-8">
      <div className="relative w-full max-w-md rounded-2xl bg-black p-8 shadow-[0_8px_18px_-4px_rgba(0,0,0,0.6)]">
        
        {/* Logo - Always visible at top */}
        <div className="absolute h-14 w-14">
          <Image src="/Teslead-Logo.png" alt="Logo" fill className="object-contain drop-shadow-lg" />
        </div>

        {/* User ID Step */}
        {step === "userId" && (
          <>
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-bold text-white">SIGN IN</h2>
              <p className="mt-1 text-sm text-gray-300">Use your account to login</p>
            </div>

            <form onSubmit={handleUserIdSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm text-gray-300">
                  User ID
                </Label>
                <Input
                  id="userId"
                  placeholder="Enter ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="h-12 border-gray-600 bg-black text-gray-100 placeholder:text-gray-500"
                  disabled={isLoading}
                  autoFocus
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={!userId.trim() || isLoading}
                className="h-12 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Next <ArrowRight className="ml-1 h-5 w-5" /></>}
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
              Powered By
              <p className="text-indigo-400">Teslead Equipments Private Limited</p>
            </div>
          </>
        )}

        {/* Password Step */}
        {step === "password" && (
          <>
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-bold text-white">Enter Password</h2>
              <p className="mt-2 text-sm text-gray-300">
                Welcome back, <span className="font-medium text-indigo-400">{userId}</span>
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-gray-600 bg-black text-gray-100 pr-12 placeholder:text-gray-500"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 flex-1 border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800 hover:text-white cursor-pointer"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="h-12 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer"
                  disabled={!password || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-xs text-gray-500">
              Powered By
              <p className="text-indigo-400">Teslead Equipments Private Limited</p>
            </div>
          </>
        )}

        {/* Loading Step */}
        {step === "loading" && (
          <>
            <div className="mt-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome, {userId}!</h2>
              <p className="mt-2 text-sm text-gray-300">Login successful. Redirecting to dashboard...</p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              <span className="text-sm text-gray-400">Loading your workspace...</span>
            </div>

            <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-gray-700">
              <div className="h-full animate-[loading_2s_ease-in-out] bg-indigo-600" />
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              Powered By
              <p className="text-indigo-400">Teslead Equipments Private Limited</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
