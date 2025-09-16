import apiClient from "./apiClient";

export const authService = {
	// Authentication service methods will be implemented here
	login: async (credentials: { email: string; password: string }) => {
		// TODO: Implement login functionality
		return apiClient.post("/auth/login", credentials);
	},

	register: async (userData: { email: string; password: string }) => {
		// TODO: Implement register functionality
		return apiClient.post("/auth/register", userData);
	},

	logout: async () => {
		// TODO: Implement logout functionality
		localStorage.removeItem("token");
		return apiClient.post("/auth/logout");
	},

	// Check if user is authenticated
	isAuthenticated: (): boolean => {
		const token = localStorage.getItem("token");
		return !!token;
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
