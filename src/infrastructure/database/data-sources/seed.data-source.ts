import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getEnvironmentConfigService } from './utils/get-environment-config-service';

export const getSeedDataSource = async (environmentConfigServiceBase: EnvironmentConfigService | null = null) => {
  const environmentConfigService = await getEnvironmentConfigService(environmentConfigServiceBase);

  const options = environmentConfigService.getTypeORMSeedDataSourceOptions();

  return new DataSource(options as DataSourceOptions);
};

const seedDataSource = getSeedDataSource();

export default seedDataSource;
