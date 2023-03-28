import { Injectable, NotFoundException } from '@nestjs/common';
import { has, isNumber, isUndefined, omit } from 'lodash';
import { CursoDbEntity } from 'src/app/entities/curso.db.entity';
import { LugarDbEntity } from 'src/app/entities/lugar.db.entity';
import { TurmaDbEntity } from 'src/app/entities/turma.db.entity';
import { getCursoRepository } from 'src/app/repositories/curso.repository';
import { getLugarRepository } from 'src/app/repositories/lugar.repository';
import { getTurmaRepository } from 'src/app/repositories/turma.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import { CursoService } from '../curso/curso.service';
import { LugarService } from '../lugar/lugar.service';
import {
  ICreateTurmaInput,
  IDeleteTurmaInput,
  IFindTurmaByIdInput,
  IUpdateTurmaInput,
} from './dtos';

@Injectable()
export class TurmaService {
  constructor(
    private cursoService: CursoService,
    private lugarService: LugarService,
  ) {}

  async findTurmaById(
    appContext: AppContext,
    dto: IFindTurmaByIdInput,
    options?: FindOneOptions<TurmaDbEntity>,
  ) {
    const { id } = dto;

    const targetTurma = await appContext.databaseRun(
      async ({ entityManager }) => {
        const turmaRepository = getTurmaRepository(entityManager);

        return turmaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetTurma) {
      return null;
    }

    const turma = await appContext.databaseRun<TurmaDbEntity>(
      async ({ entityManager }) => {
        const turmaRepository = getTurmaRepository(entityManager);

        return await turmaRepository.findOneOrFail({
          where: { id: targetTurma.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return turma;
  }

  async findTurmaByIdStrict(
    appContext: AppContext,
    dto: IFindTurmaByIdInput,
    options?: FindOneOptions<TurmaDbEntity>,
  ) {
    const turma = await this.findTurmaById(appContext, dto, options);

    if (!turma) {
      throw new NotFoundException();
    }

    return turma;
  }

  async findTurmaByIdStrictSimple(
    appContext: AppContext,
    turmaId: number,
  ): Promise<Pick<TurmaDbEntity, 'id'>> {
    const turma = await this.findTurmaByIdStrict(appContext, {
      id: turmaId,
    });

    return turma as Pick<TurmaDbEntity, 'id'>;
  }

  async getTurmaGenericField<K extends keyof TurmaDbEntity>(
    appContext: AppContext,
    turmaId: number,
    field: K,
  ): Promise<TurmaDbEntity[K]> {
    const turma = await this.findTurmaByIdStrict(
      appContext,
      { id: turmaId },
      { select: ['id', field] },
    );

    return <TurmaDbEntity[K]>turma[field];
  }

  /*
  async getTurmaGenericField(appContext: AppContext, turmaId: number) {
    return this.getTurmaGenericField(appContext, turmaId, 'genericField');
  }
  */

  async getTurmaPeriodo(appContext: AppContext, turmaId: number) {
    return this.getTurmaGenericField(appContext, turmaId, 'periodo');
  }

  async getTurmaTurno(appContext: AppContext, turmaId: number) {
    return this.getTurmaGenericField(appContext, turmaId, 'turno');
  }

  async getTurmaCurso(appContext: AppContext, turmaId: number) {
    const curso = await appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      return cursoRepository
        .createQueryBuilder('curso')
        .innerJoin('curso.turmas', 'turma')
        .where('turma.id = :turmaId', { turmaId })
        .select(['curso.id'])
        .getOne();
    });

    return curso;
  }

  async getTurmaLugarPadrao(appContext: AppContext, turmaId: number) {
    const lugarPadrao = await appContext.databaseRun(
      async ({ entityManager }) => {
        const lugarRepository = getLugarRepository(entityManager);

        return lugarRepository
          .createQueryBuilder('lugar')
          .innerJoin('lugar.turmas', 'turma')
          .where('turma.id = :turmaId', { turmaId })
          .select(['lugar.id'])
          .getOne();
      },
    );

    return lugarPadrao;
  }

  async createTurma(appContext: AppContext, dto: ICreateTurmaInput) {
    const fieldsData = omit(dto, ['cursoId', 'lugarPadraoId']);

    const turma = <TurmaDbEntity>{ ...fieldsData };

    const curso = await this.cursoService.findCursoByIdStrictSimple(
      appContext,
      dto.cursoId,
    );

    turma.curso = <CursoDbEntity>curso;

    const { lugarPadraoId } = dto;

    if (isNumber(lugarPadraoId)) {
      const lugarPadrao = await this.lugarService.findLugarByIdStrictSimple(
        appContext,
        lugarPadraoId,
      );

      turma.lugarPadrao = <LugarDbEntity>lugarPadrao;
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const turmaRepository = getTurmaRepository(entityManager);

      await turmaRepository.save(turma);

      return turma;
    });

    return this.findTurmaByIdStrictSimple(appContext, turma.id);
  }

  async updateTurma(appContext: AppContext, dto: IUpdateTurmaInput) {
    const { id } = dto;

    const turma = await this.findTurmaByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id', 'cursoId', 'lugarPadraoId']);

    const updatedTurma = <TurmaDbEntity>{ ...turma, ...fieldsData };

    const cursoId = dto.cursoId;

    if (has(dto, 'cursoId') && !isUndefined(cursoId)) {
      const curso = await this.cursoService.findCursoByIdStrictSimple(
        appContext,
        cursoId,
      );

      updatedTurma.curso = <CursoDbEntity>curso;
    }

    const lugarPadraoId = dto.lugarPadraoId;

    if (has(dto, 'lugarPadraoId') && !isUndefined(lugarPadraoId)) {
      if (lugarPadraoId === null) {
        updatedTurma.lugarPadrao = null;
      } else {
        const lugarPadrao = await this.lugarService.findLugarByIdStrictSimple(
          appContext,
          lugarPadraoId,
        );

        updatedTurma.lugarPadrao = <LugarDbEntity>lugarPadrao;
      }
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const turmaRepository = getTurmaRepository(entityManager);

      await turmaRepository.updateTurma(updatedTurma, turma.id);

      return updatedTurma;
    });

    return this.findTurmaByIdStrictSimple(appContext, turma.id);
  }

  async deleteTurma(appContext: AppContext, dto: IDeleteTurmaInput) {
    const turma = await this.findTurmaByIdStrictSimple(appContext, dto.id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const turmaRepository = getTurmaRepository(entityManager);

      try {
        await turmaRepository.delete(turma.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
