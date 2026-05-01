"use client"

import React from "react"
import { PanelLeft } from "lucide-react"
import UserMenu from "@/components/UserMenu"
import { Version } from "@/constant"

interface HeaderProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-transparent relative z-30 gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="flex items-center gap-2.5">
          {!isSidebarOpen && (
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900 md:hidden"
            >
              <PanelLeft size={18} />
            </button>
          )}
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
