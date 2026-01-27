---
title: Short Polling
description: Request is taking a while, I'will check you later
---

## When request/response isn't ideal

- A request takes long time to process
    - Upload a youtube video
- The backend wants to send a notification
    - A user just logged in

## What is Short Polling

- Client sends a request
- Server responds immediately with a handle
- Servers continues to process the request
- Client uses that handle to check for status
- Multiple "short" request response as polls

## Pros and Cons

### Pros

- Simple
- Good for long running requests
- Client can disconnect

### Cons

- Too chatty (many request responses per client)
- Thousands of clients polling leading to network congestion
- Kills network bandwidth
- Wasted backend resources
