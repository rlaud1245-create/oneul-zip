import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="font-semibold text-ink">{SITE.name}</strong> · {SITE.slogan}
        </p>
        <nav aria-label="하단 메뉴">
          <ul className="flex gap-4">
            <li>
              <Link href="/about" className="hover:text-ink">
                서비스 소개
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-ink">
                개인정보처리방침
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
