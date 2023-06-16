import { MeiliSearch } from 'meilisearch';
import { APP_RESOURCES } from 'src/actor-context/providers';
import { getMeiliSearchConfig } from './getMeiliSearchConfig';
import { setupIndex } from './setupIndex';

export const getMeiliSearchClient = async () => {
  const config = getMeiliSearchConfig();

  const client = new MeiliSearch({
    host: config.host,
    apiKey: config.apiKey,
  });

  for (const appResource of APP_RESOURCES) {
    await setupIndex(client, appResource);
  }

  return client;
};
