import { render } from "@jsxrx/core"
import App from "./App.jsx"

await render(<App />, document.querySelector("[root]")).subscribe()
