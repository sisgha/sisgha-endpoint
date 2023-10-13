import { Injectable, NotFoundException } from '@nestjs/common';
import { get, has, omit } from 'lodash';
import { FindOneOptions, IsNull } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization';
import { ICreateCursoInput, IDeleteCursoInput, IFindCursoByIdInput, IUpdateCursoInput } from '../../../../domain/dtos';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { CursoDbEntity } from '../../../database/entities/curso.db.entity';
import { ModalidadeDbEntity } from '../../../database/entities/modalidade.db.entity';
import { getCursoRepository } from '../../../database/repositories/curso.repository';
import { getModalidadeRepository } from '../../../database/repositories/modalidade.repository';
import { ValidationErrorCodes, ValidationFailedException } from '../../../exceptions';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { CursoType, ListCursoResultType } from '../../dtos/graphql';
import { ModalidadeService } from '../modalidade/modalidade.service';
import { APP_RESOURCE_CURSO } from './curso.resource';

@Injectable()
export class CursoService {
  constructor(
    // ...
    private meiliSearchService: MeiliSearchService,
    private modalidadeService: ModalidadeService,
  ) {}

  // ...

  async findCursoById(actorContext: ActorContext, dto: IFindCursoByIdInput, options: FindOneOptions<CursoDbEntity> | null = null) {
    const targetCurso = await actorContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      return cursoRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetCurso) {
      return null;
    }

    const curso = await actorContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      return cursoRepository.findOneOrFail({
        where: { id: targetCurso.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_CURSO, curso);
  }

  async findCursoByIdStrict(actorContext: ActorContext, dto: IFindCursoByIdInput, options: FindOneOptions<CursoDbEntity> | null = null) {
    const curso = await this.findCursoById(actorContext, dto, options);

    if (!curso) {
      throw new NotFoundException();
    }

    return curso;
  }

  async findCursoByIdStrictSimple<T = Pick<CursoDbEntity, 'id'>>(actorContext: ActorContext, cursoId: number): Promise<T> {
    const curso = await this.findCursoByIdStrict(actorContext, { id: cursoId });
    return <T>curso;
  }

  //

  async listCurso(actorContext: ActorContext, dto: IGenericListInput): Promise<ListCursoResultType> {
    const allowedIds = await actorContext.getResolvedIdsByRecursoVerbo(APP_RESOURCE_CURSO, ContextAction.READ);

    const result = await this.meiliSearchService.listResource<CursoType>(APP_RESOURCE_CURSO, dto, allowedIds);

    return {
      ...result,
    };
  }

  // ...

  async getCursoStrictGenericField<K extends keyof CursoDbEntity>(
    actorContext: ActorContext,
    cursoId: number,
    field: K,
  ): Promise<CursoDbEntity[K]> {
    const curso = await this.findCursoByIdStrict(actorContext, { id: cursoId }, { select: ['id', field] });

    return <CursoDbEntity[K]>curso[field];
  }

  //

  async getCursoNome(actorContext: ActorContext, cursoId: number) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'nome');
  }

  async getCursoNomeAbreviado(actorContext: ActorContext, cursoId: number) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'nomeAbreviado');
  }

  async getCursoModalidade(actorContext: ActorContext, cursoId: number) {
    const curso = await this.findCursoByIdStrictSimple(actorContext, cursoId);

    const modalidade = await actorContext.databaseRun(async ({ entityManager }) => {
      const modalidadeRepository = getModalidadeRepository(entityManager);

      const qb = modalidadeRepository
        .createQueryBuilder('modalidade')
        .select(['modalidade.id'])
        .innerJoin('modalidade.cursos', 'curso')
        .where('curso.id = :cursoId', { cursoId: curso.id });

      const modalidade = await qb.getOneOrFail();

      return modalidade;
    });

    return modalidade;
  }

  async getCursoDateCreated(actorContext: ActorContext, cursoId: number) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateCreated');
  }

  async getCursoDateUpdated(actorContext: ActorContext, cursoId: number) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateUpdated');
  }

  async getCursoDateDeleted(actorContext: ActorContext, cursoId: number) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateDeleted');
  }

  async getCursoDateSearchSync(actorContext: ActorContext, cursoId: number) {
    return this.getCursoStrictGenericField(actorContext, cursoId, 'dateSearchSync');
  }

  // ...

  async createCurso(actorContext: ActorContext, dto: ICreateCursoInput) {
    const fieldsData = omit(dto, ['modalidadeId']);

    const curso = <CursoDbEntity>{
      ...fieldsData,
    };

    if (has(dto, 'modalidadeId')) {
      const modalidadeId = get(dto, 'modalidadeId')!;

      const modalidade = await this.modalidadeService.findModalidadeById(
        actorContext,
        { id: modalidadeId },
        {
          where: {
            dateDeleted: IsNull(),
          },
        },
      );

      if (!modalidade) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.CURSO_MODALIDADE_NOT_FOUND,
            message: 'A modalidade informada não foi encontrada ou não pode ser usada.',
            path: ['modalidadeId'],
          },
        ]);
      }

      curso.modalidade = <ModalidadeDbEntity>{
        id: modalidade.id,
      };
    }

    await actorContext.ensurePermission(APP_RESOURCE_CURSO, ContextAction.CREATE, curso);

    const dbCurso = await actorContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);
      await cursoRepository.save(curso);
      return <CursoDbEntity>curso;
    });

    return this.findCursoByIdStrictSimple(actorContext, dbCurso.id);
  }

  async updateCurso(actorContext: ActorContext, dto: IUpdateCursoInput) {
    const curso = await this.findCursoByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id', 'modalidadeId']);

    const updatedCurso = <CursoDbEntity>{
      ...curso,
      ...fieldsData,
    };

    if (has(dto, 'modalidadeId')) {
      const modalidadeId = get(dto, 'modalidadeId')!;

      const modalidade = await this.modalidadeService.findModalidadeById(
        actorContext,
        { id: modalidadeId },
        {
          where: {
            dateDeleted: IsNull(),
          },
        },
      );

      if (!modalidade) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.CURSO_MODALIDADE_NOT_FOUND,
            message: 'A modalidade informada não foi encontrada ou não pode ser usada.',
            path: ['modalidadeId'],
          },
        ]);
      }

      updatedCurso.modalidade = <ModalidadeDbEntity>{
        id: modalidade.id,
      };
    }

    await actorContext.ensurePermission(APP_RESOURCE_CURSO, ContextAction.UPDATE, updatedCurso);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);
      await cursoRepository.save(updatedCurso);
      return <CursoDbEntity>updatedCurso;
    });

    return this.findCursoByIdStrictSimple(actorContext, curso.id);
  }

  async deleteCurso(actorContext: ActorContext, dto: IDeleteCursoInput) {
    const curso = await this.findCursoByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_CURSO, ContextAction.DELETE, curso);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      await cursoRepository
        .createQueryBuilder('curso')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: curso.id })
        .execute();
    });

    return true;
  }
}
