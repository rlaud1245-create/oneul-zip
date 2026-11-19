import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { activities } from "@/data/activities";
import { balanceQuestions } from "@/data/balance";
import { foods } from "@/data/foods";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: `${SITE.name}은 오늘 뭐 먹을지, 뭐 할지 고민될 때 몇 번의 클릭으로 결정을 도와주는 서비스예요.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16">
      <PageIntro eyebrow="서비스 소개" title="오늘의 고민을 압축하다, 오늘.zip" />

      <div className="space-y-8 text-[15px] leading-relaxed">
        <p className="text-muted">
          점심 메뉴 하나 고르는 데 10분, 주말에 뭐 할지 정하는 데 1시간. 작은 고민이 쌓이면 하루가 피곤해져요. 오늘.zip은
          이런 일상의 작은 결정을 몇 번의 클릭으로 끝낼 수 있게 도와드려요.
        </p>

        <section>
          <h2 className="text-lg font-bold text-ink">할 수 있는 것</h2>
          <ul className="mt-3 space-y-3">
            <li className="card p-4">
              <Link href="/food" className="font-semibold text-primary-deep hover:underline">
                오늘 뭐 먹지?
              </Link>
              <p className="mt-1 text-muted">
                {foods.length}가지 메뉴 중 음식 종류, 함께 먹는 사람, 가격대에 맞는 메뉴를 추천해요.
              </p>
            </li>
            <li className="card p-4">
              <Link href="/activity" className="font-semibold text-primary-deep hover:underline">
                오늘 뭐 하지?
              </Link>
              <p className="mt-1 text-muted">
                {activities.length}가지 활동 중 지금 기분과 시간, 예산에 맞는 할 일을 추천해요.
              </p>
            </li>
            <li className="card p-4">
              <Link href="/balance" className="font-semibold text-primary-deep hover:underline">
                오늘의 선택
              </Link>
              <p className="mt-1 text-muted">
                {balanceQuestions.length}개가 넘는 밸런스 게임 질문이 매일 하나씩 바뀌어요.
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">이렇게 만들었어요</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
            <li>회원가입 없이 모든 기능을 쓸 수 있어요.</li>
            <li>저장한 결과와 내 선택은 이 기기의 브라우저에만 보관돼요.</li>
            <li>추천은 정해진 규칙에 따라 이뤄지고, 광고나 협찬 콘텐츠가 생기면 반드시 &lsquo;광고&rsquo;로 표시해요.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
