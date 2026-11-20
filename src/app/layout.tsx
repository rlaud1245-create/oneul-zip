import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { StampToast } from "@/components/StampToast";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["오늘 뭐 먹지", "점심 메뉴 추천", "저녁 메뉴 추천", "오늘 뭐 하지", "심심할 때 할 것", "밸런스 게임"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.slogan}`,
    description: SITE.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - ${SITE.slogan}`,
    description: SITE.description,
  },
  formatDetection: { telephone: false },
  verification: {
    other: { "naver-site-verification": "20730b9f6d28fc9b5b25fe91ee26eefe6616a3c4" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3E6C8",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=Nanum+Brush+Script&display=swap" />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          본문 바로가기
        </a>
        <Providers>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <StampToast />
        </Providers>
      </body>
    </html>
  );
}
