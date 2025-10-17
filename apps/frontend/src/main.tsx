import { createRoot } from "@jsxrx/core/dom"
import App from "./App.jsx"
import { createDebugLogger } from "@jsxrx/core"

createRoot(document.querySelector("[root]"), {
  logger: createDebugLogger(["batchEvents"]),
}).mount(<App />)
