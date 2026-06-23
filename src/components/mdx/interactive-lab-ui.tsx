"use client";

import type { ReactNode } from "react";
import type {
  StageState,
  Tone,
} from "@/components/mdx/backend-communication-labs";
import { cn } from "@/lib/utils";

type ShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function DiagramShell({ title, description, children }: ShellProps) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground">
      <div className="border-b bg-fd-secondary/40 px-4 py-3">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-sm text-fd-muted-foreground">
          {description}
        </div>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

export function ToggleRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
                : "hover:bg-fd-accent hover:text-fd-accent-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleButton({
  active,
  children,
  onClick,
  tone = "primary",
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  tone?: "primary" | "warn";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5",
        active &&
          (tone === "warn"
            ? "border-amber-500/50 bg-amber-500/10"
            : "border-fd-primary bg-fd-primary/10"),
      )}
    >
      {children}
    </button>
  );
}

export function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number | string;
  min: number;
  max: number;
  step: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <div>{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full"
      />
    </label>
  );
}

export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-500/30 bg-emerald-500/10"
      : tone === "warn"
        ? "border-amber-500/30 bg-amber-500/10"
        : tone === "bad"
          ? "border-red-500/30 bg-red-500/10"
          : "border-fd-border bg-fd-secondary/30";

  return (
    <div className={cn("rounded-lg border p-3", toneClass)}>
      <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

export function Stage({
  title,
  detail,
  state,
}: {
  title: string;
  detail: string;
  state: StageState;
}) {
  const stateClass =
    state === "active"
      ? "border-fd-primary bg-fd-primary/10"
      : state === "done"
        ? "border-emerald-500/30 bg-emerald-500/10"
        : state === "blocked"
          ? "border-amber-500/30 bg-amber-500/10"
          : "border-fd-border bg-fd-secondary/20";

  return (
    <div className={cn("rounded-lg border p-3", stateClass)}>
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-sm text-fd-muted-foreground">{detail}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border bg-fd-primary px-3 py-1.5 text-sm text-fd-primary-foreground"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border px-3 py-1.5 text-sm"
    >
      {children}
    </button>
  );
}
