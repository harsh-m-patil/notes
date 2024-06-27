## Types

- In Go we can create type aliases and our own custom types

### Alias

```go
// // this is a alias
type (
	integerAlias = int
	jsonAlias    = map[string]string
)

var x integerAlias
```

### Type Definition

```go
// customType() convertor is availble
type (
	integer int
	json    map[string]string
)

type (
	distance   float64
	distanceKm float64
)
```

### Structs

```go
// NOTE: Similar to C structs
type User struct {
	id   int
	name string
}

func (u User) PrettyPrint() string {
    return string(u.id) + ": " u.name
}
// Struct With Methods
func main() {
	var u1 User
	fmt.Println(u1)
    // Two type of constructors
	u1 = User{id: 1, name: "Harsh"} // named
	u2 := User{1, "NotHarsh"} // unnamed
     
	fmt.Println(u1, u2)
}
```

```go
type Instructor struct {
	Id        int
	FirstName string
	LastName  string
	Score     int
}

func main() {
	// can use new(Type)
	harsh := data.Instructor{
		Id:       3,
		LastName: "Patil",
		Score:    100,
	}
	harsh.FirstName = "Harsh"
    
	fmt.Println(harsh)
}
```
