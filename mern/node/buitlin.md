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
