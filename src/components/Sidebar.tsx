"use client";
import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MessageSquare, 
  Zap,
  History,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { ProductName } from "@/constant";

interface SidebarProps {
  history: string[];
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isOpen?: boolean;
}

export default function Sidebar({ history, isCollapsed, setIsCollapsed, isOpen }: SidebarProps) {

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/50 transition-all duration-300 ease-in-out z-[100] ${
        isCollapsed ? "w-[72px]" : "w-[280px]"
      } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between h-16 border-b border-slate-800/50">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold tracking-tight truncate">
            <Zap className="fill-indigo-500 text-indigo-500" size={17} />
            <span className="text-sm">{ProductName}</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <Zap className="fill-indigo-500 text-indigo-500" size={20} />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors absolute -right-3 top-20 shadow-lg border border-slate-700 md:flex hidden items-center justify-center"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button 
          title={isCollapsed ? "New Chat" : ""}
          className={`flex items-center gap-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 rounded-xl font-semibold p-3 overflow-hidden shadow-sm active:scale-95 ${isCollapsed ? "justify-center" : ""}`}
        >
          <Plus size={18} className="flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap text-[13px]">New Chat</span>}
        </button>
      </div>

      {/* History section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar-visible">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-4 flex items-center gap-2 opacity-80">
            <History size={11} /> Recent Sessions
          </p>
        )}
        
        <div className="space-y-1.5 focus-within:ring-2 ring-indigo-500/20 rounded-xl">
          {history.length === 0 ? (
            !isCollapsed && (
              <p className="px-3 py-3 text-xs text-slate-600 italic">No recent chats</p>
            )
          ) : (
            history.map((item, i) => (
              <div 
                key={i} 
                title={isCollapsed ? item : ""}
                className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all active:bg-slate-800 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="relative">
                  <MessageSquare size={18} className="flex-shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  {isCollapsed && <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>}
                </div>
                {!isCollapsed && (
                  <span className="flex-1 truncate text-sm text-slate-400 group-hover:text-slate-100 font-medium">
                    {item}
                  </span>
                )}
              </div>
            ))
          )}
          
          {/* Example dummy items */}
          <div title={isCollapsed ? "Design UI strategy" : ""} className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all ${isCollapsed ? "justify-center" : ""}`}>
             <MessageSquare size={18} className="flex-shrink-0 text-slate-500 group-hover:text-indigo-400" />
             {!isCollapsed && <span className="flex-1 truncate text-sm text-slate-400 group-hover:text-slate-100 font-medium lowercase">design ui strategy</span>}
          </div>
          <div title={isCollapsed ? "Researching AI agents" : ""} className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-all ${isCollapsed ? "justify-center" : ""}`}>
             <MessageSquare size={18} className="flex-shrink-0 text-slate-500 group-hover:text-indigo-400" />
             {!isCollapsed && <span className="flex-1 truncate text-sm text-slate-400 group-hover:text-slate-100 font-medium lowercase">researching ai agents</span>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors ${isCollapsed ? "justify-center" : ""}`}>
           <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
             JD
           </div>
           {!isCollapsed && (
             <div className="flex-1 truncate">
               <p className="text-xs font-bold text-white">Syntax Matrix</p>
               <p className="text-[10px] text-slate-500 truncate">abc@example.com</p>
             </div>
           )}
           {!isCollapsed && <MoreHorizontal size={14} className="text-slate-600" />}
        </div>
      </div>
    </aside>
  );
}
