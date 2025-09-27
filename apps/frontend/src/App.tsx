import { component, state } from "@jsxrx/core"
import Button from "./components/ui/Button.js"
import Login from "./components/auth/Login.js"

export default component({
  name: "App",
  pipe() {
    const count = state(0)
    return {
      count,
      increase() {
        count.set(count.value + 1)
      },

      decrease() {
        count.set(count.value - 1)
      },
    }
  },
  render({ count, increase, decrease }) {
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
  },
})
