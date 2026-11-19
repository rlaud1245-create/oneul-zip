interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageIntro({ eyebrow, title, description }: Props) {
  return (
    <div className="pb-6 pt-8 sm:pt-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
