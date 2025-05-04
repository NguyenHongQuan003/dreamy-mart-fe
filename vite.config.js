import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    allowedHosts: [
      "98ff-2402-800-6305-970-e997-e244-4412-85fa.ngrok-free.app" // 👈 thêm dòng này
    ]
  },
});
