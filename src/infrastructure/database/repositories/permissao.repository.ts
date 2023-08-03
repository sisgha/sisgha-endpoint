import { pg } from '@ucast/sql';
import { Brackets, DataSource, EntityManager, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { IActor } from '../../../domain/actor';
import { AuthenticatedEntityType } from '../../../domain/authentication';
import { RECURSO_CORINGA_TOKEN } from '../../../domain/authorization';
import {
  AuthorizationConstraintJoinMode,
  IAuthorizationConstraintRecipe,
  IAuthorizationConstraintRecipeType,
} from '../../../domain/authorization-constraints';
import { ActorUser } from '../../actor-context/ActorUser';
import { getAppResource } from '../../application/helpers';
import { AuthorizationConstraintInterpreterSQL } from '../../authorization/authorization-constraint-interpreter-sql';
import { CargoDbEntity } from '../entities/cargo.db.entity';
import { PermissaoDbEntity } from '../entities/permissao.db.entity';

export type IPermissaoRepository = Repository<PermissaoDbEntity> & {
  createQueryBuilderForUsuarioId(usuarioId: number): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
  createQueryBuilderForUsuarioInternoId(usuarioInternoId: number): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
  createQueryBuilderForActorSimples(actorType: AuthenticatedEntityType): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
  createQueryBuilderForCargoId(cargoId: CargoDbEntity['id']): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
  createQueryBuilderForActor(actor: IActor): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
  createActorQueryBuilderForResource(actor: IActor, resource: string): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
  createActorQueryBuilderForResourceAction(actor: IActor, resource: string, action: string): Promise<SelectQueryBuilder<PermissaoDbEntity>>;
};

export const getPermissaoRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(PermissaoDbEntity).extend({
    async createQueryBuilderForUsuarioId(this: IPermissaoRepository, usuarioId: number) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioCargo', 'usuario_cargo')
        .innerJoin('usuario_cargo.usuario', 'usuario');

      qb.where('usuario.id = :usuarioId', { usuarioId: usuarioId });

      qb.andWhere('usuario.dateDeleted IS NULL');
      qb.andWhere('permissao.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForUsuarioInternoId(this: IPermissaoRepository, usuarioInternoId: number) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioInternoCargo', 'usuario_iterno_cargo')
        .innerJoin('usuario_iterno_cargo.usuarioInterno', 'usuario_interno');

      qb.where('usuario_interno.id = :usuarioInternoId', { usuarioInternoId: usuarioInternoId });

      qb.andWhere('usuario_interno.dateDeleted IS NULL');
      qb.andWhere('permissao.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForActorSimples(this: IPermissaoRepository, actorType: AuthenticatedEntityType) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo')
        .innerJoin('cargo.usuarioInternoCargo', 'usuario_interno_cargo')
        .innerJoin('usuario_interno_cargo.usuarioInterno', 'usuario_interno');

      qb.where('usuario_interno.tipoEntidade = :tipoEntidade', { tipoEntidade: actorType });

      qb.andWhere('usuario_interno.dateDeleted IS NULL');
      qb.andWhere('permissao.dateDeleted IS NULL');
      qb.andWhere('cargo.dateDeleted IS NULL');

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForCargoId(this: IPermissaoRepository, cargoId: CargoDbEntity['id']) {
      const qb = this.createQueryBuilder('permissao')
        .select(['permissao'])
        .innerJoin('permissao.cargoPermissao', 'cargo_permissao')
        .innerJoin('cargo_permissao.cargo', 'cargo');

      qb.where('cargo.id = :cargoId', { cargoId: cargoId });

      qb.cache(1000);

      return qb;
    },

    async createQueryBuilderForActor(this: IPermissaoRepository, actor: IActor) {
      switch (actor.type) {
        case AuthenticatedEntityType.USER: {
          const actorAsActorUser = <ActorUser>actor;

          const userRef = actorAsActorUser.userRef;

          const qb = await this.createQueryBuilderForUsuarioId(userRef.id);
          return qb;
        }

        case AuthenticatedEntityType.ANON: {
          const qb = await this.createQueryBuilderForActorSimples(AuthenticatedEntityType.ANON);
          return qb;
        }

        case AuthenticatedEntityType.SYSTEM: {
          const qb = await this.createQueryBuilderForActorSimples(AuthenticatedEntityType.SYSTEM);
          return qb;
        }
      }
    },

    // ...

    async createActorQueryBuilderForResource(this: IPermissaoRepository, actor: IActor, resource: string) {
      const qb = await this.createQueryBuilderForActor(actor);

      qb.andWhere(
        new Brackets((qb) => {
          qb.where('permissao.recurso = :resource', { resource });
          qb.orWhere('permissao.recurso = :recursoQualquer', { recursoQualquer: RECURSO_CORINGA_TOKEN });
        }),
      );

      return qb;
    },

    async createActorQueryBuilderForResourceAction(this: IPermissaoRepository, actor: IActor, resource: string, action: string) {
      const qb = await this.createActorQueryBuilderForResource(actor, resource);

      qb.andWhere(
        new Brackets((qb) => {
          qb.where('permissao.acao = :acao', { acao: action });

          qb.orWhere('permissao.acao = :acaoQualquer', {
            acaoQualquer: 'manage',
          });
        }),
      );

      return qb;
    },

    async createActorQueryBuilderForConstraint(
      this: IPermissaoRepository,
      resource: string,
      constraint: IAuthorizationConstraintRecipe,
      targetEntityId: unknown | null = null,
    ) {
      switch (constraint.type) {
        case IAuthorizationConstraintRecipeType.BOOLEAN: {
          return constraint.value;
        }
      }

      const appResource = getAppResource(resource);

      if (!appResource) {
        return false;
      }

      const constraintInterpreter = new AuthorizationConstraintInterpreterSQL({
        dbDialect: {
          ...pg,
          paramPlaceholder: (index: number) => `:${index}`,
        },
      });

      const interpretedConstraint = constraintInterpreter.interpret(constraint);

      const getResourceRepository = appResource.database.getTypeormRepositoryFactory();
      const resourceRepository = getResourceRepository(dataSource) as Repository<ObjectLiteral>;

      const qb = resourceRepository.createQueryBuilder(interpretedConstraint.alias);

      qb.select([`${interpretedConstraint.alias}.id`]);

      for (const join of interpretedConstraint.joins) {
        const joinResource = getAppResource(join.resource);

        const joinEntity = joinResource?.database.getTypeormEntity();

        if (!joinEntity) {
          continue;
        }

        switch (join.mode) {
          case AuthorizationConstraintJoinMode.INNER: {
            qb.innerJoin(joinEntity, join.alias, join.on);
          }
        }
      }

      qb.where(interpretedConstraint.condition);

      if (targetEntityId !== null) {
        qb.andWhere('id = :id', { id: targetEntityId });
      }

      qb.setParameters(interpretedConstraint.params);

      return qb;
    },
  });
