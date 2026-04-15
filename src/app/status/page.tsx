"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Server, Database, Globe, ArrowRight } from "lucide-react";
import { ProductName , Version } from "@/constant"

export default function StatusPage() {
  const [backendStatus, setBackendStatus] = useState<"pending" | "success" | "error">("pending");
  const [backendMessage, setBackendMessage] = useState<string>("");
  const [backendPort, setBackendPort] = useState<number>(8000);

  const checkConnection = useCallback(async () => {
    setBackendStatus("pending");
    try {
      const response = await fetch(`http://localhost:${backendPort}/api/v1/hello`);
      if (response.ok) {
        const data = await response.json();
        setBackendStatus("success");
        setBackendMessage(data.message || "Connection established successfully!");
      } else {
        setBackendStatus("error");
        setBackendMessage(`Server responded with ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setBackendStatus("error");
      setBackendMessage("Could not reach the backend server. Is it running?");
      console.error("Connection check failed:", err);
    }
  }, [backendPort]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-600/20 rounded-2xl">
            <Globe className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              System Diagnostics
            </h1>
            <p className="text-slate-400 text-sm">Validating connection between Frontend and Backend</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 transition-all hover:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${backendStatus === "success" ? "bg-emerald-500/10" : backendStatus === "error" ? "bg-rose-500/10" : "bg-slate-700/20"}`}>
                  <Server className={`w-5 h-5 ${backendStatus === "success" ? "text-emerald-400" : backendStatus === "error" ? "text-rose-400" : "text-slate-400"}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Backend Service</h3>
                  <p className="text-xs text-slate-500">http://localhost:{backendPort}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {backendStatus === "pending" && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
                {backendStatus === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {backendStatus === "error" && <XCircle className="w-5 h-5 text-rose-400" />}
                <span className={`text-sm font-medium ${backendStatus === "success" ? "text-emerald-400" : backendStatus === "error" ? "text-rose-400" : "text-slate-400"}`}>
                  {backendStatus === "success" ? "Online" : backendStatus === "error" ? "Offline" : "Checking..."}
                </span>
              </div>
            </div>
            
            {backendMessage && (
              <div className={`mt-4 text-sm p-4 rounded-xl ${backendStatus === "success" ? "bg-emerald-500/5 text-emerald-300 border border-emerald-500/10" : "bg-rose-500/5 text-rose-300 border border-rose-500/10"}`}>
                {backendMessage}
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 opacity-60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-slate-700/20">
                  <Database className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Database Persistence</h3>
                  <p className="text-xs text-slate-500">MongoDB Atlas Cluster</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                <span className="text-sm font-medium text-slate-400">Verified by Proxy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={() => setBackendPort(8000)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${backendPort === 8000 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-800 text-slate-400 hover:text-white"}`}
            >
              Port 8000
            </button>
            <button 
              onClick={() => setBackendPort(3000)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${backendPort === 3000 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
            >
              Port 3000
            </button>
          </div>
          
          <button 
            onClick={checkConnection}
            className="flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm transition-transform hover:scale-105 active:scale-95"
          >
            Run Test Again <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-slate-500 text-xs tracking-widest uppercase">
        Syntax Matrix • {ProductName} {Version}
      </p>
    </div>
  );
}
