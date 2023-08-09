import { DataSource, EntityManager } from 'typeorm';
import { PermissaoRecursoDbEntity } from '../entities/permissao_recurso.db.entity';

export type IPermissaoRecursoRepository = ReturnType<typeof getPermissaoRecursoRepository>;

export const getPermissaoRecursoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(PermissaoRecursoDbEntity).extend({
    createQueryBuilderByPermissaoId(permissaoId: number) {
      const qb = this.createQueryBuilder('permissao_recurso');

      qb.innerJoin('permissao_recurso.permissao', 'permissao');
      qb.where('permissao.id = :permissaoId', { permissaoId });

      return qb;
    },

    deleteByPermissaoId(permissaoId: number) {
      return this.createQueryBuilderByPermissaoId(permissaoId).delete().execute();
    },
  });
