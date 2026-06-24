"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="not-prose my-6 overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground"
    >
      <div className="border-b bg-fd-secondary/40 px-4 py-3">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-sm text-fd-muted-foreground">
          {description}
        </div>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </motion.div>
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
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              backgroundColor: active
                ? "var(--color-fd-primary)"
                : "transparent",
              borderColor: active
                ? "var(--color-fd-primary)"
                : "var(--color-fd-border)",
              color: active
                ? "var(--color-fd-primary-foreground)"
                : "var(--color-fd-foreground)",
            }}
            transition={{ duration: 0.2 }}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            {option.label}
          </motion.button>
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
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      animate={{
        borderColor: active
          ? tone === "warn"
            ? "rgba(245, 158, 11, 0.5)"
            : "var(--color-fd-primary)"
          : "var(--color-fd-border)",
        backgroundColor: active
          ? tone === "warn"
            ? "rgba(245, 158, 11, 0.1)"
            : "color-mix(in srgb, var(--color-fd-primary) 10%, transparent)"
          : "transparent",
      }}
      transition={{ duration: 0.2 }}
      className="rounded-md border px-3 py-1.5"
    >
      {children}
    </motion.button>
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

const toneColors: Record<Tone | "default", { border: string; bg: string }> = {
  good: { border: "rgba(16, 185, 129, 0.3)", bg: "rgba(16, 185, 129, 0.1)" },
  warn: { border: "rgba(245, 158, 11, 0.3)", bg: "rgba(245, 158, 11, 0.1)" },
  bad: { border: "rgba(239, 68, 68, 0.3)", bg: "rgba(239, 68, 68, 0.1)" },
  default: { border: "var(--color-fd-border)", bg: "transparent" },
};

export function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const colors = toneColors[tone];

  return (
    <motion.div
      animate={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
      }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border p-3"
    >
      <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-1 text-lg font-semibold"
      >
        {value}
      </motion.div>
    </motion.div>
  );
}

const stageColors: Record<StageState, { border: string; bg: string }> = {
  active: {
    border: "var(--color-fd-primary)",
    bg: "color-mix(in srgb, var(--color-fd-primary) 10%, transparent)",
  },
  done: { border: "rgba(16, 185, 129, 0.3)", bg: "rgba(16, 185, 129, 0.1)" },
  blocked: {
    border: "rgba(245, 158, 11, 0.3)",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  idle: { border: "var(--color-fd-border)", bg: "transparent" },
};

export function Stage({
  title,
  detail,
  state,
}: {
  title: string;
  detail: string;
  state: StageState;
}) {
  const colors = stageColors[state];

  return (
    <motion.div
      animate={{
        borderColor: colors.border,
        backgroundColor: colors.bg,
      }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border p-3"
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-sm text-fd-muted-foreground">{detail}</div>
    </motion.div>
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
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-md border bg-fd-primary px-3 py-1.5 text-sm text-fd-primary-foreground"
    >
      {children}
    </motion.button>
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
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-md border px-3 py-1.5 text-sm"
    >
      {children}
    </motion.button>
  );
}

// Re-export AnimatePresence for use in diagrams
export { AnimatePresence, motion };
