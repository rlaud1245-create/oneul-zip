import Link from "next/link";
import { ChevronRight, Shuffle } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { PageIntro } from "@/components/PageIntro";
import { cn } from "@/lib/cn";

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
export function CollectionView({ eyebrow, title, intro, tip, items, pickerHref, pickerLabel, adId, groups }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16">
      <PageIntro eyebrow={eyebrow} title={title} description={`${intro} 총 ${items.length}가지예요.`} />

      <Link href={pickerHref} className="btn-primary w-full sm:w-auto">
        <Shuffle className="size-4" aria-hidden />
        {pickerLabel}
      </Link>

      <ol className="mt-6 space-y-3">
        {items.map((item, index) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="card group flex items-start gap-4 p-4 transition hover:border-primary/40 sm:p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-light text-2xl" aria-hidden>
                {item.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-muted">{index + 1}</span>
                  <span className="text-[17px] font-bold">{item.name}</span>
                </span>
                <span className="mt-1 block text-[15px] leading-relaxed text-muted">{item.reason}</span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-muted ring-1 ring-line">
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
              <ChevronRight
                className="mt-3 size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
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
  );
}

/** 다른 모아보기로 이동하는 링크 묶음 */
export function CollectionNav({ groups, title = "다른 모아보기" }: { groups: Props["groups"]; title?: string }) {
  return (
    <nav aria-label={title} className="mt-12">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-4 space-y-4">
        {groups.map(({ group, links }) => (
          <div key={group}>
            <p className="text-sm font-semibold text-muted">{group}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={link.active ? "page" : undefined}
                    className={cn("chip", link.active && "border-primary-strong bg-primary-strong text-white")}
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
