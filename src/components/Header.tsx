"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/food", label: "오늘 뭐 먹지" },
  { href: "/activity", label: "오늘 뭐 하지" },
  { href: "/balance", label: "오늘의 선택" },
  { href: "/saved", label: "저장함" },
];

export function Logo() {
  return (
    <span className="text-xl font-bold tracking-tight">
      오늘<span className="text-primary">.zip</span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <Link href="/" aria-label="오늘.zip 홈" className="rounded-lg" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary-light text-primary-deep" : "text-muted hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 grid size-11 place-items-center rounded-full text-ink hover:bg-primary-light sm:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="모바일 메뉴"
          className="border-t border-line bg-surface sm:hidden"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <ul className="mx-auto max-w-5xl px-3 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 font-medium hover:bg-canvas aria-[current=page]:text-primary-deep"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
