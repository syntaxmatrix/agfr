import "./globals.css";
export const dynamic = 'force-dynamic';
import { Toaster } from "@/components/ui/sonner";
import LogoutHandler from "@/components/LogoutHandler";
import { AuthProvider } from "@/context/AuthContext";
import { ProductName, Version } from "@/constant"

export const metadata = {
  title: `${ProductName} - Assistant ${Version}`,
  description:
    "Syntx AI is an AI-powered assistant that helps users send emails and perform tasks using natural language.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <AuthProvider>
          <LogoutHandler />
          {children}
          <Toaster richColors/>
        </AuthProvider>
      </body>
    </html>
  );
}
