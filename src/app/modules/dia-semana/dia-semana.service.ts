import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { has, omit } from 'lodash';
import { DiaSemanaDbEntity } from 'src/app/entities/dia-semana.db.entity';
import { getDiaSemanaRepository } from 'src/app/repositories/dia-semana.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';
import {
  ICreateDiaSemanaInput,
  IDeleteDiaSemanaInput,
  IFindDiaSemanaByIdInput,
  IUpdateDiaSemanaInput,
} from './dtos';

@Injectable()
export class DiaSemanaService {
  async findDiaSemanaById(
    appContext: AppContext,
    dto: IFindDiaSemanaByIdInput,
    options?: FindOneOptions<DiaSemanaDbEntity>,
  ) {
    const { id } = dto;

    const targetDiaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return diaSemanaRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetDiaSemana) {
      return null;
    }

    const diaSemana = await appContext.databaseRun<DiaSemanaDbEntity>(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return await diaSemanaRepository.findOneOrFail({
          where: { id: targetDiaSemana.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return diaSemana;
  }

  async findDiaSemanaByIdStrict(
    appContext: AppContext,
    dto: IFindDiaSemanaByIdInput,
    options?: FindOneOptions<DiaSemanaDbEntity>,
  ) {
    const diaSemana = await this.findDiaSemanaById(appContext, dto, options);

    if (!diaSemana) {
      throw new NotFoundException();
    }

    return diaSemana;
  }

  async findDiaSemanaByIdStrictSimple(
    appContext: AppContext,
    diaSemanaId: number,
  ): Promise<Pick<DiaSemanaDbEntity, 'id'>> {
    const diaSemana = await this.findDiaSemanaByIdStrict(appContext, {
      id: diaSemanaId,
    });

    return diaSemana as Pick<DiaSemanaDbEntity, 'id'>;
  }

  async findDiaSemanaByOrdem(
    appContext: AppContext,
    ordem: number,
  ): Promise<DiaSemanaDbEntity | null> {
    const diaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        return diaSemanaRepository.findOne({
          where: { ordem },
          select: ['id'],
        });
      },
    );

    return diaSemana;
  }

  async getDiaSemanaGenericField<K extends keyof DiaSemanaDbEntity>(
    appContext: AppContext,
    diaSemanaId: number,
    field: K,
  ): Promise<DiaSemanaDbEntity[K]> {
    const diaSemana = await this.findDiaSemanaByIdStrict(
      appContext,
      { id: diaSemanaId },
      { select: ['id', field] },
    );

    return <DiaSemanaDbEntity[K]>diaSemana[field];
  }

  async getDiaSemanaOrdem(
    appContext: AppContext,
    diaSemanaId: number,
  ): Promise<DiaSemanaDbEntity['ordem']> {
    return this.getDiaSemanaGenericField(appContext, diaSemanaId, 'ordem');
  }

  async createDiaSemana(appContext: AppContext, dto: ICreateDiaSemanaInput) {
    const fieldsData = omit(dto, []);

    const diaSemanaForOrdem = await this.findDiaSemanaByOrdem(
      appContext,
      fieldsData.ordem,
    );

    if (diaSemanaForOrdem) {
      throw new ConflictException('Já existe um dia da semana com essa ordem.');
    }

    const diaSemana = await appContext.databaseRun(
      async ({ entityManager }) => {
        const diaSemanaRepository = getDiaSemanaRepository(entityManager);

        const diaSemana = { ...fieldsData };
        await diaSemanaRepository.save(diaSemana);

        return <DiaSemanaDbEntity>diaSemana;
      },
    );

    return this.findDiaSemanaByIdStrictSimple(appContext, diaSemana.id);
  }

  async updateDiaSemana(appContext: AppContext, dto: IUpdateDiaSemanaInput) {
    const { id } = dto;

    const diaSemana = await this.findDiaSemanaByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    const ordem = fieldsData.ordem;

    if (has(fieldsData, 'ordem') && typeof ordem === 'number') {
      const diaSemanaForOrdem = await this.findDiaSemanaByOrdem(
        appContext,
        ordem,
      );

      if (diaSemanaForOrdem && diaSemanaForOrdem.id !== diaSemana.id) {
        throw new ConflictException(
          'Já existe um dia da semana com essa ordem.',
        );
      }
    }

    await appContext.databaseRun(async ({ entityManager }) => {
      const diaSemanaRepository = getDiaSemanaRepository(entityManager);

      const updatedDiaSemana = { ...diaSemana, ...fieldsData };
      await diaSemanaRepository.updateDiaSemana(updatedDiaSemana, diaSemana.id);

      return <DiaSemanaDbEntity>updatedDiaSemana;
    });

    return this.findDiaSemanaByIdStrictSimple(appContext, diaSemana.id);
  }

  async deleteDiaSemana(appContext: AppContext, dto: IDeleteDiaSemanaInput) {
    const diaSemana = await this.findDiaSemanaByIdStrictSimple(
      appContext,
      dto.id,
    );

    return appContext.databaseRun(async ({ entityManager }) => {
      const diaSemanaRepository = getDiaSemanaRepository(entityManager);

      try {
        await diaSemanaRepository.delete(diaSemana.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
