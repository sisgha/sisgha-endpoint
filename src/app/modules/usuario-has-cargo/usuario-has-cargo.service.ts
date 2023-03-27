import { Injectable, NotFoundException } from '@nestjs/common';
import { CargoDbEntity } from 'src/app/entities/cargo.db.entity';
import { UsuarioHasCargoDbEntity } from 'src/app/entities/usuario-has-cargo.db.entity';
import { UsuarioDbEntity } from 'src/app/entities/usuario.db.entity';
import { getCargoRepository } from 'src/app/repositories/cargo.repository';
import { getUsuarioHasCargoRepository } from 'src/app/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/app/repositories/usuario.repository';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { FindOneOptions } from 'typeorm';

import {
  IAddCargoToUsuarioInput,
  IFindUsuarioHasCargoByIdInput,
  IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput,
  IRemoveCargoFromUsuarioInput,
} from './dtos';

@Injectable()
export class UsuarioHasCargoService {
  async findUsuarioHasCargoById(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByIdInput,
    options?: FindOneOptions<UsuarioHasCargoDbEntity>,
  ) {
    const { id } = dto;

    const targetUsuarioHasCargo = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioHasCargoRepository =
          getUsuarioHasCargoRepository(entityManager);

        return usuarioHasCargoRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetUsuarioHasCargo) {
      return null;
    }

    const usuarioHasCargo =
      await appContext.databaseRun<UsuarioHasCargoDbEntity>(
        async ({ entityManager }) => {
          const usuarioHasCargoRepository =
            getUsuarioHasCargoRepository(entityManager);

          return await usuarioHasCargoRepository.findOneOrFail({
            where: { id: targetUsuarioHasCargo.id },
            select: ['id'],
            ...options,
          });
        },
      );

    return usuarioHasCargo;
  }

  async findUsuarioHasCargoByIdStrict(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByIdInput,
    options?: FindOneOptions<UsuarioHasCargoDbEntity>,
  ) {
    const usuarioHasCargo = await this.findUsuarioHasCargoById(
      appContext,
      dto,
      options,
    );

    if (!usuarioHasCargo) {
      throw new NotFoundException();
    }

    return usuarioHasCargo;
  }

  async findUsuarioHasCargoByIdStrictSimple(
    appContext: AppContext,
    usuarioHasCargoId: number,
  ): Promise<Pick<UsuarioHasCargoDbEntity, 'id'>> {
    const usuarioHasCargo = await this.findUsuarioHasCargoByIdStrict(
      appContext,
      {
        id: usuarioHasCargoId,
      },
    );

    return usuarioHasCargo as Pick<UsuarioHasCargoDbEntity, 'id'>;
  }

  async findUsuarioHasCargoByUsuarioIdAndCargoId(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput,
  ): Promise<UsuarioHasCargoDbEntity | null> {
    const { cargoId, usuarioId } = dto;

    const usuarioHasCargo = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioHasCargoRepository =
          getUsuarioHasCargoRepository(entityManager);

        return usuarioHasCargoRepository
          .createQueryBuilder('uhc')
          .innerJoin('uhc.usuario', 'usuario')
          .innerJoin('uhc.cargo', 'cargo')
          .where('usuario.id = :usuarioId', { usuarioId })
          .andWhere('cargo.id = :cargoId', { cargoId })
          .select(['uhc.id'])
          .getOne();
      },
    );

    return usuarioHasCargo;
  }

  async findUsuarioHasCargoByUsuarioIdAndCargoIdStrict(
    appContext: AppContext,
    dto: IFindUsuarioHasCargoByUsuarioIdAndCargoIdInput,
  ): Promise<UsuarioHasCargoDbEntity> {
    const usuarioHasCargo = await this.findUsuarioHasCargoByUsuarioIdAndCargoId(
      appContext,
      dto,
    );

    if (!usuarioHasCargo) {
      throw new NotFoundException();
    }

    return usuarioHasCargo;
  }

  async getUsuarioHasCargoStrictGenericField<
    K extends keyof UsuarioHasCargoDbEntity,
  >(
    appContext: AppContext,
    usuarioHasCargoId: number,
    field: K,
  ): Promise<UsuarioHasCargoDbEntity[K]> {
    const usuarioHasCargo = await this.findUsuarioHasCargoByIdStrict(
      appContext,
      { id: usuarioHasCargoId },
      { select: ['id', field] },
    );

    return <UsuarioHasCargoDbEntity[K]>usuarioHasCargo[field];
  }

  async getUsuarioHasCargoUsuario(
    appContext: AppContext,
    usuarioHasCargoId: number,
  ) {
    const usuario = await appContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return usuarioRepository
        .createQueryBuilder('usuario')
        .innerJoin('usuario.usuarioHasCargo', 'uhc')
        .where('uhc.id = :usuarioHasCargoId', { usuarioHasCargoId })
        .select(['usuario.id'])
        .getOne();
    });

    return usuario;
  }

  async getUsuarioHasCargoCargo(
    appContext: AppContext,
    usuarioHasCargoId: number,
  ) {
    const cargo = await appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository
        .createQueryBuilder('cargo')
        .innerJoin('cargo.usuarioHasCargo', 'uhc')
        .where('uhc.id = :usuarioHasCargoId', { usuarioHasCargoId })
        .select(['cargo.id'])
        .getOne();
    });

    return cargo;
  }

  async addCargoToUsuario(
    appContext: AppContext,
    dto: IAddCargoToUsuarioInput,
  ) {
    const { usuarioId, cargoId } = dto;

    const usuarioHasCargoAlreadyExists =
      await this.findUsuarioHasCargoByUsuarioIdAndCargoId(appContext, {
        cargoId,
        usuarioId,
      });

    if (usuarioHasCargoAlreadyExists) {
      return usuarioHasCargoAlreadyExists;
    }

    const usuarioHasCargo = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioHasCargoRepository =
          getUsuarioHasCargoRepository(entityManager);

        const usuarioHasCargo = new UsuarioHasCargoDbEntity();

        usuarioHasCargo.cargo = <CargoDbEntity>{ id: cargoId };
        usuarioHasCargo.usuario = <UsuarioDbEntity>{ id: usuarioId };

        await usuarioHasCargoRepository.save(usuarioHasCargo);

        return usuarioHasCargo;
      },
    );

    return this.findUsuarioHasCargoByIdStrictSimple(
      appContext,
      usuarioHasCargo.id,
    );
  }

  async removeCargoFromUsuario(
    appContext: AppContext,
    dto: IRemoveCargoFromUsuarioInput,
  ) {
    const { usuarioId, cargoId } = dto;

    const usuarioHasCargo = await this.findUsuarioHasCargoByUsuarioIdAndCargoId(
      appContext,
      { cargoId, usuarioId },
    );

    if (!usuarioHasCargo) {
      return true;
    }

    return appContext.databaseRun(async ({ entityManager }) => {
      const usuarioHasCargoRepository =
        getUsuarioHasCargoRepository(entityManager);

      try {
        await usuarioHasCargoRepository.delete(usuarioHasCargo.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
