---
title: Server Sent Events
description: One Request,a very very long response
---

> Its pure HTTP thing

## Limitations of Request/Response

- Vanilla Request/response isn't ideal for notification backend
- Client wnats real time notification from backend
    - A user just logged in
    - A message is just recieved
- Push works but restricitive
- Server Sent Events work with Request/Response
- Designed for HTTP

## What is Server Sent Events

- A response has start and end
- Client sends a request
- Server sends logical events as part of response
- Server never writes the end of the response
- It is still a request but an unending response
- Client parses the streams data looking for these events
- Works with request/response (HTTP) > 1.1 (1.0 doesn't support streaming)

## Pros and Cons

### Pros

- Real time
- Compatible with Request/response

### Cons

- Clients must be online
- Client might not be able to handle
- Polling is preffered for light clients
- HTTP/1.1 problem (6 connections limitation set by chrome)

## Example code

```typescript
/*
let sse = new EventSource("http://localhost:8080/stream")
sse.onmessage = console.log
*/

const app = require("express")();

app.get("/", (req,res) => res.send("hello"));

app.get("/stream", (req,res) => {
    res.setHeader("Content-Type", "text/event-stream");
    send(res);
})

const port = process.env.PORT || 8080;

let i = 0;

function send(res) {
    // NOTE: must start `data: ` and must end with \n\n
    res.write("data: " + `hello from server ---- [${i++}]\n\n`);

    setTimeout(() => send(res),100);
}

app.listen(port);
console.log(`Listening on ${port}`);
```
