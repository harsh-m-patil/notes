const fs = require("node:fs");

console.log("1");
const result = fs.readFileSync("test.txt", "utf-8");
console.log("file : ", result);
console.log("2");
