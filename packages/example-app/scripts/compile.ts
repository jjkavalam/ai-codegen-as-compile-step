import aiGenPlugin from "ai-codegen-plugin";

await Bun.build({
  entrypoints: ["./src"],
  outdir: "./build",
  target: "bun",
  plugins: [aiGenPlugin()],
});
