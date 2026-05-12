"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export function HydrationGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => setMounted(true), []);

  if (!mounted || !hydrated) {
    return (
      <>{fallback ?? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      )}</>
    );
  }
  return <>{children}</>;
}
