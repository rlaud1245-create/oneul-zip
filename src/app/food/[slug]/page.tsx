import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { FOOD_COLLECTIONS, findFoodCollection, foodsIn, groupCollections } from "@/lib/collections";
import { FOOD_CATEGORY_LABEL, PRICE_LABEL } from "@/lib/labels";

type Props = { params: Promise<{ slug: string }> };

/** 목록에 없는 주소는 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return FOOD_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = findFoodCollection(slug);
  if (!collection) return {};
  const path = `/food/${collection.slug}`;

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: path },
    openGraph: {
      images: ["/food/opengraph-image.png"],
      title: collection.title,
      description: collection.description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      images: ["/food/twitter-image.png"],
      title: collection.title,
      description: collection.description,
    },
  };
}

export default async function FoodCollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = findFoodCollection(slug);
  if (!collection) notFound();

  const items = foodsIn(collection).map((food) => ({
    id: food.id,
    href: `/food?id=${food.id}`,
    emoji: food.emoji,
    name: food.name,
    reason: food.reason,
    tags: [FOOD_CATEGORY_LABEL[food.category], PRICE_LABEL[food.price]],
  }));

  const groups = groupCollections(FOOD_COLLECTIONS).map(({ group, items: list }) => ({
    group,
    links: list.map((c) => ({ href: `/food/${c.slug}`, label: c.label, active: c.slug === collection.slug })),
  }));

  return (
    <CollectionView
      theme="bunsik"
      eyebrow={`오늘 뭐 먹지? · ${collection.label}`}
      title={collection.title}
      intro={collection.intro}
      tip={collection.tip}
      items={items}
      pickerHref="/food"
      pickerLabel="이 중에 못 고르겠다면 랜덤 추천"
      adId={`food-${collection.slug}`}
      groups={groups}
    />
  );
}
