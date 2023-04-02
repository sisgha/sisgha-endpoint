import { DataSource, DataSourceOptions } from 'typeorm';
import { getSharedDataSourceOptions } from '../config/getSharedDataSourceOptions';
import { getPathMigrations } from "../config/getPaths";

export const getMigrationDataSource = () => {
  const options = {
    ...getSharedDataSourceOptions(),

    migrations: [`${getPathMigrations()}/**/*{.ts,.js}`],

    migrationsTableName: 'app_migration_db',
  };

  if (!options.type) {
    return null;
  }

  return new DataSource(options as DataSourceOptions);
};

const appMigrationDataSource = getMigrationDataSource();

export default appMigrationDataSource;
