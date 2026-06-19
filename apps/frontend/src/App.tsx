import { Suspense } from "@jsxrx/core"
import Splashscreen from "./components/ui/Splashscreen.js"
import { BrowserRouter } from "@jsxrx/router/browser"
import { routes } from "./routes.js"

export default function App() {
  return (
    <Suspense fallback={<Splashscreen />} tolerance={250}>
      <BrowserRouter routes={routes} />
    </Suspense>
  )
}
