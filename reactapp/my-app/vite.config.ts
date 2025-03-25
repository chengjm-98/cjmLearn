import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
      },
    }),
    // 其他插件...
  ],
  // 其他配置...
});
