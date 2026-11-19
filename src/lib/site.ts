export const SITE = {
  name: "오늘.zip",
  slogan: "오늘의 고민을 압축하다",
  description:
    "오늘 뭐 먹지, 오늘 뭐 하지 고민될 때. 점심·저녁 메뉴 추천, 심심할 때 할 일 추천, 매일 바뀌는 밸런스 게임까지 몇 번의 클릭으로 해결하세요.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;
