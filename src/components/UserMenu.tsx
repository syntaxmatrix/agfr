"use client"

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import axios from "@/lib/axios";
import { toast } from "sonner";

export default function UserMenu() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const loading = auth?.loading ?? true;
  const router = useRouter();

  if (loading) return <div className="px-4">...</div>;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <a href="/login" className="px-4 py-2 text-sm">Login</a>
        <a href="/register" className="px-4 py-2 bg-slate-900 text-white rounded">Sign up</a>
      </div>
    );
  }

  const logout = async () => {
    try {
      await axios.post('/api/user/logout');
      toast.success('Logged out');
      router.push('/login');
    } catch (err: unknown) {
      toast.error(
        typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Logout failed"
      );
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-medium">{user.name}</div>
      <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded">Logout</button>
    </div>
  );
}