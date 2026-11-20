import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 손으로 그린 빨간 동그라미. 감싼 글자 위에 겹쳐 그립니다. */
export function HandCircle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block", className)}>
      <svg
        viewBox="0 0 132 56"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-4 -inset-y-2.5 h-[calc(100%+20px)] w-[calc(100%+32px)] text-primary"
      >
        <path
          d="M14 30 C 10 10, 70 4, 112 12 C 134 17, 128 44, 92 48 C 54 53, 12 50, 8 32 C 6 22, 30 12, 60 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

/** 접었다 펴는 옵션 상자 (주문 옵션, 탑승 옵션) */
export function OptionsDrawer({ title, summary, children }: { title: string; summary: string; children: ReactNode }) {
  return (
    <details className="group card overflow-hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="font-label text-[18px]">{title}</span>
        <span className="flex min-w-0 items-center gap-2 font-label text-[15px] text-muted">
          <span className="truncate">{summary}</span>
          <span className="font-sans text-lg leading-none text-ink transition group-open:rotate-45" aria-hidden>
            +
          </span>
        </span>
      </summary>
      <div className="space-y-5 border-t-2 border-dashed border-ink/40 px-4 pb-5 pt-4">{children}</div>
    </details>
  );
}

/** 화면 아래에 붙는 큰 버튼 자리 */
export function StickyAction({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-5 mt-6 px-5 pb-4 pt-3 [background:linear-gradient(to_top,var(--shop-paper)_70%,transparent)]">
      {children}
    </div>
  );
}
