import type { ReactNode } from "react";
import type { ShopTheme } from "@/lib/shops";

/**
 * 가게 간판 (페이지 맨 위 색 띠)
 * 색은 감싸고 있는 data-shop 영역의 테마를 따라갑니다.
 */
interface Props {
  /** 가게 이름. 예: "오늘.zip 분식" */
  shop: string;
  title: string;
  /** 간판 오른쪽 위 작은 글씨 (보통 오늘 날짜) */
  note?: string;
  description?: ReactNode;
  /** 본문 폭에 맞춘 최대 너비 클래스 */
  width?: string;
}

export function ShopSign({ shop, title, note, description, width = "max-w-5xl" }: Props) {
  return (
    <header className="sign-band">
      <div className={`mx-auto w-full ${width} px-5 pb-6 pt-6 sm:pb-8 sm:pt-9`}>
        <div className="flex items-center justify-between gap-3 font-label text-[15px] text-ink">
          <span>{shop}</span>
          {note && <span>{note}</span>}
        </div>
        <h1 className="sign-title mt-2 text-[44px] leading-[1.05] sm:text-6xl">{title}</h1>
        {description && <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed text-ink">{description}</p>}
      </div>
    </header>
  );
}

/** 가게 영역. 이 안쪽은 가게 테마 색을 씁니다. */
export function Shop({ theme, children }: { theme: ShopTheme; children: ReactNode }) {
  return (
    <div data-shop={theme} className="flex-1">
      {children}
    </div>
  );
}
