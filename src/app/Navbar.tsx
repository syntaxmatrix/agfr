"use client";
import { Zap } from "lucide-react";
import Link from "next/link";
import { ProductName } from "@/constant"

export default function Navbar() {

  return (
    <nav className="fixed top-0 right-0 left-0 z-[80] bg-slate-950 border-b border-slate-800/50 transition-all duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        {/* Left Side: Toggle + Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <Zap className="fill-white text-white" size={14} />
            </div>
            <span className="hidden sm:inline-block">{ProductName}</span>
          </Link>
        </div>

        {/* Right Side: Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-[13px] font-semibold text-slate-400 hover:text-white transition-all duration-200"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="relative px-5 py-2 text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md shadow-indigo-500/10"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
