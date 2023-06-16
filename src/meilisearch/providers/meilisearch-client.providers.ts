import { Provider } from '@nestjs/common';
import { getMeiliSearchClient } from '../helpers/getMeilisearchClient';
import { MEILISEARCH_CLIENT } from '../consts/MEILISEARCH_CLIENT.const';

export const MeiliSearchClientFactory: Provider = {
  provide: MEILISEARCH_CLIENT,

  useFactory: async () => {
    const client = await getMeiliSearchClient();
    return client;
  },

  inject: [],
};

export const meiliSearchClientProviders = [MeiliSearchClientFactory];
