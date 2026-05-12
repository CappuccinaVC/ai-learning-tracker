"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";

interface Ctx {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const CommandPaletteCtx = createContext<Ctx | null>(null);

export function useCommandPalette() {
  const c = useContext(CommandPaletteCtx);
  if (!c) throw new Error("useCommandPalette must be used inside <CommandPaletteProvider>");
  return c;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Global ⌘K / Ctrl+K hotkey
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "/" && !isInputTarget(e.target)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandPaletteCtx.Provider value={{ open, close, isOpen }}>
      {children}
      <CommandPalette open={isOpen} onClose={close} />
    </CommandPaletteCtx.Provider>
  );
}

function isInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}
