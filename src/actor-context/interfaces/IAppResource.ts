import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';

export type IAppResourceSearchOptions = {
  meilisearchIndex: string;

  searchable: string[];
  filterable: string[];
  sortable: string[];

  getSearchableDataView: (data: any) => string[] | any;
};

export type IAppResource<T extends ObjectLiteral = any, R extends Repository<T> = Repository<T>> = {
  resource: string;

  search: null | IAppResourceSearchOptions;

  getTypeormEntity: () => T;

  getTypeormRepositoryFactory: () => (dataSource: DataSource | EntityManager) => R;
};
