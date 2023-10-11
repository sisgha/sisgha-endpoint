import { DataSource, EntityManager } from 'typeorm';
import { ModalidadeDbEntity } from '../entities/modalidade.db.entity';

export type IModalidadeRepository = ReturnType<typeof getModalidadeRepository>;

export const getModalidadeRepository = (dataSource: DataSource | EntityManager) => dataSource.getRepository(ModalidadeDbEntity).extend({});
