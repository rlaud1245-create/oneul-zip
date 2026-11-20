"use client";

import { motion, useReducedMotion } from "motion/react";
import type { FoodImage } from "@/data/foodImages";

interface Props {
  emoji: string;
  name: string;
  /** 메뉴 그림(그릇까지 그려진 투명 배경 그림). 없으면 이모지 + 기본 접시 */
  image?: FoodImage;
  /**
   * 주방장 손 연출
   * - "full": 손이 접시를 들고 들어와 내려놓고 빠짐 (처음 주방장 맘대로)
   * - "quick": 같은 동작을 짧게 (한 번 더 누를 때)
   * - "none": 손 없이 접시만 (메뉴판에서 직접 고르거나 공유 링크로 들어온 경우)
   */
  serve: "full" | "quick" | "none";
}

/** 연출 전체 길이(초) */
export function serveDuration(serve: Props["serve"]) {
  return serve === "full" ? 1.15 : serve === "quick" ? 0.7 : 0;
}

/**
 * 사장님 추천 위에 놓이는 접시
 * 오른쪽에서 주방장 손이 접시를 들고 들어와 탁 내려놓고 다시 빠집니다.
 */
export function ServePlate({ emoji, name, image, serve }: Props) {
  const reduce = useReducedMotion();
  const total = reduce ? 0 : serveDuration(serve);
  const animated = total > 0;
  // 손과 접시가 함께 들어오는 시간 비율
  const land = 0.45;

  // 그림 크기를 미리 계산해서 자리를 고정합니다. (그림이 늦게 떠도 손과 접시가 흔들리지 않게)
  const scale = image ? Math.min(220 / image.width, 180 / image.height, 1) : 1;
  const dishW = image ? Math.round(image.width * scale) : 188;
  const dishH = image ? Math.round(image.height * scale) : 56;

  return (
    <div
      className={`relative -mx-5 overflow-x-clip px-5 ${image ? "pt-6" : "pt-16"} ${animated ? "pb-[50px]" : "pb-[22px]"}`}
      aria-hidden
    >
      {/* 김 */}
      <motion.div
        className="absolute left-1/2 top-1 flex -translate-x-1/2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ delay: total * 0.7, duration: 2.2, repeat: 1, ease: "easeInOut" }}
      >
        {[0, 1, 2].map((i) => (
          <svg key={i} width="10" height="26" viewBox="0 0 10 26" className="text-ink/45">
            <path d="M5 25 C 0 19, 10 14, 5 8 C 1 4, 6 1, 5 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ))}
      </motion.div>

      <div className="relative mx-auto" style={{ width: dishW }}>
        {/* 접시 */}
        <motion.div
          className="relative z-10"
          initial={animated ? { x: 340 } : false}
          animate={animated ? { x: [340, 0], y: [0, -6, 0], rotate: [4, 0] } : undefined}
          transition={
            animated
              ? {
                  // 손과 같은 가속으로 움직여야 접시가 손에 붙어 들어오는 것처럼 보여요
                  x: { duration: total * land, ease: "easeOut" },
                  y: { delay: total * land, duration: 0.25, ease: "easeOut" },
                  rotate: { duration: total * land, ease: "easeOut" },
                }
              : undefined
          }
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              decoding="async"
              fetchPriority="high"
              className="block drop-shadow-[2px_4px_0_rgb(43_29_20/0.25)]"
              style={{ width: dishW, height: dishH }}
            />
          ) : (
            <>
              <svg viewBox="0 0 188 56" className="block w-full">
                <ellipse cx="94" cy="32" rx="90" ry="22" fill="#2B1D14" />
                <ellipse cx="94" cy="28" rx="90" ry="22" fill="#FFF8E6" stroke="#2B1D14" strokeWidth="3" />
                <ellipse cx="94" cy="27" rx="62" ry="13" fill="none" stroke="#C9B48E" strokeWidth="2.5" />
              </svg>
              <span className="absolute inset-x-0 -top-[52px] text-center text-[60px] leading-none drop-shadow-[2px_3px_0_rgb(43_29_20/0.2)]">
                {emoji}
              </span>
            </>
          )}
          {/* 이름표 */}
          <span className="absolute -bottom-1 left-0 -rotate-6 rounded-[3px] border-2 border-ink bg-sign px-2 font-label text-[14px] leading-6 text-ink">
            {name}
          </span>
        </motion.div>

        {/* 주방장 손 (일러스트). 접시를 아래에서 받쳐 들고 들어왔다가 빠짐 */}
        {animated && (
          <motion.img
            src="/foods/chef-hand.webp"
            alt=""
            width={640}
            height={247}
            decoding="async"
            className="absolute left-[40px] z-0 h-auto w-[300px] max-w-none"
            // 손바닥이 그릇 아랫부분을 받치도록 그릇 높이 기준으로 위치를 고정
            style={{ top: image ? dishH - 70 : dishH - 34 }}
            initial={{ x: 340 }}
            animate={{ x: [340, 0, 0, 420] }}
            transition={{ duration: total, times: [0, land, land + 0.15, 1], ease: ["easeOut", "linear", "easeIn"] }}
          />
        )}
      </div>
    </div>
  );
}
