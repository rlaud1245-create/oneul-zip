/**
 * 메뉴 그림 목록과 실제 크기(가로, 세로 px)
 * 그림 파일은 public/foods/{id}.webp (최대 480px, 투명 배경, 그릇까지 그린 그림)
 * 원본은 D:\오늘의집\메뉴 폴더(깃에는 안 올라감)에 한글 메뉴 이름으로 보관합니다.
 * 크기를 미리 알려줘야 그림이 늦게 떠도 자리가 흔들리지 않아요(주방장 손 위치가 고정됨).
 * 여기 없는 메뉴는 이모지와 기본 접시로 보여줍니다.
 */
const FOOD_IMAGE_SIZES: Record<string, [number, number]> = {
  "banhmi": [480, 378],
  "bibimbap": [480, 450],
  "bossam": [480, 419],
  "brunch": [475, 410],
  "bulgogi": [480, 373],
  "burger": [421, 408],
  "chicken": [480, 403],
  "cupbap": [413, 480],
  "curry": [474, 362],
  "dakgalbi": [480, 332],
  "dimsum": [474, 480],
  "doenjang-jjigae": [480, 468],
  "donkatsu": [480, 432],
  "eomuk": [480, 472],
  "fried-rice": [480, 406],
  "galbitang": [480, 448],
  "gamjatang": [480, 446],
  "gimbap": [480, 381],
  "gukbap": [480, 458],
  "gyudon": [405, 381],
  "hanjeongsik": [480, 373],
  "hotpot": [480, 394],
  "jeyuk": [480, 385],
  "jjajangmyeon": [412, 364],
  "jjamppong": [439, 393],
  "jjimdak": [480, 348],
  "jjolmyeon": [480, 423],
  "jokbal": [480, 416],
  "kalguksu": [480, 435],
  "kapao": [480, 425],
  "katsudon": [480, 465],
  "kimchi-jjigae": [480, 428],
  "kkanpunggi": [480, 400],
  "lamb-skewer": [480, 381],
  "malatang": [480, 448],
  "malaxiangguo": [480, 372],
  "naengmyeon": [480, 395],
  "nasi-goreng": [463, 401],
  "okonomiyaki": [443, 372],
  "omakase": [480, 305],
  "omurice": [480, 315],
  "padthai": [476, 360],
  "pasta": [436, 361],
  "pho": [480, 452],
  "pizza": [420, 403],
  "rabokki": [480, 363],
  "ramen": [480, 461],
  "ramyeon": [480, 377],
  "risotto": [455, 389],
  "salad": [436, 402],
  "samgyeopsal": [480, 391],
  "sandwich": [456, 416],
  "shabu": [468, 389],
  "soba": [443, 327],
  "spring-roll": [480, 375],
  "steak": [465, 346],
  "sundae": [480, 359],
  "sundaeguk": [480, 445],
  "sundubu": [474, 480],
  "sushi": [480, 325],
  "tacos": [453, 411],
  "tangsuyuk": [480, 322],
  "tendon": [395, 458],
  "tomyum": [458, 446],
  "tteokbokki": [480, 345],
  "twigim": [480, 440],
  "udon": [480, 460],
};

/** 그림을 바꾸면 숫자를 올려주세요. 브라우저에 남은 예전 그림 대신 새 그림을 받아옵니다. */
const IMAGE_VERSION = 2;

export interface FoodImage {
  src: string;
  width: number;
  height: number;
}

export function foodImage(id: string): FoodImage | undefined {
  const size = FOOD_IMAGE_SIZES[id];
  return size ? { src: `/foods/${id}.webp?v=${IMAGE_VERSION}`, width: size[0], height: size[1] } : undefined;
}
