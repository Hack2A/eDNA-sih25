import axios from "axios";

// Use /api which will be proxied to the actual API when running with proxy mode
const API_BASE_URL = "/api";

export const authService = {
	// Authentication service methods will be implemented here
	login: async (credentials: { email: string; password: string }) => {
		// TODO: Implement login functionality
		return axios.post(`${API_BASE_URL}/auth/login`, credentials);
	},

	register: async (userData: { email: string; password: string }) => {
		// TODO: Implement register functionality
		return axios.post(`${API_BASE_URL}/auth/register`, userData);
	},

	logout: async () => {
		// TODO: Implement logout functionality
		return axios.post(`${API_BASE_URL}/auth/logout`);
	},
};
