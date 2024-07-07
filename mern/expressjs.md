## ExpressJS - Web framework for Node.js

### Basic Server

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
```

### Routing

```js
app.get("/about", (req, res) => {
  res.send("About page");
});

app.get("/contact", (req, res) => {
  res.send("Contact page");
});
```

### HTTP Methods

```js
app.httpMethod("/path", (req, res) => {
  res.send("Response");
});

app.get("/get", (req, res) => {
  res.send("GET request");
});

app.post("/post", (req, res) => {
  res.send("POST request");
});
```

### Middleware

> Middleware functions are functions that have access to the request object (req),
> the response object (res),
> and the next middleware function in the application’s request-response cycle.

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
```

### Environment Variables

```js
const dotenv = require("dotenv");
dotenv.config(); // must be called before calling app

// access environment variables
const port = process.env.PORT || 8000;
```
