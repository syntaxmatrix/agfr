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
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={toggleSidebar} 
      />
      
      <div 
        className={cn(
          "flex-1 flex flex-col h-screen sidebar-transition",
          isSidebarOpen ? "pl-64" : "pl-16"
        )}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-10 pb-32">
            <RequireAuth>
              {children}
            </RequireAuth>
          </div>
        </main>
      </div>
    </div>
  )
}