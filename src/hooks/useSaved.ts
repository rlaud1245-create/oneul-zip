"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";
import type { SavedItem, SavedType } from "@/types";

const NO_SAVED: SavedItem[] = [];
const MAX_SAVED = 100;

const same = (item: SavedItem, type: SavedType, id: string) => item.type === type && item.id === id;

export function useSaved() {
  const [items, setItems] = useLocalStorage<SavedItem[]>(STORAGE_KEYS.saved, NO_SAVED);

  const isSaved = (type: SavedType, id: string) => items.some((item) => same(item, type, id));

  const toggle = (type: SavedType, id: string) =>
    setItems((prev) =>
      prev.some((item) => same(item, type, id))
        ? prev.filter((item) => !same(item, type, id))
        : [{ type, id, savedAt: Date.now() }, ...prev].slice(0, MAX_SAVED),
    );

  const remove = (type: SavedType, id: string) =>
    setItems((prev) => prev.filter((item) => !same(item, type, id)));

  return { items, isSaved, toggle, remove };
}
