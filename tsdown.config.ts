import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/register.ts"],
  format: "esm",
  platform: "node",
  target: "node24",
});
