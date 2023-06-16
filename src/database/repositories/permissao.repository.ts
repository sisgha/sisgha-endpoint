import { ActorType } from 'src/actor-context/interfaces';
import { DataSource, EntityManager } from 'typeorm';
import { CargoDbEntity } from '../entities/cargo.db.entity';
import { PermissaoDbEntity } from '../entities/permissao.db.entity';

export type IPermissaoRepository = ReturnType<typeof getPermissaoRepository>;

export const getPermissaoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(PermissaoDbEntity).extend({
    async createQueryBuilderForUsuarioId(usuarioId: number) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .innerJoin('usuario_cargo.usuario', 'usuario');

      qb.where('usuario.id = :usuarioId', { usuarioId: usuarioId });

      qb.andWhere('usuario.deletedAt IS NULL');
      qb.andWhere('permissao.deletedAt IS NULL');
      qb.andWhere('cargo.deletedAt IS NULL');

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForUsuarioInternoId(usuarioInternoId: number) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioInternoCargo', 'usuario_iterno_cargo')
        .innerJoin('usuario_iterno_cargo.usuarioInterno', 'usuario_interno');

      qb.where('usuario_interno.id = :usuarioInternoId', { usuarioInternoId: usuarioInternoId });

      qb.andWhere('usuario_interno.deletedAt IS NULL');
      qb.andWhere('permissao.deletedAt IS NULL');
      qb.andWhere('cargo.deletedAt IS NULL');

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForActorSimples(actorType: ActorType) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioInternoCargo', 'usuario_interno_cargo')
        .innerJoin('usuario_interno_cargo.usuarioInterno', 'usuario_interno');

      qb.where('usuario_interno.tipoAtor = :tipoAtor', { tipoAtor: actorType });

      qb.andWhere('usuario_interno.deletedAt IS NULL');
      qb.andWhere('permissao.deletedAt IS NULL');
      qb.andWhere('cargo.deletedAt IS NULL');

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForCargoId(cargoId: CargoDbEntity['id']) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo');

      qb.where('cargo.id = :cargoId', { cargoId: cargoId });

      qb.cache(1000);

      return qb;
    },
  });
