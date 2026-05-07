---
title: stateless v/s stateful
description: is state stored in backend
---

## Stateful

- Stores state about clients in its memory
- Depends on the information being there

## Stateless

- Client is responsible to "transfer the state" with every request
- May store but can safely lose it

## Stateless Backends

- Stateless backends can still store data somewhere else 
- Can you restart the backend during idle time while the client
workflow continues to work?

## What makes a backend stateless?

- Stateless backends can still store data somewhere else (database)
- The backend remain stateless but the system is stateful
- Can you restart the backend during idle time while the client
workflow continues to work?

## Stateful backend example

- /login -> go to db (verify user,passwd pair) -> store session in memory -> send session cookie to the client -> client sends the cookie on every request

- Problem here if we restart the backend and all state including user sessions are cleared

- With loadbalanced setups requires sticky sessions

## Stateless backend example

- store the session somewhere else maybe redis or a sql database
- can spin up `n` number of backends and it will still work
- problem need a read query to DB or `redis` on every request.


## Stateless v/s Stateful protocols

- The protocols can be designed to store table
- `TCP` is stateful

- `UDP` is stateless
    - `DNS` sends queryID in UDP to identify queries
    - `QUIC` sends connectionID to identify connection (but it is stateful)

- You can build a stateless protocol on top of a stateful one and vise verca
- HTTP on top of TCP
- if TCP breaks, HTTP blindly create another one
- QUIC on top UDP

Complete stateless system

- Stateless systems are rare
- State is carried with every request
- A backend service that relies completely on the input
    - Check if input param is a prime number
- JWT (Json Web Token)

