"use client"

import { useSearchParams } from "next/navigation"
import { AuthCard } from "@/components/auth/AuthCard"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") as "creator" | "public") || undefined
  return (
    <div className="min-h-[calc(100dvh-64px)] w-full grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        {role && (
          <div className="mb-4 text-center text-sm text-muted-foreground">
            {role === "creator" ? "Admin / Creator Access" : "Citizen Access"}
          </div>
        )}
        <AuthCard
          role={role}
          redirectPath={role === "creator" ? "/dashboard" : undefined}
        />
      </div>
    </div>
  )
}


