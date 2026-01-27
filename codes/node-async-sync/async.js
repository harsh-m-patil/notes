const fs = require("node:fs");

console.log("1");

fs.readFile("test.txt", "utf-8", (_, data) => console.log(data));

console.log("2");
