"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── Data model ───────────────────────────────────────────────────────────────

export type Actor = {
  id: string;
  label: string;
  icon?: "client" | "server" | "worker" | "broker" | "database" | "proxy";
};

export type MessageType = "request" | "response" | "event" | "internal";

export type TimelineStep =
  | {
      type: "message";
      from: string;
      to: string;
      label: string;
      messageType?: MessageType;
      dashed?: boolean;
    }
  | {
      type: "note";
      actor: string;
      label: string;
      noteType?: "waiting" | "processing" | "blocked" | "info";
      /** span across to another actor */
      toActor?: string;
    }
  | {
      type: "group";
      label: string;
      /** "loop" | "alt" | "opt" */
      kind?: "loop" | "alt" | "opt";
      steps: TimelineStep[];
    };

export type SequenceDiagramProps = {
  title: string;
  description?: string;
  actors: Actor[];
  steps: TimelineStep[];
  /** auto-play speed in ms per step */
  autoPlaySpeed?: number;
};

// ─── Flatten steps (expand groups) for rendering ──────────────────────────────

type FlatStep = (
  | Extract<TimelineStep, { type: "message" | "note" }>
  | { type: "group-start"; label: string; kind?: string }
  | { type: "group-end" }
) & { depth: number };

function flattenSteps(steps: TimelineStep[], depth = 0): FlatStep[] {
  const result: FlatStep[] = [];
  for (const step of steps) {
    if (step.type === "group") {
      result.push({ type: "group-start", label: step.label, kind: step.kind, depth });
      result.push(...flattenSteps(step.steps, depth + 1));
      result.push({ type: "group-end", depth });
    } else {
      result.push({ ...step, depth });
    }
  }
  return result;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ActorIcon({ icon }: { icon?: Actor["icon"] }) {
  const base = "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold";
  switch (icon) {
    case "client":
      return <div className={cn(base, "bg-blue-500/20 text-blue-600 dark:text-blue-400")}>C</div>;
    case "server":
      return <div className={cn(base, "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400")}>S</div>;
    case "worker":
      return <div className={cn(base, "bg-purple-500/20 text-purple-600 dark:text-purple-400")}>W</div>;
    case "broker":
      return <div className={cn(base, "bg-amber-500/20 text-amber-600 dark:text-amber-400")}>B</div>;
    case "database":
      return <div className={cn(base, "bg-rose-500/20 text-rose-600 dark:text-rose-400")}>D</div>;
    case "proxy":
      return <div className={cn(base, "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400")}>P</div>;
    default:
      return <div className={cn(base, "bg-fd-secondary text-fd-foreground")}>●</div>;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SequenceDiagram({
  title,
  description,
  actors,
  steps,
  autoPlaySpeed = 1200,
}: SequenceDiagramProps) {
  const flat = flattenSteps(steps);
  const totalSteps = flat.length;

  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
    // If at end, restart
    setVisibleCount((c) => {
      if (c >= totalSteps) return 0;
      return c;
    });
  }, [totalSteps, stop]);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= totalSteps) {
          stop();
          return totalSteps;
        }
        return c + 1;
      });
    }, autoPlaySpeed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, autoPlaySpeed, totalSteps, stop]);

  const stepForward = () => {
    stop();
    setVisibleCount((c) => Math.min(c + 1, totalSteps));
  };
  const stepBack = () => {
    stop();
    setVisibleCount((c) => Math.max(c - 1, 0));
  };
  const reset = () => {
    stop();
    setVisibleCount(0);
  };
  const showAll = () => {
    stop();
    setVisibleCount(totalSteps);
  };

  // Build actor index for positioning
  const actorIndex = new Map(actors.map((a, i) => [a.id, i]));
  const actorCount = actors.length;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border bg-fd-card text-fd-card-foreground">
      {/* Header */}
      <div className="border-b bg-fd-secondary/40 px-4 py-3">
        <div className="text-sm font-semibold">{title}</div>
        {description && (
          <div className="mt-1 text-xs text-fd-muted-foreground">{description}</div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
        <button
          type="button"
          onClick={playing ? stop : play}
          className="rounded-md border bg-fd-primary px-3 py-1 text-xs font-medium text-fd-primary-foreground"
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          type="button"
          onClick={stepBack}
          className="rounded-md border px-2 py-1 text-xs"
          disabled={visibleCount === 0}
        >
          ◂ Back
        </button>
        <button
          type="button"
          onClick={stepForward}
          className="rounded-md border px-2 py-1 text-xs"
          disabled={visibleCount >= totalSteps}
        >
          Next ▸
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border px-2 py-1 text-xs"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={showAll}
          className="rounded-md border px-2 py-1 text-xs"
        >
          Show all
        </button>
        <span className="ml-auto text-xs text-fd-muted-foreground">
          {visibleCount} / {totalSteps}
        </span>
      </div>

      {/* Diagram */}
      <div className="overflow-x-auto p-4">
        <div className="relative min-w-[320px]" style={{ minHeight: `${totalSteps * 56 + 80}px` }}>
          {/* Actor headers */}
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: `repeat(${actorCount}, 1fr)` }}
          >
            {actors.map((actor) => (
              <div key={actor.id} className="flex flex-col items-center gap-1 pb-3">
                <ActorIcon icon={actor.icon} />
                <span className="text-xs font-medium text-fd-foreground">{actor.label}</span>
              </div>
            ))}
          </div>

          {/* Lifelines */}
          <div
            className="absolute left-0 right-0 grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${actorCount}, 1fr)`,
              top: "60px",
              bottom: "0",
            }}
          >
            {actors.map((actor) => (
              <div key={actor.id} className="flex justify-center">
                <div className="w-px bg-fd-border h-full" />
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="relative" style={{ paddingTop: "12px" }}>
            {flat.map((step, i) => {
              const visible = i < visibleCount;
              const isCurrent = i === visibleCount - 1;

              return (
                <div
                  key={i}
                  className={cn(
                    "relative transition-all duration-500 ease-out",
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                  )}
                  style={{ height: "52px" }}
                >
                  {step.type === "message" && (
                    <MessageRow
                      step={step}
                      actorIndex={actorIndex}
                      actorCount={actorCount}
                      isCurrent={isCurrent}
                    />
                  )}
                  {step.type === "note" && (
                    <NoteRow
                      step={step}
                      actorIndex={actorIndex}
                      actorCount={actorCount}
                      isCurrent={isCurrent}
                    />
                  )}
                  {step.type === "group-start" && (
                    <GroupStartRow step={step} isCurrent={isCurrent} />
                  )}
                  {step.type === "group-end" && <div />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Row renderers ────────────────────────────────────────────────────────────

function MessageRow({
  step,
  actorIndex,
  actorCount,
  isCurrent,
}: {
  step: Extract<FlatStep, { type: "message" }>;
  actorIndex: Map<string, number>;
  actorCount: number;
  isCurrent: boolean;
}) {
  const fromIdx = actorIndex.get(step.from) ?? 0;
  const toIdx = actorIndex.get(step.to) ?? 0;
  const leftIdx = Math.min(fromIdx, toIdx);
  const rightIdx = Math.max(fromIdx, toIdx);
  const goingRight = toIdx > fromIdx;

  // Position as percentage
  const colWidth = 100 / actorCount;
  const leftPct = leftIdx * colWidth + colWidth / 2;
  const rightPct = rightIdx * colWidth + colWidth / 2;

  const messageTypeColor = {
    request: "bg-blue-500",
    response: "bg-emerald-500",
    event: "bg-amber-500",
    internal: "bg-purple-500",
  }[step.messageType ?? "request"];

  const arrowColor = {
    request: "text-blue-500",
    response: "text-emerald-500",
    event: "text-amber-500",
    internal: "text-purple-500",
  }[step.messageType ?? "request"];

  const labelColor = {
    request: "text-blue-700 dark:text-blue-300",
    response: "text-emerald-700 dark:text-emerald-300",
    event: "text-amber-700 dark:text-amber-300",
    internal: "text-purple-700 dark:text-purple-300",
  }[step.messageType ?? "request"];

  return (
    <div
      className={cn("absolute inset-x-0 flex items-center", isCurrent && "z-10")}
      style={{ top: "12px", height: "28px" }}
    >
      {/* Arrow line */}
      <div
        className="absolute flex items-center"
        style={{
          left: `${leftPct}%`,
          width: `${rightPct - leftPct}%`,
        }}
      >
        {/* Line */}
        <div
          className={cn(
            "absolute inset-x-2 top-1/2 h-[2px] -translate-y-1/2",
            step.dashed ? "" : messageTypeColor,
            isCurrent && "animate-pulse",
          )}
          style={step.dashed ? {
            backgroundImage: `repeating-linear-gradient(90deg, currentColor 0, currentColor 6px, transparent 6px, transparent 12px)`,
            height: "2px",
          } : undefined}
        />
        {/* Arrowhead */}
        <div
          className={cn("absolute text-lg leading-none", arrowColor)}
          style={goingRight ? { right: "0" } : { left: "0" }}
        >
          {goingRight ? "▸" : "◂"}
        </div>
      </div>
      {/* Label */}
      <div
        className="absolute text-[11px] font-medium whitespace-nowrap"
        style={{
          left: `${(leftPct + rightPct) / 2}%`,
          transform: "translateX(-50%)",
          top: "-2px",
        }}
      >
        <span className={cn(labelColor, isCurrent && "font-bold")}>
          {step.label}
        </span>
      </div>
    </div>
  );
}

function NoteRow({
  step,
  actorIndex,
  actorCount,
  isCurrent,
}: {
  step: Extract<FlatStep, { type: "note" }>;
  actorIndex: Map<string, number>;
  actorCount: number;
  isCurrent: boolean;
}) {
  const idx = actorIndex.get(step.actor) ?? 0;
  const colWidth = 100 / actorCount;
  const centerPct = idx * colWidth + colWidth / 2;

  const noteColor = {
    waiting: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    processing: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    blocked: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-300",
    info: "border-fd-border bg-fd-secondary/30 text-fd-muted-foreground",
  }[step.noteType ?? "info"];

  // If spanning to another actor, make it wider
  const toIdx = step.toActor ? (actorIndex.get(step.toActor) ?? idx) : idx;
  const spanLeftIdx = Math.min(idx, toIdx);
  const spanRightIdx = Math.max(idx, toIdx);
  const leftPct = spanLeftIdx * colWidth + colWidth / 2 - colWidth * 0.3;
  const widthPct = (spanRightIdx - spanLeftIdx) * colWidth + colWidth * 0.6;

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        top: "8px",
        height: "36px",
        left: step.toActor ? `${leftPct}%` : `${centerPct - colWidth * 0.3}%`,
        width: step.toActor ? `${widthPct}%` : `${colWidth * 0.6}%`,
      }}
    >
      <div
        className={cn(
          "rounded-md border px-2 py-1 text-[10px] font-medium text-center leading-tight max-w-full truncate",
          noteColor,
          isCurrent && "ring-1 ring-fd-primary/30",
        )}
      >
        {step.label}
      </div>
    </div>
  );
}

function GroupStartRow({
  step,
  isCurrent,
}: {
  step: Extract<FlatStep, { type: "group-start" }>;
  isCurrent: boolean;
}) {
  return (
    <div className="absolute inset-x-4 flex items-center" style={{ top: "16px", height: "20px" }}>
      <div
        className={cn(
          "rounded border border-dashed border-fd-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-fd-muted-foreground",
          isCurrent && "border-fd-primary text-fd-primary",
        )}
      >
        {step.kind ?? "group"}: {step.label}
      </div>
      <div className="flex-1 ml-2 border-t border-dashed border-fd-border" />
    </div>
  );
}
