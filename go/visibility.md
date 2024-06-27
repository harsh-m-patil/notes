## Visibility

- Visibility in Go is determined by the first letter of the identifier.
- If the first letter is uppercase, the identifier is exported (public).
- If the first letter is lowercase, the identifier is not exported (private).

```go
var Name string = "John" // exported
var age int = 25 // unexported

```

- same thing applies to functions, types, etc.
