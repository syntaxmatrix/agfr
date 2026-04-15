import "./globals.css";
export const dynamic = 'force-dynamic';
import { Toaster } from "@/components/ui/sonner";
import LogoutHandler from "@/components/LogoutHandler";
import { AuthProvider } from "@/context/AuthContext";
import { ProductName, Version } from "@/constant"

export const metadata = {
  title: `${ProductName} - Assistant ${Version}`,
  description: "Modern SaaS AI assistant for achieving great things.",
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
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}