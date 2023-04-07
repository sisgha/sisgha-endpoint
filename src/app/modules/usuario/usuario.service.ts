import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit, pick } from 'lodash';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { getCargoRepository } from 'src/database/repositories/cargo.repository';
import { getUsuarioHasCargoRepository } from 'src/database/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/database/repositories/usuario.repository';
import { INDEX_USUARIO } from 'src/meilisearch/constants/meilisearch-tokens';
import { IGenericListInput } from 'src/meilisearch/dtos';
import { MeiliSearchService } from 'src/meilisearch/meilisearch.service';
import { FindOneOptions } from 'typeorm';
import { UsuarioDbEntity } from '../../../database/entities/usuario.db.entity';
import {
  ICreateUsuarioInput,
  IDeleteUsuarioInput,
  IFindUsuarioByIdInput,
  IUpdateUsuarioInput,
} from './dtos';
import { ListUsuarioResultType } from './dtos/ListUsuarioResult';
import { UsuarioType } from './usuario.type';

@Injectable()
export class UsuarioService {
  constructor(private meilisearchService: MeiliSearchService) {}

  async findUsuarioById(
    appContext: AppContext,
    dto: IFindUsuarioByIdInput,
    options?: FindOneOptions<UsuarioDbEntity>,
  ) {
    const { id } = dto;

    const targetUsuario = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioRepository = getUsuarioRepository(entityManager);

        return usuarioRepository.findOne({
          where: { id },
          select: ['id'],
        });
      },
    );

    if (!targetUsuario) {
      return null;
    }

    const usuario = await appContext.databaseRun<UsuarioDbEntity>(
      async ({ entityManager }) => {
        const usuarioRepository = getUsuarioRepository(entityManager);

        return await usuarioRepository.findOneOrFail({
          where: { id: targetUsuario.id },
          select: ['id'],
          ...options,
        });
      },
    );

    return usuario;
  }

  async findUsuarioByIdStrict(
    appContext: AppContext,
    dto: IFindUsuarioByIdInput,
    options?: FindOneOptions<UsuarioDbEntity>,
  ) {
    const usuario = await this.findUsuarioById(appContext, dto, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async findUsuarioByIdStrictSimple(
    appContext: AppContext,
    usuarioId: number,
  ): Promise<Pick<UsuarioDbEntity, 'id'>> {
    const usuario = await this.findUsuarioByIdStrict(appContext, {
      id: usuarioId,
    });

    return usuario as Pick<UsuarioDbEntity, 'id'>;
  }

  async listUsuario(
    appContext: AppContext,
    dto: IGenericListInput,
  ): Promise<ListUsuarioResultType> {
    const result = await this.meilisearchService.listResource<UsuarioType>(
      INDEX_USUARIO,
      dto,
    );

    const items = await parralelMap(result.items, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const row = await this.findUsuarioById(appContext, {
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

  async getUsuarioFromKeycloakId(appContext: AppContext, keycloakId: string) {
    const userExists = await appContext.databaseRun(
      async ({ entityManager }) => {
        const usuarioRepository = getUsuarioRepository(entityManager);

        return await usuarioRepository.findOne({
          where: { keycloakId: keycloakId },
          select: ['id'],
        });
      },
    );

    if (userExists) {
      return this.findUsuarioByIdStrictSimple(appContext, userExists.id);
    }

    const newUser = await appContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const usuarioHasCargoRepository =
        getUsuarioHasCargoRepository(entityManager);

      const cargoRepository = getCargoRepository(entityManager);

      const newUser = usuarioRepository.create();
      newUser.keycloakId = keycloakId;

      const usersCount = await usuarioRepository.count();
      const hasUsers = usersCount > 0;

      await usuarioRepository.save(newUser);

      if (!hasUsers) {
        const cargo = await cargoRepository.findOne({
          where: { slug: 'dape' },
        });

        if (cargo) {
          const usuarioHasCargo = usuarioHasCargoRepository.create();
          usuarioHasCargo.usuario = newUser;
          usuarioHasCargo.cargo = cargo;
          await usuarioHasCargoRepository.save(usuarioHasCargo);
        }
      }

      return await usuarioRepository.findOneOrFail({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    return this.findUsuarioByIdStrictSimple(appContext, newUser.id);
  }

  async getUsuarioStrictGenericField<K extends keyof UsuarioDbEntity>(
    appContext: AppContext,
    usuarioId: number,
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.findUsuarioByIdStrict(
      appContext,
      { id: usuarioId },
      { select: ['id', field] },
    );

    return <UsuarioDbEntity[K]>usuario[field];
  }

  async getUsuarioEmail(appContext: AppContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(appContext, usuarioId, 'email');
  }

  async getUsuarioKeycloakId(appContext: AppContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(
      appContext,
      usuarioId,
      'keycloakId',
    );
  }

  async getUsuarioMatriculaSiape(appContext: AppContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(
      appContext,
      usuarioId,
      'matriculaSiape',
    );
  }

  async getUsuarioCargos(appContext: AppContext, usuarioId: number) {
    const cargos = await appContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      return cargoRepository
        .createQueryBuilder('cargo')
        .innerJoin('cargo.usuarioHasCargo', 'usuarioHasCargo')
        .innerJoin('usuarioHasCargo.usuario', 'usuario')
        .where('usuario.id = :usuarioId', { usuarioId })
        .select(['cargo.id'])
        .getMany();
    });

    return cargos;
  }

  async createUsuario(appContext: AppContext, dto: ICreateUsuarioInput) {
    const fieldsData = pick(dto, ['email']);

    const usuario = await appContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const usuario = { ...fieldsData };
      await usuarioRepository.save(usuario);

      return <UsuarioDbEntity>usuario;
    });

    return this.findUsuarioByIdStrictSimple(appContext, usuario.id);
  }

  async updateUsuario(appContext: AppContext, dto: IUpdateUsuarioInput) {
    const { id } = dto;

    const usuario = await this.findUsuarioByIdStrictSimple(appContext, id);

    const fieldsData = omit(dto, ['id']);

    await appContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const updatedUsuario = { ...usuario, ...fieldsData };
      await usuarioRepository.save(updatedUsuario);

      return <UsuarioDbEntity>updatedUsuario;
    });

    return this.findUsuarioByIdStrictSimple(appContext, usuario.id);
  }

  async deleteUsuario(appContext: AppContext, dto: IDeleteUsuarioInput) {
    const { id } = dto;

    const usuario = await this.findUsuarioByIdStrictSimple(appContext, id);

    return appContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      try {
        await usuarioRepository.delete(usuario.id);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}
