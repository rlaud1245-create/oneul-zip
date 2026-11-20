"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SHOPS, shopForPath } from "@/lib/shops";

const NAV = [...SHOPS.map((s) => ({ href: s.path, label: s.menu })), { href: "/stamp", label: "도장판" }, { href: "/saved", label: "저장함" }];

export function Logo() {
  return <span className="font-sign text-[22px] tracking-tight">오늘.zip</span>;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header data-shop={shopForPath(pathname)} className="sticky top-0 z-30 border-b-[3px] border-ink">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <Link href="/" aria-label="오늘.zip 홈" className="rounded-lg" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="주요 메뉴" className="hidden sm:block">
          <ul className="flex items-center gap-1.5">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full border-2 px-3.5 py-1.5 font-label text-[16px] transition-colors",
                      active ? "border-ink bg-primary-strong text-on-strong" : "border-transparent text-ink hover:border-ink",
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
          className="border-t-2 border-ink bg-surface sm:hidden"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <ul className="mx-auto max-w-5xl px-3 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 font-label text-[18px] hover:bg-primary-light aria-[current=page]:text-primary-deep"
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
