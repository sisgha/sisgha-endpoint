import { DataSource, EntityManager, ObjectLiteral, Repository } from 'typeorm';

export type IMeiliSearchIndexDefinition<
  T extends ObjectLiteral = any,
  R extends Repository<T> = Repository<T>,
> = {
  index: string;

  primaryKey: string;

  searchable: string[];
  filterable: string[];
  sortable: string[];

  getSearchableDataView: (data: any) => string[] | any;

  getTypeormEntity: () => T;

  getTypeormRepositoryFactory: () => (
    dataSource: DataSource | EntityManager,
  ) => R;
};
