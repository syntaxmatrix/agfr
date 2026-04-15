"use client"

import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export default function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) return { user: null, loading: true, error: "No auth context" };
  return { user: ctx.user, loading: ctx.loading, error: null };
}
