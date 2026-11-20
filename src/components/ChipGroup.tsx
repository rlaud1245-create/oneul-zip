"use client";

import { useId } from "react";

interface Option<V extends string> {
  value: V;
  label: string;
}

interface Props<V extends string> {
  label: string;
  options: readonly Option<V>[];
  value: V | null;
  onChange: (value: V | null) => void;
  /** 조건 없음 칩의 이름 */
  anyLabel?: string;
}

export function ChipGroup<V extends string>({ label, options, value, onChange, anyLabel = "상관없음" }: Props<V>) {
  const labelId = useId();

  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="mb-2.5 font-label text-[18px]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="chip" aria-pressed={value === null} onClick={() => onChange(null)}>
          {anyLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="chip"
            aria-pressed={value === option.value}
            onClick={() => onChange(value === option.value ? null : option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
