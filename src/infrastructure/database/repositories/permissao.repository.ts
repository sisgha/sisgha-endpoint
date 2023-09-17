import { Brackets, DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { IActor } from '../../../domain/actor';
import { AuthenticatedEntityType } from '../../../domain/authentication';
import { ActorUser } from '../../actor-context/ActorUser';
import { CargoDbEntity } from '../entities/cargo.db.entity';
import { PermissaoDbEntity } from '../entities/permissao.db.entity';

export type IPermissaoRepository = ReturnType<typeof getPermissaoRepository>;

export const getPermissaoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(PermissaoDbEntity).extend({
    async initQueryBuilder() {
      const qb = this.createQueryBuilder('permissao').select(['permissao']);
      return qb;
    },

    async filterQueryByUsuarioId(qb: SelectQueryBuilder<PermissaoDbEntity>, usuarioId: number) {
      qb.innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .innerJoin('usuario_cargo.usuario', 'usuario');

      qb.andWhere('usuario.id = :usuarioId', { usuarioId: usuarioId });

      qb.andWhere('usuario.dateDeleted IS NULL');
      qb.andWhere('permissao.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      return qb;
    },

    async createQueryBuilderByUsuarioId(usuarioId: number) {
      const qb = await this.initQueryBuilder();
      await this.filterQueryByUsuarioId(qb, usuarioId);
      return qb;
    },

    async filterQueryByUsuarioInternoId(qb: SelectQueryBuilder<PermissaoDbEntity>, usuarioInternoId: number) {
      qb.innerJoin('permissao.cargoPermissao', 'cargo_permissao');
      qb.innerJoin('cargo_permissao.cargo', 'cargo');
      qb.innerJoin('cargo.usuarioInternoCargo', 'usuario_interno_cargo');
      qb.innerJoin('usuario_interno_cargo.usuarioInterno', 'usuario_interno');

      qb.andWhere('usuario_interno.id = :usuarioInternoId', { usuarioInternoId: usuarioInternoId });

      qb.andWhere('usuario_interno.dateDeleted IS NULL');
      qb.andWhere('permissao.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      return qb;
    },

    async createQueryBuilderByUsuarioInternoId(usuarioInternoId: number) {
      const qb = await this.initQueryBuilder();
      await this.filterQueryByUsuarioInternoId(qb, usuarioInternoId);
      return qb;
    },

    async filterQueryByCargoId(qb: SelectQueryBuilder<PermissaoDbEntity>, cargoId: CargoDbEntity['id']) {
      qb.innerJoin('permissao.cargoPermissao', 'cargo_permissao').innerJoin('cargo_permissao.cargo', 'cargo');
      qb.andWhere('cargo.id = :cargoId', { cargoId: cargoId });
      return qb;
    },

    async createQueryBuilderByCargoId(cargoId: CargoDbEntity['id']) {
      const qb = await this.initQueryBuilder();
      await this.filterQueryByCargoId(qb, cargoId);
      return qb;
    },

    async filterQueryByTipoEntidade(qb: SelectQueryBuilder<PermissaoDbEntity>, tipoEntidade: AuthenticatedEntityType) {
      qb.innerJoin('permissao.cargoPermissao', 'cargo_permissao');
      qb.innerJoin('cargo_permissao.cargo', 'cargo');
      qb.innerJoin('cargo.usuarioInternoCargo', 'usuario_interno_cargo');
      qb.innerJoin('usuario_interno_cargo.usuarioInterno', 'usuario_interno');

      qb.andWhere('usuario_interno.tipoEntidade = :tipoEntidade', { tipoEntidade: tipoEntidade });

      qb.andWhere('usuario_interno.dateDeleted IS NULL');
      qb.andWhere('permissao.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      return qb;
    },

    async createQueryBuilderByTipoEntidade(tipoEntidade: AuthenticatedEntityType) {
      const qb = await this.initQueryBuilder();
      await this.filterQueryByTipoEntidade(qb, tipoEntidade);
      return qb;
    },

    async filterQueryByActor(qb: SelectQueryBuilder<PermissaoDbEntity>, actor: IActor) {
      switch (actor.type) {
        case AuthenticatedEntityType.USER: {
          const actorAsActorUser = <ActorUser>actor;
          const usuarioId = actorAsActorUser.userRef.id;
          await this.filterQueryByUsuarioId(qb, usuarioId);
          return qb;
        }

        case AuthenticatedEntityType.ANON: {
          await this.filterQueryByTipoEntidade(qb, AuthenticatedEntityType.ANON);
          return qb;
        }

        case AuthenticatedEntityType.SYSTEM: {
          await this.filterQueryByTipoEntidade(qb, AuthenticatedEntityType.SYSTEM);
          return qb;
        }
      }
    },

    async createQueryBuilderByActor(actor: IActor) {
      const qb = await this.initQueryBuilder();

      await this.filterQueryByActor(qb, actor);

      return qb;
    },

    async filterQueryByRecurso(qb: SelectQueryBuilder<PermissaoDbEntity>, recurso: string) {
      qb.leftJoin('permissao.recursos', 'permissao_recurso');

      qb.andWhere(
        new Brackets((qb) => {
          qb.where('permissao_recurso.recurso = :recurso', { recurso: recurso });
          qb.orWhere('permissao.recursoGlobal = :recursoGlobal', { recursoGlobal: true });
        }),
      );

      return qb;
    },

    async createActorQueryBuilderByRecurso(actor: IActor, resource: string) {
      const qb = await this.createQueryBuilderByActor(actor);
      await this.filterQueryByRecurso(qb, resource);
      return qb;
    },

    async filterQueryByVerbo(qb: SelectQueryBuilder<PermissaoDbEntity>, verbo: string) {
      qb.leftJoin('permissao.verbos', 'permissao_verbo');

      qb.andWhere(
        new Brackets((qb) => {
          qb.where('permissao_verbo.verbo = :verbo', { verbo: verbo });
          qb.orWhere('permissao.verboGlobal = :verboGlobal', { verboGlobal: true });
        }),
      );

      return qb;
    },

    async filterQueryByRecursoVerbo(qb: SelectQueryBuilder<PermissaoDbEntity>, recurso: string, verbo: string) {
      await this.filterQueryByRecurso(qb, recurso);
      await this.filterQueryByVerbo(qb, verbo);

      return qb;
    },

    async createActorQueryBuilderByActorRecursoVerbo(actor: IActor, recurso: string, verbo: string) {
      const qb = await this.createQueryBuilderByActor(actor);

      await this.filterQueryByRecursoVerbo(qb, recurso, verbo);

      return qb;
    },
  });
