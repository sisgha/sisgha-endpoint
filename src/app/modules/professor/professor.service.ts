import { Injectable, NotFoundException } from '@nestjs/common';
import { omit } from 'lodash';
import { ProfessorDbEntity } from 'src/database/entities/professor.db.entity';
import { getProfessorRepository } from 'src/database/repositories/professor.repository';
import { AppContext } from 'src/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import {
  ICreateProfessorInput,
  IDeleteProfessorInput,
  IFindProfessorByIdInput,
  IUpdateProfessorInput,
} from './dtos';

@Injectable()
export class ProfessorService {
  async findProfessorById(
    appContext: AppContext,
    dto: IFindProfessorByIdInput,
    options?: FindOneOptions<ProfessorDbEntity>,
  ) {
    const { id } = dto;

    const targetProfessor = await appContext.databaseRun(
      async ({ entityManager }) => {
        const professorRepository = getProfessorRepository(entityManager);

        return professorRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetProfessor) {
      return null;
    }

    const professor = await appContext.databaseRun<ProfessorDbEntity>(
      async ({ entityManager }) => {
        const professorRepository = getProfessorRepository(entityManager);

        return await professorRepository.findOneOrFail({
          where: { id: targetProfessor.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return professor;
  }

  async findProfessorByIdStrict(
    appContext: AppContext,
    dto: IFindProfessorByIdInput,
    options?: FindOneOptions<ProfessorDbEntity>,
  ) {
    const professor = await this.findProfessorById(appContext, dto, options);

    if (!professor) {
      throw new NotFoundException();
    }

    return professor;
  }

  async findProfessorByIdStrictSimple(
    appContext: AppContext,
    professorId: number,
  ): Promise<Pick<ProfessorDbEntity, 'id'>> {
    const professor = await this.findProfessorByIdStrict(appContext, {
      id: professorId,
    });

    return professor as Pick<ProfessorDbEntity, 'id'>;
  }

  async getProfessorGenericField<K extends keyof ProfessorDbEntity>(
    appContext: AppContext,
    professorId: number,
    field: K,
  ): Promise<ProfessorDbEntity[K]> {
    const professor = await this.findProfessorByIdStrict(
      appContext,
      { id: professorId },
      { select: ['id', field] },
    );

    return <ProfessorDbEntity[K]>professor[field];
  }

  /*
  async getProfessorGenericField(appContext: app-context, professorId: number) {
    return this.getProfessorGenericField(appContext, professorId, 'genericField');
  }
  */

  async getProfessorNome(appContext: AppContext, professorId: number) {
    return this.getProfessorGenericField(appContext, professorId, 'nome');
  }

  async createProfessor(appContext: AppContext, dto: ICreateProfessorInput) {
    const fieldsData = omit(dto, []);

    const professor = <ProfessorDbEntity>{ ...fieldsData };

    await appContext.databaseRun(async ({ entityManager }) => {
      const professorRepository = getProfessorRepository(entityManager);

      await professorRepository.save(professor);

      return professor;
    });

    return this.findProfessorByIdStrictSimple(appContext, professor.id);
  }

  async updateProfessor(appContext: AppContext, dto: IUpdateProfessorInput) {
    const { id } = dto;

    const professor = await this.findProfessorByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    const updatedProfessor = <ProfessorDbEntity>{ ...professor, ...fieldsData };

    await appContext.databaseRun(async ({ entityManager }) => {
      const professorRepository = getProfessorRepository(entityManager);

      await professorRepository.updateProfessor(updatedProfessor, professor.id);

      return updatedProfessor;
    });

    return this.findProfessorByIdStrictSimple(appContext, professor.id);
  }

  async deleteProfessor(appContext: AppContext, dto: IDeleteProfessorInput) {
    const professor = await this.findProfessorByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const professorRepository = getProfessorRepository(entityManager);

      try {
        await professorRepository.delete(professor.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
