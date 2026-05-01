"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
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
  LoaderCircle,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductName, supportEmail ,subscriptionChangeEmailTemplateBody,subscriptionChangeEmailTemplateSubject } from "@/constant";

export default function AccountPage() {
  const [securityLoading, setSecurityLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { user, refresh } = useAuth();
  const hasProfilePicture =
    typeof user?.profileURL === "string" &&
    user.profileURL.trim() !== "" &&
    user.profileURL.trim().toLowerCase() !== "null";

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: { data?: { message?: string } } }).response
        ?.data?.message === "string"
    ) {
      return (
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? fallback
      );
    }

    if (err instanceof Error) {
      return err.message;
    }

    return fallback;
  };

  useEffect(() => {
    if (!user) return;
    setNameInput(user.name || "");
    setUsernameInput(user.username || "");
  }, [user]);

  // Inside AccountPage(), after your state declarations:
  const searchParams = useSearchParams();

  useEffect(() => {
    const linked = searchParams.get("linked");
    const message = searchParams.get("message");

    if (linked === null) return;

    if (linked === "true") {
      toast.success("Google Account Linked", {
        description: message || "Google account linked successfully.",
      });
    } else {
      toast.error("Linking Failed", {
        description: message || "Failed to link Google account.",
      });
    }

    // Clean up the URL so the toast doesn't re-fire on refresh
    const url = new URL(window.location.href);
    url.searchParams.delete("linked");
    url.searchParams.delete("message");
    window.history.replaceState({}, "", url.toString());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkUsernameAvailability = async (value: string) => {
    const trimmedUsername = value.trim();

    if (!trimmedUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      setUsernameError("");
      return true;
    }

    setUsernameStatus("checking");
    setUsernameMessage("");

    try {
      const res = await axios.get("/api/user/usernameavailability", {
        params: { username: trimmedUsername },
      });
      const msg = res.data?.message || "";
      const isTaken = msg.includes("Already Registered");

      setUsernameStatus(isTaken ? "taken" : "available");
      setUsernameMessage(msg);
      setUsernameError(isTaken ? msg || "Username is already taken" : "");
      return !isTaken;
    } catch {
      setUsernameStatus("error");
      setUsernameMessage("Failed to check availability");
      setUsernameError("Failed to check username availability");
      return false;
    }
  };

  useEffect(() => {
    if (!user) return;

    const trimmedUsername = usernameInput.trim();
    const currentUsername = (user.username || "").trim();

    if (!trimmedUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      setUsernameError("");
      return undefined;
    }

    if (trimmedUsername === currentUsername) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      setUsernameError("");
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      await checkUsernameAvailability(trimmedUsername);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [usernameInput, user]);

  const requestSecurityCode = async () => {
    setSecurityLoading(true);
    try {
      await axios.post("/api/user/requestsecuritycode");
      toast.success("Security Code Sent", {
        description: "Check your email for the 6-digit security code.",
      });
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to send code");
      toast.error("Operation Failed", { description: msg });
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const trimmedName = nameInput.trim();
    const trimmedUsername = usernameInput.trim();
    const currentName = (user.name || "").trim();
    const currentUsername = (user.username || "").trim();

    setNameError("");
    setUsernameError("");
    setFormError("");

    if (usernameInput.length > 0 && !trimmedUsername) {
      setUsernameError("Username cannot be empty if provided");
      return;
    }

    if (trimmedUsername && trimmedUsername !== currentUsername) {
      const isUsernameAvailable =
        await checkUsernameAvailability(trimmedUsername);
      if (!isUsernameAvailable) {
        return;
      }
    }

    const payload: { name?: string; username?: string } = {};

    if (trimmedName && trimmedName !== currentName) {
      payload.name = trimmedName;
    }

    if (trimmedUsername && trimmedUsername !== currentUsername) {
      payload.username = trimmedUsername;
    }

    if (!payload.name && !payload.username) {
      setFormError("Please change at least one field before submitting");
      return;
    }

    setProfileLoading(true);
    try {
      await axios.put("/api/user/updatedprofile", payload);
      toast.success("Profile Updated Successfully");
      await refresh();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to update profile");
      setFormError(msg);
      toast.error("Profile Update Failed", { description: msg });
    } finally {
      setProfileLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post("/api/user/logout");
      toast.success("Successfully Logged Out");
      await refresh();
      router.push("/login");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Logout Failed");
      toast.error("Logout Failed", { description: msg });
    } finally {
      setLogoutLoading(false);
    }
  };

  const connectGmail = async () => {
    setConnectLoading(true);
    try {
      const res = await axios.get("/api/user/email");
      const encryptedEmail = res.data?.data?.email || res.data?.email;
      if (!encryptedEmail)
        throw new Error("Encrypted email not returned from backend");
      window.location.href = `/api/user/gmail?email=${encodeURIComponent(encryptedEmail)}`;
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { status?: number } }).response?.status ===
          "number" &&
        (err as { response?: { status?: number } }).response?.status === 401
      ) {
        router.push("/login");
        return;
      }
      toast.error("Linking failed", {
        description: "Please ensure your session is active.",
      });
    } finally {
      setConnectLoading(false);
    }
  };

  if (!user) return null;

  const subject = subscriptionChangeEmailTemplateSubject;

  const body = encodeURIComponent(
    subscriptionChangeEmailTemplateBody({
      email: user.email,
      currentPlan: user.subscription,
      name: user.name,
    })
  );

  const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${body}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-105 duration-300">
              {hasProfilePicture ? (
                <Image
                  src={user.profileURL as string}
                  alt={user.name || "Profile picture"}
                  width={128}
                  height={128}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={56} className="opacity-80" />
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-sm ring-4 ring-emerald-500/10"></div>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                {user.name}
                {user.isVerified && (
                  <CheckCircle2 size={20} className="text-emerald-500" />
                )}
              </h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1.5 pt-1">
                <Mail size={16} className="text-slate-400" />
                {user.email}
              </p>
              <p className="text-slate-400 text-sm font-semibold pt-1">
                @{user.username || "username"}
              </p>
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

              {user.subscription === "Free" && (
                <span className="px-3 py-1 bg-[#E2FDFF] rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200/50">
                  Plan : {user.subscription?.toUpperCase()}
                </span>
              )}
              {user.subscription === "Premium" && (
                <span className="px-3 py-1 bg-[#3772FF] rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-slate-200/50">
                  Plan : {user.subscription?.toUpperCase()}
                </span>
              )}

              {user.subscription === "Ultimate" && (
                <span className="px-3 py-1 bg-[#DF2935] rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-slate-200/50">
                  Plan : {user.subscription?.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <IndianRupee size={20} className="text-indigo-600" />
              Manage Subscription
            </h2>
            <p className="text-sm text-slate-500">
              Upgrade, downgrade, or cancel your current plan.
            </p>
          </div>
          <div className="space-y-4 pt-2 flex items-center">
            <div>
              <Link
                href={mailtoLink}
                className="inline-flex items-center gap-3 w-fit px-7 py-2 bg-[#c2d4ff] rounded-full text-[17px] font-bold text-black uppercase tracking-widest border border-slate-200/50 hover:bg-[#709bff] transition-colors"
              >
                <Mail className="w-5 h-5" />
                Contact us
              </Link>
            </div>
          </div>
        </section>

                <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Globe size={20} className="text-indigo-600" />
              Connected Apps
            </h2>
            <p className="text-sm text-slate-500">
              Sync your external services with {ProductName}.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-100/50 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Image
                    src="/google.png"
                    alt="Google"
                    className="w-6 h-6 "
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    Google Inbox
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    Manage emails with AI agents
                  </p>
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
                disabled={connectLoading}
              >
                {connectLoading ? "Connecting..." : "Connect Workspace"}
              </Button>
            </div>
          </div>
        </section>
        
        <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <ShieldAlert size={20} className="text-indigo-600" />
              Security Settings
            </h2>
            <p className="text-sm text-slate-500">
              Manage your account access and verification methods.
            </p>
          </div>
          <div className="space-y-4 pt-2">
            <div
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer"
              onClick={() => {
                void requestSecurityCode();
                router.push("/reset");
              }}
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  Reset Password
                </p>
                <p className="text-xs text-slate-500">
                  Initiate a password reset flow
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-slate-300 group-hover:text-slate-900 transition-colors"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] border border-slate-100 human-shadow p-8 space-y-6 md:col-span-2">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <User size={20} className="text-indigo-600" />
              Profile Settings
            </h2>
            <p className="text-sm text-slate-500">
              Update your name or username. Current values are pre-filled for
              quick edits.
            </p>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-bold text-slate-800"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (nameError) setNameError("");
                    if (formError) setFormError("");
                  }}
                  placeholder={user.name || "Enter your name"}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                {nameError && (
                  <p className="text-xs text-rose-500">{nameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="username"
                    className="text-sm font-bold text-slate-800"
                  >
                    Username
                  </label>
                  {usernameStatus === "available" && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      Available
                    </span>
                  )}
                  {usernameStatus === "taken" && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                      Taken
                    </span>
                  )}
                  {usernameStatus === "checking" && (
                    <span className="text-xs font-bold text-slate-500">
                      Checking...
                    </span>
                  )}
                </div>
                <input
                  id="username"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (usernameError) setUsernameError("");
                    if (formError) setFormError("");
                  }}
                  placeholder={user.username || "Enter your username"}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <p className="text-xs text-slate-500">
                  We automatically check username availability after a short
                  pause.
                </p>
                {usernameError && (
                  <p className="text-xs text-rose-500">{usernameError}</p>
                )}
                {!usernameError &&
                  usernameStatus === "available" &&
                  usernameMessage && (
                    <p className="text-xs text-emerald-600">
                      {usernameMessage}
                    </p>
                  )}
              </div>
            </div>

            {formError && <p className="text-sm text-rose-600">{formError}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <p className="text-xs text-slate-500">
                Only changed, non-empty fields are trimmed and sent in the
                update request.
              </p>
              <Button
                type="submit"
                className="min-w-48 h-11 rounded-xl font-bold"
                disabled={profileLoading || usernameStatus === "checking"}
              >
                {profileLoading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle size={16} className="animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </section>
      </div>

      <section className="bg-rose-50/30 rounded-[2.5rem] border border-rose-100/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-rose-500 border border-rose-100/50">
            <LogOut size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Session Access
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Terminate current session and logout safely.
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-rose-600/20 active:scale-95 transition-all w-full md:w-auto"
          onClick={logout}
          disabled={logoutLoading || securityLoading}
        >
          {logoutLoading ? "Logging Out..." : "Logout Now"}
        </Button>
      </section>
      <div>
        See our{" "}
        <Link href={"/privacy"} className="underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href={"/terms"} className="underline">
          Terms & Conditions
        </Link>
        .
      </div>
    </div>
  );
}
