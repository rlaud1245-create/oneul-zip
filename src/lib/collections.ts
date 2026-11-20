import { activities } from "@/data/activities";
import { foods } from "@/data/foods";
import type { Activity, Food } from "@/types";

/**
 * 모아보기 페이지 정의
 * /food/[slug], /activity/[slug] 로 정적 생성됩니다.
 * 검색어(예: "혼밥 메뉴 추천", "혼자 할 수 있는 것")에 맞춘 목록 페이지라
 * 새 메뉴·활동을 데이터에 추가하면 해당 조건의 페이지에 자동으로 들어갑니다.
 */
export interface Collection<T> {
  slug: string;
  /** 다른 모아보기로 이동하는 링크에 쓰는 짧은 이름 */
  label: string;
  /** 페이지 제목(h1) 겸 검색 결과 제목 */
  title: string;
  /** 검색 결과 설명 */
  description: string;
  /** 본문 상단 소개 문단 */
  intro: string;
  /** 하단 안내 문단 */
  tip: string;
  group: string;
  filter: (item: T) => boolean;
}

export const FOOD_COLLECTIONS: Collection<Food>[] = [
  // 음식 종류
  {
    slug: "korean",
    label: "한식",
    group: "음식 종류",
    title: "오늘 뭐 먹지? 한식 메뉴 추천",
    description: "찌개, 국밥, 고기, 면 요리까지. 오늘 먹기 좋은 한식 메뉴를 한눈에 모아봤어요.",
    intro: "뜨끈한 국물부터 지글지글 고기까지, 밥이 당기는 날 고르기 좋은 한식 메뉴예요.",
    tip: "혼자라면 국밥이나 찌개처럼 1인분 주문이 편한 메뉴를, 여럿이라면 보쌈·족발처럼 나눠 먹는 메뉴를 골라보세요.",
    filter: (f) => f.category === "korean",
  },
  {
    slug: "western",
    label: "양식",
    group: "음식 종류",
    title: "오늘 뭐 먹지? 양식 메뉴 추천",
    description: "파스타, 피자, 스테이크, 버거까지. 분위기 내고 싶은 날 고르기 좋은 양식 메뉴 모음.",
    intro: "기분 전환이 필요하거나 분위기를 내고 싶은 날 어울리는 양식 메뉴예요.",
    tip: "데이트라면 파스타나 스테이크, 간단히 먹고 싶다면 버거나 샌드위치처럼 가볍게 즐길 수 있는 메뉴가 좋아요.",
    filter: (f) => f.category === "western",
  },
  {
    slug: "japanese",
    label: "일식",
    group: "음식 종류",
    title: "오늘 뭐 먹지? 일식 메뉴 추천",
    description: "초밥, 라멘, 돈가스, 덮밥까지. 깔끔하게 먹고 싶은 날의 일식 메뉴 모음.",
    intro: "깔끔한 한 그릇이 생각날 때 고르기 좋은 일식 메뉴예요.",
    tip: "덮밥이나 라멘은 혼밥하기 편하고, 샤브샤브나 오코노미야키는 여럿이 함께 먹기 좋아요.",
    filter: (f) => f.category === "japanese",
  },
  {
    slug: "chinese",
    label: "중식",
    group: "음식 종류",
    title: "오늘 뭐 먹지? 중식 메뉴 추천",
    description: "짜장면, 짬뽕, 탕수육부터 마라탕까지. 든든하게 먹고 싶은 날의 중식 메뉴 모음.",
    intro: "고민될 때 실패 없는 선택, 든든하고 진한 맛의 중식 메뉴예요.",
    tip: "짜장면과 짬뽕 사이에서 고민된다면 둘 다 맛볼 수 있는 세트 메뉴를 찾아보세요.",
    filter: (f) => f.category === "chinese",
  },
  {
    slug: "snack",
    label: "분식",
    group: "음식 종류",
    title: "오늘 뭐 먹지? 분식 메뉴 추천",
    description: "떡볶이, 김밥, 라면, 튀김까지. 가볍고 저렴하게 먹기 좋은 분식 메뉴 모음.",
    intro: "가볍게, 빠르게, 부담 없이 먹고 싶을 때 딱인 분식 메뉴예요.",
    tip: "분식은 여러 메뉴를 조금씩 시켜 나눠 먹을 때 가장 맛있어요.",
    filter: (f) => f.category === "snack",
  },
  {
    slug: "asian",
    label: "아시아 음식",
    group: "음식 종류",
    title: "오늘 뭐 먹지? 아시아 음식 추천",
    description: "쌀국수, 팟타이, 커리, 월남쌈까지. 색다른 맛이 당길 때 고르기 좋은 아시아 음식 모음.",
    intro: "늘 먹던 메뉴가 지겨울 때, 이국적인 향신료와 색다른 맛의 아시아 음식이에요.",
    tip: "처음 먹어보는 메뉴라면 쌀국수나 커리처럼 익숙한 맛부터 도전해보세요.",
    filter: (f) => f.category === "asian",
  },
  // 함께 먹는 사람
  {
    slug: "solo",
    label: "혼밥",
    group: "누구와 먹나요",
    title: "혼밥 메뉴 추천: 혼자 먹기 좋은 메뉴",
    description: "1인분 주문이 편하고 혼자 먹어도 어색하지 않은 혼밥 메뉴를 모아봤어요.",
    intro: "혼자서도 편하게 들어가 먹을 수 있고, 1인분으로 주문하기 좋은 메뉴예요.",
    tip: "점심 혼밥이라면 회전이 빠른 국밥·덮밥·라멘집이 편하고, 저녁엔 포장해서 집에서 먹는 것도 좋아요.",
    filter: (f) => f.situations.includes("solo"),
  },
  {
    slug: "friends",
    label: "친구와 식사",
    group: "누구와 먹나요",
    title: "친구랑 뭐 먹지? 친구와 먹기 좋은 메뉴",
    description: "여럿이 나눠 먹고 떠들기 좋은, 친구와 함께라면 더 맛있는 메뉴 모음.",
    intro: "같이 나눠 먹고 이야기하며 시간을 보내기 좋은 메뉴예요.",
    tip: "인원이 많다면 고기나 전골처럼 가운데 두고 함께 먹는 메뉴가 분위기를 살려줘요.",
    filter: (f) => f.situations.includes("friends"),
  },
  {
    slug: "date",
    label: "데이트",
    group: "누구와 먹나요",
    title: "데이트 메뉴 추천: 연인과 먹기 좋은 메뉴",
    description: "분위기도 맛도 챙기고 싶은 데이트에 어울리는 메뉴를 모아봤어요.",
    intro: "분위기를 내고 싶은 날, 둘이 마주 앉아 먹기 좋은 데이트 메뉴예요.",
    tip: "첫 데이트라면 먹기 편하고 냄새가 덜한 메뉴를, 오래된 커플이라면 둘 다 좋아하는 메뉴를 골라보세요.",
    filter: (f) => f.situations.includes("date"),
  },
  {
    slug: "family",
    label: "가족 외식",
    group: "누구와 먹나요",
    title: "가족 외식 메뉴 추천",
    description: "어른부터 아이까지 함께 먹기 좋은 가족 외식 메뉴 모음.",
    intro: "온 가족이 둘러앉아 함께 먹기 좋은 메뉴예요.",
    tip: "아이와 함께라면 맵지 않은 메뉴가 있는지, 부모님과 함께라면 좌석이 편한 곳인지 미리 확인해보세요.",
    filter: (f) => f.situations.includes("family"),
  },
  // 가격대
  {
    slug: "cheap",
    label: "1만 원 이하",
    group: "가격대",
    title: "1만 원 이하 가성비 메뉴 추천",
    description: "1인 1만 원 이하로 든든하게 먹을 수 있는 가성비 메뉴를 모아봤어요.",
    intro: "지갑은 가볍게, 배는 든든하게. 1인 1만 원 안팎으로 먹을 수 있는 메뉴예요.",
    tip: "가격은 1인 기준 대략적인 범위예요. 지역과 가게에 따라 차이가 있을 수 있어요.",
    filter: (f) => f.price === "low",
  },
  {
    slug: "mid",
    label: "1만~2만 원",
    group: "가격대",
    title: "1만~2만 원대 메뉴 추천",
    description: "조금 더 제대로 먹고 싶은 날, 1인 1만~2만 원대로 즐기기 좋은 메뉴 모음.",
    intro: "평소보다 조금 더 신경 써서 먹고 싶은 날 어울리는 메뉴예요.",
    tip: "가격은 1인 기준 대략적인 범위예요. 지역과 가게에 따라 차이가 있을 수 있어요.",
    filter: (f) => f.price === "mid",
  },
  {
    slug: "special",
    label: "2만 원 이상",
    group: "가격대",
    title: "특별한 날 메뉴 추천 (1인 2만 원 이상)",
    description: "기념일이나 대접하고 싶은 날, 제대로 먹기 좋은 메뉴를 모아봤어요.",
    intro: "기념일, 축하할 일, 고마운 사람에게 대접하고 싶은 날에 어울리는 메뉴예요.",
    tip: "인기 있는 곳은 미리 예약하는 게 좋아요. 가격은 1인 기준 대략적인 범위예요.",
    filter: (f) => f.price === "high",
  },
];

export const ACTIVITY_COLLECTIONS: Collection<Activity>[] = [
  // 누구와
  {
    slug: "solo",
    label: "혼자",
    group: "누구와 하나요",
    title: "혼자 할 수 있는 것 추천: 혼자 놀기 좋은 활동",
    description: "산책, 독서, 원데이 클래스까지. 혼자서도 즐겁게 시간을 보낼 수 있는 활동 모음.",
    intro: "누구 눈치 볼 것 없이, 혼자라서 더 좋은 활동들이에요.",
    tip: "혼자 하는 시간이 어색하다면 산책이나 카페처럼 가벼운 것부터 시작해보세요.",
    filter: (a) => a.companions.includes("solo"),
  },
  {
    slug: "friends",
    label: "친구",
    group: "누구와 하나요",
    title: "친구랑 뭐 하지? 친구와 할 만한 것 추천",
    description: "방탈출, 보드게임, 볼링까지. 친구와 함께라면 더 재밌는 활동을 모아봤어요.",
    intro: "같이 웃고 떠들며 시간 가는 줄 모르게 즐길 수 있는 활동이에요.",
    tip: "인원이 많다면 볼링이나 보드게임처럼 팀을 나눠 즐기는 활동이 좋아요.",
    filter: (a) => a.companions.includes("friends"),
  },
  {
    slug: "date",
    label: "연인",
    group: "누구와 하나요",
    title: "데이트 코스 추천: 연인과 할 만한 것",
    description: "전시회, 야경, 원데이 클래스까지. 연인과 함께하기 좋은 데이트 활동 모음.",
    intro: "늘 가던 곳이 지겨울 때, 둘이 함께하기 좋은 데이트 활동이에요.",
    tip: "식사 메뉴까지 고민된다면 '데이트 메뉴 추천'과 함께 코스를 짜보세요.",
    filter: (a) => a.companions.includes("date"),
  },
  {
    slug: "family",
    label: "가족",
    group: "누구와 하나요",
    title: "가족과 주말에 할 만한 것 추천",
    description: "피크닉, 박물관, 아쿠아리움까지. 가족과 함께 보내기 좋은 활동을 모아봤어요.",
    intro: "어른도 아이도 함께 즐길 수 있는 가족 나들이 활동이에요.",
    tip: "아이와 함께라면 이동 시간이 짧고 쉴 곳이 있는 장소를 고르는 게 좋아요.",
    filter: (a) => a.companions.includes("family"),
  },
  // 기분
  {
    slug: "bored",
    label: "심심할 때",
    group: "지금 기분",
    title: "심심할 때 할 것 추천",
    description: "심심해서 뭘 할지 모르겠을 때, 바로 해볼 수 있는 활동들을 모아봤어요.",
    intro: "할 게 없어서 휴대폰만 보고 있다면, 이 중에 하나 골라 바로 시작해보세요.",
    tip: "고르기도 귀찮다면 '오늘 뭐 하지?'에서 버튼 한 번으로 랜덤 추천을 받아보세요.",
    filter: (a) => a.moods.includes("bored"),
  },
  {
    slug: "rest",
    label: "쉬고 싶을 때",
    group: "지금 기분",
    title: "쉬고 싶을 때 할 것 추천: 제대로 쉬는 방법",
    description: "몸도 마음도 지쳤을 때, 제대로 쉴 수 있는 휴식 활동 모음.",
    intro: "아무것도 하기 싫을 만큼 지친 날, 부담 없이 쉬어갈 수 있는 활동이에요.",
    tip: "쉬는 날에도 할 일을 정해두면 마음이 편해져요. 오늘은 '쉬기'를 할 일로 정해보세요.",
    filter: (a) => a.moods.includes("rest"),
  },
  {
    slug: "active",
    label: "몸 쓰고 싶을 때",
    group: "지금 기분",
    title: "활동적인 취미 추천: 몸 쓰고 싶을 때 할 것",
    description: "클라이밍, 배드민턴, 러닝까지. 땀 흘리며 에너지를 쓰고 싶을 때 좋은 활동 모음.",
    intro: "에너지가 넘치거나 몸을 움직여 스트레스를 풀고 싶을 때 좋은 활동이에요.",
    tip: "오랜만에 운동한다면 준비운동을 꼭 하고, 처음엔 짧게 시작해보세요.",
    filter: (a) => a.moods.includes("active"),
  },
  {
    slug: "refresh",
    label: "기분 전환",
    group: "지금 기분",
    title: "기분 전환하는 법: 기분 전환에 좋은 활동",
    description: "꿀꿀한 기분을 바꾸고 싶을 때, 리프레시에 좋은 활동을 모아봤어요.",
    intro: "기분이 가라앉거나 일상이 답답할 때, 분위기를 바꿔줄 활동이에요.",
    tip: "장소만 바꿔도 기분이 달라져요. 평소 안 가본 곳으로 가볍게 나가보세요.",
    filter: (a) => a.moods.includes("refresh"),
  },
  // 예산
  {
    slug: "free",
    label: "무료",
    group: "예산",
    title: "돈 안 드는 놀거리: 무료로 할 수 있는 것",
    description: "산책, 도서관, 박물관까지. 돈 한 푼 안 들이고 즐길 수 있는 활동 모음.",
    intro: "지갑을 열지 않아도 충분히 즐거운 하루를 보낼 수 있는 활동이에요.",
    tip: "국공립 박물관이나 도서관은 무료인 곳이 많아요. 운영 시간만 미리 확인해보세요.",
    filter: (a) => a.cost === "free",
  },
  {
    slug: "under-10k",
    label: "1만 원 이하",
    group: "예산",
    title: "1만 원으로 할 수 있는 것 추천",
    description: "만 원 한 장으로 즐길 수 있는 가성비 놀거리를 모아봤어요.",
    intro: "부담 없는 비용으로 기분 좋게 즐길 수 있는 활동이에요.",
    tip: "비용은 대략적인 예시예요. 지역과 장소에 따라 달라질 수 있어요.",
    filter: (a) => a.cost === "10k",
  },
  {
    slug: "under-30k",
    label: "3만 원 이하",
    group: "예산",
    title: "3만 원 이하 놀거리 추천",
    description: "방탈출, 영화, 클라이밍까지. 3만 원 안쪽으로 즐기기 좋은 활동 모음.",
    intro: "조금 더 특별하게 놀고 싶을 때, 3만 원 안쪽으로 즐길 수 있는 활동이에요.",
    tip: "비용은 대략적인 예시예요. 평일이나 조조 할인을 이용하면 더 저렴해져요.",
    filter: (a) => a.cost === "30k",
  },
  {
    slug: "special",
    label: "3만 원 이상",
    group: "예산",
    title: "특별한 날 할 만한 것 추천",
    description: "놀이공원, 공연, 캠핑까지. 큰맘 먹고 즐기기 좋은 특별한 활동 모음.",
    intro: "기념일이나 오랜만의 휴가처럼, 제대로 즐기고 싶은 날에 어울리는 활동이에요.",
    tip: "인기 있는 공연이나 체험은 예약이 빨리 마감되니 미리 확인해보세요.",
    filter: (a) => a.cost === "30k+",
  },
  // 시간
  {
    slug: "30-minutes",
    label: "30분",
    group: "시간",
    title: "30분 안에 할 수 있는 것 추천",
    description: "점심시간이나 짧은 틈새 시간에 바로 해볼 수 있는 30분 활동 모음.",
    intro: "시간이 애매하게 남았을 때, 30분이면 충분한 활동이에요.",
    tip: "틈새 시간을 잘 쓰면 하루가 길어져요. 휴대폰 대신 이 중 하나를 해보세요.",
    filter: (a) => a.time === "30m",
  },
  {
    slug: "2-hours",
    label: "1~2시간",
    group: "시간",
    title: "1~2시간 동안 할 만한 것 추천",
    description: "퇴근 후나 반나절 중 잠깐, 1~2시간 동안 즐기기 좋은 활동 모음.",
    intro: "퇴근 후 저녁이나 약속 사이 빈 시간에 즐기기 딱 좋은 활동이에요.",
    tip: "이동 시간까지 생각해서 가까운 곳에서 할 수 있는 활동을 골라보세요.",
    filter: (a) => a.time === "2h",
  },
  {
    slug: "half-day",
    label: "반나절",
    group: "시간",
    title: "반나절 동안 할 만한 것 추천",
    description: "주말 오후, 3~4시간 동안 알차게 보내기 좋은 활동을 모아봤어요.",
    intro: "주말 오후를 알차게 보내고 싶을 때, 반나절 코스로 좋은 활동이에요.",
    tip: "반나절 활동 하나에 식사를 더하면 하루 코스가 완성돼요.",
    filter: (a) => a.time === "4h",
  },
  {
    slug: "all-day",
    label: "하루 종일",
    group: "시간",
    title: "하루 종일 놀거리 추천: 주말 나들이",
    description: "당일치기 여행, 놀이공원, 캠핑까지. 하루를 통째로 쓰기 좋은 활동 모음.",
    intro: "온전히 하루를 비워둔 날, 제대로 떠나거나 즐기기 좋은 활동이에요.",
    tip: "하루 일정이라면 교통편과 날씨를 미리 확인하고 출발하세요.",
    filter: (a) => a.time === "day",
  },
];

export function findFoodCollection(slug: string) {
  return FOOD_COLLECTIONS.find((c) => c.slug === slug);
}

export function findActivityCollection(slug: string) {
  return ACTIVITY_COLLECTIONS.find((c) => c.slug === slug);
}

export function foodsIn(collection: Collection<Food>): Food[] {
  return foods.filter(collection.filter);
}

export function activitiesIn(collection: Collection<Activity>): Activity[] {
  return activities.filter(collection.filter);
}

/** 그룹별로 묶기 (모아보기 링크 목록용) */
export function groupCollections<T>(list: Collection<T>[]): { group: string; items: Collection<T>[] }[] {
  const groups: { group: string; items: Collection<T>[] }[] = [];
  for (const c of list) {
    const found = groups.find((g) => g.group === c.group);
    if (found) found.items.push(c);
    else groups.push({ group: c.group, items: [c] });
  }
  return groups;
}
