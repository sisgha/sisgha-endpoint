import { Injectable, NotFoundException } from '@nestjs/common';
import { DiarioProfessorDbEntity } from 'src/app/entities/diario-professor.db.entity';
import { DiarioDbEntity } from 'src/app/entities/diario.db.entity';
import { ProfessorDbEntity } from 'src/app/entities/professor.db.entity';
import { getDiarioProfessorRepository } from 'src/app/repositories/diario-professor.repository';
import { getDiarioRepository } from 'src/app/repositories/diario.repository';
import { getProfessorRepository } from 'src/app/repositories/professor.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import { DiarioService } from '../diario/diario.service';
import { ProfessorService } from '../professor/professor.service';
import {
  IAddProfessorToDiarioInput,
  IFindDiarioProfessorByIdInput,
  IFindDiarioProfessorByProfessorIdAndDiarioIdInput,
  IRemoveProfessorFromDiarioInput,
} from './dtos';

@Injectable()
export class DiarioProfessorService {
  constructor(
    private professorService: ProfessorService,
    private diarioService: DiarioService,
  ) {}

  async findDiarioProfessorById(
    appContext: AppContext,
    dto: IFindDiarioProfessorByIdInput,
    options?: FindOneOptions<DiarioProfessorDbEntity>,
  ) {
    const { id } = dto;

    const targetDiarioProfessor = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diarioProfessorRepository =
          getDiarioProfessorRepository(entityManager);

        return diarioProfessorRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetDiarioProfessor) {
      return null;
    }

    const diarioProfessor =
      await appContext.databaseRun<DiarioProfessorDbEntity>(
        async ({ entityManager }) => {
          const diarioProfessorRepository =
            getDiarioProfessorRepository(entityManager);

          return await diarioProfessorRepository.findOneOrFail({
            where: { id: targetDiarioProfessor.id },
            select: ['id'],
            ...options,
          });
        },
      );

    return diarioProfessor;
  }

  async findDiarioProfessorByIdStrict(
    appContext: AppContext,
    dto: IFindDiarioProfessorByIdInput,
    options?: FindOneOptions<DiarioProfessorDbEntity>,
  ) {
    const diarioProfessor = await this.findDiarioProfessorById(
      appContext,
      dto,
      options,
    );

    if (!diarioProfessor) {
      throw new NotFoundException();
    }

    return diarioProfessor;
  }

  async findDiarioProfessorByIdStrictSimple(
    appContext: AppContext,
    diarioProfessorId: number,
  ): Promise<Pick<DiarioProfessorDbEntity, 'id'>> {
    const diarioProfessor = await this.findDiarioProfessorByIdStrict(
      appContext,
      {
        id: diarioProfessorId,
      },
    );

    return diarioProfessor as Pick<DiarioProfessorDbEntity, 'id'>;
  }

  async findDiarioProfessorByProfessorIdAndDiarioId(
    appContext: AppContext,
    dto: IFindDiarioProfessorByProfessorIdAndDiarioIdInput,
  ): Promise<DiarioProfessorDbEntity | null> {
    const { diarioId, professorId } = dto;

    const diarioProfessor = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diarioProfessorRepository =
          getDiarioProfessorRepository(entityManager);

        return diarioProfessorRepository
          .createQueryBuilder('diario_professor')
          .innerJoin('diario_professor.diario', 'diario')
          .innerJoin('diario_professor.professor', 'professor')
          .where('diario.id = :diarioId', { diarioId })
          .andWhere('professor.id = :professorId', { professorId })
          .select(['diario_professor.id'])
          .getOne();
      },
    );

    return diarioProfessor;
  }

  async findDiarioProfessorByProfessorIdAndDiarioIdStrict(
    appContext: AppContext,
    dto: IFindDiarioProfessorByProfessorIdAndDiarioIdInput,
  ): Promise<DiarioProfessorDbEntity> {
    const diarioProfessor =
      await this.findDiarioProfessorByProfessorIdAndDiarioId(appContext, dto);

    if (!diarioProfessor) {
      throw new NotFoundException();
    }

    return diarioProfessor;
  }

  async getDiarioProfessorGenericField<K extends keyof DiarioProfessorDbEntity>(
    appContext: AppContext,
    diarioProfessorId: number,
    field: K,
  ): Promise<DiarioProfessorDbEntity[K]> {
    const diarioProfessor = await this.findDiarioProfessorByIdStrict(
      appContext,
      { id: diarioProfessorId },
      { select: ['id', field] },
    );

    return <DiarioProfessorDbEntity[K]>diarioProfessor[field];
  }

  /*
  async getDiarioProfessorGenericField(appContext: AppContext, diarioProfessorId: number) {
    return this.getDiarioProfessorGenericField(appContext, diarioProfessorId, 'genericField');
  }
  */

  async getDiarioProfessorDiario(
    appContext: AppContext,
    diarioProfessorId: number,
  ) {
    const diarioProfessor = await this.findDiarioProfessorByIdStrictSimple(
      appContext,
      diarioProfessorId,
    );

    const diario = await appContext.databaseRun(async ({ entityManager }) => {
      const diarioRepository = getDiarioRepository(entityManager);

      return diarioRepository
        .createQueryBuilder('diario')
        .innerJoin('diario.diarioProfessor', 'diario_professor')
        .where('diario_professor.id = :diarioProfessorId', {
          diarioProfessorId: diarioProfessor.id,
        })
        .select(['diario.id'])
        .getOne();
    });

    return diario;
  }

  async getDiarioProfessorProfessor(
    appContext: AppContext,
    diarioProfessorId: number,
  ) {
    const diarioProfessor = await this.findDiarioProfessorByIdStrictSimple(
      appContext,
      diarioProfessorId,
    );

    const professor = await appContext.databaseRun(
      async ({ entityManager }) => {
        const professorRepository = getProfessorRepository(entityManager);

        return professorRepository
          .createQueryBuilder('professor')
          .innerJoin('professor.diarioProfessor', 'diario_professor')
          .where('diario_professor.id = :diarioProfessorId', {
            diarioProfessorId: diarioProfessor.id,
          })
          .select(['professor.id'])
          .getOne();
      },
    );

    return professor;
  }

  async addProfessorToDiario(
    appContext: AppContext,
    dto: IAddProfessorToDiarioInput,
  ) {
    const diarioProfessorAlreadyExists =
      await this.findDiarioProfessorByProfessorIdAndDiarioId(appContext, {
        diarioId: dto.diarioId,
        professorId: dto.professorId,
      });

    if (diarioProfessorAlreadyExists) {
      return diarioProfessorAlreadyExists;
    }

    const diarioProfessor = <DiarioProfessorDbEntity>{};

    const diario = await this.diarioService.findDiarioByIdStrictSimple(
      appContext,
      dto.diarioId,
    );

    diarioProfessor.diario = <DiarioDbEntity>diario;

    const professor = await this.professorService.findProfessorByIdStrictSimple(
      appContext,
      dto.professorId,
    );

    diarioProfessor.professor = <ProfessorDbEntity>professor;

    await appContext.databaseRun(async ({ entityManager }) => {
      const diarioProfessorRespository =
        getDiarioProfessorRepository(entityManager);

      await diarioProfessorRespository.save(diarioProfessor);

      return diarioProfessor;
    });

    return this.findDiarioProfessorByIdStrictSimple(
      appContext,
      diarioProfessor.id,
    );
  }

  async removeProfessorFromDiario(
    appContext: AppContext,
    dto: IRemoveProfessorFromDiarioInput,
  ) {
    const diarioProfessor =
      await this.findDiarioProfessorByProfessorIdAndDiarioId(appContext, {
        diarioId: dto.diarioId,
        professorId: dto.professorId,
      });

    if (!diarioProfessor) {
      return true;
    }

    return appContext.databaseRun(async ({ entityManager }) => {
      const diarioProfessorRepository =
        getDiarioProfessorRepository(entityManager);

      try {
        await diarioProfessorRepository.delete(diarioProfessor.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
