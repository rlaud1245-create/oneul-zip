import type { MetadataRoute } from "next";
import { ACTIVITY_COLLECTIONS, FOOD_COLLECTIONS } from "@/lib/collections";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/food", changeFrequency: "weekly", priority: 0.9 },
    { path: "/activity", changeFrequency: "weekly", priority: 0.9 },
    { path: "/balance", changeFrequency: "daily", priority: 0.9 },
    { path: "/fortune", changeFrequency: "daily", priority: 0.9 },
    { path: "/festival", changeFrequency: "daily", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.2 },
    ...FOOD_COLLECTIONS.map((c) => ({ path: `/food/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...ACTIVITY_COLLECTIONS.map((c) => ({ path: `/activity/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
