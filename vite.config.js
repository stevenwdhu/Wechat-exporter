import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VitePluginElementPlus from "vite-plugin-element-plus";
import Components from "unplugin-vue-components/vite";
import ViteComponents, {
  ElementPlusResolver,
} from "unplugin-vue-components/resolvers";
import { join } from "path";

require("dotenv").config({ path: join(process.cwd(), ".env") });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: join(__dirname, "src/renderer"),
    base: "./",
    server: {
      port: process.env.PORT,
    },
    resolve: {
      alias: {
        "@": join(__dirname, "src/renderer"),
      },
    },
    plugins: [
      vue(),
      VitePluginElementPlus({
        format: mode === "development" ? "esm" : "cjs",
      }),
      Components({
        dirs: ["./components"],
        deep: true,
        extensions: ['vue'],
        resolvers: [ElementPlusResolver()],
      }),
    ],
    build: {
      outDir: join(__dirname, "dist/renderer"),
      minify: false,
    },
    optimizeDeps: {
      exclude: ["electron"],
    },
  };
});
