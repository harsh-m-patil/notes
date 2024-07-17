- Filename should be xxx_test.go
- test function must start with Test
- it takes only one arg `t *testing.T`
- import `testing`

```go
package main

import "testing"

func TestHello(t *testing.T) {
	t.Run("saying hello to people", func(t *testing.T) {
		got := Hello("Harsh")
		want := "Hello Harsh"

		assertCorrectMessage(t, got, want)
	})

	t.Run("say 'Hello World' if empty string is passed", func(t *testing.T) {
		got := Hello("")
		want := "Hello World"
		assertCorrectMessage(t, got, want)
	})
}

func assertCorrectMessage(t testing.TB, got, want string) {
	t.Helper() // tells that this function is a helper
	if got != want {
		t.Errorf("got %q want %q", got, want)
	}
}

```
