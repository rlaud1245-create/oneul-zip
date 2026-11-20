import { hashString } from "@/lib/random";

/**
 * 오늘의 운세 (재미로 보는 운세)
 * 날짜 + 띠로 문구를 고르기 때문에, 같은 날 같은 띠면 누구에게나 같은 부적이 나옵니다.
 * 문구를 늘리고 싶으면 아래 배열에 한 줄씩 추가하면 됩니다.
 */

export const ZODIAC = ["쥐", "소", "범", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const;
export type Zodiac = (typeof ZODIAC)[number];

export function isZodiac(value: unknown): value is Zodiac {
  return typeof value === "string" && (ZODIAC as readonly string[]).includes(value);
}

/** 양력 태어난 해 → 띠. 1월~2월 초(설 전) 생일은 전 해의 띠일 수 있어요. */
export function zodiacOfYear(year: number): Zodiac {
  return ZODIAC[(((year - 4) % 12) + 12) % 12];
}

export type FortuneGrade = "대길" | "길" | "소길" | "평";

/** 등급 비율: 대길 20%, 길 40%, 소길 25%, 평 15% */
const GRADES: { grade: FortuneGrade; weight: number }[] = [
  { grade: "대길", weight: 20 },
  { grade: "길", weight: 40 },
  { grade: "소길", weight: 25 },
  { grade: "평", weight: 15 },
];

const TEXTS: Record<FortuneGrade, string[]> = {
  대길: [
    "미뤄둔 연락을 먼저 하면 반가운 답이 와요. 오후에 작은 행운이 하나 들어와요.",
    "오래 고민하던 일에 답이 보여요. 오늘 정하면 마음이 한결 가벼워져요.",
    "움직일수록 좋은 일이 생겨요. 산책이든 운동이든 몸을 써보세요.",
    "오랜 친구에게 연락이 와요. 반가운 소식과 함께 약속이 하나 생겨요.",
    "생각지도 못한 칭찬을 듣는 날이에요. 그동안의 노력이 눈에 띄어요.",
    "새로 시작하기 좋은 날. 미뤄둔 계획의 첫 걸음을 오늘 떼보세요.",
    "지갑에 작은 여유가 생겨요. 나를 위한 작은 선물 하나는 괜찮아요.",
    "만나는 사람마다 기분 좋은 이야기를 나누게 돼요. 약속을 잡아보세요.",
    "막혀 있던 일이 술술 풀려요. 오전에 중요한 일을 먼저 끝내세요.",
  ],
  길: [
    "천천히 가도 괜찮은 날. 서두르지 않으면 실수 없이 하루가 마무리돼요.",
    "칭찬을 한마디 건네면 두 배로 돌아오는 날이에요.",
    "조용히 혼자 보내는 시간이 기운을 채워줘요. 좋아하는 노래 한 곡 어때요.",
    "정리 정돈을 하면 잃어버린 물건이 나와요. 책상부터 시작해보세요.",
    "맛있는 걸 먹으면 운이 풀리는 날. 오늘 점심은 아끼지 마세요.",
    "작은 약속을 잘 지키면 신뢰가 쌓여요. 시간 약속부터 챙기세요.",
    "새로운 길로 가보면 기분 좋은 발견이 있어요. 평소와 다른 골목으로.",
    "도움을 청하면 생각보다 쉽게 해결돼요. 혼자 끙끙대지 마세요.",
    "오후에 반가운 메시지가 와요. 답장은 너무 길게 고민하지 마세요.",
    "몸이 가벼운 날이에요. 미뤄둔 집안일을 해치우기 좋아요.",
  ],
  소길: [
    "계획에 없던 일이 생겨도 의외로 재밌게 풀려요. 점심은 새로운 메뉴로.",
    "작은 실수도 웃어넘기면 금방 지나가요. 유머가 오늘의 무기예요.",
    "기대보다 조금 늦게 풀리지만 결과는 괜찮아요. 조급해하지 마세요.",
    "말보다 행동이 통하는 날이에요. 길게 설명하기보다 먼저 해보세요.",
    "사소한 데서 기분이 좋아지는 날. 따뜻한 음료 한 잔을 챙기세요.",
    "오늘은 듣는 쪽이 이득이에요. 친구의 이야기를 끝까지 들어주세요.",
    "작은 지출이 쌓이기 쉬운 날. 장바구니는 한 번 더 확인하세요.",
    "오전엔 흐리고 오후엔 맑아요. 중요한 일은 오후로 미뤄도 좋아요.",
  ],
  평: [
    "무난한 하루. 일찍 들어가 푹 쉬는 게 오늘의 가장 큰 행운이에요.",
    "특별한 일 없이 지나가는 날이 제일 좋은 날일 수도 있어요.",
    "무리하지 않는 게 이기는 날. 오늘 할 일은 딱 세 개만 정하세요.",
    "괜히 예민해지기 쉬운 날이에요. 큰 결정은 내일로 미뤄도 괜찮아요.",
    "에너지를 아끼는 날. 약속보다 혼자만의 휴식이 더 잘 맞아요.",
    "평범한 하루 속에 작은 웃음이 숨어 있어요. 천천히 둘러보세요.",
  ],
};

const COLORS = ["노랑", "초록", "빨강", "하늘", "금색", "보라", "주황", "분홍", "파랑", "흰색", "갈색", "연두", "남색", "베이지"];
const CAUTIONS = [
  "늦잠",
  "과식",
  "지각",
  "충동구매",
  "말실수",
  "야식",
  "무리",
  "밤샘",
  "조급함",
  "미루기",
  "과음",
  "남 탓",
  "휴대폰 과다",
  "빈속 커피",
  "급한 운전",
];

export interface Fortune {
  zodiac: Zodiac;
  grade: FortuneGrade;
  text: string;
  color: string;
  number: number;
  caution: string;
}

function pickBy<T>(list: readonly T[], key: string): T {
  return list[hashString(key) % list.length];
}

/** 날짜(YYYY-MM-DD)와 띠로 오늘의 부적을 만듭니다. */
export function fortuneFor(dateKey: string, zodiac: Zodiac): Fortune {
  const roll = hashString(`fortune:${dateKey}:${zodiac}:grade`) % 100;
  let acc = 0;
  let grade: FortuneGrade = "길";
  for (const g of GRADES) {
    acc += g.weight;
    if (roll < acc) {
      grade = g.grade;
      break;
    }
  }
  return {
    zodiac,
    grade,
    text: pickBy(TEXTS[grade], `fortune:${dateKey}:${zodiac}:text`),
    color: pickBy(COLORS, `fortune:${dateKey}:${zodiac}:color`),
    number: (hashString(`fortune:${dateKey}:${zodiac}:number`) % 12) + 1,
    caution: pickBy(CAUTIONS, `fortune:${dateKey}:${zodiac}:caution`),
  };
}

/** 오늘 대길인 띠 목록 (메인 화면 안내용) */
export function luckyZodiacs(dateKey: string): Zodiac[] {
  return ZODIAC.filter((z) => fortuneFor(dateKey, z).grade === "대길");
}
