import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enterprise Project Management",
  description: "Enterprise Project Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <WorkspaceProvider>
              <div className="flex min-h-screen">
                <AppSidebar />
                <main className="flex-1 pl-16 lg:pl-64">
                  {children}
                </main>
              </div>
              <Toaster />
            </WorkspaceProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


