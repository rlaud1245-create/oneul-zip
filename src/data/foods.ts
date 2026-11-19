import type { Companion, Food, FoodCategory, PriceRange } from "@/types";

/**
 * 메뉴 데이터
 * situations 코드: S=혼밥, F=친구와, D=연인과, M=가족
 * price: low=1만 원 이하, mid=1만~2만 원, high=2만 원 이상 (1인 기준 대략적인 가격대)
 */
const SITUATION_CODE: Record<string, Companion> = { S: "solo", F: "friends", D: "date", M: "family" };

type Row = [id: string, name: string, emoji: string, category: FoodCategory, price: PriceRange, situations: string, reason: string];

const rows: Row[] = [
  // 한식
  ["kimchi-jjigae", "김치찌개", "🍲", "korean", "low", "SFM", "칼칼한 국물에 밥 한 공기면 충분할 때!"],
  ["doenjang-jjigae", "된장찌개", "🍲", "korean", "low", "SM", "속 편한 집밥이 그리운 날엔 구수하게."],
  ["bibimbap", "비빔밥", "🥗", "korean", "low", "SFM", "이것저것 다 먹고 싶은데 한 그릇으로 끝내고 싶을 때."],
  ["bulgogi", "불고기", "🥩", "korean", "mid", "FDM", "달큰한 양념 고기가 당기는 날."],
  ["samgyeopsal", "삼겹살", "🥓", "korean", "mid", "FM", "고민될 땐 역시 고기. 지글지글 구워 먹자!"],
  ["gukbap", "국밥", "🍲", "korean", "low", "SF", "빠르고 든든한 한 끼가 필요할 때."],
  ["naengmyeon", "냉면", "🍜", "korean", "low", "SFDM", "시원하고 깔끔하게 입맛을 살리고 싶을 때."],
  ["jjimdak", "찜닭", "🍗", "korean", "mid", "FDM", "달짝지근 짭조름한 양념에 당면까지."],
  ["dakgalbi", "닭갈비", "🍗", "korean", "mid", "FD", "철판에 볶아 먹고 마지막엔 볶음밥까지."],
  ["galbitang", "갈비탕", "🍖", "korean", "mid", "SM", "뜨끈한 국물로 기운 차리고 싶을 때."],
  ["bossam", "보쌈", "🥬", "korean", "high", "FM", "여럿이 둘러앉아 푸짐하게 나눠 먹기 좋아요."],
  ["jokbal", "족발", "🐖", "korean", "high", "FM", "쫀득한 식감이 생각나는 저녁."],
  ["sundubu", "순두부찌개", "🍲", "korean", "low", "SFM", "부드럽고 얼큰한 국물이 필요할 때."],
  ["jeyuk", "제육볶음", "🍚", "korean", "low", "SF", "매콤한 고기반찬에 밥이 술술 들어가요."],
  ["kalguksu", "칼국수", "🍜", "korean", "low", "SFM", "쫄깃한 면과 따뜻한 국물로 속을 달래요."],
  ["sundaeguk", "순대국", "🍲", "korean", "low", "SF", "든든함이 최우선인 날."],
  ["hanjeongsik", "한정식", "🍱", "korean", "high", "DM", "제대로 대접받는 기분을 내고 싶을 때."],
  ["gamjatang", "감자탕", "🍲", "korean", "mid", "FM", "뼈 발라 먹는 재미에 마무리 볶음밥까지."],
  ["chicken", "치킨", "🍗", "korean", "mid", "FM", "고민될 땐 치킨이 정답일 때가 많아요."],

  // 양식
  ["pasta", "파스타", "🍝", "western", "mid", "SFD", "분위기 내고 싶은 날엔 크림이든 토마토든."],
  ["pizza", "피자", "🍕", "western", "mid", "FM", "여럿이 한 조각씩 나눠 먹기엔 역시."],
  ["burger", "수제버거", "🍔", "western", "mid", "SFD", "육즙 가득한 한 입이 필요할 때."],
  ["steak", "스테이크", "🥩", "western", "high", "DM", "특별한 날엔 제대로 썰어보자."],
  ["risotto", "리조또", "🍚", "western", "mid", "SD", "크리미하고 부드러운 한 그릇."],
  ["salad", "샐러드", "🥗", "western", "low", "SF", "가볍고 산뜻하게 먹고 싶을 때."],
  ["sandwich", "샌드위치", "🥪", "western", "low", "S", "빠르고 간단하게 해결하고 싶을 때."],
  ["brunch", "브런치", "🍳", "western", "mid", "FD", "느긋하고 여유로운 한 끼."],
  ["tacos", "타코", "🌮", "western", "mid", "FD", "색다른 맛으로 기분 전환!"],
  ["omurice", "오므라이스", "🍳", "western", "low", "SD", "폭신한 달걀이 생각나는 날."],

  // 일식
  ["donkatsu", "돈가스", "🍛", "japanese", "low", "SF", "바삭하고 든든한 한 끼가 필요할 때!"],
  ["sushi", "초밥", "🍣", "japanese", "mid", "SFD", "깔끔하고 정갈하게 먹고 싶을 때."],
  ["ramen", "라멘", "🍜", "japanese", "low", "SF", "진한 국물 한 숟갈이 생각날 때."],
  ["udon", "우동", "🍜", "japanese", "low", "SFM", "부담 없이 따뜻하게 후루룩."],
  ["katsudon", "가츠동", "🍚", "japanese", "low", "S", "달달 짭짤한 덮밥 한 그릇."],
  ["omakase", "스시 오마카세", "🍣", "japanese", "high", "D", "기억에 남는 특별한 저녁을 원할 때."],
  ["soba", "메밀소바", "🍜", "japanese", "low", "SD", "시원하고 담백하게 먹고 싶을 때."],
  ["gyudon", "규동", "🍚", "japanese", "low", "S", "빠르게, 그리고 든든하게."],
  ["okonomiyaki", "오코노미야키", "🥞", "japanese", "mid", "FD", "철판 앞에서 같이 구워 먹는 재미."],
  ["shabu", "샤브샤브", "🍲", "japanese", "mid", "FDM", "채소 듬뿍, 건강하게 배부르고 싶을 때."],
  ["tendon", "텐동", "🍤", "japanese", "low", "SF", "바삭한 튀김을 밥 위에 듬뿍."],

  // 중식
  ["jjajangmyeon", "짜장면", "🍜", "chinese", "low", "SFM", "고민될 땐 국민 메뉴로."],
  ["jjamppong", "짬뽕", "🍜", "chinese", "low", "SF", "얼큰한 국물로 땀 한번 쫙 빼고 싶을 때."],
  ["tangsuyuk", "탕수육", "🍖", "chinese", "mid", "FM", "부먹이든 찍먹이든 함께 나눠 먹어요."],
  ["malatang", "마라탕", "🌶️", "chinese", "low", "SF", "얼얼하게 스트레스 날리고 싶을 때."],
  ["malaxiangguo", "마라샹궈", "🌶️", "chinese", "mid", "FD", "좋아하는 재료만 골라 매콤하게 볶아요."],
  ["dimsum", "딤섬", "🥟", "chinese", "mid", "FD", "한 입씩 골라 먹는 재미가 있어요."],
  ["fried-rice", "볶음밥", "🍚", "chinese", "low", "S", "불맛 가득한 한 그릇."],
  ["hotpot", "훠궈", "🍲", "chinese", "high", "FDM", "둘러앉아 오래오래 먹고 싶을 때."],
  ["lamb-skewer", "양꼬치", "🍢", "chinese", "mid", "F", "시끌벅적하게 즐기고 싶은 저녁."],
  ["kkanpunggi", "깐풍기", "🍗", "chinese", "mid", "FM", "달콤하고 매콤하고 바삭하게."],

  // 분식
  ["tteokbokki", "떡볶이", "🌶️", "snack", "low", "SF", "매콤달콤하게 기분 전환이 필요할 때."],
  ["gimbap", "김밥", "🍙", "snack", "low", "S", "간단하지만 든든하게."],
  ["ramyeon", "라면", "🍜", "snack", "low", "S", "가끔은 이게 제일 맛있어요."],
  ["sundae", "순대", "🍢", "snack", "low", "SF", "떡볶이 옆에 빠질 수 없는 짝꿍."],
  ["twigim", "모둠튀김", "🍤", "snack", "low", "SF", "바삭한 게 당길 때."],
  ["rabokki", "라볶이", "🍜", "snack", "low", "SF", "떡볶이와 라면을 한 번에!"],
  ["jjolmyeon", "쫄면", "🍜", "snack", "low", "S", "새콤매콤하게 입맛 살리기."],
  ["cupbap", "컵밥", "🍚", "snack", "low", "S", "가볍고 빠르게 한 끼 해결."],
  ["eomuk", "어묵탕", "🍢", "snack", "low", "SF", "따끈한 국물에 몸 녹이고 싶을 때."],

  // 아시아 음식
  ["pho", "쌀국수", "🍜", "asian", "low", "SF", "깔끔한 국물로 속을 달래고 싶을 때."],
  ["padthai", "팟타이", "🍝", "asian", "mid", "SFD", "새콤달콤 이국적인 맛."],
  ["curry", "인도 커리", "🍛", "asian", "mid", "FD", "향신료 가득한 진한 맛이 당길 때."],
  ["banhmi", "반미", "🥖", "asian", "low", "S", "가볍지만 맛있게."],
  ["nasi-goreng", "나시고렝", "🍚", "asian", "mid", "FD", "여행 온 기분을 내고 싶을 때."],
  ["tomyum", "똠얌꿍", "🍲", "asian", "mid", "FD", "새콤하고 얼큰한 이색 국물."],
  ["spring-roll", "월남쌈", "🥬", "asian", "mid", "DM", "가볍고 건강하게, 싸 먹는 재미까지."],
  ["kapao", "팟카파오무쌉", "🍚", "asian", "low", "S", "매콤한 바질 볶음밥 한 그릇."],
];

export const foods: Food[] = rows.map(([id, name, emoji, category, price, situations, reason]) => ({
  id,
  name,
  emoji,
  category,
  price,
  situations: situations.split("").map((code) => SITUATION_CODE[code]),
  reason,
}));

export function findFood(id: string): Food | undefined {
  return foods.find((food) => food.id === id);
}
