import { cn } from "@/lib/cn";

/**
 * 광고 영역 자리.
 * 실제 광고 코드를 연결하기 전까지는 아무것도 렌더링하지 않습니다.
 * 연결 후 NEXT_PUBLIC_ADS_ENABLED=true로 켜고, 아래 aside 안에 광고 스크립트/컴포넌트를 넣으세요.
 * 버튼 바로 옆 등 잘못 누르기 쉬운 위치에는 배치하지 마세요.
 */
export function AdSlot({ id, className }: { id: string; className?: string }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;

  return (
    <aside
      aria-label="광고"
      data-ad-slot={id}
      className={cn("rounded-card border border-dashed border-line p-4 text-center text-xs text-muted", className)}
    >
      광고
    </aside>
  );
}
