### Creation and deletion of Databases

```js

show dbs  // show the databases

use <dbname>  // use a the given database if it exists otherwise create a new one

db.createCollection("collectionName")  // create a collection with given Name

db.dropDatabase()  // drop the current database

show collections  // show collections
```

### Insertion

**Inserting documents in the database**

```js
db.collectionName.insertOne({ name: "harsh", age: 20, codeEditor: "vscode" }); // inserting a document in a collection (create new if do not exist)
db.collectionName.find(); // return all documents in a collection

db.collectionName.insertMany([{ doc1 }, { doc2 }, { doc3 }]); // insert many documents
```

### Deletion

**Deleting a document that satisfies the given criteria**

```js
db.collectionName.deleteOne({ fieldName: value }); // deletes the document that satisfies the given field value pair (Use fields that have unique values to avoid deleting wrong document)
db.collectionName.deleteMany({ fieldName: value }); // delete Multiple documents at once
db.collectionName.deleteMany({ fieldName: { $exists: false } }); // this will delete documents that do not have the given field
db.collectionName.deleteMany({ fieldName: value });
```

### Data types in MongoDB

**Different Data types in MongoDB**

1. **String** -> series of characters between ' ' or " "
2. **Integer** -> ints
3. **Double** -> decimals
4. **Boolean** -> true, false
5. **Date** -> new Date() default current time in UTC Time zone or new Date("2024-05-06T11:30:00")
6. **Null** -> currently unassigned //no value
7. **Arrays** -> [ ] //field can have multiple values
8. **Nested Documents** -> document inside document {key:value,key:value} //useful for fields like address

### Sorting and Limiting

**Sorting and limiting the results with help of sort and limit methods**

```js
db.collectionName.find().sort({
  fieldName: num,
}); //field: by which field we will like to sort //num 1 for alphabetical -1 for reverse
db.collectionName.fin().limit(num); // limit the number of documents returned //num: limit
// We can use both to find highest or lowest value of a field in the document by method chaining and limit = 1//
```

### Querying the database

**Query the database with the help of the find method**

```js
db.collectionName.find({ query }, { projection });
// finding for some field value pair
db.collectionName.find({ field: value });
// multiple filters
db.collectionName.find({ field1: value1, field2: value2 });
// projection only return specific fields
db.collectionName.find({}, { _id: false, field: true }); // by default id is also shown to disable _id:false
```

### Update

**Update a document with some given filter**

```js
db.collectionName.updateOne(filter,update)

db.colletionName.updateOne({name:'harsh'}, {$set{codeEditor:'neovim'}}) // this will update the field codeEditor of the document having the field name value as harsh
// we should use _id as id is unique to avoid modifying the wrong document
// to remove a value use unset

db.collectionName.updateMany(filter,update) // update multiple documents

db.collectionName.updateMany({fieldName:{$exists:false}},{$set:{fieldName:value}}) // this will set add the fieldName to the documents that do not have it and set it to value
```

### Comparison Operators

**Return Data based on value comparisons**

```js
$ne // not equals
db.collectionName.find(fieldName:{$ne:"givenValue"}) // this will return all the documents that do not have the fieldName value set to givenValue

$lt // less than
k$lte // less than equal
db.collectionName.find(fieldName:{$lt:"givenValue"}) // this will return all the documents that have the fieldName value less than givenValue

$gt // greater than
$gte // greater than equal
// we can use it just like we used lt

// we can use multiple conditions by separating them with commas
db.collectionName.find(fieldName:{$lt:"givenValue",$gt:"anotherGivenValue"})
// this will return documents having the given field set to values between the two given values

$in // in operator takes an array
db.collectionName.find(fieldName:{$in[value1,value2,value3]}) // this will return the documents having the values listed in the array

$nin // not in operator
db.collectionName.find(fieldName:{$nin[value1,value2,value3]}) // this will return the documents having that do not values listed in the array
```
