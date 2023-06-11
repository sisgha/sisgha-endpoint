import { MeiliSearch } from 'meilisearch';
import { MeilisearchIndexDefinitions } from '../../actor-context/providers/MeiliSearchIndexDefinitions';
import { getMeiliSearchConfig } from './getMeiliSearchConfig';
import { setupIndex } from './setupIndex';

export const getMeiliSearchClient = async () => {
  const config = getMeiliSearchConfig();

  const client = new MeiliSearch({
    host: config.host,
    apiKey: config.apiKey,
  });

  for (const meilisearchIndexDefinition of MeilisearchIndexDefinitions) {
    await setupIndex(client, meilisearchIndexDefinition);
  }

  return client;
};
