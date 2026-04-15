"use client"

import React, { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ProductName } from "@/constant"

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setLoading(true);
    try {
        await axios.post("/api/user/otp", { email }, {withCredentials: true });
      toast.success("Verification Code Sent", {
        description: "Check your inbox for the security code."
      });
      router.push("/reset");
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to send code";
      toast.error("Operation Failed", {
        description: msg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-white">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
            <div className="flex size-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
              <GalleryVerticalEnd size={20} />
            </div>
            {ProductName}.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight">Forgot password?</h1>
              <p className="text-slate-500 font-medium">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form onSubmit={requestOtp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-slate-700 uppercase tracking-tight ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                  <Input 
                    id="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    type="email" 
                    placeholder="name@example.com"
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all text-slate-800"
                    required 
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl active:scale-95 transition-all">
                {loading ? "Sending Code..." : "Send Reset Code"}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-slate-100 lg:block overflow-hidden">
        <Image 
          src="/maths.jpg"
          alt="Abstract illustration"
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-40 mix-blend-multiply"
          width={800}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 to-transparent flex items-end p-20">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">Secure & Intelligent Access.</h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Your security is our priority. We use industry-standard encryption to protect your data and identity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
