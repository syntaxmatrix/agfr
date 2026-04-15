"use client"

import React, { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Mail, 
  ShieldCheck,
  CheckCircle2,
  LogOut, 
  Globe, 
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductName } from "@/constant"


export default function AccountPage() {
  const [loading, setLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const router = useRouter();
  const { user, refresh } = useAuth();

  const requestSecurityCode = async () => {
    setLoading(true);
    try {
      await axios.post("/api/user/requestsecuritycode");
      toast.success("Security Code Sent", {
        description: "Check your email for the 6-digit security code."
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
            : "Failed to send code";
      toast.error("Operation Failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const checkUsername = async (val: string) => {
    setUsernameInput(val);
    if (!val.trim()) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }
    setUsernameStatus("checking");
    try {
      const res = await axios.get("/api/user/usernameavailability", { params: { username: val } });
      const msg = res.data?.message || "";
      if (msg.includes("Already Registered")) {
        setUsernameStatus("taken");
      } else {
        setUsernameStatus("available");
      }
      setUsernameMessage(msg);
    } catch {
      setUsernameStatus("error");
      setUsernameMessage("Failed to check availability");
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/user/logout");
      toast.success("Successfully Logged Out");
      await refresh();
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
            : "Logout Failed";
      toast.error("Logout Failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const connectGmail = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/user/email");
      const encryptedEmail = res.data?.data?.email || res.data?.email;
      if (!encryptedEmail) throw new Error("Encrypted email not returned from backend");
      window.location.href = `/api/user/gmail?email=${encodeURIComponent(encryptedEmail)}`;
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { status?: number } }).response?.status === "number" &&
        (err as { response?: { status?: number } }).response?.status === 401
      ) {
        router.push("/login");
        return;
      }
      toast.error("Linking failed", {
        description: "Please ensure your session is active."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Profile Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-105 duration-300">
              <User size={56} className="opacity-80" />
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-sm ring-4 ring-emerald-500/10"></div>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                {user.name}
                {user.isVerified && <CheckCircle2 size={20} className="text-emerald-500" />}
              </h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <Mail size={16} className="text-slate-400" />
                {user.email}
              </p>
              <p className="text-slate-400 text-sm font-semibold pt-1">@{user.username || "username"}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200/50">
                Member ID: {user._id?.slice(-8).toUpperCase()}
              </span>
              {user.isVerified && (
                <span className="px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Security & Actions */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <ShieldAlert size={20} className="text-indigo-600" />
              Security Settings
            </h2>
            <p className="text-sm text-slate-500">Manage your account access and verification methods.</p>
          </div>

          <div className="space-y-4 pt-2">

            <div
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer"
              onClick={() => {
                void requestSecurityCode();
                router.push('/reset');
              }}
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Reset Password</p>
                <p className="text-xs text-slate-500">Initiate a password reset flow</p>
              </div>
              <ArrowRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>
          </div>
        </section>

        {/* Integration & Linking */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Globe size={20} className="text-indigo-600" />
              Connected Apps
            </h2>
            <p className="text-sm text-slate-500">Sync your external services with {ProductName}.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-100/50 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Image src="/google.png" alt="Google" className="w-6 h-6 " width={24} height={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">Google Inbox</p>
                  <p className="text-xs text-slate-500 truncate">Manage emails with AI agents</p>
                </div>
                {user.googleConnected && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Connected
                  </span>
                )}
              </div>
              <Button 
                variant="outline" 
                className="w-full h-11 rounded-xl font-bold border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"
                onClick={connectGmail}
                disabled={loading}
              >
                {loading ? "Connecting..." : "Connect Workspace"}
              </Button>
            </div>
          </div>
        </section>

        {/* Username Availability Checker */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6 md:col-span-2">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <User size={20} className="text-indigo-600" />
              Profile Settings
            </h2>
            <p className="text-sm text-slate-500">Check if your desired username is available for future updates.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Desired Username</p>
                <p className="text-xs text-slate-500">Type a username to verify its exact availability.</p>
              </div>
              {usernameStatus === "available" && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">Available</span>}
              {usernameStatus === "taken" && <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">Taken</span>}
              {usernameStatus === "checking" && <span className="text-xs font-bold text-slate-500">Checking...</span>}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={usernameInput}
                onChange={(e) => checkUsername(e.target.value)}
                placeholder="e.g. johndoe99"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            {usernameStatus === "error" && <p className="text-xs text-rose-500">{usernameMessage}</p>}
          </div>
        </section>
      </div>

      {/* Danger Zone */}
      <section className="bg-rose-50/30 rounded-[2.5rem] border border-rose-100/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500 border border-rose-100/50">
            <LogOut size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Session Access</h3>
            <p className="text-sm text-slate-500 font-medium">Terminate current session and logout safely.</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-rose-600/20 active:scale-95 transition-all w-full md:w-auto"
          onClick={logout}
          disabled={loading}
        >
          Logout Now
        </Button>
      </section>
    </div>
  );
}
