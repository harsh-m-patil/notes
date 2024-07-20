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
