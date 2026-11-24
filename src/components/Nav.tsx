"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Nav({ onHome = true }: { onHome?: boolean }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Primary"
        className={`mx-auto flex h-14 max-w-content items-center justify-between rounded-full pl-5 pr-2 transition-all duration-300 ${
          scrolled || open
            ? "bg-bg/75 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] ring-1 ring-line/[0.08] backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent"
        }`}
      >
        <a href={href("home")} className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label={`${site.name}, home`}>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-fg text-[11px] font-bold text-bg">{site.initials}</span>
          <span className="hidden text-[15px] sm:inline">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems.slice(1).map((item) => {
            const isActive = onHome && active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                    isActive ? "text-fg" : "text-fg/60 hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-line/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a href={site.resume} download className="btn-primary hidden !px-4 !py-2 text-[13px] sm:inline-flex">
            <Download size={14} aria-hidden="true" /> Resume
          </a>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-fg/80 hover:bg-line/[0.06] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-content rounded-3xl bg-bg/90 p-3 ring-1 ring-line/[0.08] backdrop-blur-xl lg:hidden"
          >
            <ul className="grid gap-0.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-4 py-3 text-[17px] ${
                      onHome && active === item.id ? "bg-line/[0.06] text-fg" : "text-fg/75"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href={site.resume} download className="btn-primary mt-3 w-full !py-3">
              <Download size={16} aria-hidden="true" /> Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
