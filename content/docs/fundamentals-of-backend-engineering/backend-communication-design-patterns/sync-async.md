---
title: Synchronous vs Asynchronous
description: Are you blocked on something.
---

## Synchronous I/O

- Caller sends a request and blocks
- Caller cannot execute any code meanwhile
- Reciever responds, Caller unblocks
- Caller and Reciever are in _sync_

### Example

- Program asks OS to read from disk
- Program main thread is taken off the CPU
- Read completes, program can resume execution

```typescript
// Program starts
// Program uses CPU to execute stuff
doWork();

// Program reads from disk
// Program can't do anything until the file loads
// offloaded to kernel by program, kernel to I/O driver
const content = fs.readFileSync("file.txt");

// program resumes
doWork2();
```

## Asynchronous I/O

- Caller sends a request
- Caller can work until it gets a response
- Caller either:
  - Checks if the response if ready (`epoll`) (Node.js on Linu)
  - Reciever calls back when it's done (`io_uring`)
  - Spins up a new thread that blocks
- Caller and reciever are not necessary in sync

### Example of an OS asynchronous call (NodeJS)

- Program spins up a secondary thread
- Secondary thread reads from disk, OS blocks it
- Main program still running and executing code
- Thread finish reading and calls back main thread

```typescript
// Program starts
// Program uses CPU to execute stuff
doWork();

// Program requests read from disk
// Program asks to callback when done
// Program moves on to do doWork2
readFile("largefile.dat", onReadFinished(theFile));

// file is probably not read yet
// Program happy doing stuff
doWork2();

// someone just called onReadFinished
// processsing it.
-----> onReadFinished(theFile)
```

## Synchronous vs Asynchronous in Request Response

- Synchronicity is a client property
- Most modern client libraries are asynchronous
- E.g Clients send and HTTP request and do work

## Asynchronous workload is everywhere

- Asynchronous programming (promises)
- Asynchronous backend processing
  - Adds to a queue
  - Respond with acknowlodgement
  - Will process the job later
  - Return a job id
- Asynchronous commits in postgres read more [here](https://www.postgresql.org/docs/current/wal-async-commit.html)
- Asynchronous IO on Linux (epoll, io_uring)
- Asynchronous replication
- Asynchronous OS fsync (fs cache)
