import apiClient from "./apiClient";

export const authService = {
	// Authentication service methods will be implemented here
	login: async (credentials: { email: string; password: string }) => {
		return apiClient.post("/auth/login", credentials);
	},

	register: async (userData: { email: string; password: string }) => {
		return apiClient.post("/auth/register", userData);
	},

	logout: async () => {
		localStorage.removeItem("token");
		return apiClient.post("/auth/logout");
	},

	// Check if user is authenticated
	isAuthenticated: (): boolean => {
		const token = localStorage.getItem("token");
		return !!token;
	},

	// Check if user is authenticated with server validation (async)
	validateAuth: async (): Promise<boolean> => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const res = await apiClient.get("/auth/check-auth");
				return res.data.status === "success";
			} catch (error) {
				// Token is invalid, remove it
				localStorage.removeItem("token");
				return false;
			}
		}
		return false;
	},

	// Get stored token
	getToken: (): string | null => {
		return localStorage.getItem("token");
	},

	// Clear stored token
	clearToken: (): void => {
		localStorage.removeItem("token");
	},
};
