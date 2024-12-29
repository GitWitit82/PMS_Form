import type { Metadata } from "next";
import { GeistSans } from "geist/font";
import { GeistMono } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { WorkspaceProvider } from "@/providers/workspace-provider";
import { FormProvider } from "@/providers/form-provider";
import { WorkflowProvider } from "@/providers/workflow-provider";
import { SessionProvider } from "@/providers/session-provider";

export const metadata: Metadata = {
  title: "Enterprise Project Management",
  description: "A comprehensive project management system with workflow automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <WorkspaceProvider>
              <FormProvider>
                <WorkflowProvider>
                  {children}
                </WorkflowProvider>
              </FormProvider>
            </WorkspaceProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


