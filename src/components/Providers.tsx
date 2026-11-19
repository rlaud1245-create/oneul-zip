"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** 사용자가 OS에서 '동작 줄이기'를 켜면 애니메이션을 최소화합니다. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
