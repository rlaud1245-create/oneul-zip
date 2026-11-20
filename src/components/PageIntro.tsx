interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

/** 간판 없이 쓰는 작은 페이지 제목 (소개, 저장함, 개인정보처리방침 등) */
export function PageIntro({ eyebrow, title, description }: Props) {
  return (
    <div className="pb-6 pt-8 sm:pt-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-1 font-sign text-[32px] font-normal leading-tight sm:text-[42px]">{title}</h1>
      {description && <p className="mt-3 leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
