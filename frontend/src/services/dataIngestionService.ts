import apiClient from "./apiClient";

// Data ingestion service using centralized API client
export const dataIngestionService = {
	// Upload file for pipeline processing (supports .txt, .csv, .fasta)
	uploadFile: async (file: File, metadata?: any) => {
		const formData = new FormData();
		formData.append("file_type", "file");
		formData.append("data", file);
		if (metadata) {
			formData.append("metadata", JSON.stringify(metadata));
		}

		return apiClient.post("/predict", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			timeout: 300000, // 5 minutes for file uploads and ML processing
		});
	},

	// Legacy method - kept for backward compatibility
	uploadCSV: async (file: File, metadata?: any) => {
		return dataIngestionService.uploadFile(file, metadata);
	},

	// Upload sequence data
	uploadSequence: async (sequenceData: string, format: string = "fasta") => {
		return apiClient.post(
			"/predict",
			{
				file_type: "manual",
				data: sequenceData,
				format,
			},
			{
				timeout: 300000, // 5 minutes for ML processing
			}
		);
	},

	// Legacy method for FormData uploads
	uploadData: async (formData: FormData) => {
		return apiClient.post("/predict", formData);
	},

	// Unified submit function for front-end payloads
	// payload: { file_type: 'manual' | 'file', data: string | File, format?: string, metadata?: any }
	submitSequencePayload: async (payload: {
		file_type: string;
		data: any;
		format?: string;
		metadata?: any;
	}) => {
		if (!payload || !payload.file_type) {
			throw new Error("Invalid payload: missing file_type");
		}

		if (payload.file_type === "manual") {
			// data is expected to be a sequence string
			const sequence = String(payload.data || "");
			if (!sequence)
				throw new Error("No sequence data provided for manual upload");
			return dataIngestionService.uploadSequence(
				sequence,
				payload.format || "fasta"
			);
		}

		if (payload.file_type === "file") {
			// data is expected to be a File (supports .txt, .csv, .fasta)
			const file = payload.data as File;
			if (!file) throw new Error("No file provided for file upload");
			return dataIngestionService.uploadFile(file, payload.metadata);
		}

		throw new Error(`Unsupported file_type: ${payload.file_type}`);
	},

	// Get upload progress
	getUploadProgress: async (uploadId: string) => {
		return apiClient.get(`/pipeline/upload/progress/${uploadId}`);
	},

	// Get processing status
	getProcessingStatus: async (jobId: string) => {
		return apiClient.get(`/pipeline/status/${jobId}`);
	},
};

// Usage examples:
// Manual sequence payload:
// const payload = { file_type: 'manual', data: 'ATGGCGAACGGCGAGG...' }
// dataIngestionService.submitSequencePayload(payload).then(res => console.log(res.data))

// File payload (supports .txt, .csv, .fasta files):
// const file = (event.target as HTMLInputElement).files[0]  // .txt, .csv, or .fasta file
// const payload = { file_type: 'file', data: file, metadata: { source: 'user' } }
// dataIngestionService.submitSequencePayload(payload).then(res => console.log(res.data))
