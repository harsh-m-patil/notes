## Mongoose

> mongodb object modeling for node.js

### Intro

```js
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const User = mongoose.model("User", { name: String });

const rick = new User({ name: "Rick Astley" });
rick.save().then(() => console.log("Never Gonna Give You Up"));
```

### Defining Schema

```js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});

// can add additional keys later using Schema#add
```

### Schema Validation

```js
const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
  },
  bio: {
    type: String,
    match: /[a-z]/,
    validate: {
      validator: function (v) {
        return v.length > 10;
      },
      message: "Bio should be longer than 10 characters",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user", "moderator"],
      message: "{VALUE} is not supported",
      default: "user",
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
});
```

### Permitted SchemaTypes

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Decimal128
- Map
- UUID

### Middlewares

#### Pre and Post Middleware

```js
const schema = new Schema({ name: String });

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

schema.post("save", function (doc) {
  console.log("post save middleware");
});
```

#### Query Middleware

```js
schema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
```

### Aggregation Pipeline

The aggregation pipeline is a powerful feature in MongoDB that allows for data transformation, advanced filtering, grouping, and aggregation. It is particularly useful when you need to perform complex operations on your data.

For example, you can use the aggregation pipeline to calculate statistics about a product, such as the average price, total sales, or the most popular category.

Here's an example of how you can use the aggregation pipeline in MongoDB:

```js
db.products.aggregate([
  { $match: { category: "Electronics" } }, // Filter documents by category
  { $group: { _id: "$brand", totalSales: { $sum: "$sales" } } }, // Group by brand and calculate total sales
  { $sort: { totalSales: -1 } }, // Sort by total sales in descending order
  { $limit: 5 }, // Limit the result to the top 5 brands
]);
```

In this example, we start by filtering the documents based on the category "Electronics". Then, we group the documents by the brand field and calculate the total sales for each brand using the $sum operator. Next, we sort the result by total sales in descending order and limit the result to the top 5 brands.

The aggregation pipeline provides a flexible and efficient way to perform complex data operations in MongoDB. It allows you to combine multiple stages and operators to achieve the desired result.

### Virtuals

```js
const userSchema = new Schema({
  firstName: String,
  lastName: String,
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
```

### Virtual Populate

```js
const userSchema = new Schema({
  name: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const postSchema = new Schema({
  title: String,
});

userSchema.virtual("postCount", {
  ref: "Post", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "author", // is equal to `foreignField`
  count: true, // Only get the number of docs
});
```

### Indexing

Indexing in Mongoose (and MongoDB in general) is a mechanism that improves the performance of queries. When an index is created, MongoDB builds a data structure that holds specific fields and their values, which allows it to quickly locate data without scanning the entire collection. Indexes make reading data faster but may slightly slow down write operations since the index has to be updated with each insert, update, or delete.

```js
// Create an index on the "name" field
schema.index({ name: 1 });

// Create a compound index on multiple fields
schema.index({ name: 1, age: -1 });

// Create a unique index
schema.index({ email: 1 }, { unique: true });

// Create a text index for full-text search
schema.index({ title: "text", body: "text" });

// Create a sparse index
// Sparse Index: These are indexes that only include documents that contain the indexed field. Documents without the field are excluded from the index, which can be useful when indexing optional fields.
schema.index({ date: 1 }, { sparse: true });

// 2dsphere Index: Used for geospatial queries (e.g., finding locations within a certain distance).
locationSchema.index({ coordinates: "2dsphere" });
```
