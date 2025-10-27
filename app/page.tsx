"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoginWithRole from "@/components/login-with-role"

export default function Home() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/interface")
      }
    }
  }, [isLoggedIn, user, router])

  if (isLoggedIn) {
    return null
  }

  return <LoginWithRole />
}
