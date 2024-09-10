## HTTP Server

```go
// NOTE: http.Request is a struct that holds info about current request
func home(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Hello from SnippetBox"))
}

func main() {
    // Use the http.NewServeMux() function to initialize a new servermux,then
    // register the home function as the handler for the "/" URL pattern.

    mux := http.NewServeMux()
    // NOTE: currently all paths will resolve to home function
    // Go treats "/" as catch all
    mux.HandleFunc("/", home) // host name matching also supported
    // for example foo.example.org/

    // Use the http.ListenAndServe() function to start a web server
    // it takes two parameters:TCP network addr and the servermux we created
    // if it returns a error we log it
    err := http.ListenAndServe(":5000", mux)
    // can used named ports such as :http or :http-alt
    if err != nil {
        log.Fatal(err) // also calls os.Exit(1)
    }
    log.Println("Server running on localhost:5000")
}
```

### Fixed Paths VS Sub-tree Paths

- paths not ending with / are fixed paths
- sub-tree paths end with a trailing slash /

**Fixed Paths**

- Only matched when the request URL exactly matches

**Sub-tree Paths**

- Act like wildcards /\*\*
- will match with / and /(anything-here)

### Restricting the / handler

```go
func home(w http.ResponseWriter, r *http.Request) {

    if r.URL.Path != "/" {
        http.NotFound(w,r) // returns 404 status code
        return
    }
    w.Write([]byte("Hello from SnippetBox"))
}
```

### Default ServeMux

> If you’ve been working with Go for a while you might have come across
> the http.Handle() and http.HandleFunc() functions. These allow you
> to register routes without declaring a servemux, like this

```go
func main() {
    http.HandleFunc("/", home)
    http.HandleFunc("/snippet", showSnippet)
    http.HandleFunc("/snippet/create", createSnippet)
    log.Println("Starting server on :4000")
    err := http.ListenAndServe(":4000", nil)
    log.Fatal(err)
}

/*
This global varible from net/http is being used here
var DefaultServeMux = NewServeMux()
WARNING: Do not use DefaultServeMux for security reasons
*/
```

## http.Handler

> An object(type) which satisfies the http.Handler interface

```go
type Handler interface {
ServeHTTP(ResponseWriter, *Request)
}
```

> This means that this type must have the ServerHTTP() method with the same signature

```go
func (h *home) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("This is my home page"))
}
```

**We can use the home struct as a handler**

```go
mux := http.NewServeMux()
mux.Handle("/", &home{})

```

> This method is a bit-confusing instead we write it as a normal function

```go
func home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("This is my home page"))
}

// since home is not a type(object) anymore we have to do the below
// to transform it into a handler

mux := http.NewServeMux()
mux.Handle("/", http.HandlerFunc(home))

// more easy way
mux := http.NewServeMux()
mux.HandleFunc("/", home)
```

### Serving Static Files

```go
	fileServer := http.FileServer(http.Dir("./ui/static/"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
```
