import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit, pick } from 'lodash';
import MeiliSearch from 'meilisearch';
import { AppContext } from 'src/app-context/AppContext';
import { parralelMap } from 'src/common/utils/parralel-map';
import { getCargoRepository } from 'src/database/repositories/cargo.repository';
import { getUsuarioHasCargoRepository } from 'src/database/repositories/usuario-has-cargo.repository';
import { getUsuarioRepository } from 'src/database/repositories/usuario.repository';
import { MEILISEARCH_CLIENT } from 'src/meilisearch/constants/MEILISEARCH_CLIENT.const';
import { INDEX_USUARIO } from 'src/meilisearch/constants/meilisearch-tokens';
import { FindOneOptions } from 'typeorm';
import { UsuarioDbEntity } from '../../../database/entities/usuario.db.entity';
import {
  ICreateUsuarioInput,
  IDeleteUsuarioInput,
  IFindUsuarioByIdInput,
  IUpdateUsuarioInput,
} from './dtos';
import { IListUsuarioInput } from './dtos/ListUsuarioInput';
import { ListUsuarioResultType } from './dtos/ListUsuarioResult';
import { UsuarioType } from './usuario.type';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject(MEILISEARCH_CLIENT)
    private meilisearchClient: MeiliSearch,
  ) {}

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
    dto: IListUsuarioInput,
  ): Promise<ListUsuarioResultType> {
    const { query, limit, offset } = dto;

    const meilisearchResult = await this.meilisearchClient
      .index(INDEX_USUARIO)
      .search<UsuarioType>(query, { limit, offset });

    const items = await parralelMap(meilisearchResult.hits, async (hit) => {
      const id = hit.id;

      if (!isNil(id)) {
        const usuario = await this.findUsuarioById(appContext, {
          id: hit.id,
        });

        if (usuario) {
          return usuario;
        }
      }

      return null;
    });

    const listUsuarioResult: ListUsuarioResultType = {
      query: meilisearchResult.query,

      limit: meilisearchResult.limit,
      offset: meilisearchResult.offset,

      total: meilisearchResult.estimatedTotalHits,

      items: items,
    };

    return listUsuarioResult;
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

      const hasUsers = await usuarioRepository.findOne({
        select: ['id'],
      });

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
