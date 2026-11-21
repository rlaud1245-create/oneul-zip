/**
 * 카카오톡 공유 (Kakao JavaScript SDK)
 * - 키는 Cloudflare 빌드 변수 NEXT_PUBLIC_KAKAO_JS_KEY 에 넣습니다. (JavaScript 키는 공개돼도 되는 키예요.)
 * - 카카오 개발자 콘솔에 사이트 도메인(https://oneulzip.com)을 등록해야 동작합니다.
 * - 키가 없으면 카카오 공유 버튼은 숨기고 링크 복사만 보여줍니다.
 */

const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

interface KakaoLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoSdk {
  init(key: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(options: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        imageWidth?: number;
        imageHeight?: number;
        link: KakaoLink;
      };
      buttons?: { title: string; link: KakaoLink }[];
    }): void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";

let loading: Promise<KakaoSdk | null> | null = null;

/** SDK를 처음 필요할 때 한 번만 불러옵니다. */
export function loadKakao(): Promise<KakaoSdk | null> {
  if (!KAKAO_KEY || typeof window === "undefined") return Promise.resolve(null);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const ready = () => {
      const kakao = window.Kakao;
      if (!kakao) return resolve(null);
      if (!kakao.isInitialized()) kakao.init(KAKAO_KEY);
      resolve(kakao);
    };
    if (window.Kakao) return ready();
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = ready;
    script.onerror = () => {
      loading = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });
  return loading;
}

export interface KakaoShareData {
  title: string;
  text: string;
  url: string;
  /** 절대 주소의 미리보기 이미지 (1200×630 권장) */
  imageUrl: string;
  buttonLabel?: string;
}

/** 카카오톡 친구 선택 창을 엽니다. 성공적으로 열면 true */
export async function shareToKakao(data: KakaoShareData): Promise<boolean> {
  const kakao = await loadKakao();
  if (!kakao) return false;
  try {
    const link = { mobileWebUrl: data.url, webUrl: data.url };
    kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: data.title,
        description: data.text,
        imageUrl: data.imageUrl,
        imageWidth: 1200,
        imageHeight: 630,
        link,
      },
      buttons: [{ title: data.buttonLabel ?? "오늘.zip에서 보기", link }],
    });
    return true;
  } catch (error) {
    console.error("[kakao]", error);
    return false;
  }
}
