import { RecipeGuardCaslAbilityCompiler } from '#recipe-guard-casl';
import { IAuthorizationConstraintRecipe } from '#recipe-guard-core';
import { RecipeGuardTypeormCompiler } from '#recipe-guard-typeorm';
import { subject as castSubject } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { get, has } from 'lodash';
import { DataSource } from 'typeorm';
import { IAppResource } from '../../domain/application-resources';
import { AuthenticatedEntityType } from '../../domain/authentication';
import { ContextAction } from '../../domain/authorization';
import { getAppResource } from '../application/helpers';
import { PermissaoDbEntity } from '../database/entities/permissao.db.entity';
import { authorizationConstraintInterpreterSQLContextOptions, recipeGuardContext } from '../recipe-guard';
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
              await queryRunner.query(`set local "request.auth.user.id" to ${user.id};`);
            }

            break;
          }

          case AuthenticatedEntityType.ANON:
          default: {
            break;
          }
        }

        return callback({ entityManager, queryRunner });
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  //

  async getResolvedIdsByAppResourceAuthorizationConstraintRecipe<Id = unknown>(
    appResource: IAppResource,
    authorizationConstraintRecipeRaw: IAuthorizationConstraintRecipe,
    targetEntityId: unknown | null = null,
  ): Promise<Id[]> {
    const resolvedIds: Id[] | null = await this.databaseRun(async ({ entityManager }) => {
      const recipeGuardTypeormCompiler = new RecipeGuardTypeormCompiler<{ id: Id }>(
        recipeGuardContext,
        authorizationConstraintInterpreterSQLContextOptions,
        entityManager,
      );

      return recipeGuardTypeormCompiler.getResolvedIdsByAuthorizationConstraintRecipe(
        appResource,
        authorizationConstraintRecipeRaw,
        targetEntityId,
      );
    });

    return resolvedIds ?? [];
  }

  async getResolvedIdsByAppResourcePermissoes<Id = unknown>(
    appResource: IAppResource,
    permissoes: PermissaoDbEntity[],
    targetEntityId: unknown | null = null,
  ): Promise<Id[]> {
    const resolvedIds: Id[] | null = await this.databaseRun(async ({ entityManager }) => {
      const authorizationConstraintRecipeGenerator = async function* () {
        for (const permissao of permissoes) {
          yield permissao.authorizationConstraintRecipe;
        }
      };

      const authorizationConstraintRecipeIterable = authorizationConstraintRecipeGenerator();

      const recipeGuardTypeormCompiler = new RecipeGuardTypeormCompiler<{ id: Id }>(
        recipeGuardContext,
        authorizationConstraintInterpreterSQLContextOptions,
        entityManager,
      );

      return recipeGuardTypeormCompiler.getResolvedIdsByAuthorizationConstraintRecipes(
        appResource,
        authorizationConstraintRecipeIterable,
        targetEntityId,
      );
    });

    return resolvedIds ?? [];
  }

  async getResolvedIdsByRecursoPermissoes<Id = unknown>(
    recurso: string,
    permissoes: PermissaoDbEntity[],
    targetEntityId: unknown | null = null,
  ): Promise<Id[]> {
    const appResource = getAppResource(recurso);

    if (appResource) {
      const resolvedIds = await this.getResolvedIdsByAppResourcePermissoes<Id>(appResource, permissoes, targetEntityId);
      return resolvedIds;
    }

    return [];
  }

  async getResolvedIdsByRecursoVerbo<Id = unknown>(recurso: string, verbo: string, targetEntityId: unknown | null = null): Promise<Id[]> {
    const permissoes = await this.actorContextRepository.getPermissoesByRecursoVerbo(recurso, verbo);
    return this.getResolvedIdsByRecursoPermissoes<Id>(recurso, permissoes, targetEntityId);
  }

  // ...

  async getAbilityByRecursoVerbo(recurso: string, verbo: string, targetEntityId: unknown | null = null) {
    const recipeGuardCaslAbilityCompiler = new RecipeGuardCaslAbilityCompiler(recipeGuardContext, {
      getResolvedIdsByAppResourceAuthorizationConstraintRecipe: this.getResolvedIdsByAppResourceAuthorizationConstraintRecipe.bind(this),
    });

    const authorizationConstraintRecipeGenerator = async function* (this: ActorContext) {
      const permissoes = await this.actorContextRepository.getPermissoesByRecursoVerbo(recurso, verbo);

      for (const permissao of permissoes) {
        yield permissao.authorizationConstraintRecipe;
      }
    };

    const authorizationConstraintRecipeIterable = authorizationConstraintRecipeGenerator.call(this);

    const ability = await recipeGuardCaslAbilityCompiler.getCaslAbilityByAuthorizationConstraintRecipes(
      verbo,
      recurso,
      authorizationConstraintRecipeIterable,
      targetEntityId,
    );

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
