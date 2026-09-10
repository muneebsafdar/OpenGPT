import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    // Option A: Allow all tunneling hosts (Recommended for development)
    allowedHosts: true,

    // Option B: Allow only your specific ngrok hostname (without https://)
    // allowedHosts: ["unalterable-tabetha-seasonedly.ngrok-free.dev"],
  },
});