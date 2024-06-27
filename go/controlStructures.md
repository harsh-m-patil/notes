## Control Structures

- if else
- switch
- for loop

**There is no `while` loop in Go.**

- No parantheses are required around the condition

### If else statement

```go
// NOTE: No ternary operator in Go

func main() {
    age := 17

    if (age < 18) {
        fmt.Println("Not an adult")
    } else {
        fmt.Println("Adult")
    }

    // we can create multiple expressions separated by ;
    if message:="Hello"; age < 18 { // message is only available in this block
        fmt.Println(message, "Not an adult")
    } else {
        fmt.Println(message, "Adult")
    }
}
```

### Switch statement

```go
// NOTE: Go does not have automatic fallthrough, so we need to use the fallthrough keyword
// no break
switch day {
    case "Monday":
        fmt.Println("Start of the week")
    case "Saturday":
        fallthrough
    case "Sunday":
        fmt.Println("Weekend")
    default:
        fmt.Println("Another Workday")
}

// can replace large ifs
switch {
    case age < 18:
        fmt.Println("Not an adult")
    case age < 60:
        fmt.Println("Adult")
    default:
        fmt.Println("Senior Citizen")
}
```

### For loop

```go
// Classic for loop
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// for range similar to for in
for index := range collection {
    // we get index
    fmt.Println(index)
}

// For range,similar to foreach
for key,value := range map {
    fmt.Println(key, value)
}

// we can emulate while loop just by using a boolean expression
endOfGame := false

for endOfGame {
    // do something
}

for count < 5 {
    // do something
}

for {
    // infinite loop
}
```
