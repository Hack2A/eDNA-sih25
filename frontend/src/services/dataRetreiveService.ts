import apiClient from "./apiClient";

export const dataRetrievalService = {
	fetchLastReports: async () => {
		return apiClient.get("/latest-result");
	},
};
