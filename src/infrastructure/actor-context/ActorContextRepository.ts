import { DataSource, SelectQueryBuilder } from 'typeorm';
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
}
