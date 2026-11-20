/**
 * 메뉴 그림이 있는 메뉴 ID 목록
 * 그림 파일은 public/foods/{id}.webp (가로 480px, 투명 배경, 그릇까지 그린 그림)
 * 여기 없는 메뉴는 이모지와 기본 접시로 보여줍니다. 그림이 생기면 한 줄씩 추가하세요.
 */
export const FOOD_IMAGES = new Set<string>(["kimchi-jjigae", "tteokbokki"]);

export function foodImage(id: string): string | undefined {
  return FOOD_IMAGES.has(id) ? `/foods/${id}.webp` : undefined;
}
