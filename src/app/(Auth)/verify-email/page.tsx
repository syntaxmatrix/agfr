"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"
import axios from "@/lib/axios"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("verify_email")
    if (savedEmail) {
      setEmail(savedEmail)
    }
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp) {
      toast.error("Please enter the verification code")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post("/api/user/verifyemail", {
        securityCode: otp,
      })

      if (response.data.success) {
        toast.success("Email verified successfully! You can now Login.")
        router.push("/login")
      } else {
        toast.error(response.data.message || "Verification failed")
      }
    } catch (error: unknown) {
      const errorMessage = 
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error
            ? error.message
            : "Invalid or expired code"
      toast.error(errorMessage)
      console.error("Verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-slate-900 items-center justify-center text-white human-shadow mb-6 mx-auto active:scale-95 transition-transform">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight mb-2">Verify Email</h1>
          <p className="text-slate-500 font-medium whitespace-pre-wrap">
            We&apos;ve sent a 6-digit code to{"\n"}
            <span className="text-slate-900 font-bold">{email || "your email"}</span>
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 md:p-10 text-center">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Code</label>
              <input 
                type="text" 
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={isLoading}
                className="w-full h-16 text-center text-3xl font-bold tracking-[0.5em] bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:bg-white focus:border-slate-900/10 focus:ring-4 focus:ring-slate-900/5 transition-all text-slate-800"
              />
            </div>

            <button 
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all human-shadow mt-4 disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Verify Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="mt-8 text-xs font-bold text-slate-400">
            Didn&apos;t receive a code? <button className="text-slate-900 hover:underline">Resend</button>
          </p>
        </div>
      </div>
    </div>
  )
}
