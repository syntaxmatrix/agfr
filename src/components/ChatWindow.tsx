"use client"

import React, { useState, useEffect, useRef } from "react";
import axios from "@/lib/axios";
import { 
  Bot, 
  User, 
  Sparkles, 
  Loader2,
  Paperclip,
  Mic,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ProductName } from "@/constant";

type Role = "user" | "agent";

type ChatMessage = {
  from: Role;
  text: React.ReactNode | string;
};

type HistoryMessage = {
  role?: string;
  content?: unknown;
};

type HistoryResponse = {
  ok?: boolean;
  messages?: HistoryMessage[];
};

type AgentAnswer = {
  labelIds?: string[];
  subject?: string;
  to?: string;
  body?: unknown;
  text?: string;
};

type AgentChatResponse = {
  ans?: unknown;
  text?: string;
};

const LOADING_MESSAGES = ["Generating...", "Working...", "Loading...", "Thinking..."];

export default function ChatWindow({ initialQuery, conversationId }: { initialQuery?: string, conversationId?: string }) {
  const router = useRouter();
  function normalizeContent(content: unknown): React.ReactNode {
    if (React.isValidElement(content)) return content;
    if (typeof content === 'string') return content;
    if (content === null || content === undefined) return '';
    if (typeof content === 'object') {
      const maybeContent = content as AgentAnswer;
      if (typeof maybeContent.body === 'string') return maybeContent.body;
      if (typeof maybeContent.text === 'string') return maybeContent.text;
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  }
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialQuery ? [{ from: "user", text: initialQuery }] : []
  );
  const [convId, setConvId] = useState(conversationId || crypto.randomUUID());
  const [input, setInput] = useState(initialQuery ?? "");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;
  
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
  
    return () => clearInterval(interval);
  }, [loading]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch specific conversation if conversationId changes
  useEffect(() => {
    if (conversationId) {
      setConvId(conversationId);
      const fetchHistory = async () => {
        try {
          const res = await axios.get<HistoryResponse>(`http://localhost:8000/api/v1/history/${conversationId}`, {
            withCredentials: true
          });
          if (res.data?.ok && res.data.messages) {
            setMessages(res.data.messages.map((m) => ({
              from: m.role === "ai" ? "agent" : "user",
              text: normalizeContent(m.content)
            })));
          }
        } catch (err) {
          console.warn("Failed to load chat history", err);
        }
      };
      fetchHistory();
    } else {
      // New conversation
      setConvId(crypto.randomUUID());
      setMessages(initialQuery ? [{ from: "user", text: initialQuery }] : []);
      setInput(initialQuery ?? "");
    }
  }, [conversationId, initialQuery]);

  useEffect(() => {
    const handleForceReset = () => {
      setConvId(crypto.randomUUID());
      setMessages([]);
      setInput("");
    };
    window.addEventListener("resetChatWindow", handleForceReset);
    return () => window.removeEventListener("resetChatWindow", handleForceReset);
  }, []);

  // Handle initial query after mount
  useEffect(() => {
    if (initialQuery && !conversationId) {
      send();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    const q = input.trim();
    if (!q) return;

    if (!messages.find(m => m.text === q)) {
      setMessages((s) => [...s, { from: "user", text: q }]);
    }
    setInput("");
    setLoading(true);

    try {
      const res = await axios.get<AgentChatResponse>("http://localhost:8000/api/v1/agent/chats", { 
        params: { q, conversationId: convId },
        withCredentials: true 
      });
      const ans: unknown = res.data?.ans ?? res.data?.text ?? "I'm sorry, I couldn't process that.";

      // Handle Email responses
      if (ans && typeof ans === 'object') {
        const answer = ans as AgentAnswer;
        // Sent confirmation from Gmail API (has labelIds with SENT)
        if (Array.isArray(answer.labelIds) && answer.labelIds.includes('SENT')) {
          const sentText = (
            <div className="flex flex-col gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm w-full flex items-center justify-between">
                <div className="text-sm text-green-800 font-medium">Email sent to recipient.</div>
                <div className="text-xs text-green-700 opacity-80">Sent</div>
              </div>
            </div>
          );
          setMessages((s) => [...s, { from: "agent", text: sentText }]);
        } else if (answer.subject !== undefined && answer.to !== undefined && answer.body) {
          // Format as an email draft visualization
          const jsx = (
            <div className="flex flex-col gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-md">DRAFT</span>
                  <p className="text-sm font-semibold text-slate-800">New Email</p>
                </div>
                <div className="text-xs text-slate-500 space-y-1.5 mb-3 select-all">
                  <p><strong className="text-slate-700">To:</strong> {answer.to || "[Not Specified]"}</p>
                  <p><strong className="text-slate-700">Subject:</strong> {answer.subject}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap font-medium">
                  {normalizeContent(answer.body)}
                </div>
              </div>
            </div>
          );
          setMessages((s) => [...s, { from: "agent", text: jsx }]);
        } else {
          setMessages((s) => [...s, { from: "agent", text: normalizeContent(answer) }]);
        }
      } else {
        setMessages((s) => [...s, { from: "agent", text: String(ans) }]);
      }

      // Update URL to stay in this conversation context
      if (!conversationId) {
        router.replace(`/chats?conversationId=${convId}`);
      }

    } catch (err: unknown) {
      const fallback = "Connection interrupted";
      const responseData =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: unknown } }).response?.data === "object"
          ? (err as { response?: { data?: { message?: unknown; error?: unknown } } }).response?.data
          : undefined;
      const msg =
        (typeof responseData?.message === "string" && responseData.message) ||
        (typeof responseData?.error === "string" && responseData.error) ||
        (err instanceof Error && err.message) ||
        fallback;
      setMessages((s) => [...s, { from: "agent", text: msg }]);
    } finally {
      setLoading(false);
      // Notify sidebar to refresh history even if AI failed
      window.dispatchEvent(new Event("chatUpdated"));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 select-none">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Intelligence Ready</h3>
              <p className="text-slate-500 font-medium max-w-[200px] mx-auto leading-relaxed">
                Start a conversation to see {ProductName} in action.
              </p>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div 
            key={i} 
            className={cn(
              "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
              m.from === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
              m.from === "user" ? "bg-white border-slate-100 text-slate-600" : "bg-slate-900 border-slate-900 text-white"
            )}>
              {m.from === "user" ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div className={cn(
              "max-w-[80%] px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
              m.from === "user" 
                ? "bg-slate-50 text-slate-800 rounded-tr-none border border-slate-100" 
                : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
            )}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 flex-row">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border bg-slate-900 border-slate-900 text-white">
              <Bot size={18} />
            </div>
            <div className="max-w-[80%] px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm bg-white text-slate-800 rounded-tl-none border border-slate-100 flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-slate-400" />
              <span className="text-slate-500 animate-pulse">{LOADING_MESSAGES[messageIndex]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-50">
        <form 
          onSubmit={send} 
          className="relative glass rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-2 shadow-2xl focus-within:ring-8 focus-within:ring-slate-900/5 transition-all"
        >
          <div className="flex items-center">
            <button type="button" className="p-4 text-slate-400 hover:text-slate-900 transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent px-2 py-4 text-sm font-semibold focus:outline-none placeholder:text-slate-300 text-slate-800 disabled:opacity-50"
              placeholder={`Message ${ProductName}...`}
            />
            <div className="flex items-center gap-1.5 pr-2">
              <button type="button" className="p-3 text-slate-300 hover:text-slate-600 transition-colors hidden sm:block">
                <Mic size={20} />
              </button>
              <button 
                type="submit" 
                className={cn(
                  "p-4 bg-slate-900 text-white rounded-3xl shadow-xl transition-all active:scale-95 flex items-center gap-2",
                  !input.trim() && !loading ? "opacity-30 pointer-events-none grayscale" : "opacity-100 hover:bg-slate-800"
                )}
                disabled={loading || !input.trim()}
              >
                <span className="text-xs font-bold uppercase tracking-widest hidden md:block pl-2 pr-1">Send</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
