## Pointers

```go

// NOTE: Don't have pointer arithmetic like C
func main() {
    x := 10
    increment(&x) // pass by reference
    fmt.Println(x) // 11
    // can create a pointer to a pointer
    y := &x
    z := &y
    fmt.Println(*y) // 11
    fmt.Println(**z) // 11
}
```
