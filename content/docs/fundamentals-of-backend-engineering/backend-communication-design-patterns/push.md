---
title: Push
description: I want it as soon as possible
---

## Request response isn't always ideal

- Client wants real time notifications from backend
  - A user just logged in
  - A message is just recieved
- Push model is good for certain cases

## What is Push?

- Client connects to a server
- Server sends data to the client
- Client doesn't have to request anything
- Protocol must be bidirectional (is better, can use unidirectional)
- Used by RabbitMQ

## Pros and Cons

### Pros      
- Real time 

### Cons:
- Clients must be online 
- Clients might not be able to handle 
- Requires a bidirectional protocol
- Polling is preffered for light clients

## Example

```typescript
const http = require("node:http");
const WebSocketServer = require("websocket").server

let connections = [];

// create a raw http server (this will create the TCP which will then pass) 
const httpServer = http.createServer();

// pass the httpServer object to the WebSocketServer library to do all the job
const websocket = new WebSocketServer({"httpServer": httpServer})

// listen on the TCP socket
httpServer.listen(8080, "Listening on port 8080")

websocket.on("request", request => {

    const connection = request.accept(null, request.origin)
    connection.on("message", message => {
        // someone just send a message tell everybody
        connections.forEach(c => c.send(`User${connection.socket.remotePort} says ${message.utf8Data}`))
    })

    connections.push(connection)
    // someone just connected, tell everybody
    connections.forEach(c => c.send(`User${connection.socket.remotePart} just connected`))
})
```

