# React

## Creating and nesting a component

- Component : piece of UI that has its own logic and appearance
- Must Start with capital letter

```jsx
function MyButton() {
  // To distinguish from html tags
  return <button>I'm a button</button>;
}

export default function MyApp() {
  // export default specifies the main component of file
  return (
    <div>
      <h1>Hello World</h1>
      <MyButton />
    </div>
  );
}
```

## JSX

- Stricter than html
- Have to close tags like `<br/>`
- component can't return multiple JSX tags have to wrap them in a parent

- HTML to JSX : [tool](https://transform.tools/html-to-jsx)

```jsx
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>
        Hello there <br /> How do you do
      </p>
    </>
  );
}
```

### Styles

- Add styles using `className` similar as the class a attrubute in HTML
- or using `style={{}}`

```jsx
<img src={user.image} className="avatar" />

<img src={user.image} style={{height:user.imageSize}} />
// {{}} creating a {} inside the js mode
```

### Conditional Rendering

- Use JS for conditional rendering

```jsx
let content;

if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}

return <div>{content}</div>;
```

- Use of ternary operator

```jsx
<div>
	{ isLoggedIn ? (
        <AdminPanel/>
    ) :(
        <LoginForm />
    )}
<div/>
```

- Using `&&` operator if no else part is needed

```jsx
<div>{isLoggedIn && <AdminPanel />}</div>
```

### Rendering Lists

- Use `array.map(el => html element or component)`

### Responding To Events

```jsx
function MyButton() {
	function handleClick() {
		alert('You Clicked Me')
	}

	return (
		<button onClick={handleClick}>
			Click Me
		<button/>
	)
}
```

### Updating the Screen

```jsx
import { useState } from "react";

// If rendered multiple times each will get its own state
export default function MyButton() {
  // Names can be anything but convention is foo,setFoo
  const [count, setCount] = useState(0);

  const handleClick = function () {
    setCount(count + 1); // new state is created
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    //NOTE: this will only increament this once due to batching
    // to overcome this use callback
  };

  return <button onClick={handleClick}>Clicked {count} Times</button>;
}
```

### React-Fiber [Github](https://github.com/acdlite/react-fiber-architecture)

#### Reconciliation

- the algorithm that React uses to diff the virtual DOM and the real DOM to determine what needs to be updated
