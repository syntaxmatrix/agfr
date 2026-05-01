"use client"

import React, { useState } from "react"
import RequireAuth from "@/components/RequireAuth";
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] md:hidden"
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={toggleSidebar} 
      />
      
      <div 
        className={cn(
          "flex-1 flex flex-col h-screen sidebar-transition",
          isSidebarOpen
            ? "md:pl-[var(--dashboard-sidebar-expanded)]"
            : "md:pl-[var(--dashboard-sidebar-collapsed)]"
        )}
      >
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto px-4 py-4 sm:px-5 md:p-8 lg:p-10 pb-24 md:pb-32">
            <RequireAuth>
              {children}
            </RequireAuth>
          </div>
        </main>
      </div>
    </div>
  )
}
