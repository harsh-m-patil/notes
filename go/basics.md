## Basics

- Go is a statically typed and compiled language.

```go
package main // package declaration is mandatory

import "fmt" // fmt is a package that provides I/O functions

func main() { // main function is the entry point of the program
    // (one per package)
    fmt.Println("Hello, World!")
    *int x = 5
    fmt.Printf("Value of x is %d", x)
	
    /* NOTE: format specifiers
    %d is a format specifier for integers
    %f is a format specifier for floats
    %s is a format specifier for strings
    %v is a format specifier for any value
    */
    // Taking input
    var name string
    fmt.Scanln(&name) // & is used to get the address of the variable
}
```

- Go CLI

```bash
go run <filename>.go # run the go program
go build <filename>.go # compile the go program
./<filename> # run the compiled program
go mod init <module-name> # initialize a module
```
