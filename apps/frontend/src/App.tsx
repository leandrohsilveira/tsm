import { component, state } from "@jsxrx/core"

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
      <>
        <div>Count is {count}</div>
        <div>
          <button type="button" onClick={increase}>
            Increase
          </button>
          <button type="button" onClick={decrease}>
            Decrease
          </button>
        </div>
      </>
    )
  },
})
