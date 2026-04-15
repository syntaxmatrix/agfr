"use client"

import { useEffect } from "react";
import axios from "@/lib/axios";

declare global {
  interface Window {
    logoutHandler?: () => Promise<void>;
  }
}

export default function LogoutHandler() {
  useEffect(() => {
    window.logoutHandler = async () => {
      try {
        await axios.post('/api/user/logout');
      } catch {
        // ignore
      }
      window.location.href = '/login';
    };

    return () => {
      try {
        delete window.logoutHandler;
      } catch {}
    };
  }, []);

  return null;
}
