'use client'

import { useEffect, useState } from 'react';
import { BACKEND_GOOGLE_GMAIL_URL } from "@/constant.js";
import axios from '@/lib/axios';

export default function GoogleRedirect() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get("/api/user/email");
        const foundEmail = response.data?.data?.email;
        if (foundEmail) {
          setEmail(foundEmail);
        } else {
          console.error("Email not found in response");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) {
      const encodedEmail = encodeURIComponent(email);
      window.location.href = `${BACKEND_GOOGLE_GMAIL_URL}?email=${encodedEmail}`;
    }
  }, [email]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg font-semibold">Redirecting to Google...</p>
    </div>
  );
}
