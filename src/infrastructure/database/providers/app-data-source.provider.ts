import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { APP_DATA_SOURCE_TOKEN } from '../tokens/APP_DATA_SOURCE_TOKEN';

export const appDataSourceProvider: Provider = {
  provide: APP_DATA_SOURCE_TOKEN,

  useFactory: async (environmentConfigService: EnvironmentConfigService) => {
    const options = environmentConfigService.getTypeORMAppDataSourceOptions();

    const dataSource = new DataSource(options);

    console.log('[INFO] app data source created.');

    console.log('[INFO] initializing app data source...');

    const initializePromise = dataSource.initialize();

    initializePromise
      .then(() => {
        console.log('[INFO] app data source initialized.');
      })
      .catch(() => {
        console.log('[INFO] app data source can not be initialized.');
      });

    return initializePromise;
  },

  inject: [EnvironmentConfigService],
};
