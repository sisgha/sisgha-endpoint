import { Injectable, NotFoundException } from '@nestjs/common';
import { get, has, omit } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization';
import {
  ICheckModalidadeSlugAvailabilityInput,
  ICreateModalidadeInput,
  IDeleteModalidadeInput,
  IFindModalidadeByIdInput,
  IUpdateModalidadeInput,
} from '../../../../domain/dtos';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { ModalidadeDbEntity } from '../../../database/entities/modalidade.db.entity';
import { getModalidadeRepository } from '../../../database/repositories/modalidade.repository';
import { ValidationErrorCodes, ValidationFailedException } from '../../../exceptions';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { ListModalidadeResultType, ModalidadeType } from '../../dtos/graphql';
import { APP_RESOURCE_MODALIDADE } from './modalidade.resource';

@Injectable()
export class ModalidadeService {
  constructor(
    // ...
    private meiliSearchService: MeiliSearchService,
  ) {}

  // ...

  async findModalidadeById(
    actorContext: ActorContext,
    dto: IFindModalidadeByIdInput,
    options: FindOneOptions<ModalidadeDbEntity> | null = null,
  ) {
    const targetModalidade = await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);

      return modalidadeRepository.findOne({
        cache: 20,
        ...options,
        where: { id: dto.id, ...options?.where },
        select: ['id'],
      });
    });

    if (!targetModalidade) {
      return null;
    }

    const modalidade = await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);

      return modalidadeRepository.findOneOrFail({
        ...options,
        where: { id: targetModalidade.id },
        select: ['id', ...(options && Array.isArray(options.select) ? options.select : [])],
      });
    });

    return actorContext.readResource(APP_RESOURCE_MODALIDADE, modalidade);
  }

  async findModalidadeByIdStrict(
    actorContext: ActorContext,
    dto: IFindModalidadeByIdInput,
    options: FindOneOptions<ModalidadeDbEntity> | null = null,
  ) {
    const modalidade = await this.findModalidadeById(actorContext, dto, options);

    if (!modalidade) {
      throw new NotFoundException();
    }

    return modalidade;
  }

  async findModalidadeByIdStrictSimple<T = Pick<ModalidadeDbEntity, 'id'>>(actorContext: ActorContext, modalidadeId: number): Promise<T> {
    const modalidade = await this.findModalidadeByIdStrict(actorContext, { id: modalidadeId });
    return <T>modalidade;
  }

  //

  async listModalidade(actorContext: ActorContext, dto: IGenericListInput): Promise<ListModalidadeResultType> {
    const allowedIds = await actorContext.getResolvedIdsByRecursoVerbo(APP_RESOURCE_MODALIDADE, ContextAction.READ);

    const result = await this.meiliSearchService.listResource<ModalidadeType>(APP_RESOURCE_MODALIDADE, dto, allowedIds);

    return {
      ...result,
    };
  }

  async checkModalidadeSlugAvailability(actorContext: ActorContext, dto: ICheckModalidadeSlugAvailabilityInput) {
    const isSlugBeignUsedByOtherModalidade = await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);

      const qb = modalidadeRepository.createQueryBuilder('modalidade');

      qb.select('modalidade.id');

      qb.where('modalidade.slug = :slug', { slug: dto.slug });

      if (dto.modalidadeId) {
        qb.andWhere('modalidade.id != :modalidadeId', { modalidadeId: dto.modalidadeId });
      }

      const count = await qb.getCount();

      return count === 0;
    });

    return isSlugBeignUsedByOtherModalidade;
  }

  // ...

  async getModalidadeStrictGenericField<K extends keyof ModalidadeDbEntity>(
    actorContext: ActorContext,
    modalidadeId: number,
    field: K,
  ): Promise<ModalidadeDbEntity[K]> {
    const modalidade = await this.findModalidadeByIdStrict(actorContext, { id: modalidadeId }, { select: ['id', field] });

    return <ModalidadeDbEntity[K]>modalidade[field];
  }

  //

  async getModalidadeSlug(actorContext: ActorContext, modalidadeId: number) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'slug');
  }

  async getModalidadeNome(actorContext: ActorContext, modalidadeId: number) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'nome');
  }

  async getModalidadeDateCreated(actorContext: ActorContext, modalidadeId: number) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateCreated');
  }

  async getModalidadeDateUpdated(actorContext: ActorContext, modalidadeId: number) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateUpdated');
  }

  async getModalidadeDateDeleted(actorContext: ActorContext, modalidadeId: number) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateDeleted');
  }

  async getModalidadeDateSearchSync(actorContext: ActorContext, modalidadeId: number) {
    return this.getModalidadeStrictGenericField(actorContext, modalidadeId, 'dateSearchSync');
  }

  // ...

  async createModalidade(actorContext: ActorContext, dto: ICreateModalidadeInput) {
    const fieldsData = omit(dto, []);

    if (has(fieldsData, 'slug')) {
      const slug = get(fieldsData, 'slug')!;

      const isSlugAvailable = await this.checkModalidadeSlugAvailability(actorContext, { slug: slug, modalidadeId: null });

      if (!isSlugAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.MODALIDADE_SLUG_ALREADY_IN_USE,
            message: 'Já existe uma modalidade com o mesmo slug.',
            path: ['slug'],
          },
        ]);
      }
    }

    const modalidade = <ModalidadeDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_MODALIDADE, ContextAction.CREATE, modalidade);

    const dbModalidade = await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);
      await modalidadeRepository.save(modalidade);
      return <ModalidadeDbEntity>modalidade;
    });

    return this.findModalidadeByIdStrictSimple(actorContext, dbModalidade.id);
  }

  async updateModalidade(actorContext: ActorContext, dto: IUpdateModalidadeInput) {
    const modalidade = await this.findModalidadeByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    if (has(fieldsData, 'slug')) {
      const slug = get(fieldsData, 'slug')!;

      const isSlugAvailable = await this.checkModalidadeSlugAvailability(actorContext, { slug: slug, modalidadeId: modalidade.id });

      if (!isSlugAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.MODALIDADE_SLUG_ALREADY_IN_USE,
            message: 'Já existe uma modalidade com o mesmo slug.',
            path: ['slug'],
          },
        ]);
      }
    }

    const updatedModalidade = <ModalidadeDbEntity>{
      ...modalidade,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_MODALIDADE, ContextAction.UPDATE, updatedModalidade);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);
      await modalidadeRepository.save(updatedModalidade);
      return <ModalidadeDbEntity>updatedModalidade;
    });

    return this.findModalidadeByIdStrictSimple(actorContext, modalidade.id);
  }

  async deleteModalidade(actorContext: ActorContext, dto: IDeleteModalidadeInput) {
    const modalidade = await this.findModalidadeByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_MODALIDADE, ContextAction.DELETE, modalidade);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);

      await modalidadeRepository
        .createQueryBuilder('modalidade')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: modalidade.id })
        .execute();
    });

    return true;
  }
}
