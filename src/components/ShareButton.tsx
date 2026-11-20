"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { shareOrCopy } from "@/lib/share";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  text: string;
  /** 사이트 내부 경로. 예: "/food?id=donkatsu" */
  path: string;
  className?: string;
  /** 버튼 모양. 기본은 보조 버튼 */
  variant?: "ghost" | "primary";
  label?: string;
}

export function ShareButton({ title, text, path, className, variant = "ghost", label = "공유하기" }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function handleClick() {
    const result = await shareOrCopy({ title, text, url: `${window.location.origin}${path}` });
    const next =
      result === "copied" ? "링크를 복사했어요" : result === "failed" ? "공유에 실패했어요. 주소창 링크를 복사해 주세요." : null;
    if (!next) return;
    setMessage(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={cn(variant === "primary" ? "btn-primary" : "btn-ghost", className)}>
        <Share2 className="size-4" aria-hidden />
        {label}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={
          message
            ? "fixed inset-x-0 bottom-6 z-50 mx-auto w-fit rounded-full bg-ink px-4 py-2.5 text-sm text-white shadow-soft"
            : "sr-only"
        }
      >
        {message ?? ""}
      </p>
    </>
  );
}
