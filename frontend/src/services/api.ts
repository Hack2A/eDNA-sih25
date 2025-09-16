import apiClient from "./apiClient";

// Generic API service functions
export const apiService = {
	// GET request
	get: async (url: string, config?: any) => {
		return apiClient.get(url, config);
	},

	// POST request
	post: async (url: string, data?: any, config?: any) => {
		return apiClient.post(url, data, config);
	},

	// PUT request
	put: async (url: string, data?: any, config?: any) => {
		return apiClient.put(url, data, config);
	},

	// PATCH request
	patch: async (url: string, data?: any, config?: any) => {
		return apiClient.patch(url, data, config);
	},

	// DELETE request
	delete: async (url: string, config?: any) => {
		return apiClient.delete(url, config);
	},
};

// Specific API endpoints can be organized here
export const pipelineAPI = {
	// Pipeline related API calls
	uploadData: async (formData: FormData) => {
		return apiClient.post("/pipeline/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	},

	getResults: async (id: string) => {
		return apiClient.get(`/pipeline/results/${id}`);
	},

	getSpecieDetails: async (specieId: string) => {
		return apiClient.get(`/species/${specieId}`);
	},
};

export const speciesAPI = {
	// Species related API calls
	searchSpecies: async (query: string, filters?: any) => {
		return apiClient.get("/species/search", {
			params: { query, ...filters },
		});
	},

	getSpeciesList: async (page: number = 1, limit: number = 10) => {
		return apiClient.get("/species", {
			params: { page, limit },
		});
	},

	getDiversityData: async () => {
		return apiClient.get("/diversity/data");
	},
};

// Export the axios instance for direct use when needed
export { default as apiClient } from "./apiClient";
