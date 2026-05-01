"use client"

import React, { useState, useEffect } from "react"
import { 
  PanelLeft, 
  Plus, 
  MessageSquare,
  Sparkles,
  LogOut,
  User,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "@/lib/axios"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { ProductName } from "@/constant"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"
import Image from "next/image"


interface SidebarProps {
  isOpen: boolean
  toggle: () => void
}

type HistoryItem = {
  _id: string;
  latestMessage?: string;
  title?: string;
  query?: string;
  messages?: Array<{
    role?: string;
    content?: unknown;
  }>;
};

type HistoryResponse = {
  ok?: boolean;
  history?: HistoryItem[];
};

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const user = auth?.user ?? null;
  const searchParams = useSearchParams();
  const hasProfileUrl =
    typeof user?.profileURL === "string" &&
    user.profileURL.trim() !== "" &&
    user.profileURL.trim().toLowerCase() !== "null";
  const refresh = auth?.refresh ?? (async () => {});
  const router = useRouter();
  const [currentConversationId, setCurrentConversationId] = React.useState<string | null>(null);

  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState(false);

  useEffect(() => {
    setCurrentConversationId(searchParams?.get("conversationId") ?? null);
  }, [searchParams]);

  const getHistoryLabel = (chat: HistoryItem) => {
    if (typeof chat.title === "string" && chat.title.trim()) {
      return chat.title.trim();
    }

    if (typeof chat.query === "string" && chat.query.trim()) {
      return chat.query.trim();
    }

    const firstUserTextMessage = chat.messages?.find((message) => {
      if (message.role !== "user") return false;
      if (typeof message.content !== "string") return false;
      return message.content.trim().length > 0;
    });

    if (typeof firstUserTextMessage?.content === "string") {
      return firstUserTextMessage.content.trim();
    }

    if (typeof chat.latestMessage === "string" && chat.latestMessage.trim()) {
      return chat.latestMessage.trim();
    }

    return "New Chat";
  };

  const getDeletedIds = (): string[] => {
    const raw = localStorage.getItem("deletedIds") || "[]";
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((id): id is string => typeof id === "string");
      }
    } catch {
      // fallback below for malformed localStorage content
    }
    return [];
  };

  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [openMenuId]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const deletedIds = getDeletedIds();
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("deletedIds", JSON.stringify(deletedIds));
    }
    
    setRecentHistory((prev) => prev.filter((item) => item._id !== id));
    setOpenMenuId(null);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchHistory = async () => {
        try {
          setHistoryError(false);
          const res = await axios.get<HistoryResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history`, {
            withCredentials: true
          });
          if (res.data?.ok) {
            const deletedIds = getDeletedIds();
            const history = res.data.history ?? [];
            const filteredData = history.filter(
              (item) => !deletedIds.includes(item._id)
            );
            setRecentHistory(filteredData);
          } else {
            setRecentHistory([]);
          }
        } catch (err) {
          setHistoryError(true);
          setRecentHistory([]);
          console.warn("Failed to load history", err);
        }
      };
      // Fetch history initially
      fetchHistory();
      
      const handleChatUpdate = () => {
        fetchHistory();
      };
      
      window.addEventListener("chatUpdated", handleChatUpdate);
      return () => window.removeEventListener("chatUpdated", handleChatUpdate);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout");
      toast.success("Successfully Logged Out");
      await refresh();
      router.push("/login");
    } catch {
      toast.error("Logout Failed");
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300 ease-in-out",
        isOpen
          ? "w-[min(18rem,88vw)] md:w-[var(--dashboard-sidebar-expanded)] translate-x-0"
          : "-translate-x-full md:w-[var(--dashboard-sidebar-collapsed)] md:translate-x-0"
      )}
    >
      {/* Sidebar Header: Logo & Toggle */}
      <div
        className={cn(
          "shrink-0 border-b border-slate-100/80",
          isOpen
            ? "h-20 flex items-center justify-between px-4 md:px-5"
            : "hidden md:flex md:flex-col md:items-center md:gap-4 md:px-3 md:py-5"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
            <Sparkles size={20} />
          </div>
          {isOpen && <span className="font-bold text-slate-800 text-lg tracking-tight">{ProductName}</span>}
        </Link>
        <button 
          type="button"
          onClick={toggle}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900",
            !isOpen && "md:self-center"
          )}
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Action: New Chat */}
      <div className={cn("mb-5 md:mb-6 shrink-0", isOpen ? "px-4 pt-5" : "px-3 pt-5 md:px-2")}>
        <Link href="/chats" className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95",
          !isOpen && "md:h-14 md:justify-center md:px-0"
        )}>
          <Plus size={20} />
          {isOpen && <span>New Chat</span>}
        </Link>
      </div>

      {/* Recent History - Scrollable */}
      <div
        className={cn(
          "flex-1 overflow-y-auto space-y-1 py-4 border-t border-slate-100",
          isOpen ? "px-4" : "px-2"
        )}
      >
        {isOpen && (
          <div className="mb-4">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h3>
            <div className="space-y-1">
              {!historyError && recentHistory.length === 0 && (
                <p className="px-3 py-2 text-sm text-slate-400">No chat threads yet.</p>
              )}

              {historyError && (
                <p className="px-3 py-2 text-sm text-red-500">Unable to load chat history.</p>
              )}

              {recentHistory.map((chat, idx) => {
                const isActive = currentConversationId === chat._id;
                return (
                  <div
                    key={chat._id || idx}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left group relative",
                      isActive 
                        ? "bg-slate-100 text-slate-900 font-semibold shadow-sm border border-slate-200/50" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    <div
                      onClick={() => {
                        router.push(`/chats?conversationId=${chat._id}`);
                      }}
                      className="flex-1 flex items-center gap-3 overflow-hidden cursor-pointer"
                    >
                      <MessageSquare size={16} className={cn("shrink-0", isActive ? "text-slate-900" : "text-slate-300 group-hover:text-slate-400")} />
                      <span className="truncate">{getHistoryLabel(chat)}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                      }}
                      className={cn(
                        "p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-opacity shrink-0 ml-2",
                        openMenuId === chat._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {openMenuId === chat._id && (
                      <div className="absolute right-0 top-10 min-w-28 bg-white border border-slate-200 shadow-md rounded-lg py-1 z-60 text-slate-700">
                        <button
                          onClick={(e) => handleDelete(chat._id, e)}
                          className="w-full text-left px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile Section */}
      <div className={cn("border-t border-slate-100 shrink-0", isOpen ? "p-4" : "p-3")}>
        {isAuthenticated && user ? (
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-200/50 group",
            !isOpen && "md:justify-center md:border-none md:bg-transparent md:px-0"
          )}>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden shrink-0 border-2 border-white shadow-sm">
              {hasProfileUrl ? (
                <Image width={20} height={20} src={user.profileURL as string}
                  alt={user.name || "Profile picture"}
                  className="w-full h-full object-cover"/>
              ) : (
                <User size={20} />
              )}
            </div>
            {isOpen && (
              <Link href="/account" className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-medium uppercase tracking-tight">{user.email}</p>
              </Link>
            )}
            {isOpen && (
              <button 
                onClick={handleLogout} 
                title="Logout" 
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        ) : (
          isOpen && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 text-center">
              <p className="text-xs font-semibold text-slate-500 mb-3">Save your conversations</p>
              <Link 
                href="/login"
                className="block w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Login
              </Link>
            </div>
          )
        )}
      </div>
    </aside>
  )
}
