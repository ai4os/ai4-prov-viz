export const Api = {
  baseURL: import.meta.env.VITE_BACKEND_URL ?? "https://provenance.cloud.ai4eosc.eu",
  provGraph: "/rdf-graph",
  provDate: "/rdf-date",
  detailsMetadata: "/details-metadata",
};

export const LLMApi = {
  baseURL: import.meta.env.VITE_LLM_URL ?? "https://mcp.ai4eosc.predictia.es",
  chat: "/gemini/chat",
};
