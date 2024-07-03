## Command Line

### Taking Arguments

```go
import "flag"
// arg name,default value,description
addr := flag.String("addr", ":5000", "HTTP network address")
// flag.String() converts to string
// methods for other types also available

flag.Parse() // should be after

// can use addr as *addr
```

> -help available for help

### Environment Variables

```go
import "os"

os.Getenv("VAR_NAME")
```