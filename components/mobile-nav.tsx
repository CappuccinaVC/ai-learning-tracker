"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Lightbulb, Trophy, Rocket, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/setup", label: "Setup", icon: Rocket },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/rankings", label: "Ranks", icon: BarChart3 },
  { href: "/tips", label: "Tips", icon: Lightbulb },
  { href: "/achievements", label: "Awards", icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 flex-1 rounded-md transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.25]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
