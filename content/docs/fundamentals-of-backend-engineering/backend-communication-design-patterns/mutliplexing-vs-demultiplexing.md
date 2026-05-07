---
title: Multiplexing vs Demultiplexing
description: HTTP/2, QUIC, Connection Pool, MPTCP
---

## What is Multiplexing?

> Combining multiple signals/streams into **one** channel.

- Multiple senders → single connection → single receiver
- Reduces overhead of establishing many connections
- Maximizes utilization of a single connection

## What is Demultiplexing?

> Splitting a single channel back into **multiple** streams.

- Single connection → split into multiple logical streams → multiple receivers/handlers
- The receiver identifies which stream each chunk belongs to and routes accordingly

---

## Why does it matter?

Every TCP connection has a cost:
- 3-way handshake (latency)
- TLS negotiation (more latency)
- Slow-start (congestion window builds up slowly)
- OS resources (file descriptors, buffers)

Multiplexing amortizes this cost — **one connection, many requests/responses in parallel**.

---

## HTTP/1.1 — The Problem

- One request at a time per connection (no multiplexing)
- **Head-of-line blocking**: request 2 waits for request 1 to complete
- Workaround: browsers open **6 parallel TCP connections** per host
  - Wastes resources, doesn't scale

---

## HTTP/2 — Multiplexing over TCP

- Introduces **streams** — logical, independent, bidirectional sequences of frames
- Multiple streams share **one TCP connection**
- Each frame is tagged with a **stream ID**
- Server and client can interleave frames from different streams freely
- No head-of-line blocking at the **HTTP layer**

```
TCP Connection
├── Stream 1 → GET /index.html
├── Stream 3 → GET /style.css
├── Stream 5 → GET /app.js
└── Stream 7 → POST /api/data
```

> Demultiplexing: receiver reads stream ID on each frame and routes to the correct handler.

### Still has a problem
- **TCP head-of-line blocking** remains
- One lost TCP packet blocks **all streams** until retransmitted
- HTTP/2 multiplexing is at the application layer; TCP is still a single ordered byte stream underneath

---

## QUIC — Multiplexing over UDP

- Built on **UDP** instead of TCP
- Implements its own reliable delivery, congestion control, and stream management
- Each stream is **independently reliable** — a lost packet in stream 1 doesn't block stream 2
- Solves TCP head-of-line blocking entirely
- Integrated TLS 1.3 — connection + crypto handshake in **1 RTT** (0-RTT for reconnects)
- Used by **HTTP/3**

```
QUIC Connection (UDP)
├── Stream 1 → lost packet, retransmitting... (only stream 1 blocked)
├── Stream 2 → flowing freely ✓
└── Stream 3 → flowing freely ✓
```

---

## Connection Pool — Multiplexing at the Application Level

> Pre-establish a pool of connections; reuse them across many requests.

- Common in databases (PostgreSQL, MySQL), HTTP clients, Redis clients
- Avoids the cost of creating a new connection for every request
- The pool manager **multiplexes** many application-level requests across a fixed set of connections
- The server **demultiplexes** by reading requests off each connection and dispatching to workers

### Tradeoffs
| | Connection per request | Connection Pool |
|---|---|---|
| Latency | High (handshake every time) | Low (reuse) |
| Resource usage | High (many connections) | Controlled (fixed pool size) |
| Complexity | Low | Medium |

### Typical settings
- `min_connections` — kept alive even when idle
- `max_connections` — cap to avoid overwhelming the server
- `connection_timeout` — how long to wait for a free slot

---

## MPTCP — Multipath TCP

> Use **multiple network paths simultaneously** for a single TCP connection.

- A single logical TCP connection can use multiple physical paths (e.g., Wi-Fi + LTE at the same time)
- **Multiplexing**: data is split across multiple subflows (paths)
- **Demultiplexing**: receiver reassembles data from multiple subflows into one ordered byte stream
- Increases throughput, improves resilience (failover if one path drops)

### Use cases
- Mobile devices seamlessly switching from Wi-Fi to cellular
- Apple uses MPTCP for Siri traffic
- Data centers with multiple NICs

```
Client
├── Subflow 1 → Wi-Fi path   → Server
└── Subflow 2 → LTE path     → Server
         ↓
   Single TCP stream reassembled at receiver
```

---

## Summary

| Technology | Mux/Demux Level | Transport | Key Benefit |
|---|---|---|---|
| HTTP/2 | Application (streams) | TCP | No HTTP head-of-line blocking |
| QUIC / HTTP/3 | Transport (streams) | UDP | No TCP head-of-line blocking, faster handshake |
| Connection Pool | Application | TCP/UDP | Reuse connections, lower latency |
| MPTCP | Transport (subflows) | TCP | Multiple paths, resilience + throughput |
