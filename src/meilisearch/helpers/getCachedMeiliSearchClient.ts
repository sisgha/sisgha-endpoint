import { MeiliSearch } from 'meilisearch';
import { getMeiliSearchClient } from './getMeilisearchClient';

let clientCache: MeiliSearch | null = null;

export const getCachedMeiliSearchClient = async (
  forceRecreate = false,
): Promise<MeiliSearch> => {
  if (!clientCache || forceRecreate) {
    clientCache = await getMeiliSearchClient();
  }

  return clientCache;
};
