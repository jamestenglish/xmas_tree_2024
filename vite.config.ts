import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import mkcert from "vite-plugin-mkcert";
// import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [
    // basicSsl(),
    // mkcert(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      // ssr: false,
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: { exclude: [] },
});
