"use client";

import { useState } from "react";
import {
  SequenceDiagram,
  type Actor,
  type TimelineStep,
} from "@/components/mdx/sequence-diagram";
import {
  buildSseStream,
  calculateShortPollingLoad,
  calculateSidecarFlow,
  comparePushPattern,
  type DeliverySemantic,
  describeSyncAsync,
  evaluateSessionState,
  getLongPollingStages,
  getPubSubFlow,
  type LongPollingOutcome,
  type MuxTransport,
  type PubSubMode,
  type PushPattern,
  type RequestMessagePart,
  requestMessageParts,
  type SessionDesign,
  type SyncAsyncMode,
  simulateMuxTransport,
  type Tone,
} from "@/components/mdx/backend-communication-labs";
import {
  DiagramShell,
  PrimaryButton,
  RangeControl,
  SecondaryButton,
  Stage,
  Stat,
  ToggleButton,
  ToggleRow,
} from "@/components/mdx/interactive-lab-ui";
import { cn } from "@/lib/utils";

// ─── Request/Response ─────────────────────────────────────────────────────────

const rrActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "server", label: "Server", icon: "server" },
];

const rrSteps: TimelineStep[] = [
  { type: "message", from: "client", to: "server", label: "GET /users/42", messageType: "request" },
  { type: "note", actor: "server", label: "Parse, validate, authorize", noteType: "processing" },
  { type: "note", actor: "server", label: "Execute business logic", noteType: "processing" },
  { type: "message", from: "server", to: "client", label: "200 OK + JSON body", messageType: "response" },
];

export function RequestResponseDiagram() {
  return (
    <SequenceDiagram
      title="Request/Response pattern"
      description="One request produces exactly one response. Step through to see the full lifecycle."
      actors={rrActors}
      steps={rrSteps}
      autoPlaySpeed={1000}
    />
  );
}

// Keep the inspector too — it teaches message anatomy
export function RequestResponseInspector() {
  const [part, setPart] = useState<RequestMessagePart>("method");
  const selected = requestMessageParts[part];

  return (
    <DiagramShell
      title="Message anatomy"
      description="Click a part of the protocol message to see what job it performs."
    >
      <ToggleRow
        value={part}
        onChange={setPart}
        options={(Object.keys(requestMessageParts) as RequestMessagePart[]).map(
          (value) => ({ value, label: requestMessageParts[value].label }),
        )}
      />
      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border bg-fd-secondary/20 p-3 font-mono text-sm leading-7">
          <div className={cn(part === "method" && "text-fd-primary font-semibold")}>
            GET /users/42 HTTP/1.1
          </div>
          <div className={cn(part === "headers" && "text-fd-primary font-semibold")}>
            Host: api.example.com
          </div>
          <div className={cn(part === "headers" && "text-fd-primary font-semibold")}>
            Accept: application/json
          </div>
          <div className={cn(part === "boundary" && "text-fd-primary font-semibold")}>
            [blank line]
          </div>
          <div className={cn(part === "body" && "text-fd-primary font-semibold")}>
            {'{"id":42,"name":"Ada"}'}
          </div>
          <div className="mt-4 border-t pt-4" />
          <div className={cn(part === "status" && "text-fd-primary font-semibold")}>
            HTTP/1.1 200 OK
          </div>
          <div className={cn(part === "headers" && "text-fd-primary font-semibold")}>
            Content-Type: application/json
          </div>
          <div className={cn(part === "boundary" && "text-fd-primary font-semibold")}>
            [blank line]
          </div>
          <div className={cn(part === "body" && "text-fd-primary font-semibold")}>
            {'{"id":42,"name":"Ada"}'}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">
            Selected part
          </div>
          <div className="mt-1 text-lg font-semibold">{selected.label}</div>
          <div className="mt-3 text-sm font-mono text-fd-primary">{selected.example}</div>
          <p className="mt-3 text-sm text-fd-muted-foreground">{selected.why}</p>
        </div>
      </div>
    </DiagramShell>
  );
}

// ─── Short Polling ────────────────────────────────────────────────────────────

const spActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "server", label: "Server", icon: "server" },
];

const spSteps: TimelineStep[] = [
  { type: "message", from: "client", to: "server", label: "POST /jobs", messageType: "request" },
  { type: "message", from: "server", to: "client", label: "202 Accepted + jobId", messageType: "response" },
  {
    type: "group",
    label: "Every N seconds",
    kind: "loop",
    steps: [
      { type: "message", from: "client", to: "server", label: "GET /jobs/123 (poll)", messageType: "request" },
      { type: "message", from: "server", to: "client", label: '{"status": "pending"}', messageType: "response", dashed: true },
      { type: "message", from: "client", to: "server", label: "GET /jobs/123 (poll)", messageType: "request" },
      { type: "message", from: "server", to: "client", label: '{"status": "pending"}', messageType: "response", dashed: true },
      { type: "message", from: "client", to: "server", label: "GET /jobs/123 (poll)", messageType: "request" },
      { type: "message", from: "server", to: "client", label: '{"status": "done", ...}', messageType: "response" },
    ],
  },
];

export function ShortPollingDiagram() {
  return (
    <SequenceDiagram
      title="Short Polling pattern"
      description="Client repeatedly asks. Most responses are empty. Watch how many wasted round-trips happen before the real answer arrives."
      actors={spActors}
      steps={spSteps}
      autoPlaySpeed={900}
    />
  );
}

export function ShortPollingCalculator() {
  const [clients, setClients] = useState(50000);
  const [interval, setInterval] = useState(2);
  const [eventEvery, setEventEvery] = useState(30);
  const load = calculateShortPollingLoad({ clients, intervalSeconds: interval, eventEverySeconds: eventEvery });

  return (
    <DiagramShell
      title="Short polling load calculator"
      description="Drag the sliders to feel how quickly request volume rises, even when most polls return nothing new."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <RangeControl label={`Clients: ${clients.toLocaleString()}`} min={1000} max={100000} step={1000} value={clients} onChange={(v) => setClients(Number(v))} />
        <RangeControl label={`Poll interval: ${interval}s`} min={1} max={10} step={1} value={interval} onChange={(v) => setInterval(Number(v))} />
        <RangeControl label={`Real event every: ${eventEvery}s`} min={5} max={60} step={5} value={eventEvery} onChange={(v) => setEventEvery(Number(v))} />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Requests / second" value={load.requestsPerSecond.toFixed(0)} tone={load.requestsTone} />
        <Stat label="Useful responses / sec" value={load.usefulResponsesPerSecond.toFixed(0)} tone="good" />
        <Stat label="Empty responses / sec" value={load.emptyResponsesPerSecond.toFixed(0)} tone={load.emptyTone} />
        <Stat label="Avg staleness" value={`${load.averageStalenessSeconds.toFixed(1)}s`} tone="warn" />
      </div>
    </DiagramShell>
  );
}

// ─── Long Polling ─────────────────────────────────────────────────────────────

const lpActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "server", label: "Server", icon: "server" },
];

function buildLongPollingSteps(outcome: LongPollingOutcome): TimelineStep[] {
  if (outcome === "event") {
    return [
      { type: "message", from: "client", to: "server", label: "GET /events?after=1042", messageType: "request" },
      { type: "note", actor: "server", label: "⏳ Hold connection open... waiting for data", noteType: "waiting" },
      { type: "note", actor: "server", label: "✓ New event arrived!", noteType: "processing" },
      { type: "message", from: "server", to: "client", label: "200 OK + event data", messageType: "response" },
      { type: "message", from: "client", to: "server", label: "GET /events?after=1043 (reconnect)", messageType: "request" },
      { type: "note", actor: "server", label: "⏳ Holding again...", noteType: "waiting" },
    ];
  }
  return [
    { type: "message", from: "client", to: "server", label: "GET /events?after=1042", messageType: "request" },
    { type: "note", actor: "server", label: "⏳ Hold connection open... waiting for data", noteType: "waiting" },
    { type: "note", actor: "server", label: "⏰ Timeout reached, no new data", noteType: "blocked" },
    { type: "message", from: "server", to: "client", label: "204 No Content", messageType: "response", dashed: true },
    { type: "message", from: "client", to: "server", label: "GET /events?after=1042 (reconnect)", messageType: "request" },
    { type: "note", actor: "server", label: "⏳ Holding again...", noteType: "waiting" },
  ];
}

export function LongPollingTimeline() {
  const [outcome, setOutcome] = useState<LongPollingOutcome>("event");

  return (
    <div className="not-prose my-6 space-y-2">
      <div className="flex gap-2 px-1">
        <button
          type="button"
          onClick={() => setOutcome("event")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            outcome === "event"
              ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
              : "hover:bg-fd-accent",
          )}
        >
          Event arrives
        </button>
        <button
          type="button"
          onClick={() => setOutcome("timeout")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            outcome === "timeout"
              ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
              : "hover:bg-fd-accent",
          )}
        >
          Timeout first
        </button>
      </div>
      <SequenceDiagram
        title={outcome === "event" ? "Long Polling — event arrives" : "Long Polling — timeout"}
        description={
          outcome === "event"
            ? "Server holds the connection until real data arrives, then responds immediately."
            : "No data before timeout. Server sends empty response, client reconnects."
        }
        actors={lpActors}
        steps={buildLongPollingSteps(outcome)}
        autoPlaySpeed={1100}
      />
    </div>
  );
}

// ─── SSE ──────────────────────────────────────────────────────────────────────

const sseActors: Actor[] = [
  { id: "client", label: "Browser", icon: "client" },
  { id: "server", label: "Server", icon: "server" },
];

const sseSteps: TimelineStep[] = [
  { type: "message", from: "client", to: "server", label: "GET /stream (Accept: text/event-stream)", messageType: "request" },
  { type: "message", from: "server", to: "client", label: "200 OK, Transfer-Encoding: chunked", messageType: "response" },
  { type: "note", actor: "server", label: "Connection stays open", noteType: "info", toActor: "client" },
  { type: "message", from: "server", to: "client", label: "id:1 data:{\"msg\":\"hello\"}", messageType: "event" },
  { type: "message", from: "server", to: "client", label: "id:2 data:{\"msg\":\"world\"}", messageType: "event" },
  { type: "note", actor: "client", label: "❌ Connection drops!", noteType: "blocked" },
  { type: "message", from: "client", to: "server", label: "GET /stream (Last-Event-ID: 2)", messageType: "request" },
  { type: "message", from: "server", to: "client", label: "200 OK (resume from id:2)", messageType: "response" },
  { type: "message", from: "server", to: "client", label: "id:3 data:{\"msg\":\"resumed\"}", messageType: "event" },
];

export function SSEStreamBuilder() {
  const [includeId, setIncludeId] = useState(true);
  const [includeEvent, setIncludeEvent] = useState(true);
  const [includeRetry, setIncludeRetry] = useState(false);
  const [dropped, setDropped] = useState(false);
  const stream = buildSseStream({ includeId, includeEvent, includeRetry, dropped });

  return (
    <div className="not-prose my-6 space-y-4">
      <SequenceDiagram
        title="Server-Sent Events flow"
        description="One HTTP request opens a persistent stream. Server pushes events as they happen. On disconnect, the browser auto-reconnects with Last-Event-ID."
        actors={sseActors}
        steps={sseSteps}
        autoPlaySpeed={1000}
      />
      <DiagramShell
        title="SSE wire format explorer"
        description="Toggle fields on/off, simulate a disconnect, and see how the browser can resume."
      >
        <div className="flex flex-wrap gap-2 text-sm">
          <ToggleButton active={includeId} onClick={() => setIncludeId((v) => !v)}>id:</ToggleButton>
          <ToggleButton active={includeEvent} onClick={() => setIncludeEvent((v) => !v)}>event:</ToggleButton>
          <ToggleButton active={includeRetry} onClick={() => setIncludeRetry((v) => !v)}>retry:</ToggleButton>
          <ToggleButton active={dropped} onClick={() => setDropped((v) => !v)} tone="warn">
            {dropped ? "Reconnect" : "Drop connection"}
          </ToggleButton>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <pre className="overflow-x-auto rounded-lg border bg-fd-secondary/20 p-4 text-sm">{stream.raw}</pre>
          <div className="space-y-3 rounded-lg border p-4 text-sm">
            <div>
              <div className="font-medium">Client state</div>
              <div className="text-fd-muted-foreground">{stream.clientState}</div>
            </div>
            <div>
              <div className="font-medium">Reconnect header</div>
              <div className="mt-1 rounded-md bg-fd-secondary/30 p-2 font-mono text-xs">{stream.reconnectHeader}</div>
            </div>
          </div>
        </div>
      </DiagramShell>
    </div>
  );
}

// ─── Push / WebSocket ─────────────────────────────────────────────────────────

const pushActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "server", label: "Server", icon: "server" },
];

const wsPushSteps: TimelineStep[] = [
  { type: "message", from: "client", to: "server", label: "HTTP Upgrade: websocket", messageType: "request" },
  { type: "message", from: "server", to: "client", label: "101 Switching Protocols", messageType: "response" },
  { type: "note", actor: "server", label: "Persistent bidirectional channel open", noteType: "info", toActor: "client" },
  { type: "message", from: "server", to: "client", label: "event: user.online", messageType: "event" },
  { type: "message", from: "server", to: "client", label: "event: message.created", messageType: "event" },
  { type: "message", from: "client", to: "server", label: "ack: message.created", messageType: "request" },
  { type: "message", from: "server", to: "client", label: "event: typing.started", messageType: "event" },
];

export function PushPatternExplorer() {
  const [pattern, setPattern] = useState<PushPattern>("websocket");
  const [eventsPerMinute, setEventsPerMinute] = useState(30);
  const stats = comparePushPattern({ pattern, eventsPerMinute });

  return (
    <div className="not-prose my-6 space-y-4">
      <SequenceDiagram
        title="Push (WebSocket) pattern"
        description="After the handshake, either side can send at any time. No repeated requests needed."
        actors={pushActors}
        steps={wsPushSteps}
        autoPlaySpeed={1000}
      />
      <DiagramShell
        title="Pattern comparison"
        description="Compare how much idle chatter each approach creates."
      >
        <ToggleRow
          value={pattern}
          onChange={setPattern}
          options={[
            { value: "polling", label: "Polling" },
            { value: "sse", label: "SSE" },
            { value: "websocket", label: "WebSocket" },
          ]}
        />
        <RangeControl
          label={`Useful events per minute: ${eventsPerMinute}`}
          min={5} max={60} step={5} value={eventsPerMinute}
          onChange={(v) => setEventsPerMinute(Number(v))}
        />
        <div className="grid gap-3 md:grid-cols-3">
          <Stat label="Client requests / min" value={String(stats.clientRequests)} tone={stats.clientRequestsTone} />
          <Stat label="Server updates / min" value={String(stats.serverMessages)} tone="good" />
          <Stat label="Who can speak" value={stats.whoCanSpeak} tone="warn" />
        </div>
        <p className="text-sm text-fd-muted-foreground">{stats.note}</p>
      </DiagramShell>
    </div>
  );
}

// ─── Pub/Sub ──────────────────────────────────────────────────────────────────

const pubsubActors: Actor[] = [
  { id: "publisher", label: "Publisher", icon: "client" },
  { id: "broker", label: "Broker", icon: "broker" },
  { id: "sub1", label: "Email Svc", icon: "server" },
  { id: "sub2", label: "Analytics", icon: "server" },
  { id: "sub3", label: "Fraud", icon: "server" },
];

const pubsubSteps: TimelineStep[] = [
  { type: "message", from: "publisher", to: "broker", label: "publish: order.created", messageType: "request" },
  { type: "note", actor: "broker", label: "Route to all subscribers of topic", noteType: "processing" },
  { type: "message", from: "broker", to: "sub1", label: "deliver: order.created", messageType: "event" },
  { type: "message", from: "broker", to: "sub2", label: "deliver: order.created", messageType: "event" },
  { type: "message", from: "broker", to: "sub3", label: "deliver: order.created", messageType: "event" },
  { type: "message", from: "sub1", to: "broker", label: "ack", messageType: "response", dashed: true },
  { type: "message", from: "sub2", to: "broker", label: "ack", messageType: "response", dashed: true },
  { type: "message", from: "sub3", to: "broker", label: "ack", messageType: "response", dashed: true },
];

export function PubSubFlowLab() {
  const [mode, setMode] = useState<PubSubMode>("pubsub");
  const [semantic, setSemantic] = useState<DeliverySemantic>("at-least-once");
  const [subscribers, setSubscribers] = useState([true, true, true]);
  const [publishCount, setPublishCount] = useState(0);
  const flow = getPubSubFlow({ mode, semantic, subscribers, publishCount });

  const queueActors: Actor[] = [
    { id: "publisher", label: "Producer", icon: "client" },
    { id: "broker", label: "Queue", icon: "broker" },
    { id: "sub1", label: "Worker A", icon: "worker" },
    { id: "sub2", label: "Worker B", icon: "worker" },
    { id: "sub3", label: "Worker C", icon: "worker" },
  ];

  const queueSteps: TimelineStep[] = [
    { type: "message", from: "publisher", to: "broker", label: "enqueue: job_1", messageType: "request" },
    { type: "note", actor: "broker", label: "Route to ONE available worker", noteType: "processing" },
    { type: "message", from: "broker", to: "sub1", label: "deliver: job_1", messageType: "event" },
    { type: "note", actor: "sub2", label: "idle (not chosen)", noteType: "info" },
    { type: "note", actor: "sub3", label: "idle (not chosen)", noteType: "info" },
    { type: "message", from: "sub1", to: "broker", label: "ack: done", messageType: "response", dashed: true },
  ];

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex gap-2 px-1">
        <button
          type="button"
          onClick={() => setMode("pubsub")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            mode === "pubsub" ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
          )}
        >
          Pub/Sub (fanout)
        </button>
        <button
          type="button"
          onClick={() => setMode("queue")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            mode === "queue" ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
          )}
        >
          Work Queue (single)
        </button>
      </div>
      <SequenceDiagram
        title={mode === "pubsub" ? "Pub/Sub — one event fans out to ALL subscribers" : "Work Queue — one message goes to ONE worker"}
        description={
          mode === "pubsub"
            ? "The publisher doesn't know who receives. The broker routes to every active subscriber."
            : "The queue delivers each message to exactly one worker. Others stay idle."
        }
        actors={mode === "pubsub" ? pubsubActors : queueActors}
        steps={mode === "pubsub" ? pubsubSteps : queueSteps}
        autoPlaySpeed={900}
      />
      <DiagramShell
        title="Delivery semantics lab"
        description="Publish events and observe how delivery changes under different semantics."
      >
        <ToggleRow
          value={semantic}
          onChange={setSemantic}
          options={[
            { value: "at-most-once", label: "At most once" },
            { value: "at-least-once", label: "At least once" },
            { value: "exactly-once", label: "Exactly once" },
          ]}
        />
        <div className="grid gap-3 md:grid-cols-3">
          {flow.names.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => setSubscribers((c) => c.map((v, i) => (i === index ? !v : v)))}
              className={cn(
                "rounded-lg border p-3 text-left",
                subscribers[index] ? "border-fd-primary bg-fd-primary/10" : "opacity-50",
              )}
            >
              <div className="font-medium">{name}</div>
              <div className="text-sm text-fd-muted-foreground">{subscribers[index] ? "Active" : "Disabled"}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton onClick={() => setPublishCount((c) => c + 1)}>Publish event</PrimaryButton>
          <SecondaryButton onClick={() => setPublishCount(0)}>Reset</SecondaryButton>
          <span className="text-sm text-fd-muted-foreground">
            {publishCount === 0 ? "No event published yet." : `Latest: ${flow.eventId}`}
          </span>
        </div>
        {publishCount > 0 && (
          <div className="rounded-lg border p-4 text-sm">
            <div className="font-medium">Observed delivery</div>
            {flow.deliveries.length === 0 ? (
              <div className="mt-2 text-fd-muted-foreground">No active consumers.</div>
            ) : (
              <ul className="mt-2 space-y-1 text-fd-muted-foreground">
                {flow.deliveries.map((d) => (
                  <li key={d.key}>{d.receiver} received {flow.eventId}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DiagramShell>
    </div>
  );
}

// ─── Multiplexing ─────────────────────────────────────────────────────────────

const muxH2Actors: Actor[] = [
  { id: "client", label: "Browser", icon: "client" },
  { id: "tcp", label: "TCP Connection", icon: "proxy" },
  { id: "server", label: "Server", icon: "server" },
];

const muxH2Steps: TimelineStep[] = [
  { type: "message", from: "client", to: "tcp", label: "Stream 1: GET /index.html", messageType: "request" },
  { type: "message", from: "client", to: "tcp", label: "Stream 3: GET /style.css", messageType: "request" },
  { type: "message", from: "client", to: "tcp", label: "Stream 5: GET /app.js", messageType: "request" },
  { type: "note", actor: "tcp", label: "All streams share ONE TCP connection", noteType: "info" },
  { type: "message", from: "tcp", to: "server", label: "Frames interleaved by stream ID", messageType: "internal" },
  { type: "note", actor: "tcp", label: "⚠ Packet lost! TCP stalls ALL streams", noteType: "blocked" },
  { type: "note", actor: "client", label: "Stream 1: waiting...", noteType: "blocked" },
  { type: "note", actor: "client", label: "Stream 3: waiting... (head-of-line block)", noteType: "blocked" },
];

const muxH3Actors: Actor[] = [
  { id: "client", label: "Browser", icon: "client" },
  { id: "quic", label: "QUIC/UDP", icon: "proxy" },
  { id: "server", label: "Server", icon: "server" },
];

const muxH3Steps: TimelineStep[] = [
  { type: "message", from: "client", to: "quic", label: "Stream 1: GET /index.html", messageType: "request" },
  { type: "message", from: "client", to: "quic", label: "Stream 2: GET /style.css", messageType: "request" },
  { type: "message", from: "client", to: "quic", label: "Stream 3: GET /app.js", messageType: "request" },
  { type: "note", actor: "quic", label: "Each stream is independently reliable", noteType: "info" },
  { type: "message", from: "quic", to: "server", label: "Independent QUIC streams", messageType: "internal" },
  { type: "note", actor: "quic", label: "⚠ Packet lost in Stream 1 only", noteType: "blocked" },
  { type: "note", actor: "client", label: "Stream 1: waiting for retransmit", noteType: "blocked" },
  { type: "note", actor: "client", label: "Stream 2 & 3: still flowing! ✓", noteType: "processing" },
];

export function MuxTransportLab() {
  const [transport, setTransport] = useState<MuxTransport>("http2");

  return (
    <div className="not-prose my-6 space-y-2">
      <div className="flex gap-2 px-1">
        <button
          type="button"
          onClick={() => setTransport("http2")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            transport === "http2" ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
          )}
        >
          HTTP/2 over TCP
        </button>
        <button
          type="button"
          onClick={() => setTransport("http3")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            transport === "http3" ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
          )}
        >
          HTTP/3 over QUIC
        </button>
      </div>
      <SequenceDiagram
        title={transport === "http2" ? "HTTP/2 — head-of-line blocking on packet loss" : "HTTP/3 — independent streams survive loss"}
        description={
          transport === "http2"
            ? "All streams share one TCP byte sequence. One lost packet stalls everything."
            : "Each QUIC stream is independently reliable. Loss in one doesn't block others."
        }
        actors={transport === "http2" ? muxH2Actors : muxH3Actors}
        steps={transport === "http2" ? muxH2Steps : muxH3Steps}
        autoPlaySpeed={1000}
      />
    </div>
  );
}

// ─── Stateful/Stateless ───────────────────────────────────────────────────────

const sessionActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "lb", label: "Load Balancer", icon: "proxy" },
  { id: "server1", label: "Instance A", icon: "server" },
  { id: "server2", label: "Instance B", icon: "server" },
];

function buildSessionSteps(design: SessionDesign, restarted: boolean): TimelineStep[] {
  if (design === "memory") {
    const steps: TimelineStep[] = [
      { type: "message", from: "client", to: "lb", label: "POST /login", messageType: "request" },
      { type: "message", from: "lb", to: "server1", label: "route to Instance A", messageType: "internal" },
      { type: "note", actor: "server1", label: "Store session in process memory", noteType: "processing" },
      { type: "message", from: "server1", to: "client", label: "Set-Cookie: sid=abc", messageType: "response" },
    ];
    if (restarted) {
      steps.push(
        { type: "note", actor: "server1", label: "💥 Instance A crashes/restarts!", noteType: "blocked" },
        { type: "message", from: "client", to: "lb", label: "GET /dashboard (Cookie: sid=abc)", messageType: "request" },
        { type: "message", from: "lb", to: "server2", label: "route to Instance B", messageType: "internal" },
        { type: "note", actor: "server2", label: "❌ No session found! → 401", noteType: "blocked" },
        { type: "message", from: "server2", to: "client", label: "401 Unauthorized", messageType: "response", dashed: true },
      );
    } else {
      steps.push(
        { type: "message", from: "client", to: "lb", label: "GET /dashboard (Cookie: sid=abc)", messageType: "request" },
        { type: "message", from: "lb", to: "server1", label: "sticky → same instance", messageType: "internal" },
        { type: "note", actor: "server1", label: "✓ Session found in memory", noteType: "processing" },
        { type: "message", from: "server1", to: "client", label: "200 OK", messageType: "response" },
      );
    }
    return steps;
  }
  if (design === "redis") {
    return [
      { type: "message", from: "client", to: "lb", label: "POST /login", messageType: "request" },
      { type: "message", from: "lb", to: "server1", label: "route to any instance", messageType: "internal" },
      { type: "note", actor: "server1", label: "Store session in Redis (external)", noteType: "processing" },
      { type: "message", from: "server1", to: "client", label: "Set-Cookie: sid=abc", messageType: "response" },
      { type: "note", actor: "server1", label: restarted ? "💥 Instance restarts" : "Instance running", noteType: restarted ? "blocked" : "info" },
      { type: "message", from: "client", to: "lb", label: "GET /dashboard (Cookie: sid=abc)", messageType: "request" },
      { type: "message", from: "lb", to: "server2", label: "route to ANY instance", messageType: "internal" },
      { type: "note", actor: "server2", label: "✓ Fetch session from Redis", noteType: "processing" },
      { type: "message", from: "server2", to: "client", label: "200 OK", messageType: "response" },
    ];
  }
  // JWT
  return [
    { type: "message", from: "client", to: "lb", label: "POST /login", messageType: "request" },
    { type: "message", from: "lb", to: "server1", label: "route to any instance", messageType: "internal" },
    { type: "note", actor: "server1", label: "Sign JWT with user claims", noteType: "processing" },
    { type: "message", from: "server1", to: "client", label: "200 + JWT token", messageType: "response" },
    { type: "note", actor: "server1", label: restarted ? "💥 Instance restarts" : "Instance running", noteType: restarted ? "blocked" : "info" },
    { type: "message", from: "client", to: "lb", label: "GET /dashboard (Bearer JWT)", messageType: "request" },
    { type: "message", from: "lb", to: "server2", label: "route to ANY instance", messageType: "internal" },
    { type: "note", actor: "server2", label: "✓ Verify JWT signature (no lookup needed)", noteType: "processing" },
    { type: "message", from: "server2", to: "client", label: "200 OK", messageType: "response" },
  ];
}

export function StatefulSessionLab() {
  const [design, setDesign] = useState<SessionDesign>("memory");
  const [restarted, setRestarted] = useState(false);

  return (
    <div className="not-prose my-6 space-y-2">
      <div className="flex flex-wrap gap-2 px-1">
        {(["memory", "redis", "jwt"] as SessionDesign[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => { setDesign(d); setRestarted(false); }}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              design === d ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
            )}
          >
            {d === "memory" ? "Server Memory" : d === "redis" ? "Redis/DB" : "JWT"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRestarted((v) => !v)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors ml-2",
            restarted ? "border-red-500 bg-red-500/10 text-red-600" : "hover:bg-fd-accent",
          )}
        >
          {restarted ? "💥 Instance Crashed" : "Crash Instance"}
        </button>
      </div>
      <SequenceDiagram
        title={`Session: ${design === "memory" ? "Server Memory" : design === "redis" ? "External Store (Redis)" : "Client Token (JWT)"}${restarted ? " — after crash" : ""}`}
        description={
          design === "memory" && restarted
            ? "Session state was in process memory. It's gone. The next request fails."
            : design === "memory"
              ? "Session lives in one process. Works only if requests always hit the same instance."
              : design === "redis"
                ? "Session is in Redis. Any instance can serve any request."
                : "State is in the signed token. Server is truly stateless."
        }
        actors={sessionActors}
        steps={buildSessionSteps(design, restarted)}
        autoPlaySpeed={900}
      />
    </div>
  );
}

// ─── Sync/Async ───────────────────────────────────────────────────────────────

const syncActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "server", label: "Server", icon: "server" },
];

const asyncActors: Actor[] = [
  { id: "client", label: "Client", icon: "client" },
  { id: "server", label: "API Server", icon: "server" },
  { id: "worker", label: "Worker", icon: "worker" },
];

const syncSteps: TimelineStep[] = [
  { type: "message", from: "client", to: "server", label: "POST /checkout", messageType: "request" },
  { type: "note", actor: "server", label: "Validate cart", noteType: "processing" },
  { type: "note", actor: "server", label: "Charge card (slow!)", noteType: "waiting" },
  { type: "note", actor: "server", label: "Write order to DB", noteType: "processing" },
  { type: "note", actor: "client", label: "⏳ Blocked... waiting...", noteType: "blocked" },
  { type: "message", from: "server", to: "client", label: "200 OK + order details", messageType: "response" },
];

const asyncSteps: TimelineStep[] = [
  { type: "message", from: "client", to: "server", label: "POST /exports", messageType: "request" },
  { type: "note", actor: "server", label: "Validate + enqueue job", noteType: "processing" },
  { type: "message", from: "server", to: "client", label: "202 Accepted + jobId", messageType: "response" },
  { type: "note", actor: "client", label: "✓ Free to do other work!", noteType: "processing" },
  { type: "message", from: "server", to: "worker", label: "job: generate export", messageType: "internal" },
  { type: "note", actor: "worker", label: "Processing in background...", noteType: "waiting" },
  { type: "note", actor: "worker", label: "Done! Upload file, mark complete", noteType: "processing" },
  { type: "message", from: "client", to: "server", label: "GET /jobs/123 (check status)", messageType: "request" },
  { type: "message", from: "server", to: "client", label: '{"status":"done","url":"..."}', messageType: "response" },
];

export function SyncAsyncLab() {
  const [mode, setMode] = useState<SyncAsyncMode>("sync");

  return (
    <div className="not-prose my-6 space-y-2">
      <div className="flex gap-2 px-1">
        <button
          type="button"
          onClick={() => setMode("sync")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            mode === "sync" ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
          )}
        >
          Synchronous
        </button>
        <button
          type="button"
          onClick={() => setMode("async")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            mode === "async" ? "border-fd-primary bg-fd-primary text-fd-primary-foreground" : "hover:bg-fd-accent",
          )}
        >
          Asynchronous
        </button>
      </div>
      <SequenceDiagram
        title={mode === "sync" ? "Synchronous — caller is BLOCKED until done" : "Asynchronous — caller is FREE immediately"}
        description={
          mode === "sync"
            ? "The client cannot do anything until the server finishes all work and responds."
            : "The server accepts the job and responds fast. Work happens in background. Client checks later."
        }
        actors={mode === "sync" ? syncActors : asyncActors}
        steps={mode === "sync" ? syncSteps : asyncSteps}
        autoPlaySpeed={1000}
      />
    </div>
  );
}

// ─── Sidecar ──────────────────────────────────────────────────────────────────

const sidecarActors: Actor[] = [
  { id: "appA", label: "App A", icon: "client" },
  { id: "sidecarA", label: "Sidecar A", icon: "proxy" },
  { id: "sidecarB", label: "Sidecar B", icon: "proxy" },
  { id: "appB", label: "App B", icon: "server" },
];

const sidecarSteps: TimelineStep[] = [
  { type: "message", from: "appA", to: "sidecarA", label: "HTTP call to App B", messageType: "request" },
  { type: "note", actor: "sidecarA", label: "Add mTLS + trace headers", noteType: "processing" },
  { type: "message", from: "sidecarA", to: "sidecarB", label: "Encrypted request + tracing", messageType: "internal" },
  { type: "note", actor: "sidecarB", label: "Verify mTLS, extract trace", noteType: "processing" },
  { type: "message", from: "sidecarB", to: "appB", label: "Plain HTTP to localhost", messageType: "request" },
  { type: "note", actor: "appB", label: "Business logic (no TLS code!)", noteType: "processing" },
  { type: "message", from: "appB", to: "sidecarB", label: "200 OK response", messageType: "response" },
  { type: "message", from: "sidecarB", to: "sidecarA", label: "Encrypted response", messageType: "internal" },
  { type: "message", from: "sidecarA", to: "appA", label: "200 OK response", messageType: "response" },
];

export function SidecarFlowLab() {
  const [mtls, setMtls] = useState(true);
  const [tracing, setTracing] = useState(true);
  const [retries, setRetries] = useState(2);
  const [failureRate, setFailureRate] = useState(50);
  const flow = calculateSidecarFlow({ mtls, tracing, retries, failureRate });

  return (
    <div className="not-prose my-6 space-y-4">
      <SequenceDiagram
        title="Sidecar pattern — transparent infrastructure"
        description="App A just makes a plain HTTP call. The sidecars handle mTLS, tracing, retries, and observability transparently."
        actors={sidecarActors}
        steps={sidecarSteps}
        autoPlaySpeed={900}
      />
      <DiagramShell
        title="Retry amplification calculator"
        description="When sidecars retry, failures can multiply traffic exponentially."
      >
        <div className="flex flex-wrap gap-2 text-sm">
          <ToggleButton active={mtls} onClick={() => setMtls((v) => !v)}>mTLS</ToggleButton>
          <ToggleButton active={tracing} onClick={() => setTracing((v) => !v)}>Tracing</ToggleButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <RangeControl label={`Retries per hop: ${retries}`} min={0} max={4} step={1} value={retries} onChange={(v) => setRetries(Number(v))} />
          <RangeControl label={`Failure rate: ${failureRate}%`} min={0} max={100} step={10} value={failureRate} onChange={(v) => setFailureRate(Number(v))} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Stat label="Expected attempts / hop" value={(flow.attemptsPerHop as number).toFixed(1)} tone={flow.attemptsPerHopTone as Tone} />
          <Stat label="Total attempts (both hops)" value={(flow.totalAttempts as number).toFixed(1)} tone={flow.totalAttemptsTone as Tone} />
        </div>
      </DiagramShell>
    </div>
  );
}
