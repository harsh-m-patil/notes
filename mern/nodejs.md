## Nodejs is runtime for JS

> Built on chromes V8 Engine

- Single Threaded
- event driven
- non IO-Blocking

## CommonJS Module System

- NodeJS uses the CommonJS module system to organize and manage code.
- Each file in NodeJS is treated as a separate module.
- Modules can be imported and exported using the `require` and `module.exports` functions.

### Importing Modules

```js
// Builtin Modules
const module = require("./module"); // like fs
// Custom Modules
const module = require("./module");
// 3rd Party Modules
const module = require("module"); // like express
```

## Builtin Modules

### File

```js
const fs = require("fs");

// Synchronous Blocking code
const input = fs.readFileSync("input.txt", "utf-8");
console.log(input);

// Asynchronous Non-Blocking code
fs.readFile("input.txt", "utf-8", (err, data) => {
  console.log(data);
});
console.log("Reading file ..."); // will be logged first

// Problem callback hell SOlution:promises async await
```

### HTTP

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello from the server");
});

// server.listen(port, hostname, callback)
server.listen(8000,() => {
  console.log("Server is listening on port 8000");
}
```

### OS

```js
const os = require("os");

console.log(os.platform());
console.log(os.arch());
console.log(os.cpus());
console.log(os.freemem());
console.log(os.totalmem());
```

### Path

```js
const path = require("path");

console.log(path.basename(__filename)); // file name
console.log(path.dirname(__filename)); // directory name
console.log(path.extname(__filename)); // file extension
console.log(path.parse(__filename)); // object with all details
// path.join(__dirname, "test", "hello.html");
```

## How NodeJS works behind the scenes

1. **NodeJS Runtime**: NodeJS is a runtime environment for executing JS code.
2. **Node APIs**: NodeJS has several built-in APIs that provide functionalities to the JS code.
3. **Libuv Library**: NodeJS uses the libuv library to handle asynchronous operations.
4. **Node Core**: NodeJS has a core that provides basic functionalities like file system, HTTP, OS, etc.
5. **V8 Engine**: NodeJS is built on the V8 engine, which is the same engine that powers Google Chrome.

### Event Loop

1. **Event Loop**: The event loop is responsible for executing the code, collecting and processing events, and executing queued sub-tasks.
2. **Callback Queue**: The callback queue stores the callbacks that are ready to be executed.
3. **Call Stack**: The call stack stores the functions that are currently being executed.
4. **Offloading**: The event loop offloads the processing of events to the thread pool, which is managed by the libuv library.

#### Dont block the event loop

- Use non-blocking code
- dont use synchronous code
- be careful with loops and large json
