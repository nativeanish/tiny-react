/** @jsx createElement */
import { createElement, useState, useEffect } from "./framework";

export function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count, "Increased");
  }, [count]);

  return (
    <div>
      <h1>My Tiny React</h1>
      <p>Counter: {count}</p>
      <button onclick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
