/**
 * 지역별 축제 페이지 (/festival/[slug])
 * name은 축제 데이터의 region 값과 같아야 합니다.
 */
export interface FestivalRegion {
  slug: string;
  /** 짧은 이름. 칩과 데이터에 쓰는 값. 예: "서울" */
  name: string;
  /** 소개 문구에 쓰는 정식 이름 */
  fullName: string;
}

export const FESTIVAL_REGIONS: FestivalRegion[] = [
  { slug: "seoul", name: "서울", fullName: "서울특별시" },
  { slug: "incheon", name: "인천", fullName: "인천광역시" },
  { slug: "gyeonggi", name: "경기", fullName: "경기도" },
  { slug: "gangwon", name: "강원", fullName: "강원특별자치도" },
  { slug: "daejeon", name: "대전", fullName: "대전광역시" },
  { slug: "sejong", name: "세종", fullName: "세종특별자치시" },
  { slug: "chungbuk", name: "충북", fullName: "충청북도" },
  { slug: "chungnam", name: "충남", fullName: "충청남도" },
  { slug: "gwangju", name: "광주", fullName: "광주" },
  { slug: "jeonbuk", name: "전북", fullName: "전북특별자치도" },
  { slug: "jeonnam", name: "전남", fullName: "전남" },
  { slug: "busan", name: "부산", fullName: "부산광역시" },
  { slug: "daegu", name: "대구", fullName: "대구광역시" },
  { slug: "ulsan", name: "울산", fullName: "울산광역시" },
  { slug: "gyeongbuk", name: "경북", fullName: "경상북도" },
  { slug: "gyeongnam", name: "경남", fullName: "경상남도" },
  { slug: "jeju", name: "제주", fullName: "제주특별자치도" },
];

export function regionBySlug(slug: string): FestivalRegion | undefined {
  return FESTIVAL_REGIONS.find((r) => r.slug === slug);
}

export function regionByName(name: string): FestivalRegion | undefined {
  return FESTIVAL_REGIONS.find((r) => r.name === name);
}

/** 지역 칩이 이동할 주소. 페이지가 없는 지역(기타 등)은 null */
export function regionHref(name: string): string | null {
  if (name === "전체") return "/festival";
  const region = regionByName(name);
  return region ? `/festival/${region.slug}` : null;
}
