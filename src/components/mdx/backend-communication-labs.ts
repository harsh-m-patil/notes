export type Tone = "default" | "good" | "warn" | "bad";
export type StageState = "idle" | "active" | "done" | "blocked";

export type StageSpec = {
  title: string;
  detail: string;
  state: StageState;
};

export const requestMessageParts = {
  method: {
    label: "Method + path",
    example: "GET /users/42 HTTP/1.1",
    why: "Tells the server what resource the client wants and what kind of action it intends.",
  },
  headers: {
    label: "Headers",
    example: "Host, Accept, Content-Type, Authorization",
    why: "Carry metadata so both sides know how to route, parse, cache, and secure the message.",
  },
  body: {
    label: "Body",
    example: '{"id":42,"name":"Ada"}',
    why: "Carries the actual payload when the request or response needs content.",
  },
  status: {
    label: "Status line",
    example: "HTTP/1.1 200 OK",
    why: "Tells the client how the server thinks the request ended: success, retry, auth failure, and so on.",
  },
  boundary: {
    label: "Message boundary",
    example: "blank line + content length / end of body",
    why: "Without a boundary, the receiver cannot know where one message ends and the next begins.",
  },
} as const;

export type RequestMessagePart = keyof typeof requestMessageParts;

export function calculateShortPollingLoad({
  clients,
  intervalSeconds,
  eventEverySeconds,
}: {
  clients: number;
  intervalSeconds: number;
  eventEverySeconds: number;
}) {
  const requestsPerSecond = clients / intervalSeconds;
  const usefulRatio = Math.min(1, intervalSeconds / eventEverySeconds);
  const usefulResponsesPerSecond = requestsPerSecond * usefulRatio;
  const emptyResponsesPerSecond = Math.max(
    0,
    requestsPerSecond - usefulResponsesPerSecond,
  );
  const averageStalenessSeconds = intervalSeconds / 2;

  return {
    requestsPerSecond,
    usefulResponsesPerSecond,
    emptyResponsesPerSecond,
    averageStalenessSeconds,
    requestsTone:
      requestsPerSecond > 20000
        ? "bad"
        : requestsPerSecond > 10000
          ? "warn"
          : "good",
    emptyTone:
      emptyResponsesPerSecond > usefulResponsesPerSecond ? "bad" : "warn",
  } satisfies Record<string, number | Tone>;
}

export type LongPollingOutcome = "event" | "timeout";

export function getLongPollingStages(outcome: LongPollingOutcome): StageSpec[] {
  const eventPath = outcome === "event";

  return [
    {
      title: "1. Client asks",
      detail: "GET /events?after=1042",
      state: "done",
    },
    {
      title: "2. Server waits",
      detail: "Connection stays open instead of replying immediately.",
      state: "blocked",
    },
    {
      title: eventPath ? "3. Event arrives" : "3. Timeout reached",
      detail: eventPath
        ? "Server now has useful data."
        : "No new data before the timeout.",
      state: "active",
    },
    {
      title: eventPath ? "4. Response 200" : "4. Response 204",
      detail: eventPath
        ? "Client gets new events."
        : "Client gets an intentional empty response.",
      state: "done",
    },
    {
      title: "5. Open next long poll",
      detail: "Client immediately reconnects with a cursor.",
      state: "done",
    },
  ];
}

export function buildSseStream({
  includeId,
  includeEvent,
  includeRetry,
  dropped,
}: {
  includeId: boolean;
  includeEvent: boolean;
  includeRetry: boolean;
  dropped: boolean;
}) {
  const raw = [
    includeId ? "id: 1042" : null,
    includeEvent ? "event: message" : null,
    'data: {"text":"hello"}',
    includeRetry ? "retry: 5000" : null,
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    raw,
    clientState: dropped
      ? "Connection dropped; browser is reconnecting."
      : "Connection open; browser is waiting for more events.",
    reconnectHeader: dropped
      ? includeId
        ? "Last-Event-ID: 1042"
        : "(none — browser cannot resume from an event id)"
      : "(not reconnecting yet)",
  };
}

export type PushPattern = "polling" | "sse" | "websocket";

export function comparePushPattern({
  pattern,
  eventsPerMinute,
}: {
  pattern: PushPattern;
  eventsPerMinute: number;
}) {
  if (pattern === "polling") {
    return {
      clientRequests: 60,
      serverMessages: eventsPerMinute,
      whoCanSpeak: "client asks",
      note: "Low update frequency wastes many checks because the client keeps asking even when nothing changed.",
      clientRequestsTone: "bad",
    } as const;
  }

  if (pattern === "sse") {
    return {
      clientRequests: 1,
      serverMessages: eventsPerMinute,
      whoCanSpeak: "server only",
      note: "One request opens the stream; the server sends each update as it happens.",
      clientRequestsTone: "good",
    } as const;
  }

  return {
    clientRequests: 1,
    serverMessages: eventsPerMinute,
    whoCanSpeak: "both sides",
    note: "One long-lived connection supports low-latency messages in both directions.",
    clientRequestsTone: "good",
  } as const;
}

export type PubSubMode = "pubsub" | "queue";
export type DeliverySemantic =
  | "at-most-once"
  | "at-least-once"
  | "exactly-once";

export function getPubSubFlow({
  mode,
  semantic,
  subscribers,
  publishCount,
}: {
  mode: PubSubMode;
  semantic: DeliverySemantic;
  subscribers: boolean[];
  publishCount: number;
}) {
  const names =
    mode === "pubsub"
      ? ["Email", "Analytics", "Fraud"]
      : ["Worker A", "Worker B", "Worker C"];
  const activeNames = names.filter((_, index) => subscribers[index]);
  const eventId = `evt_${publishCount}`;

  let deliveries: string[] = [];
  if (publishCount > 0 && activeNames.length > 0) {
    if (mode === "queue")
      deliveries = [activeNames[(publishCount - 1) % activeNames.length]];
    else if (semantic === "at-most-once")
      deliveries = activeNames.filter(
        (_, index) => index !== (publishCount - 1) % activeNames.length,
      );
    else if (semantic === "exactly-once") deliveries = activeNames;
    else deliveries = [...activeNames, activeNames[0]];
  }

  const deliveryCounts = new Map<string, number>();
  const deliveryRecords = deliveries.map((receiver) => {
    const deliveryNumber = (deliveryCounts.get(receiver) ?? 0) + 1;
    deliveryCounts.set(receiver, deliveryNumber);
    return {
      key: `${eventId}-${receiver}-${deliveryNumber}`,
      receiver,
    };
  });

  return { names, eventId, deliveries: deliveryRecords };
}

export type MuxTransport = "http2" | "http3";

export function simulateMuxTransport({
  transport,
  loss,
  lostStream,
}: {
  transport: MuxTransport;
  loss: boolean;
  lostStream: string;
}) {
  const streams = [1, 2, 3].map((stream) => {
    if (!loss) return { stream, status: "flowing" as const };
    if (transport === "http2") return { stream, status: "blocked" as const };
    return {
      stream,
      status:
        String(stream) === lostStream
          ? ("blocked" as const)
          : ("flowing" as const),
    };
  });

  return {
    streams,
    explanation: loss
      ? transport === "http2"
        ? "TCP retransmission stalls later bytes for every HTTP/2 stream."
        : "Only the affected QUIC stream pauses; the others keep moving."
      : "All streams are flowing normally.",
  };
}

export type SessionDesign = "memory" | "redis" | "jwt";

export function evaluateSessionState({
  design,
  sticky,
  restarted,
}: {
  design: SessionDesign;
  sticky: boolean;
  restarted: boolean;
}) {
  const stateLivesIn =
    design === "memory"
      ? "process memory"
      : design === "redis"
        ? "Redis / DB"
        : "client token";
  const nextRequestFails = design === "memory" && restarted;
  let outcome: string;

  if (design === "memory") {
    if (restarted)
      outcome = "Session lost: instance memory disappeared on restart.";
    else
      outcome = sticky
        ? "Request succeeds: same instance still remembers the session."
        : "Risky: another instance may not have that session.";
  } else if (design === "redis") {
    outcome =
      "Request succeeds: backend instance can fetch session state from Redis.";
  } else {
    outcome =
      "Request succeeds: the client carries signed state in the token itself.";
  }

  return {
    stateLivesIn,
    afterRestart: restarted ? "instance replaced" : "instance still running",
    afterRestartTone: restarted ? "warn" : "good",
    nextRequest: nextRequestFails ? "fails" : "works",
    nextRequestTone: nextRequestFails ? "bad" : "good",
    outcome,
  } satisfies Record<string, string>;
}

export type SyncAsyncMode = "sync" | "async";

export function describeSyncAsync(mode: SyncAsyncMode) {
  const sync = mode === "sync";

  const stages = [
    {
      title: "Client request",
      detail: sync
        ? "Send /checkout and wait."
        : "Send /exports and get jobId.",
      state: "done",
    },
    {
      title: "Server starts work",
      detail: sync
        ? "Work stays inside the request."
        : "Work is queued for later.",
      state: "done",
    },
    {
      title: sync ? "Caller state" : "Background worker",
      detail: sync ? "Caller is blocked." : "Worker runs after the response.",
      state: sync ? "blocked" : "active",
    },
    {
      title: "Client gets final answer",
      detail: sync
        ? "Only after all work finishes."
        : "Immediately for start; later for completion.",
      state: "active",
    },
  ] satisfies StageSpec[];

  const stats = {
    initialResponse: sync ? "slow but final" : "fast, usually 202",
    initialResponseTone: sync ? "warn" : "good",
    callerCanDoWork: sync ? "no" : "yes",
    callerCanDoWorkTone: sync ? "bad" : "good",
    operationalComplexity: sync ? "lower" : "higher",
    operationalComplexityTone: sync ? "good" : "warn",
  } satisfies {
    initialResponse: string;
    initialResponseTone: Tone;
    callerCanDoWork: string;
    callerCanDoWorkTone: Tone;
    operationalComplexity: string;
    operationalComplexityTone: Tone;
  };

  return { stages, stats };
}

export function calculateSidecarFlow({
  mtls,
  tracing,
  retries,
  failureRate,
}: {
  mtls: boolean;
  tracing: boolean;
  retries: number;
  failureRate: number;
}) {
  const attemptsPerHop = 1 + (retries * failureRate) / 100;
  const totalAttempts = attemptsPerHop * attemptsPerHop;

  return {
    sidecarADetail:
      [mtls && "mTLS", tracing && "trace headers"]
        .filter(Boolean)
        .join(" + ") || "plain proxying",
    sidecarBDetail: retries > 0 ? `${retries} retry budget` : "no retries",
    attemptsPerHop,
    totalAttempts,
    attemptsPerHopTone: attemptsPerHop > 2 ? "bad" : "warn",
    totalAttemptsTone: totalAttempts > 4 ? "bad" : "warn",
  } satisfies Record<string, string | number>;
}
