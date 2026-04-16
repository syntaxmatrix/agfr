"use client"

import React from "react"
import UserMenu from "@/components/UserMenu"
import { Version } from "@/constant"

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-transparent relative z-30 gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="font-display font-bold text-slate-800 tracking-tight text-base sm:text-lg truncate">Assistant {Version}</span>
          <span className="hidden sm:inline-flex text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-slate-200/50">Beta</span>
        </div>
      </div>

      {/* Center Section - Removed per request */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0"></div>

      {/* Right Section - User Menu */}
      <div className="flex items-center gap-3 shrink-0">
        <UserMenu />
      </div>
    </header>
  )
}
