import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { MobileNav } from "@/components/mobile-nav";
import { HydrationGuard } from "@/components/hydration-guard";
import { CommandPaletteProvider } from "@/components/command-palette-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Learning Tracker",
  description: "A calm, focused dashboard for the AI image, video, audio and full-stack mastery roadmap.",
  openGraph: {
    title: "AI Learning Tracker",
    description: "A calm, focused dashboard for mastering AI across chat, image, video, and audio workflows.",
    type: "website",
    siteName: "AI Learning Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Learning Tracker",
    description: "A local-first, gamified AI mastery dashboard with roadmap tracking and live model rankings.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CommandPaletteProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <TopBar />
                <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 pb-24 lg:pb-12 max-w-6xl w-full mx-auto">
                  <HydrationGuard>{children}</HydrationGuard>
                </main>
              </div>
            </div>
            <MobileNav />
            <Toaster position="bottom-right" closeButton theme="system" />
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
