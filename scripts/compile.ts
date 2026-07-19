import aiGenPlugin from "./ai-codegen-plugin";

await Bun.build({
  entrypoints: ["./"],
  outdir: "./build",
  target: "bun",
  plugins: [aiGenPlugin()],
});
