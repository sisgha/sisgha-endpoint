import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';
import { getEnvironmentConfigService } from './utils/get-environment-config-service';

export const getMigrationDataSource = async (environmentConfigServiceBase: EnvironmentConfigService | null = null) => {
  const environmentConfigService = await getEnvironmentConfigService(environmentConfigServiceBase);

  const options = environmentConfigService.getTypeORMMigrationDataSourceOptions();

  const dataSource = new DataSource(options as DataSourceOptions);

  return dataSource;
};

const migrationDataSource = getMigrationDataSource();

export default migrationDataSource;
