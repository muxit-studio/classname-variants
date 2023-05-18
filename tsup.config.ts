import { defineConfig } from "tsup-preset-solid";

export default defineConfig(
  [
    {
      entry: "src/index.ts",
    },
    {
      entry: "src/solid.tsx",
    },
  ],
  {
    // Enable this to write export conditions to package.json
    writePackageJson: true,
    dropConsole: true,
    cjs: true,
  }
);
