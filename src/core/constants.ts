export const Api = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
  provGraph: "/prov-graph",
  provDate: "/provenance-date",
  detailsMetadata: "/details-metadata",
};

export const LLMApi = {
  baseURL: import.meta.env.VITE_LLM_URL,
  chat: "/ai4eosc/chat",
};
