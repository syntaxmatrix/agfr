"use client"

import React, { useEffect, useMemo, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd, Lock, ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { PasswordResetSchema, VerifyCodeSchema } from "@/schemas/auth";
import { ProductName } from "@/constant"

type ResetCookie = {
  email?: string;
  cnt?: number;
  lastSentAt?: number;
};

const RESET_COOKIE_NAME = "token_reset";
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_RESEND_COUNT = 3;

function readResetCookie(): ResetCookie {
  if (typeof document === "undefined") return {};

  const cookieEntry = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${RESET_COOKIE_NAME}=`));

  if (!cookieEntry) return {};

  const rawValue = decodeURIComponent(cookieEntry.slice(RESET_COOKIE_NAME.length + 1));

  try {
    const parsed = JSON.parse(rawValue) as ResetCookie;
    return parsed ?? {};
  } catch {
    const params = new URLSearchParams(rawValue);
    return {
      email: params.get("email") ?? undefined,
      cnt: Number(params.get("cnt") ?? "0"),
      lastSentAt: Number(params.get("lastSentAt") ?? "0"),
    };
  }
}

function writeResetCookie(nextValue: ResetCookie) {
  if (typeof document === "undefined") return;

  document.cookie = `${RESET_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(nextValue))}; path=/; max-age=86400; samesite=lax`;
}

export default function ResetPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendCount, setResendCount] = useState(0);
  const router = useRouter();

  const resetCookie = useMemo(() => readResetCookie(), []);
  const email = resetCookie.email ?? "";

  useEffect(() => {
    const cookie = readResetCookie();
    const currentCount = Number(cookie.cnt ?? 0);
    setResendCount(Number.isFinite(currentCount) ? currentCount : 0);

    const lastSentAt = Number(cookie.lastSentAt ?? 0);
    if (lastSentAt > 0) {
      const elapsedSeconds = Math.floor((Date.now() - lastSentAt) / 1000);
      setCooldownSeconds(Math.max(0, RESEND_COOLDOWN_SECONDS - elapsedSeconds));
      return;
    }

    const fallbackCount = Number(cookie.cnt ?? 0);
    if (Number.isFinite(fallbackCount) && fallbackCount >= 0) {
      writeResetCookie({
        ...cookie,
        cnt: fallbackCount,
        lastSentAt: Date.now(),
      });
    }
    setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
  }, []);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timerId = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [cooldownSeconds]);

  const resendSecurityCode = async () => {
    if (!email) {
      toast.error("Email missing", {
        description: "The reset session could not be found. Please request a new code."
      });
      return;
    }

    if (resendCount >= MAX_RESEND_COUNT) {
      toast.error("Resend limit reached", {
        description: "You can only resend the security code 3 times."
      });
      return;
    }

    if (cooldownSeconds > 0) {
      toast.error("Please wait", {
        description: `You can resend the code in ${cooldownSeconds}s.`
      });
      return;
    }

    setResendLoading(true);
    try {
      try {
        await axios.post("/api/user/otp", { email });
      } catch {
        await axios.get("/api/user/otp", { params: { email } });
      }

      const nextCount = resendCount + 1;
      setResendCount(nextCount);
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
      writeResetCookie({
        email,
        cnt: nextCount,
        lastSentAt: Date.now(),
      });

      toast.success("Verification Code Resent", {
        description: "Check your inbox for the new security code."
      });
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to resend code";
      toast.error("Resend Failed", {
        description: msg
      });
    } finally {
      setResendLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeResult = VerifyCodeSchema.safeParse({ verifyCode: code });
    if (!codeResult.success) {
      toast.error("Invalid Security Code", {
        description: codeResult.error.issues[0]?.message ?? "Please enter a valid 6-digit code."
      });
      return;
    }

    const passwordResult = PasswordResetSchema.safeParse({ password, confirmPassword });
    if (!passwordResult.success) {
      toast.error("Invalid Password", {
        description: passwordResult.error.issues[0]?.message ?? "Please check your password requirements."
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/passwordreset", { securityCode: codeResult.data.verifyCode, password: passwordResult.data.password });
      toast.success("Password Changed", {
        description: "Your password has been successfully updated."
      });
      router.push("/login");
    } catch (err: unknown) {
      const msg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Password reset failed";
      toast.error("Reset Failed", {
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
              <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
              <p className="text-slate-500 font-medium">
                Please enter the code sent to your email and your new password.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Security Code</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <Input 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="Enter 6-digit code"
                    className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <Input 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                  <Input 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-md font-bold shadow-lg active:scale-95 transition-all">
                  {loading ? "Updating..." : "Reset Password"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={resendLoading || cooldownSeconds > 0}
                  onClick={resendSecurityCode}
                  className="w-full h-12 rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <RotateCcw size={16} className="mr-2" />
                  {resendLoading
                    ? "Resending..."
                    : cooldownSeconds > 0
                      ? `Resend Code (${cooldownSeconds}s)`
                      : "Resend Code"}
                </Button>
              </div>
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
          src="/puzzul.jpg"
          alt="Security visual"
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-20"
          width={800}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-slate-900/90 flex flex-col justify-center p-16 text-white">
          <ShieldCheck size={64} className="mb-8 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">Identity Verification.</h2>
          <p className="text-xl text-slate-200 font-medium leading-relaxed max-w-md">
            We use multi-factor verification to ensure that only you can access and manage your account.
          </p>
        </div>
      </div>
    </div>
  );
}
