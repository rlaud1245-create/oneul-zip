/**
 * 동네 가게 목록
 * 새 "오늘의 ○○" 메뉴를 추가할 때:
 *   1) globals.css에 [data-shop="새이름"] 색 블록 추가
 *   2) 여기 SHOPS에 한 줄 추가
 *   3) 페이지를 <Shop theme="새이름"> + <ShopSign>으로 감싸기
 */
export type ShopTheme = "town" | "bunsik" | "land" | "stationery" | "fortune" | "festival";

export interface ShopInfo {
  theme: ShopTheme;
  /** 간판에 쓰는 가게 이름 */
  name: string;
  /** 상단 메뉴 이름 */
  menu: string;
  path: string;
}

export const SHOPS: ShopInfo[] = [
  { theme: "bunsik", name: "오늘.zip 분식", menu: "오늘 뭐 먹지", path: "/food" },
  { theme: "land", name: "오늘.zip 랜드", menu: "오늘 뭐 하지", path: "/activity" },
  { theme: "stationery", name: "오늘.zip 문방구", menu: "오늘의 선택", path: "/balance" },
  { theme: "fortune", name: "오늘.zip 철학관", menu: "오늘의 운세", path: "/fortune" },
  { theme: "festival", name: "오늘.zip 동네 게시판", menu: "오늘의 축제", path: "/festival" },
];

export function shopForPath(pathname: string): ShopTheme {
  const shop = SHOPS.find((s) => pathname === s.path || pathname.startsWith(`${s.path}/`));
  return shop ? shop.theme : "town";
}

export function shopInfo(theme: ShopTheme): ShopInfo | undefined {
  return SHOPS.find((s) => s.theme === theme);
}
