import { AbilityBuilder, AnyAbility, subject as castSubject, createMongoAbility } from '@casl/ability';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { get, has, intersection, union, without } from 'lodash';
import { DataSource } from 'typeorm';
import { CASL_RECURSO_WILDCARD } from './interfaces/CASL_RECURSO_WILDCARD';
import { CASL_VERBO_WILDCARD } from './interfaces/CASL_VERBO_WILDCARD';
import { IAppResource } from '../../domain/application-resources';
import { AuthenticatedEntityType } from '../../domain/authentication';
import {
  ContextAction,
  IAuthorizationConstraintRecipe,
  IAuthorizationConstraintRecipeResolutionMode,
  IAuthorizationConstraintRecipeType,
} from '../../domain/authorization-constraints';
import { PermissaoModel } from '../../domain/models';
import { getAppResource } from '../application/helpers';
import { AuthorizationConstraintRecipeZod } from '../authorization/zod';
import { PermissaoDbEntity } from '../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../database/repositories/permissao.repository';
import { extractIds } from '../helpers/extract-ids';
import { Actor } from './Actor';
import { ActorContextRepository } from './ActorContextRepository';
import { ActorUser } from './ActorUser';
import { IActorContextDatabaseRunCallback } from './interfaces';

export class ActorContext {
  public actorContextRepository: ActorContextRepository;

  constructor(
    // ...
    public readonly dataSource: DataSource,
    public readonly actor: Actor,
  ) {
    this.actorContextRepository = new ActorContextRepository(dataSource, actor);
  }

  // ...

  static forSystem(dataSource: DataSource) {
    return new ActorContext(dataSource, Actor.forSystemEntity());
  }

  // ...

  async databaseRun<T>(callback: IActorContextDatabaseRunCallback<T>): Promise<T> {
    const { dataSource, actor } = this;

    try {
      const result = await dataSource.transaction(async (entityManager) => {
        const queryRunner = entityManager.queryRunner;

        if (!queryRunner) {
          throw new Error('Query runner not found.');
        }

        switch (actor.type) {
          case AuthenticatedEntityType.SYSTEM: {
            break;
          }

          case AuthenticatedEntityType.USER: {
            const user = (<ActorUser>actor).userRef;

            if (user) {
              // await queryRunner.query('set local "request.auth.role" to \'authenticated\';');
              await queryRunner.query(`set local "request.auth.user.id" to ${user.id};`);
            }

            break;
          }

          case AuthenticatedEntityType.ANON:
          default: {
            break;
          }
        }

        // if (anonymous) {
        //   await queryRunner.manager.query(`set local role ${DatabaseActorRole.ANON};`);
        // }

        return callback({ entityManager, queryRunner });
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  //

  async getAllowedIdsByAppResourceAuthorizationConstraintRecipe<Id = unknown>(
    appResource: IAppResource,
    authorizationConstraintRecipe: IAuthorizationConstraintRecipe,
    targetEntityId: unknown | null = null,
  ): Promise<Id[]> {
    const isValid = AuthorizationConstraintRecipeZod.safeParse(authorizationConstraintRecipe);

    if (!isValid.success) {
      throw new InternalServerErrorException(isValid.error);
    }

    return this.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = await permissaoRepository.createActorQueryBuilderByConstraintRecipe<{ id: Id }>(
        appResource,
        authorizationConstraintRecipe,
        targetEntityId,
      );

      const results = await qb.getMany();

      const ids = extractIds(results);

      return ids;
    });
  }

  async getAllowedIdsByAppResourcePermissoes<Id = unknown>(
    appResource: IAppResource,
    permissoes: PermissaoDbEntity[],
    targetEntityId: unknown | null = null,
  ): Promise<Id[]> {
    let allowedResources: Id[] | null = null;

    for (const permissao of permissoes) {
      const { authorizationConstraintRecipe } = permissao;

      const isValid = AuthorizationConstraintRecipeZod.safeParse(authorizationConstraintRecipe);

      if (!isValid.success) {
        throw new InternalServerErrorException(isValid.error);
      }

      const constraintAllowedResources = await this.getAllowedIdsByAppResourceAuthorizationConstraintRecipe<Id>(
        appResource,
        authorizationConstraintRecipe,
        targetEntityId,
      );

      switch (authorizationConstraintRecipe.resolutionMode) {
        case IAuthorizationConstraintRecipeResolutionMode.INTERSECTION: {
          if (allowedResources === null) {
            allowedResources = constraintAllowedResources;
          } else {
            allowedResources = intersection(allowedResources, constraintAllowedResources);
          }

          break;
        }

        case IAuthorizationConstraintRecipeResolutionMode.MERGE: {
          if (allowedResources === null) {
            allowedResources = constraintAllowedResources;
          } else {
            allowedResources = union(allowedResources, constraintAllowedResources);
          }

          break;
        }

        case IAuthorizationConstraintRecipeResolutionMode.EXCLUDE: {
          if (allowedResources !== null) {
            allowedResources = without(allowedResources, ...constraintAllowedResources);
          }

          break;
        }
      }
    }

    return allowedResources ?? [];
  }

  async getAllowedIdsByRecursoPermissoes<Id = unknown>(
    recurso: string,
    permissoes: PermissaoDbEntity[],
    targetEntityId: unknown | null = null,
  ): Promise<Id[]> {
    const appResource = getAppResource(recurso);

    if (appResource) {
      const allowedIds = await this.getAllowedIdsByAppResourcePermissoes<Id>(appResource, permissoes, targetEntityId);
      return allowedIds;
    }

    return [];
  }

  async getAllowedIdsByRecursoVerbo<Id = unknown>(recurso: string, verbo: string, targetEntityId: unknown | null = null): Promise<Id[]> {
    const permissoes = await this.actorContextRepository.getPermissoesByRecursoVerbo(recurso, verbo);

    return this.getAllowedIdsByRecursoPermissoes<Id>(recurso, permissoes, targetEntityId);
  }

  // ...

  private async attachRecursoVerboPermissaoToCaslAbilityBuilder(
    abilityBuilder: AbilityBuilder<AnyAbility>,
    verbo: string,
    recurso: string,
    permissao: PermissaoModel,
    targetEntityId: unknown | null = null,
  ) {
    const { authorizationConstraintRecipe } = permissao;

    const { can: allow, cannot: forbid } = abilityBuilder;

    if (
      // ...
      verbo === CASL_VERBO_WILDCARD ||
      recurso === CASL_RECURSO_WILDCARD
    ) {
      return;
    }

    switch (authorizationConstraintRecipe.resolutionMode) {
      case IAuthorizationConstraintRecipeResolutionMode.INTERSECTION:
      case IAuthorizationConstraintRecipeResolutionMode.MERGE:
      case IAuthorizationConstraintRecipeResolutionMode.EXCLUDE: {
        const appResource = getAppResource(recurso);

        if (appResource) {
          const allowedIds = await this.getAllowedIdsByAppResourceAuthorizationConstraintRecipe(
            appResource,
            authorizationConstraintRecipe,
            targetEntityId,
          );

          allow(verbo, recurso, { id: { $in: [...allowedIds] } });
        }
      }

      case IAuthorizationConstraintRecipeResolutionMode.CASL_ONLY: {
        const forbidMode = authorizationConstraintRecipe.caslInverted;

        const caslAction = verbo;
        const caslSubject = recurso;

        switch (authorizationConstraintRecipe.type) {
          case IAuthorizationConstraintRecipeType.FILTER: {
            if (forbidMode) {
              forbid(caslAction, caslSubject, authorizationConstraintRecipe.condition);
            } else {
              allow(caslAction, caslSubject, authorizationConstraintRecipe.condition);
            }

            break;
          }

          case IAuthorizationConstraintRecipeType.BOOLEAN: {
            if (forbidMode) {
              if (authorizationConstraintRecipe.value) {
                forbid(caslAction, caslSubject);
              } /* else {
                allow(caslAction, caslSubject);
              } */
            } else {
              if (authorizationConstraintRecipe.value) {
                allow(caslAction, caslSubject);
              } /* else {
                forbid(caslAction, caslSubject);
              } */
            }

            break;
          }
        }

        break;
      }
    }
  }

  async getAbilityByRecursoVerbo(recurso: string, verbo: string, targetEntityId: unknown | null = null) {
    const abilityBuilder = new AbilityBuilder(createMongoAbility as any);

    const permissoes = await this.actorContextRepository.getPermissoesByRecursoVerbo(recurso, verbo);

    for (const permissao of permissoes) {
      await this.attachRecursoVerboPermissaoToCaslAbilityBuilder(abilityBuilder, verbo, recurso, permissao, targetEntityId);
    }

    const ability = abilityBuilder.build({});

    return ability;
  }

  async can<Entity extends object>(recurso: string, verbo: string, entity?: Entity): Promise<boolean> {
    const targetEntityId = entity && has(entity, 'id') ? get(entity, 'id') : null;

    const ability = await this.getAbilityByRecursoVerbo(recurso, verbo, targetEntityId);

    const targetSubject = entity ? castSubject(recurso, entity) : recurso;

    const isAllowed = ability.can(verbo, targetSubject);

    return isAllowed;
  }

  //

  async readResource<Entity extends object>(recurso: string, entidade: Entity) {
    await this.ensurePermission(recurso, ContextAction.READ, entidade);
    return entidade;
  }

  async ensurePermission<Entity extends object>(recurso: string, verbo: string, entidade?: Entity) {
    const isAllowed = await this.can(recurso, verbo, entidade);

    if (!isAllowed) {
      throw new ForbiddenException(`Actor is not allowed to perform "${verbo}" on resource "${recurso}".`);
    }
  }

  // ...
}
