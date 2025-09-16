import axios from "axios";
import type {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./authService";

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
	baseURL: "/api", // Proxied to actual API in dev mode
	timeout: 120000, // 2 minutes timeout for file uploads and ML processing
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add authorization token
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Ensure headers object exists
		config.headers = config.headers ?? {};

		// Prefer authService.getToken() in case token management is centralized there
		const token = authService?.getToken
			? authService.getToken()
			: localStorage.getItem("token");

		// Add authorization header if token exists
		if (token) {
			// Some TS setups expect headers to be an object with string values
			// We set the Authorization header directly
			// @ts-ignore
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error) => {
		// Handle common error scenarios
		if (error.response?.status === 401) {
			// Unauthorized - clear token and redirect to login
			localStorage.removeItem("token");
			// Optionally redirect to login page
			window.location.href = "/";
		} else if (error.response?.status === 403) {
			// Forbidden - handle as needed
			console.error("Access forbidden");
		} else if (error.response?.status >= 500) {
			// Server errors
			console.error(
				"Server error:",
				error.response?.data?.message || "Internal server error"
			);
		}

		return Promise.reject(error);
	}
);

export default apiClient;
