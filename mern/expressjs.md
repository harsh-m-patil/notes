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

### Express Generator

```bash
npm install express-generator -g
express --view=ejs myapp
cd myapp
npm install
npm start
```

### Routing

```js
// app.METHOD(PATH, HANDLER)

app.get("/about", (req, res) => {
  res.send("About page");
});

app.get("/contact", (req, res) => {
  res.send("Contact page");
});
```

### Response Methods

```js
app.get("/json", (req, res) => {
  res.json({ message: "JSON response" });
});

app.get("/send", (req, res) => {
  res.send("Send response");
});

app.get("/status", (req, res) => {
  res.status(404).send("Not Found");
});

// NOTE: http status codes
// 200 OK
// 201 Created
// 204 No Content
// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 500 Internal Server Error
```

### Serve Static files

```js
app.use(express.static("public"));
// this is relative to the directory you run your node process

// therefore use this
const path = require("path");
app.use("/static", express.static(path.join(__dirname, "public")));
```

### Express Router

```js
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Home page");
});

router.get("/about", (req, res) => {
  res.send("About page");
});
```

### Nested Routes

```js
const router = express.Router();
const reviewRouter = require("../routes/reviewRouter");
const authController = require("../controllers/auth");
const reviewController = require("../controllers/review");

// 1) 1 Way of doing nested Routes
router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview,
  );

// 2) Better Way of Creating nested Routes

router.use("/:tourId/reviews", reviewRouter);
```

```js
// In Review Router
// To get access to params of prev router
const router = express.Router({ mergeParams: true });
// /:tourId/reviews this will / here
```

### Middleware

> [!IMPORTANT]
> Middleware functions are functions that have access to the request object (req),
> the response object (res),
> and the next middleware function in the application’s request-response cycle.

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("Hello from the Middleware");
  next();
});
```

### Environment Variables

```js
const dotenv = require("dotenv");
dotenv.config(); // must be called before calling app

// access environment variables
const port = process.env.PORT || 8000;
```

### Logging Middleware

```js
const morgan = require("morgan");

app.use(morgan("dev"));

// This is the result
// GET /api/v1/tours 401 5.905 ms - 1152
```

### Factory

```js
/**
 * Factory Function to create a handler
 * @param {mongoose.Model} Model
 *  @example
 *  exports.deleteReview = factory.deleteOne(Review);
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
```
