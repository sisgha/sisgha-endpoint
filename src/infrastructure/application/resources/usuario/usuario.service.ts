import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { get, has, intersection, omit, pick } from 'lodash';
import { FindOneOptions, IsNull } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import {
  ICheckUsuarioEmailAvailabilityInput,
  ICheckUsuarioMatriculaSiapeAvailabilityInput,
  ICreateUsuarioInput,
  IDeleteUsuarioInput,
  IFindUsuarioByIdInput,
  IUpdateUsuarioInput,
  IUpdateUsuarioPasswordInput,
} from '../../../../domain/dtos';
import { IGenericListInput } from '../../../../domain/search/IGenericListInput';
import { ActorContext } from '../../../actor-context/ActorContext';
import { ActorUser } from '../../../actor-context/ActorUser';
import { CargoDbEntity } from '../../../database/entities/cargo.db.entity';
import { PermissaoDbEntity } from '../../../database/entities/permissao.db.entity';
import { UsuarioDbEntity } from '../../../database/entities/usuario.db.entity';
import { getCargoRepository } from '../../../database/repositories/cargo.repository';
import { getPermissaoRepository } from '../../../database/repositories/permissao.repository';
import { getUsuarioRepository } from '../../../database/repositories/usuario.repository';
import { getUsuarioCargoRepository } from '../../../database/repositories/usuario_cargo.repository';
import { ValidationErrorCodes, ValidationFailedException } from '../../../exceptions';
import { extractIds } from '../../../helpers/extract-ids';
import { KCClientService } from '../../../kc-container/kc-client.service';
import { KCContainerService } from '../../../kc-container/kc-container.service';
import { MeiliSearchService } from '../../../meilisearch/meilisearch.service';
import { ListUsuarioResultType } from '../../dtos/graphql/list_usuario_result.type';
import { UsuarioType } from '../../dtos/graphql/usuario.type';
import { APP_RESOURCE_CARGO } from '../cargo/cargo.resource';
import { APP_RESOURCE_PERMISSAO } from '../permissao/permissao.resource';
import { APP_RESOURCE_USUARIO } from './usuario.resource';

@Injectable()
export class UsuarioService {
  constructor(
    // ...
    private meilisearchService: MeiliSearchService,
    private kcContainerService: KCContainerService,
    private kcClientService: KCClientService,
  ) {}

  async findUsuarioById(actorContext: ActorContext, dto: IFindUsuarioByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return usuarioRepository.findOne({
        where: { id: dto.id },
        select: ['id'],
        cache: 20,
      });
    });

    if (!targetUsuario) {
      return null;
    }

    const usuario = await actorContext.databaseRun<UsuarioDbEntity>(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOneOrFail({
        where: { id: targetUsuario.id },
        select: ['id'],
        ...options,
      });
    });

    return actorContext.readResource(APP_RESOURCE_USUARIO, usuario);
  }

  async findUsuarioByIdStrict(actorContext: ActorContext, dto: IFindUsuarioByIdInput, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.findUsuarioById(actorContext, dto, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async findUsuarioByIdStrictSimple<T = Pick<UsuarioDbEntity, 'id'>>(actorContext: ActorContext, usuarioId: number): Promise<T> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, { id: usuarioId });
    return <T>usuario;
  }

  async findUsuarioByKeycloakId(actorContext: ActorContext, keycloakId: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOne({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    return this.findUsuarioById(actorContext, { id: targetUsuario.id }, options);
  }

  async findUsuarioByKeycloakIdStrict(actorContext: ActorContext, keycloakId: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.findUsuarioByKeycloakId(actorContext, keycloakId, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async findUsuarioByEmail(actorContext: ActorContext, email: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOne({
        where: { email: email },
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    return this.findUsuarioById(actorContext, { id: targetUsuario.id }, options);
  }

  async findUsuarioByEmailStrict(actorContext: ActorContext, email: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.findUsuarioByEmail(actorContext, email, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async findUsuarioByMatriculaSiape(actorContext: ActorContext, matriculaSiape: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const targetUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      return await usuarioRepository.findOne({
        where: { matriculaSiape: matriculaSiape },
        select: ['id'],
      });
    });

    if (!targetUsuario) {
      return null;
    }

    return this.findUsuarioById(actorContext, { id: targetUsuario.id }, options);
  }

  async findUsuarioByMatriculaSiapeStrict(actorContext: ActorContext, matriculaSiape: string, options?: FindOneOptions<UsuarioDbEntity>) {
    const usuario = await this.findUsuarioByEmail(actorContext, matriculaSiape, options);

    if (!usuario) {
      throw new NotFoundException();
    }

    return usuario;
  }

  async listUsuario(actorContext: ActorContext, dto: IGenericListInput): Promise<ListUsuarioResultType> {
    const allowedUsuarioIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_USUARIO, ContextAction.READ);

    const result = await this.meilisearchService.listResource<UsuarioType>(APP_RESOURCE_USUARIO, dto, allowedUsuarioIds);

    return {
      ...result,
    };
  }

  async checkUsuarioEmailAvailability(actorContext: ActorContext, dto: ICheckUsuarioEmailAvailabilityInput) {
    const isEmailBeingUsedByOtherUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const qb = usuarioRepository.createQueryBuilder('usuario');

      qb.select('usuario.id');

      qb.where('usuario.email = :email', { email: dto.email });

      qb.andWhere('usuario.dateDeleted is NULL');

      if (dto.usuarioId) {
        qb.andWhere('usuario.id != :usuarioId', { usuarioId: dto.usuarioId });
      }

      const count = await qb.getCount();

      return count === 0;
    });

    return isEmailBeingUsedByOtherUsuario;
  }

  async checkUsuarioMatriculaSiapeAvailability(actorContext: ActorContext, dto: ICheckUsuarioMatriculaSiapeAvailabilityInput) {
    const isMatriculaSiapeBeingUsedByOtherUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const qb = usuarioRepository.createQueryBuilder('usuario');

      qb.select('usuario.id');

      qb.where('usuario.matriculaSiape = :matriculaSiape', { matriculaSiape: dto.matriculaSiape });

      qb.andWhere('usuario.dateDeleted is NULL');

      if (dto.usuarioId) {
        qb.andWhere('usuario.id != :usuarioId', { usuarioId: dto.usuarioId });
      }

      const count = await qb.getCount();

      return count === 0;
    });

    return isMatriculaSiapeBeingUsedByOtherUsuario;
  }

  async getUsuariosCount(actorContext: ActorContext, includeDeleted = false) {
    return actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const qb = usuarioRepository.createQueryBuilder('usuario');

      qb.select('usuario.id');

      if (!includeDeleted) {
        qb.where('usuario.dateDeleted IS NULL');
      }

      const usersCount = await qb.getCount();

      return usersCount;
    });
  }

  async getHasUsuarios(actorContext: ActorContext, includeDeleted = false) {
    const usersCount = await this.getUsuariosCount(actorContext, includeDeleted);
    return usersCount > 0;
  }

  //

  async getUsuarioStrictGenericField<K extends keyof UsuarioDbEntity>(
    actorContext: ActorContext,
    usuarioId: number,
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, { id: usuarioId }, { select: ['id', field] });
    return <UsuarioDbEntity[K]>usuario[field];
  }

  // ...

  async getUsuarioNome(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'nome');
  }

  async getUsuarioEmail(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'email');
  }

  async getUsuarioMatriculaSiape(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'matriculaSiape');
  }

  //

  async getUsuarioKeycloakId(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'keycloakId');
  }

  //

  async getUsuarioDateCreated(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateCreated');
  }

  async getUsuarioDateUpdated(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateUpdated');
  }

  async getUsuarioDateDeleted(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateDeleted');
  }

  async getUsuarioDateSearchSync(actorContext: ActorContext, usuarioId: number) {
    return this.getUsuarioStrictGenericField(actorContext, usuarioId, 'dateSearchSync');
  }

  //

  async getUsuarioPermissoes(actorContext: ActorContext, usuarioId: number) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, usuarioId);

    const allowedPermissaoIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_PERMISSAO, ContextAction.READ);

    const allUsuarioPermissaoIds = await actorContext.databaseRun(async ({ entityManager }) => {
      const permissaoRepository = getPermissaoRepository(entityManager);

      const qb = await permissaoRepository.initQueryBuilder();

      await permissaoRepository.filterQueryByUsuarioId(qb, usuario.id);

      qb.select(['permissao.id']);

      const permissoes = await qb.getMany();

      const ids = extractIds(permissoes);

      return ids;
    });

    const targetPermissaoIds = intersection(allowedPermissaoIds, allUsuarioPermissaoIds);

    const permissoes = targetPermissaoIds.map((id) => <PermissaoDbEntity>{ id: id });

    return permissoes;
  }

  async getUsuarioCargos(actorContext: ActorContext, usuarioId: number, includeDeleted = false) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, usuarioId);

    const allowedCargoIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_CARGO, ContextAction.READ);

    const allUsuarioCargoIds = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = await cargoRepository.initQueryBuilder();

      await cargoRepository.filterQueryByUsuarioId(qb, usuario.id);

      qb.select(['cargo.id']);

      if (!includeDeleted) {
        qb.andWhere('cargo.dateDeleted IS NULL');
      }

      const cargos = await qb.getMany();

      const ids = extractIds(cargos);

      return ids;
    });

    const targetCargoIds = intersection(allowedCargoIds, allUsuarioCargoIds);

    const cargos = targetCargoIds.map((id) => <CargoDbEntity>{ id: id });

    return cargos;
  }

  // ...

  async loadUsuarioFromKeycloakId(actorContext: ActorContext, keycloakId: string) {
    const kcUser = await this.kcClientService.findUserByKeycloakIdStrict(actorContext, keycloakId);

    const kcUserId = kcUser.id;

    if (!kcUserId) {
      throw new InternalServerErrorException('The provided user was not found by keycloakId on the KeyCloak repository.');
    }

    const dbUsuarioByKeycloakId = await this.findUsuarioByKeycloakId(actorContext, keycloakId, {
      where: {
        dateDeleted: IsNull(),
      },
    });

    if (dbUsuarioByKeycloakId) {
      return this.findUsuarioByIdStrictSimple(actorContext, dbUsuarioByKeycloakId.id);
    }

    const username = kcUser.username;

    if (username) {
      const dbUsuarioByKeycloakUsername = await this.findUsuarioByMatriculaSiape(actorContext, username, {
        where: {
          dateDeleted: IsNull(),
        },
      });

      if (dbUsuarioByKeycloakUsername) {
        return this.findUsuarioByIdStrictSimple(actorContext, dbUsuarioByKeycloakUsername.id);
      }
    }

    const hasUsuarios = await this.getHasUsuarios(actorContext, false);

    const newUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const newUsuario = usuarioRepository.create();

      newUsuario.keycloakId = keycloakId;
      newUsuario.nome = KCClientService.buildUserFullName(kcUser);
      newUsuario.email = kcUser.email ?? null;
      newUsuario.matriculaSiape = kcUser.username ?? null;

      await usuarioRepository.save(newUsuario);

      return newUsuario;
    });

    if (!hasUsuarios) {
      await actorContext.databaseRun(async ({ entityManager }) => {
        const cargoRepository = getCargoRepository(entityManager);
        const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);

        const cargoDape = await cargoRepository.findOne({
          where: { slug: 'dape' },
        });

        if (cargoDape) {
          const usuarioHasCargo = usuarioCargoRepository.create();
          usuarioHasCargo.usuario = newUsuario;
          usuarioHasCargo.cargo = cargoDape;
          await usuarioCargoRepository.save(usuarioHasCargo);
        }
      });
    }

    return this.findUsuarioByIdStrictSimple(actorContext, newUsuario.id);
  }

  async createUsuario(actorContext: ActorContext, dto: ICreateUsuarioInput) {
    const fieldsData = pick(dto, ['email', 'nome', 'matriculaSiape']);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.checkUsuarioEmailAvailability(actorContext, { email: email, usuarioId: null });

      if (!isEmailAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.USUARIO_EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['email'],
          },
        ]);
      }
    }

    if (has(fieldsData, 'matriculaSiape')) {
      const matriculaSiape = get(fieldsData, 'matriculaSiape')!;

      const isMatriculaSiapeAvailable = await this.checkUsuarioMatriculaSiapeAvailability(actorContext, {
        matriculaSiape: matriculaSiape,
        usuarioId: null,
      });

      if (!isMatriculaSiapeAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.USUARIO_MATRICULA_SIAPE_ALREADY_IN_USE,
            message: 'Já existe um usuário com a mesma Matrícula Siape.',
            path: ['matriculaSiape'],
          },
        ]);
      }
    }

    const usuario = <UsuarioDbEntity>{
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO, ContextAction.CREATE, usuario);

    const dbUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);
      await usuarioRepository.save(usuario);
      return <UsuarioDbEntity>usuario;
    });

    if (dbUsuario) {
      const kcUser = await this.kcClientService.createUser(actorContext, dto);

      await actorContext.databaseRun(async ({ entityManager }) => {
        const usuarioRepository = getUsuarioRepository(entityManager);

        const updatedUser = <UsuarioDbEntity>{
          id: dbUsuario.id,
        };

        updatedUser.keycloakId = kcUser.id;

        await usuarioRepository.save(updatedUser);

        return updatedUser;
      });
    }

    return this.findUsuarioByIdStrictSimple(actorContext, dbUsuario.id);
  }

  async updateUsuario(actorContext: ActorContext, dto: IUpdateUsuarioInput) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, dto.id);

    const fieldsData = omit(dto, ['id']);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.checkUsuarioEmailAvailability(actorContext, { email: email, usuarioId: usuario.id });

      if (!isEmailAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.USUARIO_EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['email'],
          },
        ]);
      }
    }

    if (has(fieldsData, 'matriculaSiape')) {
      const matriculaSiape = get(fieldsData, 'matriculaSiape')!;

      const isMatriculaSiapeAvailable = await this.checkUsuarioMatriculaSiapeAvailability(actorContext, {
        matriculaSiape: matriculaSiape,
        usuarioId: usuario.id,
      });

      if (!isMatriculaSiapeAvailable) {
        throw new ValidationFailedException([
          {
            code: ValidationErrorCodes.USUARIO_EMAIL_ALREADY_IN_USE,
            message: 'Já existe um usuário com o mesmo email.',
            path: ['matriculaSiape'],
          },
        ]);
      }
    }

    const updatedUsuario = {
      ...usuario,
      ...fieldsData,
    };

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO, ContextAction.UPDATE, updatedUsuario);

    // await actorContext.databaseRun(async ({ entityManager }) => {
    //   const usuarioRepository = getUsuarioRepository(entityManager);
    //   await usuarioRepository.save(updatedUsuario);
    //   return <UsuarioDbEntity>updatedUsuario;
    // });

    const result = await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const result = await usuarioRepository
        .createQueryBuilder('user')
        .update()
        .set(updatedUsuario)
        .where('id = :id', { id: usuario.id })
        .execute();

      return result;
    });

    const rowsAffected = result.affected ?? 0;

    if (rowsAffected > 0) {
      const keycloakId = await this.getUsuarioKeycloakId(actorContext, usuario.id);

      if (keycloakId) {
        await this.kcClientService.updateUser(actorContext, keycloakId, dto);
      }
    }

    return this.findUsuarioByIdStrictSimple(actorContext, usuario.id);
  }

  async updateUsuarioPassword(actorContext: ActorContext, dto: IUpdateUsuarioPasswordInput) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, dto.id);

    const invokeContextUserRef = actorContext.actor instanceof ActorUser && actorContext.actor.userRef;

    if (!invokeContextUserRef || invokeContextUserRef.id !== usuario.id) {
      throw new ForbiddenException("You can't change other user password.");
    }

    const usuarioKeycloakId = await this.getUsuarioKeycloakId(actorContext, usuario.id);

    if (!usuarioKeycloakId) {
      throw new InternalServerErrorException('User without keycloakId');
    }

    const isPasswordCorrect = await this.kcClientService.checkUserPassword(actorContext, usuarioKeycloakId, dto.currentPassword);

    if (!isPasswordCorrect) {
      throw new ValidationFailedException([
        {
          code: ValidationErrorCodes.AUTH_PASSWORD_INVALID,
          message: 'Senha atual inválida.',
          path: ['currentPassword'],
        },
      ]);
    }

    const updated = await this.kcClientService.updateUserPassword(actorContext, usuarioKeycloakId, dto, false);

    return updated;
  }

  async deleteUsuario(actorContext: ActorContext, dto: IDeleteUsuarioInput) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, dto.id);

    await actorContext.ensurePermission(APP_RESOURCE_USUARIO, ContextAction.DELETE, usuario);

    await actorContext.databaseRun(async ({ entityManager }) => {
      const usuarioRepository = getUsuarioRepository(entityManager);

      const result = await usuarioRepository
        .createQueryBuilder('usuario')
        .update()
        .set({
          dateDeleted: new Date(),
        })
        .where('id = :id', { id: usuario.id })
        .execute();

      return result;
    });

    return true;
  }
}
