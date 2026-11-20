import type { Metadata } from "next";
import { FOOD_COLLECTIONS, groupCollections } from "@/lib/collections";
import { AdSlot } from "@/components/AdSlot";
import { CollectionNav } from "@/components/CollectionView";
import { InfoSection } from "@/components/InfoSection";
import { ShopCrossLinks } from "@/components/ShopCrossLinks";
import { Shop, ShopSign } from "@/components/ShopSign";
import { formatKoreanDate, kstDateKey } from "@/lib/kst";
import { foods, findFood } from "@/data/foods";
import { FoodPicker } from "@/features/food/FoodPicker";

type Props = { searchParams: Promise<{ id?: string | string[] }> };

const TITLE = "오늘 뭐 먹지? 점심·저녁 메뉴 랜덤 추천";
const DESCRIPTION =
  "한식, 양식, 일식, 중식, 분식까지. 누구와 먹는지와 가격대만 고르면 오늘 먹을 메뉴를 바로 추천해 드려요. 회원가입 없이 무료.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams;
  const food = typeof id === "string" ? findFood(id) : undefined;
  const ogTitle = food ? `오늘 메뉴는 ${food.name} ${food.emoji} 어때요?` : TITLE;
  const ogDescription = food ? food.reason : DESCRIPTION;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/food" },
    openGraph: { images: ["/opengraph-image.png"], title: ogTitle, description: ogDescription, url: food ? `/food?id=${food.id}` : "/food" },
    twitter: { card: "summary_large_image", images: ["/twitter-image.png"], title: ogTitle, description: ogDescription },
  };
}

export default async function FoodPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const initialId = typeof id === "string" ? findFood(id)?.id : undefined;

  return (
    <Shop theme="bunsik">
      <ShopSign
        width="max-w-2xl"
        shop="오늘.zip 분식"
        note={formatKoreanDate(kstDateKey())}
        title="오늘 뭐 먹지"
        description="메뉴판에서 직접 골라도 되고, 주방장 맘대로 눌러도 돼요. 마음에 안 들면 다시 시키세요."
      />
    <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-6 sm:pt-8">
      <FoodPicker initialId={initialId} />
      <ShopCrossLinks current="bunsik" />
      <AdSlot id="food-bottom" className="mt-10" />

      <InfoSection title="이렇게 추천해요">
        <p>
          오늘.zip은 {foods.length}가지 메뉴 중에서 고른 조건에 맞는 메뉴만 골라 무작위로 추천해요. 최근에 추천한 메뉴는
          되도록 다시 나오지 않게 해서 매번 새로운 선택지를 볼 수 있어요.
        </p>
        <p>
          점심 메뉴가 고민될 땐 &lsquo;혼밥&rsquo;과 &lsquo;1만 원 이하&rsquo;를, 데이트 저녁 메뉴가 고민될 땐
          &lsquo;연인과 식사&rsquo;를 골라보세요. 조건에 맞는 메뉴가 없으면 어떤 조건을 빼면 되는지 알려드려요.
        </p>
        <p>가격대는 1인 기준 대략적인 범위이고, 실제 가격은 가게마다 다를 수 있어요.</p>
      </InfoSection>

      <CollectionNav
        title="상황별 메뉴 모아보기"
        groups={groupCollections(FOOD_COLLECTIONS).map(({ group, items }) => ({
          group,
          links: items.map((c) => ({ href: `/food/${c.slug}`, label: c.label })),
        }))}
      />
    </div>
    </Shop>
  );
}
