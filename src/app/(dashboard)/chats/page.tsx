"use client"

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import RequireAuth from "@/components/RequireAuth";

function ChatsContent() {
  const search = useSearchParams();
  const q = search?.get("q") ?? "";
  const conversationId = search?.get("conversationId") ?? undefined;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequireAuth>
        <div className="h-[calc(100vh-8.5rem)] md:h-[calc(100vh-180px)] min-h-[26rem] flex flex-col bg-white rounded-[1.75rem] md:rounded-[2.5rem] border border-slate-100 human-shadow overflow-hidden">
          <ChatWindow initialQuery={q || undefined} conversationId={conversationId} />
        </div>
      </RequireAuth>
    </Suspense>
  );
}

export default function ChatsPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center">Loading...</div>}>
      <ChatsContent />
    </Suspense>
  );
}
