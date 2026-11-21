"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link2, MessageCircle, Share2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { KAKAO_KEY, loadKakao, shareToKakao } from "@/lib/kakao";
import { canNativeShare, copyText } from "@/lib/share";

interface Props {
  title: string;
  text: string;
  /** 사이트 내부 경로. 예: "/food?id=donkatsu" */
  path: string;
  /** 카카오톡 미리보기 이미지(사이트 내부 경로). 없으면 가게 대표 이미지 */
  image?: string;
  className?: string;
  /** 버튼 모양. 기본은 보조 버튼 */
  variant?: "ghost" | "primary";
  label?: string;
}

const SHOP_IMAGES = ["food", "activity", "balance", "fortune", "festival"];

function defaultImage(path: string) {
  const segment = path.split(/[/?#]/)[1] ?? "";
  return SHOP_IMAGES.includes(segment) ? `/${segment}/opengraph-image.png` : "/opengraph-image.png";
}

/**
 * 공유 버튼
 * - 휴대폰 공유창이 되는 브라우저(크롬, 사파리, 삼성 인터넷 등): 공유창을 바로 엽니다.
 * - 안 되는 곳(카카오톡·인스타 안 브라우저, 일부 PC): 아래에서 선택 창을 띄워 카카오톡 보내기 / 링크 복사를 고르게 합니다.
 */
export function ShareButton({ title, text, path, image, className, variant = "ghost", label = "공유하기" }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // 선택 창: 열리면 첫 버튼에 포커스, Esc로 닫기, 카카오 SDK 미리 불러오기
  useEffect(() => {
    if (!sheetOpen) return;
    void loadKakao();
    sheetRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const url = () => `${window.location.origin}${path}`;

  function toast(next: string) {
    setMessage(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }

  function closeSheet() {
    setSheetOpen(false);
    triggerRef.current?.focus();
  }

  async function handleClick() {
    if (canNativeShare()) {
      try {
        await navigator.share({ title, text, url: url() });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        // 그 외 오류는 선택 창으로
      }
    }
    setSheetOpen(true);
  }

  async function handleKakao() {
    const ok = await shareToKakao({
      title,
      text,
      url: url(),
      imageUrl: `${window.location.origin}${image ?? defaultImage(path)}`,
    });
    if (ok) setSheetOpen(false);
    else toast("카카오톡을 열 수 없어요. 링크 복사로 보내주세요.");
  }

  async function handleCopy() {
    const ok = await copyText(`${text}\n${url()}`);
    setSheetOpen(false);
    toast(ok ? "링크를 복사했어요. 원하는 곳에 붙여넣어 보내세요." : "복사에 실패했어요. 주소창 링크를 복사해 주세요.");
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleClick}
        className={cn(variant === "primary" ? "btn-primary" : "btn-ghost", className)}
      >
        <Share2 className="size-4" aria-hidden />
        {label}
      </button>

      {/* 결과 카드가 기울어져(transform) 있어도 화면 기준으로 뜨도록 body에 붙입니다 */}
      {sheetOpen &&
        createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-transparent bg-none" data-shop="town">
          <button
            type="button"
            aria-label="닫기"
            onClick={closeSheet}
            className="absolute inset-0 cursor-default bg-ink/45 [background-image:none]"
          />
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-sheet-title"
            className="relative w-full max-w-md rounded-t-[18px] border-[3px] border-b-0 border-ink bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 [background-image:none]"
          >
            <div className="flex items-center justify-between">
              <h2 id="share-sheet-title" className="font-sign text-[22px] font-normal">
                친구한테 보내기
              </h2>
              <button type="button" onClick={closeSheet} aria-label="닫기" className="-mr-2 grid size-10 place-items-center">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <p className="mt-1 truncate text-[14px] text-muted">{text.split("\n")[0]}</p>
            <div className="mt-4 grid gap-2.5">
              {KAKAO_KEY && (
                <button
                  type="button"
                  onClick={handleKakao}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border-[3px] border-ink bg-[#FEE500] font-label text-[18px] text-[#191600]"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  카카오톡으로 보내기
                </button>
              )}
              <button type="button" onClick={handleCopy} className="btn-ghost min-h-13 text-[16px]">
                <Link2 className="size-5" aria-hidden />
                링크 복사하기
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}

      <p
        role="status"
        aria-live="polite"
        className={
          message
            ? "fixed inset-x-0 bottom-6 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-ink px-4 py-2.5 text-center text-sm text-white shadow-soft"
            : "sr-only"
        }
      >
        {message ?? ""}
      </p>
    </>
  );
}
