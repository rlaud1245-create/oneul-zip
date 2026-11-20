"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { pick, type Condition, type RelaxHint } from "@/lib/recommend";

export type RecommendStatus = "idle" | "result" | "empty";

type Filters = Record<string, string | null>;

const NO_RECENT: string[] = [];
const RECENT_LIMIT = 5;

interface Options<T, F extends Filters> {
  items: readonly T[];
  emptyFilters: F;
  /** 결과가 없을 때 앞쪽 조건부터 완화를 제안합니다 */
  buildConditions: (filters: F) => Condition<T>[];
  recentKey: string;
  /** 결과 공유용 URL 경로. 예: "/food" → "/food?id=..." */
  path: string;
  /** 공유 링크로 들어왔을 때 처음 보여줄 결과 */
  initialItem?: T | null;
}

/** 오늘 뭐 먹지 / 오늘 뭐 하지 공용 추천 상태 관리 */
export function useRecommender<T extends { id: string }, F extends Filters>({
  items,
  emptyFilters,
  buildConditions,
  recentKey,
  path,
  initialItem = null,
}: Options<T, F>) {
  const [filters, setFilters] = useState<F>(emptyFilters);
  const [result, setResult] = useState<T | null>(initialItem);
  const [status, setStatus] = useState<RecommendStatus>(initialItem ? "result" : "idle");
  const [fromShare, setFromShare] = useState(Boolean(initialItem));
  const [relax, setRelax] = useState<RelaxHint | null>(null);
  const [round, setRound] = useState(0);
  const [recent, setRecent] = useLocalStorage<string[]>(recentKey, NO_RECENT);

  const recommend = (next: F = filters) => {
    const { item, relax: hint } = pick(items, buildConditions(next), recent);
    setFromShare(false);

    if (!item) {
      setResult(null);
      setStatus("empty");
      setRelax(hint);
      return;
    }

    apply(item);
  };

  const apply = (item: T) => {
    setResult(item);
    setStatus("result");
    setRelax(null);
    setRound((r) => r + 1);
    setRecent((prev) => [item.id, ...prev.filter((id) => id !== item.id)].slice(0, RECENT_LIMIT));
    // 현재 결과를 URL에 반영 → 새로고침·공유 시 같은 결과
    window.history.replaceState(null, "", `${path}?id=${encodeURIComponent(item.id)}`);
  };

  /** 목록에서 직접 고른 항목을 결과로 보여주기 */
  const show = (item: T) => {
    setFromShare(false);
    apply(item);
  };

  const setFilter = <K extends keyof F>(key: K, value: F[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setRelax(null);
  };

  /** 안내된 조건 하나를 빼고 다시 추천 */
  const relaxAndRetry = () => {
    if (!relax) return;
    const next = { ...filters, [relax.key]: null } as F;
    setFilters(next);
    recommend(next);
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setRelax(null);
    if (status === "empty") setStatus("idle");
  };

  const hasFilters = Object.values(filters).some((value) => value !== null);

  return { filters, setFilter, resetFilters, hasFilters, result, status, fromShare, relax, round, recommend, relaxAndRetry, show };
}
