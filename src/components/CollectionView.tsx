import Link from "next/link";
import { ChevronRight, Shuffle } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { Shop, ShopSign } from "@/components/ShopSign";
import { cn } from "@/lib/cn";
import { shopInfo, type ShopTheme } from "@/lib/shops";

export interface CollectionItem {
  id: string;
  href: string;
  emoji: string;
  name: string;
  reason: string;
  tags: string[];
}

export interface CollectionLink {
  href: string;
  label: string;
  active?: boolean;
}

interface Props {
  theme: ShopTheme;
  eyebrow: string;
  title: string;
  intro: string;
  tip: string;
  items: CollectionItem[];
  /** 랜덤 추천 페이지 (/food, /activity) */
  pickerHref: string;
  pickerLabel: string;
  adId: string;
  groups: { group: string; links: CollectionLink[] }[];
}

/** 모아보기 페이지 공통 화면 (서버 컴포넌트) */
export function CollectionView({ theme, eyebrow, title, intro, tip, items, pickerHref, pickerLabel, adId, groups }: Props) {
  return (
    <Shop theme={theme}>
      <ShopSign width="max-w-3xl" shop={shopInfo(theme)?.name ?? eyebrow} title={title} description={`${intro} 총 ${items.length}가지예요.`} />
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 sm:pt-8">

      <Link href={pickerHref} className="btn-primary w-full sm:w-auto">
        <Shuffle className="size-4" aria-hidden />
        {pickerLabel}
      </Link>

      <ol className="card mt-6 divide-y-2 divide-dashed divide-ink/30 px-4 py-1 sm:px-6">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={item.href} className="group flex items-start gap-3 py-4">
              <span className="mt-0.5 text-2xl leading-none" aria-hidden>
                {item.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline">
                  <span className="font-sign text-[19px] font-normal group-hover:text-primary-deep">{item.name}</span>
                  <span className="menu-leader" aria-hidden />
                  <span className="shrink-0 font-label text-[16px]">{item.tags[item.tags.length - 1]}</span>
                </span>
                <span className="mt-1 block text-[15px] leading-relaxed text-muted">{item.reason}</span>
                {item.tags.length > 1 && (
                  <span className="mt-1.5 inline-block rounded-full border-2 border-ink bg-primary-light px-2.5 py-0.5 font-label text-[14px]">
                    {item.tags.slice(0, -1).join(", ")}
                  </span>
                )}
              </span>
              <ChevronRight className="mt-1 size-5 shrink-0 text-muted group-hover:text-ink" aria-hidden />
            </Link>
          </li>
        ))}
      </ol>

      <AdSlot id={adId} className="mt-10" />

      <InfoSection title="고르기 어렵다면">
        <p>{tip}</p>
        <p>
          그래도 못 고르겠다면{" "}
          <Link href={pickerHref} className="font-semibold text-primary-deep underline-offset-2 hover:underline">
            랜덤 추천
          </Link>
          으로 한 번에 정해보세요.
        </p>
      </InfoSection>

      <CollectionNav groups={groups} />
    </div>
    </Shop>
  );
}

/** 다른 모아보기로 이동하는 링크 묶음 */
export function CollectionNav({ groups, title = "다른 모아보기" }: { groups: Props["groups"]; title?: string }) {
  return (
    <nav aria-label={title} className="mt-12">
      <h2 className="font-sign text-xl font-normal">{title}</h2>
      <div className="mt-4 space-y-4">
        {groups.map(({ group, links }) => (
          <div key={group}>
            <p className="font-label text-[16px] text-muted">{group}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={link.active ? "page" : undefined}
                    className={cn("chip", link.active && "bg-primary-strong text-on-strong")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
