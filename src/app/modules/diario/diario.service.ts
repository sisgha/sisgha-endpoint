import { Injectable, NotFoundException } from '@nestjs/common';
import { has, isUndefined, omit } from 'lodash';
import { DiarioDbEntity } from 'src/database/entities/diario.db.entity';
import { DisciplinaDbEntity } from 'src/database/entities/disciplina.db.entity';
import { TurmaDbEntity } from 'src/database/entities/turma.db.entity';
import { getDiarioRepository } from 'src/database/repositories/diario.repository';
import { getDisciplinaRepository } from 'src/database/repositories/disciplina.repository';
import { getTurmaRepository } from 'src/database/repositories/turma.repository';
import { AppContext } from 'src/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import { DisciplinaService } from '../disciplina/disciplina.service';
import { TurmaService } from '../turma/turma.service';
import {
  ICreateDiarioInput,
  IDeleteDiarioInput,
  IFindDiarioByIdInput,
  IUpdateDiarioInput,
} from './dtos';

@Injectable()
export class DiarioService {
  constructor(
    private turmaService: TurmaService,
    private disciplinaService: DisciplinaService,
  ) {}

  async findDiarioById(
    appContext: AppContext,
    dto: IFindDiarioByIdInput,
    options?: FindOneOptions<DiarioDbEntity>,
  ) {
    const { id } = dto;

    const targetDiario = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diarioRepository = getDiarioRepository(entityManager);

        return diarioRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetDiario) {
      return null;
    }

    const diario = await appContext.databaseRun<DiarioDbEntity>(
      async ({ entityManager }) => {
        const diarioRepository = getDiarioRepository(entityManager);

        return await diarioRepository.findOneOrFail({
          where: { id: targetDiario.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return diario;
  }

  async findDiarioByIdStrict(
    appContext: AppContext,
    dto: IFindDiarioByIdInput,
    options?: FindOneOptions<DiarioDbEntity>,
  ) {
    const diario = await this.findDiarioById(appContext, dto, options);

    if (!diario) {
      throw new NotFoundException();
    }

    return diario;
  }

  async findDiarioByIdStrictSimple(
    appContext: AppContext,
    diarioId: number,
  ): Promise<Pick<DiarioDbEntity, 'id'>> {
    const diario = await this.findDiarioByIdStrict(appContext, {
      id: diarioId,
    });

    return diario as Pick<DiarioDbEntity, 'id'>;
  }

  async getDiarioGenericField<K extends keyof DiarioDbEntity>(
    appContext: AppContext,
    diarioId: number,
    field: K,
  ): Promise<DiarioDbEntity[K]> {
    const diario = await this.findDiarioByIdStrict(
      appContext,
      { id: diarioId },
      { select: ['id', field] },
    );

    return <DiarioDbEntity[K]>diario[field];
  }

  /*
  async getDiarioGenericField(appContext: app-context, diarioId: number) {
    return this.getDiarioGenericField(appContext, diarioId, 'genericField');
  }
  */

  async getDiarioTurma(appContext: AppContext, darioId: number) {
    const turma = await appContext.databaseRun(async ({ entityManager }) => {
      const turmaRepository = getTurmaRepository(entityManager);

      return turmaRepository
        .createQueryBuilder('turma')
        .leftJoinAndSelect('turma.diarios', 'diario')
        .where('diario.id = :diarioId', { diarioId: darioId })
        .getOne();
    });

    return turma;
  }

  async getDiarioDisciplina(appContext: AppContext, darioId: number) {
    const disciplina = await appContext.databaseRun(
      async ({ entityManager }) => {
        const disciplinaRepository = getDisciplinaRepository(entityManager);

        return disciplinaRepository
          .createQueryBuilder('disciplina')
          .leftJoinAndSelect('disciplina.diarios', 'diario')
          .where('diario.id = :diarioId', { diarioId: darioId })
          .getOne();
      },
    );

    return disciplina;
  }

  async createDiario(appContext: AppContext, dto: ICreateDiarioInput) {
    const fieldsData = omit(dto, ['turmaId', 'disciplinaId']);

    const diario = <DiarioDbEntity>{ ...fieldsData };

    const turma = await this.turmaService.findTurmaByIdStrictSimple(
      appContext,
      dto.turmaId,
    );

    diario.turma = <TurmaDbEntity>turma;

    const disciplina =
      await this.disciplinaService.findDisciplinaByIdStrictSimple(
        appContext,
        dto.disciplinaId,
      );

    diario.disciplina = <DisciplinaDbEntity>disciplina;

    await appContext.databaseRun(async ({ entityManager }) => {
      const diarioRepository = getDiarioRepository(entityManager);

      await diarioRepository.save(diario);

      return diario;
    });

    return this.findDiarioByIdStrictSimple(appContext, diario.id);
  }

  async updateDiario(appContext: AppContext, dto: IUpdateDiarioInput) {
    const { id } = dto;

    const diario = await this.findDiarioByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id', 'turmaId', 'disciplinaId']);

    const updatedDiario = <DiarioDbEntity>{ ...diario, ...fieldsData };

    const turmaId = dto.turmaId;

    if (has(dto, 'turmaId') && !isUndefined(turmaId)) {
      const turma = await this.turmaService.findTurmaByIdStrictSimple(
        appContext,
        turmaId,
      );

      updatedDiario.turma = <TurmaDbEntity>turma;
    }

    const disciplinaId = dto.disciplinaId;

    if (has(dto, 'disciplinaId') && !isUndefined(disciplinaId)) {
      const disciplina =
        await this.disciplinaService.findDisciplinaByIdStrictSimple(
          appContext,
          disciplinaId,
        );

      updatedDiario.disciplina = <DisciplinaDbEntity>disciplina;
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const diarioRepository = getDiarioRepository(entityManager);

      await diarioRepository.updateDiario(updatedDiario, diario.id);

      return updatedDiario;
    });

    return this.findDiarioByIdStrictSimple(appContext, diario.id);
  }

  async deleteDiario(appContext: AppContext, dto: IDeleteDiarioInput) {
    const diario = await this.findDiarioByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const diarioRepository = getDiarioRepository(entityManager);

      try {
        await diarioRepository.delete(diario.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
