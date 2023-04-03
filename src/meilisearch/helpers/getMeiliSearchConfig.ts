export const getMeiliSearchConfig = () => {
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!host || !apiKey) {
    throw new Error('MeiliSearch host or API key not found');
  }

  return { host, apiKey };
};
