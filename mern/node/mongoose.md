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
