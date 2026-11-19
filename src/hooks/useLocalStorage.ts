"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { STORAGE_EVENT, parseJSON, readRaw, writeJSON } from "@/lib/storage";

function subscribe(callback: () => void) {
  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener("storage", callback); // 다른 탭에서 바뀐 경우
  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * localStorage 값을 React 상태처럼 사용합니다.
 * 서버 렌더링과 첫 hydration 때는 fallback을 쓰므로 hydration 불일치가 생기지 않습니다.
 * fallback은 컴포넌트 밖에 정의한 상수를 넘겨주세요.
 */
export function useLocalStorage<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo(() => parseJSON(raw, fallback), [raw, fallback]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = parseJSON(readRaw(key), fallback);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeJSON(key, resolved);
    },
    [key, fallback],
  );

  return [value, setValue] as const;
}

const noopSubscribe = () => () => {};

/** 클라이언트에서 hydration이 끝났는지 여부 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
