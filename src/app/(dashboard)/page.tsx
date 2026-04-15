"use client"

import React from "react"
import Image from "next/image"
import {
  Sparkles,
  Plus,
  Users,
  Calendar,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
// import "./dashboard.css";
export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.name || "Agentic AI";

  const features = [
    {
      title: "Contribute",
      subtitle: "Ideas & Feedback",
      description: "Share your thoughts, contribute new ideas, and manage your tasks effortlessly.",
      icon: Plus,
      color: "bg-blue-50 text-blue-500 border-blue-100"
    },
    {
      title: "Collaborate",
      subtitle: "Team Connection",
      description: "Stay connected with your team, share resources, and collaborate in real-time.",
      icon: Users,
      color: "bg-indigo-50 text-indigo-500 border-indigo-100"
    },
    {
      title: "Prioritize",
      subtitle: "Time & Goals",
      description: "Organize your busy schedule and set important priorities for your daily success.",
      icon: Calendar,
      color: "bg-violet-50 text-violet-500 border-violet-100"
    }
  ]

  return (
    <div className="flex flex-col gap-12 pt-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <section className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white border border-white/50 human-shadow overflow-hidden group hero-section">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-8 text-center md:text-left hero-content">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/50 text-[11px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
              <Sparkles size={12} className="text-slate-400" />
              Beta v0.2
            </div>
            <h1 className="hero-title fade-in delay-100">
              Hi {userName}, <br />
              <span className="hero-subtitle">Ready to Achieve Great Things?</span>
            </h1>
            <p className="hero-desc fade-in delay-200">
              Explore your personalized workspace where creativity meets productivity. Your AI assistant is ready to help you build the future.
            </p>

            {/* Instructional Text */}
            <p className="info-text fade-in delay-300">
              To send email or chat, click on &quot;New Chat&quot;
            </p>
          </div>

          <div className="relative flex-1 flex justify-center lg:justify-end">
            <div className="relative w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] drop-shadow-2xl animate-float">
              <Image
                src="/robot.png"
                alt="Friendly AI Robot"
                fill
                className="object-contain hero-image"
                priority
              />

              {/* Floating Chat Bubble */}
              <div className="absolute -top-4 -right-2 md:top-10 md:right-0 bg-white p-4 rounded-2xl rounded-tr-none human-shadow border border-slate-100/50 animate-bounce-slow">
                <p className="text-sm font-semibold text-slate-800">How can I help you?</p>
                <div className="absolute top-0 right-0 w-3 h-3 bg-white border-t border-r border-slate-100/50 rotate-45 translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements for 'human-crafted' feel */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-slate-100/30 rounded-full blur-3xl -z-0"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl -z-0"></div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group relative p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300 human-shadow cursor-pointer hover-lift overflow-hidden"
          >
            <div className="relative z-10 space-y-5">
              <div className={cn(
                "w-14 h-14 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg",
                feature.color
              )}>
                <feature.icon size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-semibold text-slate-800">{feature.title}</h3>
                <span className="inline-block text-[10px] font-bold text-slate-400 border border-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-widest leading-none">
                  {feature.subtitle}
                </span>
                <p className="text-slate-500 text-sm leading-relaxed pt-2">
                  {feature.description}
                </p>
              </div>
            </div>

            {/* Organic imperfection line */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-20 transition-opacity">
              <ArrowUpRight size={24} className="text-slate-900" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </section>

      
    </div>
  )
}
