## GO Routines

- Go way of doing concurrency
- Lightweight threads
- we open a new go routine by using the keyword `go` followed by the function call

```go
package main

import (
	"fmt"
	"time"
)

func printMessage(text string) {
	for i := 0; i < 10; i++ {
		fmt.Println(text)
		time.Sleep(800 * time.Millisecond)
	}
}

func main() {
	go printMessage("Go is Great")
	printMessage("we miss classes")
    // NOTE: Go routines
    // if both are go routines main function will return before
}
```
