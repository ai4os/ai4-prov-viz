export const Api = {
  baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:80",
  provGraph: "/rdf-graph",
  provDate: "/rdf-date",
  detailsMetadata: "/details-metadata",
};

export const LLMApi = {
  baseURL: import.meta.env.VITE_LLM_URL,
  chat: "/ai4eosc/chat",
};
