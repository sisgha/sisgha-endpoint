import { DataSourceOptions } from 'typeorm';

export interface ITypeORMDataSourceConfig {
  getTypeORMSharedDataSourceOptions(): Partial<DataSourceOptions>;

  getTypeORMAppDataSourceOptions(): DataSourceOptions;

  getTypeORMMigrationDataSourceOptions(): DataSourceOptions;

  getTypeORMSeedDataSourceOptions(): DataSourceOptions;
}
