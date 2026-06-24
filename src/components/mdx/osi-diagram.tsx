"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { DiagramShell } from "@/components/mdx/interactive-lab-ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = "send" | "receive";

interface LayerInfo {
  number: number;
  name: string;
  pdu: string;
  protocols: string;
  sendAction: string;
  receiveAction: string;
  headerAdded: string;
  color: string;
  device?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const layers: LayerInfo[] = [
  {
    number: 7,
    name: "Application",
    pdu: "Data",
    protocols: "HTTP, FTP, gRPC, DNS, SMTP",
    sendAction: "Generate application data (e.g. POST /users with JSON body)",
    receiveAction: "Process request, route to handler, generate response",
    headerAdded: "HTTP headers (method, path, Host, Content-Type)",
    color: "rgb(139, 92, 246)", // violet
  },
  {
    number: 6,
    name: "Presentation",
    pdu: "Data",
    protocols: "TLS, SSL, JPEG, UTF-8, gzip",
    sendAction: "Serialize (JSON → bytes), compress, encrypt via TLS",
    receiveAction: "Decrypt, decompress, deserialize bytes → structured data",
    headerAdded: "Encoding/encryption metadata (content negotiation)",
    color: "rgb(99, 102, 241)", // indigo
  },
  {
    number: 5,
    name: "Session",
    pdu: "Data",
    protocols: "TLS handshake, NetBIOS, RPC",
    sendAction: "Establish or reuse TLS session (session ID, keys)",
    receiveAction: "Validate session, derive session keys for decryption",
    headerAdded: "Session identifiers, TLS record header",
    color: "rgb(59, 130, 246)", // blue
  },
  {
    number: 4,
    name: "Transport",
    pdu: "Segment / Datagram",
    protocols: "TCP, UDP, QUIC",
    sendAction: "Segment data, add src/dest port, sequence numbers, checksum",
    receiveAction: "Reassemble segments in order, verify checksum, send ACK",
    headerAdded: "Source port, dest port, seq/ack numbers, flags, window size",
    color: "rgb(14, 165, 233)", // sky
    device: "Firewall (L4)",
  },
  {
    number: 3,
    name: "Network",
    pdu: "Packet",
    protocols: "IP (v4/v6), ICMP, IPSec",
    sendAction: "Add source IP and destination IP, set TTL, may fragment",
    receiveAction: "Check dest IP matches host (or forward if router), reassemble fragments",
    headerAdded: "Source IP, dest IP, TTL, protocol number, header checksum",
    color: "rgb(20, 184, 166)", // teal
    device: "Router",
  },
  {
    number: 2,
    name: "Data Link",
    pdu: "Frame",
    protocols: "Ethernet, Wi-Fi (802.11), ARP",
    sendAction: "Add source MAC and next-hop MAC (via ARP), compute FCS",
    receiveAction: "Verify FCS checksum, check dest MAC matches NIC, strip header",
    headerAdded: "Source MAC, dest MAC, EtherType + FCS trailer",
    color: "rgb(34, 197, 94)", // green
    device: "Switch",
  },
  {
    number: 1,
    name: "Physical",
    pdu: "Bits",
    protocols: "Ethernet cable, fiber optic, Wi-Fi radio, 5G",
    sendAction: "Convert frame bits → electrical signals / light / radio waves",
    receiveAction: "Convert signals back to bits, pass frame up",
    headerAdded: "Preamble, start frame delimiter (physical sync)",
    color: "rgb(234, 179, 8)", // yellow
    device: "Hub, NIC, Cable",
  },
];

// ─── Encapsulation Visual ─────────────────────────────────────────────────────

function EncapsulationStack({ activeLayer, direction }: { activeLayer: number; direction: Direction }) {
  // Show headers that have been added so far (for send: layers above current; for receive: layers below current)
  const visibleLayers = direction === "send"
    ? layers.filter((l) => l.number >= activeLayer)
    : layers.filter((l) => l.number <= activeLayer);

  // Order: outermost first for send (lowest layer number in visible = outermost)
  const ordered = direction === "send"
    ? [...visibleLayers].sort((a, b) => a.number - b.number)
    : [...visibleLayers].sort((a, b) => b.number - a.number);

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-0.5 overflow-x-auto text-xs font-mono">
        {ordered.map((layer, i) => (
          <motion.div
            key={layer.number}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className={cn(
              "rounded px-2 py-1 border whitespace-nowrap",
              layer.number === activeLayer && "ring-2 ring-offset-1 ring-fd-primary font-bold"
            )}
            style={{
              borderColor: layer.color,
              backgroundColor: `${layer.color}20`,
              color: layer.color,
            }}
          >
            {layer.number === 7 ? "Data" : `L${layer.number}`}
          </motion.div>
        ))}
        {direction === "send" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="rounded px-2 py-1 border border-dashed text-fd-muted-foreground"
          >
            FCS
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OSIEncapsulationDiagram() {
  const [activeLayer, setActiveLayer] = useState(7);
  const [direction, setDirection] = useState<Direction>("send");

  const layer = layers.find((l) => l.number === activeLayer)!;
  const displayLayers = direction === "send" ? layers : [...layers].reverse();

  return (
    <DiagramShell
      title="OSI Encapsulation Explorer"
      description="Click a layer to see what happens at each stage. Toggle between send (encapsulation) and receive (decapsulation)."
    >
      {/* Direction toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setDirection("send"); setActiveLayer(7); }}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            direction === "send"
              ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
              : "hover:bg-fd-accent"
          )}
        >
          ↓ Send (encapsulate)
        </button>
        <button
          type="button"
          onClick={() => { setDirection("receive"); setActiveLayer(1); }}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm transition-colors",
            direction === "receive"
              ? "border-fd-primary bg-fd-primary text-fd-primary-foreground"
              : "hover:bg-fd-accent"
          )}
        >
          ↑ Receive (decapsulate)
        </button>
      </div>

      {/* Layer stack */}
      <div className="grid gap-1">
        {displayLayers.map((l) => {
          const isActive = l.number === activeLayer;
          const isPast = direction === "send" ? l.number > activeLayer : l.number < activeLayer;
          return (
            <motion.button
              key={l.number}
              type="button"
              onClick={() => setActiveLayer(l.number)}
              animate={{
                borderColor: isActive ? l.color : "var(--color-fd-border)",
                backgroundColor: isActive ? `${l.color}15` : isPast ? `${l.color}08` : "transparent",
                opacity: isPast ? 0.5 : 1,
              }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-all",
                isActive && "ring-1 ring-offset-1",
              )}
              style={isActive ? { "--tw-ring-color": l.color } as React.CSSProperties : undefined}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: l.color }}
              >
                {l.number}
              </span>
              <span className="font-medium">{l.name}</span>
              <span className="ml-auto text-xs text-fd-muted-foreground hidden sm:inline">{l.pdu}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Encapsulation visual */}
      <div className="rounded-lg border bg-fd-secondary/10 p-3">
        <div className="text-xs uppercase tracking-wide text-fd-muted-foreground mb-1">
          {direction === "send" ? "Encapsulated so far" : "Remaining after strip"}
        </div>
        <EncapsulationStack activeLayer={activeLayer} direction={direction} />
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeLayer}-${direction}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-3 rounded-lg border p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">
                {direction === "send" ? "Action (encapsulate)" : "Action (decapsulate)"}
              </div>
              <div className="mt-1 text-sm font-medium">
                {direction === "send" ? layer.sendAction : layer.receiveAction}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">Header added</div>
              <div className="mt-1 text-sm font-mono" style={{ color: layer.color }}>
                {layer.headerAdded}
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">Protocols</div>
              <div className="mt-1 text-sm">{layer.protocols}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">PDU name</div>
              <div className="mt-1 text-sm font-semibold">{layer.pdu}</div>
            </div>
            {layer.device && (
              <div>
                <div className="text-xs uppercase tracking-wide text-fd-muted-foreground">Device at this layer</div>
                <div className="mt-1 text-sm">{layer.device}</div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </DiagramShell>
  );
}

// ─── Sender→Receiver flow animation ──────────────────────────────────────────

export function OSIFlowDiagram() {
  const [step, setStep] = useState(0);
  // 0-6: sender layers (7 down to 1), 7: wire, 8-14: receiver layers (1 up to 7)
  const totalSteps = 15;

  const getStepLabel = (s: number): { side: string; layer: LayerInfo | null; phase: string } => {
    if (s < 7) {
      return { side: "Sender", layer: layers[s], phase: "encapsulate" };
    }
    if (s === 7) {
      return { side: "Wire", layer: null, phase: "transit" };
    }
    // receiver: index 8 maps to layer 1 (index 6), 9 to layer 2 (index 5), etc.
    return { side: "Receiver", layer: layers[6 - (s - 8)], phase: "decapsulate" };
  };

  const current = getStepLabel(step);

  return (
    <DiagramShell
      title="End-to-End OSI Flow"
      description="Step through the complete journey of data from sender application to receiver application."
    >
      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-fd-secondary/30 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-fd-primary"
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {current.side}
          {current.layer && ` — L${current.layer.number} ${current.layer.name}`}
          {current.phase === "transit" && " — Bits on the medium"}
        </span>
        <span className="text-fd-muted-foreground">{step + 1} / {totalSteps}</span>
      </div>

      {/* Visual */}
      <div className="flex items-center gap-2">
        {/* Sender stack */}
        <div className="flex-1 space-y-0.5">
          <div className="text-xs text-center text-fd-muted-foreground mb-1">Sender</div>
          {layers.map((l, i) => (
            <motion.div
              key={l.number}
              animate={{
                opacity: step >= i && step <= 7 ? 1 : step > 7 ? 0.3 : 0.3,
                backgroundColor: step === i ? `${l.color}20` : "transparent",
                borderColor: step === i ? l.color : "var(--color-fd-border)",
              }}
              transition={{ duration: 0.2 }}
              className="rounded border px-2 py-1 text-xs text-center truncate"
            >
              L{l.number}
            </motion.div>
          ))}
        </div>

        {/* Wire */}
        <div className="flex flex-col items-center justify-center px-2">
          <motion.div
            animate={{
              opacity: step === 7 ? 1 : 0.3,
              scale: step === 7 ? 1.1 : 1,
            }}
            className="text-2xl"
          >
            {step < 7 ? "→" : step === 7 ? "⚡" : "←"}
          </motion.div>
          <div className="text-[10px] text-fd-muted-foreground mt-1">wire</div>
        </div>

        {/* Receiver stack */}
        <div className="flex-1 space-y-0.5">
          <div className="text-xs text-center text-fd-muted-foreground mb-1">Receiver</div>
          {[...layers].reverse().map((l, i) => {
            const receiverStep = 8 + (6 - i); // map visual position to step
            return (
              <motion.div
                key={l.number}
                animate={{
                  opacity: step >= 8 && step >= (8 + i) ? 1 : step < 8 ? 0.3 : 0.3,
                  backgroundColor: step === (8 + i) ? `${l.color}20` : "transparent",
                  borderColor: step === (8 + i) ? l.color : "var(--color-fd-border)",
                }}
                transition={{ duration: 0.2 }}
                className="rounded border px-2 py-1 text-xs text-center truncate"
              >
                L{l.number}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.15 }}
          className="rounded-lg border p-3 text-sm"
        >
          {current.layer ? (
            <>
              <span className="font-semibold" style={{ color: current.layer.color }}>
                L{current.layer.number} {current.layer.name}:
              </span>{" "}
              {current.phase === "encapsulate" ? current.layer.sendAction : current.layer.receiveAction}
            </>
          ) : (
            <span>Bits travel across the physical medium (copper, fiber, radio) to the receiver.</span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30 hover:bg-fd-accent"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
          disabled={step === totalSteps - 1}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-30 hover:bg-fd-accent"
        >
          Next →
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-fd-accent ml-auto"
        >
          Reset
        </button>
      </div>
    </DiagramShell>
  );
}
