---
title: Long Polling
description: Request is taking long, I'll check with you later. But talk to me only when it's ready
---

## When request/response isn't ideal

- A request takes long time to process
    - Upload a youtube video
- The backend wants to send a notification
    - A user just logged in
- Short polling is good but chatty
- Meet long polling (Kafka uses it)

## What is Long Polling?

- Client sends a request
- Server responds immediately with a handle
- Server continues to process the request
- Client uses that handle to check for status
- Server *DOES NOT RESPOND* until it has the response
- So we got a handle, we can disconnect and we are less chatty
- Some variation has timeouts too

## Pros and Cons

### Pros

- Less chatty and backend friendly
- Clients can still disconnect

### Cons

- Not real time

