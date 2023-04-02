import { DataSource, EntityManager } from 'typeorm';
import { DeletedRowsLogDbEntity } from '../entities/deleted-rows-log.db';

export type IDeletedRowsLoRepository = ReturnType<
  typeof getDeletedRowsLogRepository
>;

export const getDeletedRowsLogRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(DeletedRowsLogDbEntity).extend({});
