import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';

export type IAppResource<T extends ObjectLiteral = any, R extends Repository<T> = Repository<T>> = {
  resource: string;

  searchable: string[];
  filterable: string[];
  sortable: string[];

  getTypeormEntity: () => T;

  getSearchableDataView: (data: any) => string[] | any;

  getTypeormRepositoryFactory: () => (dataSource: DataSource | EntityManager) => R;
};
