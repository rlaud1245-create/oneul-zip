/**
 * 메뉴 그림이 있는 메뉴 ID 목록
 * 그림 파일은 public/foods/{id}.webp (가로 480px, 투명 배경, 그릇까지 그린 그림)
 * 원본은 D:\오늘의집\메뉴 폴더(깃에는 안 올라감)에 한글 메뉴 이름으로 보관합니다.
 * 여기 없는 메뉴는 이모지와 기본 접시로 보여줍니다.
 */
export const FOOD_IMAGES = new Set<string>([
  "banhmi",
  "bibimbap",
  "bossam",
  "brunch",
  "bulgogi",
  "burger",
  "chicken",
  "cupbap",
  "curry",
  "dakgalbi",
  "doenjang-jjigae",
  "donkatsu",
  "eomuk",
  "galbitang",
  "gamjatang",
  "gukbap",
  "gyudon",
  "hanjeongsik",
  "jeyuk",
  "jjajangmyeon",
  "jjamppong",
  "jjolmyeon",
  "jokbal",
  "kalguksu",
  "katsudon",
  "kimchi-jjigae",
  "naengmyeon",
  "nasi-goreng",
  "okonomiyaki",
  "omakase",
  "omurice",
  "padthai",
  "pasta",
  "pho",
  "pizza",
  "rabokki",
  "ramen",
  "ramyeon",
  "risotto",
  "salad",
  "samgyeopsal",
  "sandwich",
  "shabu",
  "soba",
  "steak",
  "sundae",
  "sundaeguk",
  "sundubu",
  "sushi",
  "tacos",
  "tangsuyuk",
  "tendon",
  "tteokbokki",
  "twigim",
  "udon",
]);

/** 그림을 바꾸면 숫자를 올려주세요. 브라우저에 남은 예전 그림 대신 새 그림을 받아옵니다. */
const IMAGE_VERSION = 2;

export function foodImage(id: string): string | undefined {
  return FOOD_IMAGES.has(id) ? `/foods/${id}.webp?v=${IMAGE_VERSION}` : undefined;
}
