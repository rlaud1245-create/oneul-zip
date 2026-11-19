import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  tone: "purple" | "yellow" | "peach";
}

const TONE = {
  purple: "bg-primary-light text-primary-deep",
  yellow: "bg-yellow/50 text-[#7a5a00]",
  peach: "bg-peach/70 text-[#9a4a33]",
};

export function FeatureCard({ href, icon, title, description, tone }: Props) {
  return (
    <Link
      href={href}
      className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.99] sm:flex-col sm:items-start sm:p-6"
    >
      <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", TONE[tone])} aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{description}</span>
      </span>
      <ArrowRight
        className="size-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-primary sm:hidden"
        aria-hidden
      />
    </Link>
  );
}
