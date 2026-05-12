"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Rocket, Map, Image as ImageIcon, Film, Music,
  Wrench, GraduationCap, Trophy, Settings, Sparkles, Lightbulb,
  BookOpenText, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/setup", label: "Pre-Flight Setup", icon: Rocket, group: "Overview" },
  { href: "/roadmap", label: "Main Roadmap", icon: Map, group: "Learn" },
  { href: "/image", label: "Image Track", icon: ImageIcon, group: "Learn" },
  { href: "/video", label: "Video Track", icon: Film, group: "Learn" },
  { href: "/audio", label: "Audio Track", icon: Music, group: "Learn" },
  { href: "/cookbook", label: "Cookbook", icon: BookOpenText, group: "Library" },
  { href: "/tips", label: "Tips & Templates", icon: Lightbulb, group: "Library" },
  { href: "/rankings", label: "Model Rankings", icon: BarChart3, group: "Library" },
  { href: "/tools", label: "Tools Inventory", icon: Wrench, group: "Library" },
  { href: "/courses", label: "Courses Library", icon: GraduationCap, group: "Library" },
  { href: "/achievements", label: "Achievements", icon: Trophy, group: "You" },
  { href: "/settings", label: "Settings", icon: Settings, group: "You" },
];

const groups = Array.from(new Set(navItems.map((i) => i.group!)));

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-background sticky top-0 h-screen">
      <div className="px-5 h-16 flex items-center border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm tracking-tight">AI Tracker</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {groups.map((group) => (
          <div key={group} className="mb-5 last:mb-0">
            <p className="px-2 mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {group}
            </p>
            <div className="space-y-0.5">
              {navItems.filter((i) => i.group === group).map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-[11px] text-muted-foreground">v1.0 · local mode</p>
      </div>
    </aside>
  );
}
