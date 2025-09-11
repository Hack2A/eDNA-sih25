/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				"space-grotesk": ["Space Grotesk", "sans-serif"],
				sans: [
					"Space Grotesk",
					"ui-sans-serif",
					"system-ui",
					"sans-serif",
				],
			},
			fontWeight: {
				light: "300",
				normal: "400",
				medium: "500",
				semibold: "600",
				bold: "700",
			},
			colors: {
				primary: "#131E24",
				secondary: "#1A2832",
				accent: "#2A4A5A",
				highlight: "#0088ff",
				success: "#10B981",
				warning: "#F59E0B",
				error: "#EF4444",
				info: "#3B82F6",
				light: "#F8FAFC",
				dark: "#0F172A",
				muted: "#64748B",
				border: "#E2E8F0",
				surface: "#FFFFFF",
				"surface-dark": "#1E293B",
			},
			backgroundColor: {
				primary: "#131E24",
				secondary: "#1A2832",
				accent: "#2A4A5A",
				highlight: "#0088ff",
				"surface-dark": "#1E293B",
			},
			textColor: {
				primary: "#131E24",
				secondary: "#1A2832",
				accent: "#2A4A5A",
				highlight: "#0088ff",
				muted: "#64748B",
				light: "#F8FAFC",
				dark: "#0F172A",
			},
			borderColor: {
				primary: "#131E24",
				secondary: "#1A2832",
				accent: "#2A4A5A",
				highlight: "#0088ff",
				muted: "#64748B",
			},
		},
	},
	plugins: [],
};
