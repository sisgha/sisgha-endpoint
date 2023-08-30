import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { get, has, intersection, omit, pick } from 'lodash';
import { FindOneOptions } from 'typeorm';
import { ContextAction } from '../../../../domain/authorization-constraints';
import {
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

  async listUsuario(actorContext: ActorContext, dto: IGenericListInput): Promise<ListUsuarioResultType> {
    const allowedUsuarioIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_USUARIO, ContextAction.READ);

    const result = await this.meilisearchService.listResource<UsuarioType>(APP_RESOURCE_USUARIO, dto, allowedUsuarioIds);

    return {
      ...result,
    };
  }

  async getUsuarioStrictGenericField<K extends keyof UsuarioDbEntity>(
    actorContext: ActorContext,
    usuarioId: number,
    field: K,
  ): Promise<UsuarioDbEntity[K]> {
    const usuario = await this.findUsuarioByIdStrict(actorContext, { id: usuarioId }, { select: ['id', field] });
    return <UsuarioDbEntity[K]>usuario[field];
  }

  //

  async findUsuarioByEmail(actorContext: ActorContext, email: string) {
    const kcUser = await this.kcClientService.findUserByEmail(actorContext, email);

    if (kcUser) {
      const id = get(kcUser, 'id');

      if (typeof id === 'string') {
        return this.loadUsuarioFromKeycloakId(actorContext, id);
      }
    }

    // const usuario = await actorContext.databaseRun(async ({ entityManager }) => {
    //   const usuarioRepository = getUsuarioRepository(entityManager);

    //   return await usuarioRepository.findOne({
    //     where: { email },
    //     select: ['id'],
    //   });
    // });

    // return usuario;

    return null;
  }

  async findUsuarioByMatriculaSiape(actorContext: ActorContext, matriculaSiape: string) {
    const kcUser = await this.kcClientService.findUserByUsername(actorContext, matriculaSiape);

    if (kcUser) {
      const id = get(kcUser, 'id');

      if (typeof id === 'string') {
        return this.loadUsuarioFromKeycloakId(actorContext, id);
      }
    }

    return null;
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

  async getUsuarioCargos(actorContext: ActorContext, usuarioId: number) {
    const usuario = await this.findUsuarioByIdStrictSimple(actorContext, usuarioId);

    const allowedCargoIds = await actorContext.getAllowedIdsByRecursoVerbo(APP_RESOURCE_CARGO, ContextAction.READ);

    const allUsuarioCargoIds = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);

      const qb = await cargoRepository.initQueryBuilder();

      await cargoRepository.filterQueryByUsuarioId(qb, usuario.id);

      qb.select(['cargo.id']);

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
      throw new InternalServerErrorException();
    }

    const usuarioExists = await this.findUsuarioByKeycloakId(actorContext, kcUserId);

    if (usuarioExists) {
      const email = kcUser.email;

      if (email) {
        await actorContext.databaseRun(async ({ entityManager }) => {
          const usuarioRepository = getUsuarioRepository(entityManager);

          await usuarioRepository
            .createQueryBuilder('usuario')
            .update()
            .set({
              email: null,
            })
            .where('email = :email', { email })
            .andWhere('id != :id', { id: usuarioExists.id })
            .execute();
        });
      }

      const username = kcUser.username;

      if (username) {
        await actorContext.databaseRun(async ({ entityManager }) => {
          const usuarioRepository = getUsuarioRepository(entityManager);

          await usuarioRepository
            .createQueryBuilder('usuario')
            .update()
            .set({
              matriculaSiape: null,
            })
            .where('matriculaSiape = :matriculaSiape', { matriculaSiape: username })
            .andWhere('id != :id', { id: usuarioExists.id })
            .execute();
        });
      }

      return this.findUsuarioByIdStrictSimple(actorContext, usuarioExists.id);
    }

    const newUsuario = await actorContext.databaseRun(async ({ entityManager }) => {
      const cargoRepository = getCargoRepository(entityManager);
      const usuarioRepository = getUsuarioRepository(entityManager);
      const usuarioCargoRepository = getUsuarioCargoRepository(entityManager);

      const newUsuario = usuarioRepository.create();

      newUsuario.keycloakId = keycloakId;
      newUsuario.nome = KCClientService.buildUserFullName(kcUser);
      newUsuario.email = kcUser.email ?? null;
      newUsuario.matriculaSiape = kcUser.username ?? null;

      const usersCount = await usuarioRepository.count();
      const hasUsers = usersCount > 0;

      await usuarioRepository.save(newUsuario);

      if (!hasUsers) {
        const cargoDape = await cargoRepository.findOne({
          where: { slug: 'dape' },
        });

        if (cargoDape) {
          const usuarioHasCargo = usuarioCargoRepository.create();
          usuarioHasCargo.usuario = newUsuario;
          usuarioHasCargo.cargo = cargoDape;
          await usuarioCargoRepository.save(usuarioHasCargo);
        }
      }

      return await usuarioRepository.findOneOrFail({
        where: { keycloakId: keycloakId },
        select: ['id'],
      });
    });

    return this.findUsuarioByIdStrictSimple(actorContext, newUsuario.id);
  }

  async isEmailAvailable(actorContext: ActorContext, email: string) {
    return this.kcClientService.isEmailAvailable(actorContext, email);
  }

  async isEmailAvailableForUser(actorContext: ActorContext, email: string, usuarioId: UsuarioDbEntity['id']) {
    const keycloakId = await this.getUsuarioKeycloakId(actorContext, usuarioId);

    if (!keycloakId) {
      return false;
    }

    return this.kcClientService.isEmailAvailableForUser(actorContext, email, keycloakId);
  }

  async isUsernameAvailable(actorContext: ActorContext, username: string) {
    return this.kcClientService.isUsernameAvailable(actorContext, username);
  }

  async isUsernameAvailableForUser(actorContext: ActorContext, matriculaSiape: string, usuarioId: UsuarioDbEntity['id']) {
    const keycloakId = await this.getUsuarioKeycloakId(actorContext, usuarioId);

    if (!keycloakId) {
      return false;
    }

    return this.kcClientService.isUsernameAvailableForUser(actorContext, matriculaSiape, keycloakId);
  }

  async createUsuario(actorContext: ActorContext, dto: ICreateUsuarioInput) {
    const fieldsData = pick(dto, ['email', 'nome', 'matriculaSiape']);

    if (has(fieldsData, 'email')) {
      const email = get(fieldsData, 'email')!;

      const isEmailAvailable = await this.isEmailAvailable(actorContext, email);

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

      const isMatriculaSiapeAvailable = await this.isUsernameAvailable(actorContext, matriculaSiape);

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

      const isEmailAvailable = await this.isEmailAvailableForUser(actorContext, email, usuario.id);

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

      const isMatriculaSiapeAvailable = await this.isUsernameAvailableForUser(actorContext, matriculaSiape, usuario.id);

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
