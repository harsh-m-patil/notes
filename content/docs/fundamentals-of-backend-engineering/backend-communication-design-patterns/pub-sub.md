---
title: publish subscribe
description: one publisher many readers (can have many publishers)
---

## Request/Response pros and cons

| Pros               | Cons                            |
| ------------------ | ------------------------------- |
| Elegant and Simple | Bad for multiple recievers      |
| Scalable           | High Coupling                   |
|                    | Client/Server have to be runnig |
|                    | Chaining, circuit breaking      |

## Pub/Sub pros and cons

| Pros                            | Cons                    |
| ------------------------------- | ----------------------- |
| Scales w/ multiple recievers    | Message delivery issues |
| Great for microservvices        | Complexity              |
| Loose Coupling                  | Network saturation      |
| Works while clients not running |                         |
