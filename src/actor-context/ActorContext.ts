import { AbilityBuilder, subject as castSubject, createMongoAbility } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { pg } from '@ucast/sql';
import { get, has, intersection } from 'lodash';
import { ConstraintInterpreter } from 'src/authorization/ConstraintInterpreter';
import { ConstraintJoinMode, ContextAction, IRawConstraint } from 'src/authorization/interfaces';
import { DatabaseActorRole } from 'src/database/constants/DatabaseActorRole';
import { Brackets, DataSource, EntityManager, SelectQueryBuilder } from 'typeorm';
import { extractIds } from '../common/extract-ids';
import { PermissaoDbEntity } from '../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../database/repositories/permissao.repository';
import { Actor } from './Actor';
import { ActorUser } from './ActorUser';
import { IDatabaseRunCallback } from './interfaces';
import { ActorType } from './interfaces/ActorType';
import { getAppResource } from './providers';

const RECURSO_QUALQUER = 'all';

export class ActorContext {
  constructor(public readonly dataSource: DataSource, public readonly actor: Actor) {}

  // ...

  async databaseRun<T>(callback: IDatabaseRunCallback<T>): Promise<T> {
    const { dataSource, actor } = this;

    try {
      const result = await dataSource.transaction(async (entityManager) => {
        const queryRunner = entityManager.queryRunner;

        if (!queryRunner) {
          throw new Error('Query runner not found.');
        }

        switch (actor.type) {
          case ActorType.USER: {
            const user = (<ActorUser>actor).user;

            if (user) {
              await queryRunner.query(`set local role ${DatabaseActorRole.USER};`);
              // await queryRunner.query('set local "request.auth.role" to \'authenticated\';');
              await queryRunner.query(`set local "request.auth.user.id" to ${user.id};`);
              break;
            }
          }

          case ActorType.SYSTEM: {
            break;
          }

          case ActorType.ANON:
          default: {
            // await queryRunner.manager.query(`set local role ${DatabaseActorRole.ANON};`);
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

  // ...

  async getQueryPermissions(): Promise<SelectQueryBuilder<PermissaoDbEntity>> {
    const permissaoRepository = getPermissaoRepository(this.dataSource);

    switch (this.actor.type) {
      case ActorType.USER: {
        const userRef = (<ActorUser>this.actor).user;

        const qb = await permissaoRepository.createQueryBuilderForUser(userRef.id);
        return qb;
      }

      case ActorType.ANON: {
        const qb = await permissaoRepository.createQueryBuilderForActorSimples(ActorType.ANON);
        return qb;
      }

      case ActorType.SYSTEM: {
        const qb = await permissaoRepository.createQueryBuilderForActorSimples(ActorType.SYSTEM);
        return qb;
      }
    }
  }

  async getQueryPermissionsForResource(resource: string) {
    const qb = await this.getQueryPermissions();

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('permissao.recurso = :resource', { resource });
        qb.orWhere('permissao.recurso = :recursoQualquer', { recursoQualquer: RECURSO_QUALQUER });
      }),
    );
    return qb;
  }

  async getQueryPermissionsForResourceAction(resource: string, action: string) {
    const qb = await this.getQueryPermissionsForResource(resource);

    qb.andWhere(
      new Brackets((qb) => {
        qb.where('permissao.acao = :acao', { acao: action });

        qb.orWhere('permissao.acao = :acaoQualquer', {
          acaoQualquer: 'manage',
        });
      }),
    );

    return qb;
  }

  async getQueryAllowedResourcesForConstraint(
    resource: string,
    dataSource: DataSource | EntityManager,
    constraint: IRawConstraint,
    targetEntityId: unknown | null = null,
  ) {
    if (typeof constraint === 'boolean') {
      return constraint;
    }

    // const appResource = getAppResource(constraint.resource);
    const appResource = getAppResource(resource);

    if (!appResource) {
      return false;
    }

    const constraintInterpreter = new ConstraintInterpreter({
      dbDialect: {
        ...pg,
        paramPlaceholder: (index: number) => `:${index}`,
      },
    });

    const interpretedConstraint = constraintInterpreter.interpret(constraint);

    const getResourceRepository = appResource.getTypeormRepositoryFactory();
    const resourceRepository = getResourceRepository(dataSource);
    const qb = resourceRepository.createQueryBuilder(interpretedConstraint.alias);

    qb.select([`${interpretedConstraint.alias}.id`]);

    for (const join of interpretedConstraint.joins) {
      const joinResource = getAppResource(join.resource);

      const joinEntity = joinResource?.getTypeormEntity();

      if (!joinEntity) {
        continue;
      }

      switch (join.mode) {
        case ConstraintJoinMode.INNER: {
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
  }

  //

  async getPermissions(): Promise<PermissaoDbEntity[]> {
    const qb = await this.getQueryPermissions();
    return qb.getMany();
  }

  async getPermissionsForResource(resource: string) {
    const qb = await this.getQueryPermissionsForResource(resource);

    return qb.getMany();
  }

  async getPermissionsForResourceAction(resource: string, action: string): Promise<PermissaoDbEntity[]> {
    const qb = await this.getQueryPermissionsForResourceAction(resource, action);
    return qb.getMany();
  }

  // ...

  async getAllowedResourcesForPermissions<Id = unknown>(
    resource: string,
    permissions: PermissaoDbEntity[],
    targetEntityId: unknown | null = null,
  ): Promise<Id[] | boolean> {
    let allowedResourcesForPermissions: Id[] | boolean | null = null;

    for (const permission of permissions) {
      const appResource = getAppResource(resource);

      if (!appResource) {
        continue;
      }

      const { constraint } = permission;

      const allowedForConstraint = await this.databaseRun(async ({ entityManager }) => {
        const qbAllowedForConstraint = await this.getQueryAllowedResourcesForConstraint(
          resource,
          entityManager,
          constraint,
          targetEntityId,
        );

        if (typeof qbAllowedForConstraint === 'boolean') {
          return qbAllowedForConstraint;
        }

        const qbResults = await qbAllowedForConstraint.getMany();

        const ids: Id[] = qbResults.map((result) => get(result, 'id'));

        return ids;
      });

      if (allowedForConstraint === false) {
        allowedResourcesForPermissions = false;
        break;
      }

      if (allowedForConstraint === true) {
        if (!Array.isArray(allowedResourcesForPermissions)) {
          allowedResourcesForPermissions = true;
        }
      }

      if (Array.isArray(allowedForConstraint)) {
        if (Array.isArray(allowedResourcesForPermissions)) {
          allowedResourcesForPermissions = intersection(allowedResourcesForPermissions, allowedForConstraint);
        } else {
          allowedResourcesForPermissions = allowedForConstraint;
        }
      }
    }

    if (allowedResourcesForPermissions === null) {
      allowedResourcesForPermissions = false;
    }

    return allowedResourcesForPermissions;
  }

  async getAllowedResourcesForResourceAction(resource: string, action: string, targetEntityId: unknown | null = null) {
    const permissions = await this.getPermissionsForResourceAction(resource, action);

    return this.getAllowedResourcesForPermissions(resource, permissions, targetEntityId);
  }

  async getAllowedResourcesIdsForResourceAction(resource: string, action: string, targetEntityId: unknown | null = null) {
    const appResource = getAppResource(resource);

    if (!appResource) {
      return [];
    }

    const allowedResources = await this.getAllowedResourcesForResourceAction(resource, action, targetEntityId);

    if (Array.isArray(allowedResources)) {
      return allowedResources;
    }

    if (typeof allowedResources === 'boolean') {
      if (allowedResources === false) {
        return [];
      }

      const getResourceRepository = appResource.getTypeormRepositoryFactory();
      const resourceRepository = getResourceRepository(this.dataSource);

      const qb = resourceRepository.createQueryBuilder('resource').select(['resource.id']);

      const results = await qb.getMany();

      const ids = extractIds(results);

      return ids;
    }

    return [];
  }

  //

  async getAbilityForPermissions(resource: string, permissions: PermissaoDbEntity[], targetEntityId: unknown | null = null) {
    const { can: allow, cannot: forbid, build } = new AbilityBuilder(createMongoAbility);

    for (const permission of permissions) {
      const { acao } = permission;

      const allowedResources = await this.getAllowedResourcesForResourceAction(resource, acao, targetEntityId);

      if (Array.isArray(allowedResources)) {
        allow(acao, resource, {
          id: {
            $in: [...allowedResources],
          },
        });
      } else if (typeof allowedResources === 'boolean') {
        if (allowedResources) {
          allow(acao, resource);
        } else {
          forbid(acao, resource);
        }
      }
    }

    const ability = build({});

    return ability;
  }

  async getAbilityForResourceAction(resource: string, action: string, targetEntityId: unknown | null = null) {
    const permissions = await this.getPermissionsForResourceAction(resource, action);
    return this.getAbilityForPermissions(resource, permissions, targetEntityId);
  }

  // ...

  async can<Entity extends object>(resource: string, action: string, entity?: Entity): Promise<boolean> {
    const targetEntityId = entity && has(entity, 'id') ? get(entity, 'id') : null;

    const ability = await this.getAbilityForResourceAction(resource, action, targetEntityId);

    const targetSubject = entity ? castSubject(resource, entity) : resource;

    return ability.can(action, targetSubject);
  }

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
}
