import { DataSource, DataSourceOptions } from 'typeorm';
import { getSharedDataSourceOptions } from '../config/getSharedDataSourceOptions';
import { getPathSeeds } from '../config/getPaths';

const getSeedDataSource = () => {
  const options = {
    ...getSharedDataSourceOptions(),

    migrations: [`${getPathSeeds()}/**/*{.ts,.js}`],

    migrationsTableName: 'app_migration_seed',
  };

  if (!options.type) {
    return null;
  }

  return new DataSource(options as DataSourceOptions);
};

const seedDataSource = getSeedDataSource();

export default seedDataSource;
