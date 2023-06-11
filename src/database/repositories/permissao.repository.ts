import { ActorType } from 'src/actor-context/interfaces';
import { DataSource, EntityManager } from 'typeorm';
import { PermissaoDbEntity } from '../entities/permissao.db.entity';

export type IPermissaoRepository = ReturnType<typeof getPermissaoRepository>;

export const getPermissaoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(PermissaoDbEntity).extend({
    async createQueryBuilderForUser(userId: number) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .innerJoin('usuario_cargo.usuario', 'usuario');

      qb.where('usuario.id = :usuarioId', { usuarioId: userId });

      qb.andWhere('usuario.deletedAt IS NULL');
      qb.andWhere('permissao.deletedAt IS NULL');
      qb.andWhere('cargo.deletedAt IS NULL');

      return qb;
    },

    async createQueryBuilderForActorSimples(actorType: ActorType) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.atorSimplesCargo', 'ator_simples_cargo')
        .innerJoin('ator_simples_cargo.atorSimples', 'ator_simples');

      qb.where('ator_simples.tipo = :tipo', { tipo: actorType });

      qb.andWhere('ator_simples.deletedAt IS NULL');
      qb.andWhere('permissao.deletedAt IS NULL');
      qb.andWhere('cargo.deletedAt IS NULL');

      return qb;
    },
  });
