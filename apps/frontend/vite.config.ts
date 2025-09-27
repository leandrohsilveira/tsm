import path from "node:path"
import { jsxRX } from "@jsxrx/vite-plugin"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { mockDevServerPlugin } from "vite-plugin-mock-dev-server"

export default defineConfig({
  plugins: [jsxRX(), tailwindcss(), mockDevServerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "^/api": "http://example.com/",
    },
  },
})
