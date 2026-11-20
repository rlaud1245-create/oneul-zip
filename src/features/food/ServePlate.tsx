"use client";

import { motion, useReducedMotion } from "motion/react";

interface Props {
  emoji: string;
  name: string;
  /** 메뉴 그림(그릇까지 그려진 투명 배경 그림). 없으면 이모지 + 기본 접시 */
  image?: string;
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

      <div className={`relative mx-auto ${image ? "w-fit max-w-[220px]" : "w-[188px]"}`}>
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
              src={image}
              alt=""
              width={480}
              height={400}
              decoding="async"
              className="block h-auto max-h-[180px] w-auto max-w-full drop-shadow-[2px_4px_0_rgb(43_29_20/0.25)]"
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
            className={`absolute left-[40px] z-0 w-[300px] max-w-none ${image ? "top-[calc(100%-70px)]" : "top-[calc(100%-34px)]"}`}
            initial={{ x: 340 }}
            animate={{ x: [340, 0, 0, 420] }}
            transition={{ duration: total, times: [0, land, land + 0.15, 1], ease: ["easeOut", "linear", "easeIn"] }}
          />
        )}
      </div>
    </div>
  );
}
