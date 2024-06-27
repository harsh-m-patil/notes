# Rust

- a low level systems programming language
- ahead of time compiled (first compiled then run the binary)
- statically typed (variable data type is known at compile time)

**Cargo** : Dependency Manager and build tool for rust

## Introduction

### Rustup

> CLI tool for managing rust versions

**Update** : `rustup update`
**Uninstall** : `rustup self uninstall`
**Documentation** : `rustup doc`

### Code

> File naming convention main.rs for multiple worlds use '\_' hello_world.rs

`main.rs`

```rust
fn main() {
    println!("Hello World");
}
```

**Compiling the code** : `rustc main.rs`

- extra file `main.pdb` is created on windows that contains debugging info
  **Running the code** : `./main`

#### Anatomy of a rust program

1. **main()** : **the first function to be executed**
2. **println!("Hello world")** : **println! is a macro not a function println() is a function**

### Cargo

> Rust's build system and package manager

**Creating a project** : `cargo new project_name`

- This creates a new project and git directory named project_name
- packages of code are reffered as crates

**Building and Running cargo project**

`cargo build`

- Creates a executable `target/debug/hello_cargo`
- because default build is debug build

```
.
├── Cargo.lock -> keeps track of the exact versions of dependencies of project
├── Cargo.toml -> configuration file
├── src -> all code goes in this directory
│   └── main.rs
└── target
    ├── CACHEDIR.TAG
    └── debug
        ├── build
        ├── deps
        ├── examples
        ├── hello_cargo -> executable
        ├── hello_cargo.d
        └── incremental

8 directories, 6 files
```

`cargo run`

- this compiles the code and runs it in the same command

`cargo check`

- quickly checks your code to make sure it compiles

`cargo build --release`

- compile it with optimizations for release in `target/release`

## Common Programming Concepts

### Variables and Mutability

1. Variables are immutable by default declared using `let`
2. Make them mutable by using the `mut` keyword
3. `const` exists they can be defined in global scope unlike `let`
4. `const` variables are always immutable
5. Constants named using uppercase letters and underscores as seperators

```rust
const TWO: i32 = 2; // use TWO_NUMBER capital naming

fn main() {
    let mut x = 5; 
    // variables are immutable by default i.e they cannot be changed
    println!("The value of x is {x}");
    x = 6;
    println!("The value of x is {x}");
	
    println!("{TWO}")
}
```

#### Shadowing

> you can declare a new variable with the same name as a previous variable.

```rust
fn main() {
    let x = 5;
	
    let x = x + 1; // can be redeclared new variable is created
	
    {
        let x = x * 2; // this variable will shadow outer variable
	        println!("The value of x in the inner scope is: {x}");
	         // this will be 12
    }
	
    println!("The value of x is: {x}"); 
    // this variable will shadow inner variable and will be 6
}
```

- Can change types with `let`

```rust
    let spaces = "   ";
    let spaces = spaces.len();
    // this will work
```

- if we make the variable `mut` this won't work

```rust
    let mut spaces = "   ";
    spaces = spaces.len();
    // types cannot be changed
    // Error : You are not allowed to mutate a variables type
```

### Data types
