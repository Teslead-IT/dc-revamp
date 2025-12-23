"use client"

import { LoginLogo } from "@/components/login/login-logo"
import { Login } from "@/components/login/login"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Logo (50%) */}
      <div className="h-40 w-full md:h-screen md:w-1/2">
        <LoginLogo />
      </div>

      {/* Right side - Login component (50%) */}
      <div className="flex-1 md:w-1/2">
        <Login />
      </div>
    </div>
  )
}
