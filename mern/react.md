# React

## Creating and nesting a component

> component a piece of ui that has its own logic and appearance

```jsx
// Components must start with a capital letter
function MyButton() {
  return <button>I'm a button</button>;
}

// can't return multiple elements
// wrap them in a div or a fragment <></>
// NOTE: https://transform.tools/html-to-jsx
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my App</h1>
      <MyButton />
    </div>
  );
}
```

- Adding Styles

```jsx
<img className="avatar" />
```

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```
