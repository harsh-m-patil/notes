# Rust
- a low level systems programming language
- ahead of time compiled   

**Cargo** : Dependency Manager and build tool for rust 
## Introduction

### Rustup
> CLI tool for managing rust versions

**Update** : `rustup update`
**Uninstall** : `rustup self uninstall`
**Documentation** : `rustup doc`

### Code 

> File naming convention main.rs for multiple worlds use '_' hello_world.rs   

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

1. **main()** : __the first function to be executed__
2. **println!("Hello world")** : __println! is a macro not a function println() is a function__   

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


