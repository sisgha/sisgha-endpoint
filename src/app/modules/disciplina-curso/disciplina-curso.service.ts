import { Injectable, NotFoundException } from '@nestjs/common';
import { CursoDbEntity } from 'src/app/entities/curso.db.entity';
import { DisciplinaCursoDbEntity } from 'src/app/entities/disciplina-curso.db.entity';
import { DisciplinaDbEntity } from 'src/app/entities/disciplina.db.entity';
import { getCursoRepository } from 'src/app/repositories/curso.repository';
import { getDisciplinaCursoRepository } from 'src/app/repositories/disciplina-curso.repository';
import { getDisciplinaRepository } from 'src/app/repositories/disciplina.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import { CursoService } from '../curso/curso.service';
import { DisciplinaService } from '../disciplina/disciplina.service';
import {
  IAddDisciplinaToCursoInput,
  IFindDisciplinaCursoByDisciplinaIdAndCursoIdInput,
  IFindDisciplinaCursoByIdInput,
  IRemoveDisciplinaFromCursoInput,
} from './dtos';

@Injectable()
export class DisciplinaCursoService {
  constructor(
    private disciplinaService: DisciplinaService,
    private cursoService: CursoService,
  ) {}

  async findDisciplinaCursoById(
    appContext: AppContext,
    dto: IFindDisciplinaCursoByIdInput,
    options?: FindOneOptions<DisciplinaCursoDbEntity>,
  ) {
    const { id } = dto;

    const targetDisciplinaCurso = await appContext.databaseRun(
      async ({ entityManager }) => {
        const disciplinaCursoRepository =
          getDisciplinaCursoRepository(entityManager);

        return disciplinaCursoRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetDisciplinaCurso) {
      return null;
    }

    const disciplinaCurso =
      await appContext.databaseRun<DisciplinaCursoDbEntity>(
        async ({ entityManager }) => {
          const disciplinaCursoRepository =
            getDisciplinaCursoRepository(entityManager);

          return await disciplinaCursoRepository.findOneOrFail({
            where: { id: targetDisciplinaCurso.id },
            select: ['id'],
            ...options,
          });
        },
      );

    return disciplinaCurso;
  }

  async findDisciplinaCursoByIdStrict(
    appContext: AppContext,
    dto: IFindDisciplinaCursoByIdInput,
    options?: FindOneOptions<DisciplinaCursoDbEntity>,
  ) {
    const disciplinaCurso = await this.findDisciplinaCursoById(
      appContext,
      dto,
      options,
    );

    if (!disciplinaCurso) {
      throw new NotFoundException();
    }

    return disciplinaCurso;
  }

  async findDisciplinaCursoByIdStrictSimple(
    appContext: AppContext,
    disciplinaCursoId: number,
  ): Promise<Pick<DisciplinaCursoDbEntity, 'id'>> {
    const disciplinaCurso = await this.findDisciplinaCursoByIdStrict(
      appContext,
      {
        id: disciplinaCursoId,
      },
    );

    return disciplinaCurso as Pick<DisciplinaCursoDbEntity, 'id'>;
  }

  async findDisciplinaCursoByDisciplinaIdAndCursoId(
    appContext: AppContext,
    dto: IFindDisciplinaCursoByDisciplinaIdAndCursoIdInput,
  ) {
    const { disciplinaId, cursoId } = dto;

    const disciplinaCurso = await appContext.databaseRun(
      async ({ entityManager }) => {
        const disciplinaCargoRepository =
          getDisciplinaCursoRepository(entityManager);

        return disciplinaCargoRepository
          .createQueryBuilder('disciplina_curso')
          .innerJoin('disciplina_curso.disciplina', 'disciplina')
          .innerJoin('disciplina_curso.curso', 'curso')
          .where('disciplina.id = :disciplinaId', { disciplinaId })
          .andWhere('curso.id = :cursoId', { cursoId })
          .select(['disciplina_curso.id'])
          .getOne();
      },
    );

    return disciplinaCurso;
  }

  async findDisciplinaCursoByDisciplinaIdAndCursoIdStrict(
    appContext: AppContext,
    dto: IFindDisciplinaCursoByDisciplinaIdAndCursoIdInput,
  ) {
    const disciplinaCurso =
      await this.findDisciplinaCursoByDisciplinaIdAndCursoId(appContext, dto);

    if (!disciplinaCurso) {
      throw new NotFoundException();
    }

    return disciplinaCurso;
  }

  async getDisciplinaCursoGenericField<K extends keyof DisciplinaCursoDbEntity>(
    appContext: AppContext,
    disciplinaCursoId: number,
    field: K,
  ): Promise<DisciplinaCursoDbEntity[K]> {
    const disciplinaCurso = await this.findDisciplinaCursoByIdStrict(
      appContext,
      { id: disciplinaCursoId },
      { select: ['id', field] },
    );

    return <DisciplinaCursoDbEntity[K]>disciplinaCurso[field];
  }

  /*
  async getDisciplinaCursoGenericField(appContext: AppContext, disciplinaCursoId: number) {
    return this.getDisciplinaCursoGenericField(appContext, disciplinaCursoId, 'genericField');
  }
  */

  async getDisciplinaCursoDisciplina(
    appContext: AppContext,
    disciplinaCursoId: number,
  ) {
    const disciplinaCurso = await this.findDisciplinaCursoByIdStrictSimple(
      appContext,
      disciplinaCursoId,
    );

    const disciplina = await appContext.databaseRun(
      async ({ entityManager }) => {
        const disciplinaRepository = getDisciplinaRepository(entityManager);

        return disciplinaRepository
          .createQueryBuilder('disciplina')
          .innerJoin('disciplina.disciplina_cursos', 'disciplina_curso')
          .where('disciplina_curso.id = :disciplinaCursoId', {
            disciplinaCursoId: disciplinaCurso.id,
          })
          .select(['disciplina.id'])
          .getOne();
      },
    );

    return disciplina;
  }

  async getDisciplinaCursoCurso(
    appContext: AppContext,
    disciplinaCursoId: number,
  ) {
    const disciplinaCurso = await this.findDisciplinaCursoByIdStrictSimple(
      appContext,
      disciplinaCursoId,
    );

    const curso = await appContext.databaseRun(async ({ entityManager }) => {
      const cursoRepository = getCursoRepository(entityManager);

      return cursoRepository
        .createQueryBuilder('curso')
        .innerJoin('curso.disciplina_cursos', 'disciplina_curso')
        .where('disciplina_curso.id = :disciplinaCursoId', {
          disciplinaCursoId: disciplinaCurso.id,
        })
        .select(['curso.id'])
        .getOne();
    });

    return curso;
  }

  async addDisciplinaToCurso(
    appContext: AppContext,
    dto: IAddDisciplinaToCursoInput,
  ) {
    const disciplinaCursoAlreadyExists =
      await this.findDisciplinaCursoByDisciplinaIdAndCursoId(appContext, {
        cursoId: dto.cursoId,
        disciplinaId: dto.disciplinaId,
      });

    if (disciplinaCursoAlreadyExists) {
      return disciplinaCursoAlreadyExists;
    }

    const disciplinaCurso = <DisciplinaCursoDbEntity>{};

    const disciplina =
      await this.disciplinaService.findDisciplinaByIdStrictSimple(
        appContext,
        dto.disciplinaId,
      );

    disciplinaCurso.disciplina = <DisciplinaDbEntity>disciplina;

    const curso = await this.cursoService.findCursoByIdStrictSimple(
      appContext,
      dto.cursoId,
    );

    disciplinaCurso.curso = <CursoDbEntity>curso;

    await appContext.databaseRun(async ({ entityManager }) => {
      const disciplinaCursoRepository =
        getDisciplinaCursoRepository(entityManager);

      await disciplinaCursoRepository.save(disciplinaCurso);

      return disciplinaCurso;
    });

    return this.findDisciplinaCursoByIdStrictSimple(
      appContext,
      disciplinaCurso.id,
    );
  }

  async removeDisciplinaFromCurso(
    appContext: AppContext,
    dto: IRemoveDisciplinaFromCursoInput,
  ) {
    const disciplinaCurso =
      await this.findDisciplinaCursoByDisciplinaIdAndCursoId(appContext, {
        cursoId: dto.cursoId,
        disciplinaId: dto.disciplinaId,
      });

    if (!disciplinaCurso) {
      return true;
    }

    return appContext.databaseRun(async ({ entityManager }) => {
      const disciplinaCursoRepository =
        getDisciplinaCursoRepository(entityManager);

      try {
        await disciplinaCursoRepository.delete(disciplinaCurso.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
