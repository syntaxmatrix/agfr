'use client'

import { useEffect } from 'react';
import { BACKEND_GOOGLE_URL } from "@/constant";

export default function GoogleRedirect() {
  
  useEffect(() => {
      window.location.href = `${BACKEND_GOOGLE_URL}`;
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-semibold">Redirecting to Google...</p>
    </div>
  );
}
