import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { SavedList } from "./SavedList";

export const metadata: Metadata = {
  title: "저장한 결과",
  description: "마음에 들어 저장한 메뉴와 활동을 모아 봐요.",
  alternates: { canonical: "/saved" },
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16">
      <PageIntro
        eyebrow="저장함"
        title="저장한 결과"
        description="저장한 추천은 이 기기의 브라우저에만 보관돼요. 회원가입은 필요 없어요."
      />
      <SavedList />
    </div>
  );
}
