import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { InfoSection } from "@/components/InfoSection";
import { PageIntro } from "@/components/PageIntro";
import { activities, findActivity } from "@/data/activities";
import { ActivityPicker } from "@/features/activity/ActivityPicker";

type Props = { searchParams: Promise<{ id?: string | string[] }> };

const TITLE = "오늘 뭐 하지? 심심할 때 할 것 추천";
const DESCRIPTION =
  "혼자 놀기부터 주말에 할 일까지. 누구와, 어떤 기분인지, 시간과 예산만 고르면 지금 하기 좋은 활동을 추천해 드려요.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams;
  const activity = typeof id === "string" ? findActivity(id) : undefined;
  const ogTitle = activity ? `오늘은 ${activity.name} ${activity.emoji} 어때요?` : TITLE;
  const ogDescription = activity ? activity.reason : DESCRIPTION;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/activity" },
    openGraph: {
      images: ["/opengraph-image.png"],
      title: ogTitle,
      description: ogDescription,
      url: activity ? `/activity?id=${activity.id}` : "/activity",
    },
    twitter: { card: "summary_large_image", images: ["/twitter-image.png"], title: ogTitle, description: ogDescription },
  };
}

export default async function ActivityPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const initialId = typeof id === "string" ? findActivity(id)?.id : undefined;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16">
      <PageIntro
        eyebrow="오늘 뭐 하지?"
        title="남는 시간, 뭐 할지 정해 드릴게요"
        description="지금 상황을 고르면 딱 맞는 할 일을 찾아드려요. 고르지 않고 바로 눌러도 괜찮아요."
      />
      <ActivityPicker initialId={initialId} />
      <AdSlot id="activity-bottom" className="mt-10" />

      <InfoSection title="이렇게 추천해요">
        <p>
          산책이나 독서처럼 혼자 하기 좋은 일부터 방탈출, 근교 여행처럼 함께하면 더 즐거운 일까지 {activities.length}가지
          활동 중에서 조건에 맞는 것을 골라 추천해요.
        </p>
        <p>
          쓸 수 있는 시간을 고르면 그 시간 안에 끝낼 수 있는 활동을, 예산을 고르면 그 금액 안에서 할 수 있는 활동을
          보여드려요. 예상 시간과 비용은 대략적인 예시 추정치라 장소나 상황에 따라 달라질 수 있어요.
        </p>
      </InfoSection>
    </div>
  );
}
