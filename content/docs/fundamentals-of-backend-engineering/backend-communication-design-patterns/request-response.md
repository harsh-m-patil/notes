---
title: Request Response
description: Every request doesn't get a response :(
---

> You make a request.
> Backend processes the request,
> And responds to you.

1. Client sends a `Request`.
2. Server parses the `Request` (requires some compute).
3. Server processes the `Request`.
4. Server sends a `Response`.
5. Client parses the `Response` and consume.

### Where it is used?

- Web, `HTTP`, `DNS`, `SSH`
- `RPC` (remote procedure call) - used by LSP's and MCP.
- `SQL` and Database Protocols.
- APIs (REST/SOAP/GraphQL)

## Anatomy of a Request/Response

- structure defined by both client and server
- Request has a boundary.(where does it end)
- Defined by a protocol and message format.
- Same for the response.

```
GET /HTTP/1.1
Headers
<CTRLF>
BODY
```

## Example

#### Building an upload image service with request response.

1. Send large request with the image (simple)
   - One request-response cycle
2. Chuck image and send a request per chunk (resumable)
   - Multiple request-response cycle

## Doesn't work everywhere

- Notification service
  - Can try polling, will work but with the cost of lot of requests
- Chatting application
- Very long running request
  - waiting doing nothing, can make async request
  - What if client disconnects

> See it yourself

```bash
curl -v --trace out.txt http://google.com
```
