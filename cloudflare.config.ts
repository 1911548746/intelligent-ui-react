import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "intelligent-ui-react",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-25",
    compatibilityFlags: ["nodejs_compat"],
    // Match the existing Worker's Dashboard settings on the first CI deploy.
    workersDev: true,
    previewUrls: false,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      // Keep production settings in source control so cf deploy preserves them.
      LLM_BASE_URL: bindings.text("https://api.siliconflow.cn/v1"),
      LLM_MODEL: bindings.text("deepseek-ai/DeepSeek-V4.1-Flash"),
      LLM_ENABLE_THINKING: bindings.text("false"),
      LLM_REASONING_EFFORT: bindings.text("low"),
      // Set the value as a Secret in the Worker Dashboard, never in this file.
      LLM_API_KEY: bindings.secret(),
    },
  }),
});
