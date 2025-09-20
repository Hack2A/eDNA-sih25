import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const useProxy = mode === "proxy"; // only when we ran `npm run dev:proxy`
	return {
		plugins: [tailwindcss(), react()],
		server: {
			allowedHosts: [
				"solid-enormously-crane.ngrok-free.app",
				"topical-gratefully-wasp.ngrok-free.app",
			],
			host: true,
			port: 5173,
			proxy: useProxy
				? {
						"/api": {
							target: "https://solid-enormously-crane.ngrok-free.app",
							changeOrigin: true,
							secure: false,
							configure: (proxy: any, _options: any) => {
								proxy.on("proxyReq", (proxyReq: any) => {
									proxyReq.setHeader(
										"ngrok-skip-browser-warning",
										"1"
									);
								});
							},
						},
				  }
				: undefined,
		},
	};
});
