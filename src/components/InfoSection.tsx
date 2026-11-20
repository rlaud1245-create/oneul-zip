import type { ReactNode } from "react";

/** 페이지 하단의 설명 콘텐츠 (사용자 안내 + 검색엔진이 읽을 수 있는 실제 내용) */
export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-14 border-t-2 border-dashed border-ink/40 pt-8">
      <h2 className="font-sign text-xl font-normal">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}
