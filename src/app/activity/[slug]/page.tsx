import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { ACTIVITY_COLLECTIONS, activitiesIn, findActivityCollection, groupCollections } from "@/lib/collections";

type Props = { params: Promise<{ slug: string }> };

/** 목록에 없는 주소는 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ACTIVITY_COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = findActivityCollection(slug);
  if (!collection) return {};
  const path = `/activity/${collection.slug}`;

  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: path },
    openGraph: {
      images: ["/activity/opengraph-image.png"],
      title: collection.title,
      description: collection.description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      images: ["/activity/twitter-image.png"],
      title: collection.title,
      description: collection.description,
    },
  };
}

export default async function ActivityCollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = findActivityCollection(slug);
  if (!collection) notFound();

  const items = activitiesIn(collection).map((activity) => ({
    id: activity.id,
    href: `/activity?id=${activity.id}`,
    emoji: activity.emoji,
    name: activity.name,
    reason: `${activity.description}. ${activity.reason}`,
    tags: [activity.timeLabel, activity.costLabel],
  }));

  const groups = groupCollections(ACTIVITY_COLLECTIONS).map(({ group, items: list }) => ({
    group,
    links: list.map((c) => ({ href: `/activity/${c.slug}`, label: c.label, active: c.slug === collection.slug })),
  }));

  return (
    <CollectionView
      theme="land"
      eyebrow={`오늘 뭐 하지? · ${collection.label}`}
      title={collection.title}
      intro={collection.intro}
      tip={collection.tip}
      items={items}
      pickerHref="/activity"
      pickerLabel="이 중에 못 고르겠다면 랜덤 추천"
      adId={`activity-${collection.slug}`}
      groups={groups}
    />
  );
}
