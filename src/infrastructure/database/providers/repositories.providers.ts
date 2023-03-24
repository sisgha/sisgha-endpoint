import { Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DATA_SOURCE } from '../constants/DATA_SOURCE';

export const makeRepositoryProvider = <R extends Repository<any>>(
  key: any,
  factory: (dataSource: DataSource) => R,
): Provider => ({
  provide: key,
  useFactory: (dataSource: DataSource) => factory(dataSource),
  inject: [DATA_SOURCE],
});

export const repositoriesProviders = [
  //
];
