import { APP_RESOURCE_PERMISSAO } from 'src/actor-context/providers';
import { FindOneOptions } from 'typeorm';
import { ActorContext } from '../../../actor-context/ActorContext';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { IFindPermissaoByIdInput } from './dtos';

export class PermissaoService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findPermissaoById(
    actorContext: ActorContext,
    dto: IFindPermissaoByIdInput,
    options: FindOneOptions<PermissaoDbEntity> | null = null,
  ) {
    const { id } = dto;

    const targetPermissao = await actorContext.databaseRun(({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      return permissaoRepository.findOne({
        where: { id },
        select: ['id'],
      });
    });

    if (!targetPermissao) {
      return null;
    }

    const permissao = await actorContext.databaseRun(({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      return permissaoRepository.findOneOrFail({
        where: { id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_PERMISSAO, permissao);
  }
}
