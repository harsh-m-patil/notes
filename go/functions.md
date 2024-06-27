## Functions

### Basics

```go
func hello() {

}

func add(x int, y int) int {
    return x + y
}

// NOTE: multiple return values
func addAndSubtract(x int, y int) (int, int) {
    return x + y, x - y
}
sum, diff := addAndSubtract(10, 5)
addition, _ := addAndSubtract(10, 5) // ignore the second return value

// named return values
func addAndSubtractNamed(x int, y int) (sum int, diff int) {
    sum = x + y
    diff = x - y
    return
}


// functions recieving references
func increment(x *int) {
    *x++
}
```

1. Can return multiple values (at the same time)
2. Can have named return values
3. Arguments can have default values
4. Last Argument can be of variable length
5. Always pass by value

### Panic

```go
// NOTE: Panics are a way to stop the normal execution of a program. It is similar to exceptions in other languages
func main() {
    age := 17
    if (age < 18) {
        panic("Not an adult") // interrupts the program
    }
}

/*
panic: Not an adult

goroutine 1 [running]:
main.main()
        /home/harsh/notes/main.go:7 +0x25
exit status 2
*/
```

### defer

```go
// NOTE: defer is used to delay the execution of a function until the surrounding function returns
func main() {
    defer fmt.Println("Great")
    defer fmt.Println("World")
    fmt.Println("Hello")
}

// Output:
/*
Hello
World
Great
*/
```

### Error Design Pattern

```go
// NOTE: Go does not have exceptions, so error handling is done by returning an error as a second return value
func readUser(id int) (user,err) {
    // ... we proceed with the reading and see a bool ok value
    if ok {
        return user, nil
    } else {
        return nil,errorDetails
    }
}
func main() {
    user, err := readUser(1)
    if err != nil {
        fmt.Println("Error reading user", err)
        return
    }
    fmt.Println("User", user)
}
```

### Methods

- OOP like methods

```go
type (
    distance   float64
    distanceKm float64
)
// NOTE: OOP like methods
// This is a method for the type given in the special arguement
func (miles distance) ToKm() distanceKm {
    // miles distance is a special arguement
    return distanceKm(1.60934 * miles)
}

// miles distance is a special arguement
func (miles distanceKm) ToMiles() distance {
    return distance(miles / 1.60934)
}

func Test() {
    d := distance(3.45)
    km := d.ToKm()
    miles := km.ToMiles()
    fmt.Println(d, km, miles)
}
```
