/** 모바일에서 결과가 화면 아래쪽에 있으면 결과 위치까지 스크롤합니다. */
export function scrollToResult(element: HTMLElement | null) {
  if (!element) return;
  requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
}
