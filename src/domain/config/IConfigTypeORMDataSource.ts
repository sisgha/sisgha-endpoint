import { DataSourceOptions } from 'typeorm';

export interface IConfigTypeORMDataSource {
  getTypeORMSharedDataSourceOptions(): Partial<DataSourceOptions>;

  getTypeORMAppDataSourceOptions(): DataSourceOptions;

  getTypeORMMigrationDataSourceOptions(): DataSourceOptions;

  getTypeORMSeedDataSourceOptions(): DataSourceOptions;
}
