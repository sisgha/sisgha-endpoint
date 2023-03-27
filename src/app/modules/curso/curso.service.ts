import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { CursoDbEntity } from 'src/app/entities/curso.db.entity';
import { getCursoRepository } from 'src/app/repositories/curso.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import {
  ICreateCursoInput,
  IDeleteCursoInput,
  IFindCursoByIdInput,
  IUpdateCursoInput,
} from './dtos';

@Injectable()
export class CursoService {
  async findCursoById(
    appContext: AppContext,
    dto: IFindCursoByIdInput,
    options?: FindOneOptions<CursoDbEntity>,
  ) {
    const { id } = dto;

    const targetCurso = await appContext.databaseRun(
      async ({ entityManager }) => {
        const cursoRepository = getCursoRepository(entityManager);

        return cursoRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetCurso) {
      return null;
    }

    const curso = await appContext.databaseRun<CursoDbEntity>(
      async ({ entityManager }) => {
        const cursoRepository = getCursoRepository(entityManager);

        return await cursoRepository.findOneOrFail({
          where: { id: targetCurso.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return curso;
  }

  async findCursoByIdStrict(
    appContext: AppContext,
    dto: IFindCursoByIdInput,
    options?: FindOneOptions<CursoDbEntity>,
  ) {
    const curso = await this.findCursoById(appContext, dto, options);

    if (!curso) {
      throw new NotFoundException();
    }

    return curso;
  }

  async findCursoByIdStrictSimple(
    appContext: AppContext,
    cursoId: number,
  ): Promise<Pick<CursoDbEntity, 'id'>> {
    const curso = await this.findCursoByIdStrict(appContext, {
      id: cursoId,
    });

    return curso as Pick<CursoDbEntity, 'id'>;
  }

  async getCursoGenericField<K extends keyof CursoDbEntity>(
    appContext: AppContext,
    cursoId: number,
    field: K,
  ): Promise<CursoDbEntity[K]> {
    const curso = await this.findCursoByIdStrict(
      appContext,
      { id: cursoId },
      { select: ['id', field] },
    );

    return <CursoDbEntity[K]>curso[field];
  }

  async getCursoNome(appContext: AppContext, cursoId: number) {
    return this.getCursoGenericField(appContext, cursoId, 'nome');
  }

  async getCursoTipo(appContext: AppContext, cursoId: number) {
    return this.getCursoGenericField(appContext, cursoId, 'tipo');
  }

  async createCurso(appContext: AppContext, dto: ICreateCursoInput) {
    const fieldsData = omit(dto, []);

    const curso = await appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      const curso = <CursoDbEntity>{ ...fieldsData };
      await cursoRepository.save(curso);

      return curso;
    });

    return this.findCursoByIdStrictSimple(appContext, curso.id);
  }

  async updateCurso(appContext: AppContext, dto: IUpdateCursoInput) {
    const { id } = dto;

    const curso = await this.findCursoByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      const updatedCurso = <CursoDbEntity>{ ...curso, ...fieldsData };

      await cursoRepository.updateCurso(updatedCurso, curso.id);

      return updatedCurso;
    });

    return this.findCursoByIdStrictSimple(appContext, curso.id);
  }

  async deleteCurso(appContext: AppContext, dto: IDeleteCursoInput) {
    const curso = await this.findCursoByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      try {
        await cursoRepository.delete(curso.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
