import { pg } from '@ucast/sql';
import { DataSource, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import {
  AuthorizationConstraintJoinMode,
  IAuthorizationConstraintRecipe,
  IAuthorizationConstraintRecipeType,
} from '../../domain/authorization-constraints';
import { getAppResource } from '../application/helpers';
import { AuthorizationConstraintInterpreterSQL } from '../authorization/authorization-constraint-interpreter-sql';
import { PermissaoDbEntity } from '../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../database/repositories/permissao.repository';
import { getPermissaoVerboRepository } from '../database/repositories/permissao_verbo.repository';
import { Actor } from './Actor';

export class ActorContextRepository {
  constructor(
    // ...
    public readonly dataSource: DataSource,
    public readonly actor: Actor,
  ) {}

  get permissaoRepository() {
    return getPermissaoRepository(this.dataSource);
  }

  get permissaoVerboRepository() {
    return getPermissaoVerboRepository(this.dataSource);
  }

  async getQueryPermissoes(): Promise<SelectQueryBuilder<PermissaoDbEntity>> {
    const qb = await this.permissaoRepository.initQueryBuilder();
    await this.permissaoRepository.filterQueryByActor(qb, this.actor);
    return qb;
  }

  async getQueryPermissionsByRecurso(resource: string) {
    return this.permissaoRepository.createActorQueryBuilderByRecurso(this.actor, resource);
  }

  async getQueryPermissionsForRecursoVerbo(recurso: string, verbo: string) {
    return this.permissaoRepository.createActorQueryBuilderByActorRecursoVerbo(this.actor, recurso, verbo);
  }

  async getPermissoes(): Promise<PermissaoDbEntity[]> {
    const qb = await this.getQueryPermissoes();
    return qb.getMany();
  }

  async getPermissoesByRecurso(recurso: string) {
    const qb = await this.getQueryPermissionsByRecurso(recurso);
    return qb.getMany();
  }

  async getPermissoesByRecursoVerbo(recurso: string, verbo: string): Promise<PermissaoDbEntity[]> {
    const qb = await this.getQueryPermissionsForRecursoVerbo(recurso, verbo);
    return qb.getMany();
  }

  async createActorQueryBuilderByAuthorizationConstraintRecipe(
    resource: string,
    authorizationConstraintRecipe: IAuthorizationConstraintRecipe,
    targetEntityId: unknown | null = null,
  ) {
    const appResource = getAppResource(resource);

    if (!appResource) {
      return null;
    }

    const getResourceRepository = appResource.database.getTypeormRepositoryFactory();
    const resourceRepository = getResourceRepository(this.dataSource) as Repository<ObjectLiteral>;

    switch (authorizationConstraintRecipe.type) {
      case IAuthorizationConstraintRecipeType.BOOLEAN: {
        const qb = resourceRepository.createQueryBuilder('resource');

        qb.select(['resource.id']);

        qb.where(authorizationConstraintRecipe.value ? 'TRUE' : 'FALSE');

        if (targetEntityId !== null) {
          qb.andWhere('resource.id = :id', { id: targetEntityId });
        }

        return qb;
      }
    }

    const authorizationConstraintInterpreterSQL = new AuthorizationConstraintInterpreterSQL({
      dbDialect: {
        ...pg,
        paramPlaceholder: (index: number) => `:${index}`,
      },
    });

    const interpretedConstraint = authorizationConstraintInterpreterSQL.interpret(authorizationConstraintRecipe);

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
  }
}
