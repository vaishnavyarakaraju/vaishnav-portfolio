"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-9 w-9 place-items-center rounded-full text-fg/70 transition hover:bg-line/[0.06] hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {mounted ? (isDark ? <Sun size={17} /> : <Moon size={17} />) : <span className="h-4 w-4" />}
    </button>
  );
}
