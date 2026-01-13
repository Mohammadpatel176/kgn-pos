import { createRequire } from "module";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);

// ✅ ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/kgn-pos/",

  plugins: [
    preact({
      babel: {
        cwd: require.resolve("@preact/preset-vite"),
      },
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {

      "@": path.resolve(__dirname, "./src"),

      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    cssCodeSplit: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
});
