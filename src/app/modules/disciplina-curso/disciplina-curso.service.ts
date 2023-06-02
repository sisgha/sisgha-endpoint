import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil } from 'lodash';
import { AppContext } from 'src/app/AppContext/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { CursoDbEntity } from 'src/database/entities/curso.db.entity';
import { DisciplinaCursoDbEntity } from 'src/database/entities/disciplina-curso.db.entity';
import { DisciplinaDbEntity } from 'src/database/entities/disciplina.db.entity';
import { getCursoRepository } from 'src/database/repositories/curso.repository';
import { getDisciplinaCursoRepository } from 'src/database/repositories/disciplina-curso.repository';
import { getDisciplinaRepository } from 'src/database/repositories/disciplina.repository';
import { INDEX_DISCIPLINA_CURSO } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { CursoService } from '../curso/curso.service';
import { DisciplinaService } from '../disciplina/disciplina.service';
import { DisciplinaCursoType } from './disciplina-curso.type';
import {
  IAddDisciplinaToCursoInput,
  IFindDisciplinaCursoByDisciplinaIdAndCursoIdInput,
  IFindDisciplinaCursoByIdInput,
  IRemoveDisciplinaFromCursoInput,
  ListDisciplinaCursoResultType,
} from './dtos';

@Injectable()
export class DisciplinaCursoService {
  constructor(
    private disciplinaService: DisciplinaService,
    private cursoService: CursoService,
    private meilisearchService: MeiliSearchService,
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

  async listDisciplinaCurso(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListDisciplinaCursoResultType> {
    const result =
      await this.meilisearchService.listResource<DisciplinaCursoType>(
        INDEX_DISCIPLINA_CURSO,
        dto,
      );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findDisciplinaCursoById(appContext, {
          id: hit.id,
        });

        if (row) {
          return row;
        }
      }

      return null;
    });

    return {
      ...result,
      items,
    };
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
  async getDisciplinaCursoGenericField(appContext: app-context, disciplinaCursoId: number) {
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
          .innerJoin('disciplina.disciplinaCurso', 'disciplina_curso')
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
        .innerJoin('curso.disciplinaCurso', 'disciplina_curso')
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
