import { state } from "@jsxrx/core"
import Login from "./components/auth/Login.js"
import Button from "./components/ui/Button.js"

export default function App() {
  const count = state(0)
  function increase() {
    count.set(count.value + 1)
  }

  function decrease() {
    count.set(count.value - 1)
  }

  return (
    <Login>
      <div>Count is {count}</div>
      <div className="flex gap-1">
        <Button type="button" onClick={increase}>
          Increase
        </Button>
        <Button type="button" onClick={decrease}>
          Decrease
        </Button>
      </div>
    </Login>
  )
}
