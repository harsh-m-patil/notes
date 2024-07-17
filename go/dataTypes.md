## Data Types

- Go has the following basic data types:
  - `bool`
  - `string`
  - `int`, `int8`, `int16`, `int32`, `int64`
  - `uint`, `uint8`, `uint16`, `uint32`, `uint64`
  - `float32`, `float64`
  - `complex64`, `complex128`
  - `byte` (alias for `uint8`)
  - `rune` (alias for `int32`)
- Go also has the following composite data types:

  - `array`
  - `slice`
  - `map`
  - `struct`
  - `interface`
  - `pointer`

- Type conversion

```go
var x int = 10
var y float64 = float64(x)
```

- Constants

```go
const pi = 3.14
```

- Strings

```go
var name string = "John"
// multi-line string
var message string = `
    Hello, World!
    This is a multi-line string.
`
```

- Collections (Not objects)

Arrays have a fixed capacity which you define when you declare the variable. We can initialize an array in two ways:
[N]type{value1, value2, ..., valueN} e.g. numbers := [5]int{1, 2, 3, 4, 5}
[...]type{value1, value2, ..., valueN} e.g. numbers := [...]int{1, 2, 3, 4, 5}

```go
// NOTE: Can have multiple init functions in same file/package (Only exception)

// Arrays
var numbers [5]int = [5]int{1, 2, 3, 4, 5} // fixed size
length := len(numbers) // get the length of the array also works for strings and slices

// Slices
var numbers []int = []int{1, 2, 3, 4, 5} // similar to arrays but with dynamic size
numbers := append(numbers, 6) // append an element to the slice creates a new slice (reassigning numbers)
// cap will give the capacity of the slice
// but they are actually chunks to arrays

// Maps
map[keyType]valueType
var person map[string]string = map[string]string{
"name": "John",
"age": "25",
}
```
