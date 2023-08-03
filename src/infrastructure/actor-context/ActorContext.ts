import { AbilityBuilder, subject as castSubject, createMongoAbility } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { get, has, intersection } from 'lodash';
import { DataSource, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { AuthenticatedEntityType } from '../../domain/authentication';
import { ContextAction, IAuthorizationConstraintRecipe } from '../../domain/authorization-constraints';
import { IAllowedResources } from '../../domain/authorization/IAllowedResources';
import { getAppResource } from '../application/helpers';
import { PermissaoDbEntity } from '../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../database/repositories/permissao.repository';
import { extractIds } from '../helpers/extract-ids';
import { Actor } from './Actor';
import { ActorUser } from './ActorUser';
import { IActorContextDatabaseRunCallback } from './interfaces';

export class ActorContext {
  constructor(
    // ...
    public readonly dataSource: DataSource,
    public readonly actor: Actor,
  ) {}

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

        let anonymous = true;

        switch (actor.type) {
          case AuthenticatedEntityType.SYSTEM: {
            anonymous = false;
            break;
          }

          case AuthenticatedEntityType.USER: {
            const user = (<ActorUser>actor).userRef;

            if (user) {
              // await queryRunner.query('set local "request.auth.role" to \'authenticated\';');
              await queryRunner.query(`set local "request.auth.user.id" to ${user.id};`);
              anonymous = false;
            }

            break;
          }

          case AuthenticatedEntityType.ANON:
          default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            anonymous = true;
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

  async getPermissions(): Promise<PermissaoDbEntity[]> {
    const qb = await this.getQueryPermissions();
    return qb.getMany();
  }

  async getPermissionsByResource(resource: string) {
    const qb = await this.getQueryPermissionsForResource(resource);
    return qb.getMany();
  }

  async getPermissionsByResourceAction(resource: string, action: string): Promise<PermissaoDbEntity[]> {
    const qb = await this.getQueryPermissionsForResourceAction(resource, action);
    return qb.getMany();
  }

  //

  async getAllowedResourcesByConstraint<Id = unknown>(
    resource: string,
    constraint: IAuthorizationConstraintRecipe,
    targetEntityId: unknown | null = null,
  ): Promise<IAllowedResources<Id>> {
    const qbAllowedForConstraint = await this.getQueryAllowedResourcesForConstraint(resource, constraint, targetEntityId);

    if (typeof qbAllowedForConstraint === 'boolean') {
      return {
        type: 'boolean',
        value: qbAllowedForConstraint,
      };
    }

    const qbResults = await qbAllowedForConstraint.getMany();

    const ids = extractIds(qbResults as any[]) as Id[];

    return {
      type: 'id_array',
      ids,
    };
  }

  async getAllowedResourcesForPermissions<Id = unknown>(
    resource: string,
    permissions: PermissaoDbEntity[],
    targetEntityId: unknown | null = null,
  ): Promise<IAllowedResources<Id>> {
    let allowedResources: IAllowedResources<Id> = { type: 'null', value: null };

    for (const permission of permissions) {
      const appResource = getAppResource(resource);

      if (!appResource) {
        continue;
      }

      const { constraint } = permission;

      const allowedForConstraint = await this.getAllowedResourcesByConstraint<Id>(resource, constraint, targetEntityId);

      if (allowedForConstraint.type === 'boolean') {
        if (allowedForConstraint.value === false) {
          allowedResources = { type: 'boolean', value: false };
          break;
        }

        if (allowedForConstraint.value === true) {
          if (allowedResources.type !== 'id_array') {
            allowedResources = { type: 'boolean', value: true };
          }
        }
      }

      if (allowedForConstraint.type === 'id_array') {
        const ids: Id[] =
          allowedResources.type === 'id_array' ? intersection(allowedResources.ids, allowedForConstraint.ids) : allowedForConstraint.ids;

        allowedResources = {
          type: 'id_array',
          ids: ids,
        };
      }
    }

    if (allowedResources.type === 'null') {
      allowedResources = {
        type: 'boolean',
        value: false,
      };
    }

    return allowedResources;
  }

  async getAllowedResourcesForResourceAction(resource: string, action: string, targetEntityId: unknown | null = null) {
    const permissions = await this.getPermissionsByResourceAction(resource, action);
    return this.getAllowedResourcesForPermissions(resource, permissions, targetEntityId);
  }

  async getAllowedIdsForResourceAction(resource: string, action: string, targetEntityId: unknown | null = null) {
    const appResource = getAppResource(resource);

    if (!appResource) {
      return [];
    }

    const allowedResources = await this.getAllowedResourcesForResourceAction(resource, action, targetEntityId);

    switch (allowedResources.type) {
      case 'id_array': {
        return allowedResources.ids;
      }

      case 'boolean': {
        if (allowedResources.value === true) {
          const getResourceRepository = appResource.database.getTypeormRepositoryFactory();
          const resourceRepository = getResourceRepository(this.dataSource) as Repository<ObjectLiteral>;

          const qb = resourceRepository.createQueryBuilder('resource').select(['resource.id']);
          const results = await qb.getMany();

          const ids = extractIds(results as any[]);
          return ids;
        }
      }
    }

    return [];
  }

  // ...

  async getAbilityForPermissions(resource: string, permissions: PermissaoDbEntity[], targetEntityId: unknown | null = null) {
    const { can: allow, cannot: forbid, build } = new AbilityBuilder(createMongoAbility as any);

    for (const permission of permissions) {
      const { acao } = permission;

      const allowedResources = await this.getAllowedResourcesForResourceAction(resource, acao, targetEntityId);

      switch (allowedResources.type) {
        case 'id_array': {
          allow(acao, resource, {
            id: {
              $in: [...allowedResources.ids],
            },
          });

          break;
        }

        case 'boolean': {
          if (allowedResources.value) {
            allow(acao, resource);
          } else {
            forbid(acao, resource);
          }
        }
      }
    }

    const ability = build({});

    return ability;
  }

  async getAbilityForResourceAction(resource: string, action: string, targetEntityId: unknown | null = null) {
    const permissions = await this.getPermissionsByResourceAction(resource, action);
    return this.getAbilityForPermissions(resource, permissions, targetEntityId);
  }

  async can<Entity extends object>(resource: string, action: string, entity?: Entity): Promise<boolean> {
    const targetEntityId = entity && has(entity, 'id') ? get(entity, 'id') : null;

    const ability = await this.getAbilityForResourceAction(resource, action, targetEntityId);

    const targetSubject = entity ? castSubject(resource, entity) : resource;

    return ability.can(action, targetSubject);
  }

  //

  async readResource<Entity extends object>(resource: string, entity: Entity) {
    await this.ensurePermission(resource, ContextAction.READ, entity);
    return entity;
  }

  async ensurePermission<Entity extends object>(resource: string, action: string, entity?: Entity) {
    const isAllowed = await this.can(resource, action, entity);

    if (!isAllowed) {
      throw new ForbiddenException();
    }
  }

  // ...

  private async getQueryAllowedResourcesForConstraint(
    resource: string,
    constraint: IAuthorizationConstraintRecipe,
    targetEntityId: unknown | null = null,
  ) {
    // Nota para os desenvolvedores:
    // A interpretação da condição SQL depende do usuário autenticado.
    // Por isso, é necessário em algum momento chamar o databaseRun.

    return this.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);
      return permissaoRepository.createActorQueryBuilderForConstraint(resource, constraint, targetEntityId);
    });
  }

  private async getQueryPermissions(): Promise<SelectQueryBuilder<PermissaoDbEntity>> {
    const permissaoRepository = getPermissaoRepository(this.dataSource);
    return permissaoRepository.createQueryBuilderForActor(this.actor);
  }

  private async getQueryPermissionsForResource(resource: string) {
    const permissaoRepository = getPermissaoRepository(this.dataSource);
    return permissaoRepository.createActorQueryBuilderForResource(this.actor, resource);
  }

  // ...

  private async getQueryPermissionsForResourceAction(resource: string, action: string) {
    const permissaoRepository = getPermissaoRepository(this.dataSource);
    return permissaoRepository.createActorQueryBuilderForResourceAction(this.actor, resource, action);
  }
}
