import { Provider } from '@nestjs/common';
import { MEILISEARCH_CLIENT } from 'src/meilisearch/constants/MEILISEARCH_CLIENT.const';
import { getMeiliSearchClient } from '../helpers/getMeilisearchClient';

export const MeiliSearchClientFactory: Provider = {
  provide: MEILISEARCH_CLIENT,

  useFactory: async () => {
    const client = await getMeiliSearchClient();
    return client;
  },

  inject: [],
};

export const meiliSearchClientProviders = [MeiliSearchClientFactory];
