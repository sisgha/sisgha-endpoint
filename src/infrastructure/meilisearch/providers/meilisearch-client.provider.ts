import { Provider } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { MEILISEARCH_CLIENT_TOKEN } from '../tokens/MEILISEARCH_CLIENT_TOKEN';
import { SetupMeiliSearchUtil } from '../utils/SetupMeiliSearchUtil';

export const meiliSearchClientProvider: Provider = {
  provide: MEILISEARCH_CLIENT_TOKEN,

  useFactory: async (environmentConfigService: EnvironmentConfigService) => {
    const { host, apiKey } = environmentConfigService.getMeiliSearchConfig();

    const client = new MeiliSearch({ host, apiKey });

    const setupMeiliSearchUtil = new SetupMeiliSearchUtil();

    await setupMeiliSearchUtil.setupInstance(client);

    return client;
  },

  inject: [
    // ...
    EnvironmentConfigService,
  ],
};
