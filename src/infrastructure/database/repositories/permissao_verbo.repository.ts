import { DataSource, EntityManager } from 'typeorm';
import { PermissaoVerboDbEntity } from '../entities/permissao_verbo.db.entity';

export type IPermissaoVerboRepository = ReturnType<typeof getPermissaoVerboRepository>;

export const getPermissaoVerboRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(PermissaoVerboDbEntity).extend({
    createQueryBuilderByPermissaoId(permissaoId: number) {
      const qb = this.createQueryBuilder('permissao_verbo');

      qb.innerJoin('permissao_verbo.permissao', 'permissao');
      qb.where('permissao.id = :permissaoId', { permissaoId });

      return qb;
    },

    deleteByPermissaoId(permissaoId: number) {
      return this.createQueryBuilderByPermissaoId(permissaoId).delete().execute();
    },
  });
