import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { has } from 'lodash';
import { BaseClient } from 'openid-client';
import { ICreateUsuarioInput, IUpdateUsuarioInput, IUpdateUsuarioPasswordInput } from '../../domain/dtos';
import { ActorContext } from '../actor-context/ActorContext';
import { OPENID_CLIENT_TOKEN } from '../oidc-client/tokens/OPENID_CLIENT_TOKEN';
import { KCContainerService } from './kc-container.service';

@Injectable()
export class KCClientService {
  constructor(
    // ...
    private kcContainerService: KCContainerService,

    @Inject(OPENID_CLIENT_TOKEN)
    private oidcClient: BaseClient,
  ) {}

  static buildUserFullName(user: UserRepresentation) {
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  }

  private async getKcAdminClient() {
    const kcAdminClient = await this.kcContainerService.getAdminClient();
    return kcAdminClient;
  }

  async findUserByEmail(actorContext: ActorContext, email: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const response = await kcAdminClient.users.find({
      email,
      exact: true,
    });

    if (response.length === 0) {
      return null;
    }

    const user = response[0];

    return user;
  }

  async findUserByUsername(actorContext: ActorContext, username: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const response = await kcAdminClient.users.find({
      username,
      exact: true,
    });

    if (response.length === 0) {
      return null;
    }

    const user = response[0];

    return user;
  }

  async findUserByKeycloakId(actorContext: ActorContext, keycloakId: string) {
    const kcAdminClient = await this.getKcAdminClient();
    const user = await kcAdminClient.users.findOne({ id: keycloakId });
    return user;
  }

  async findUserByKeycloakIdStrict(actorContext: ActorContext, keycloakId: string) {
    const user = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async cleanupEmailUsage(actorContext: ActorContext, keycloakId: string | null, email: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const users = await kcAdminClient.users.find({ email });

    for (const user of users) {
      const id = user.id;

      if (id && id !== keycloakId) {
        await kcAdminClient.users.update({ id }, { email: '' });
      }
    }
  }

  async cleanupUsernameUsage(actorContext: ActorContext, keycloakId: string | null = null, username: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const users = await kcAdminClient.users.find({ username });

    for (const user of users) {
      const id = user.id;

      if (id && id !== keycloakId) {
        await kcAdminClient.users.update({ id }, { username: '' });
      }
    }
  }

  async cleanupUsage(
    actorContext: ActorContext,
    keycloakId: string | null,
    dto: { email?: string | undefined | null; username?: string | undefined | null },
  ) {
    const email = dto.email;

    if (email) {
      await this.cleanupEmailUsage(actorContext, keycloakId, email);
    }

    const username = dto.username;

    if (username) {
      await this.cleanupUsernameUsage(actorContext, keycloakId, username);
    }
  }

  async createUser(actorContext: ActorContext, dto: ICreateUsuarioInput) {
    await this.cleanupUsage(actorContext, null, { email: dto.email, username: dto.matriculaSiape });

    const kcAdminClient = await this.getKcAdminClient();

    const user: UserRepresentation = {
      username: dto.matriculaSiape,
      email: dto.email,
      firstName: dto.nome,
      enabled: true,
    };

    const response = await kcAdminClient.users.create(user);

    return response;
  }

  async updateUser(actorContext: ActorContext, keycloakId: string, dto: IUpdateUsuarioInput) {
    await this.cleanupUsage(actorContext, keycloakId, { email: dto.email, username: dto.matriculaSiape });

    const kcAdminClient = await this.getKcAdminClient();

    const user: UserRepresentation = {
      ...(has(dto, 'nome')
        ? {
            firstName: dto.nome,
            lastName: '',
          }
        : {}),

      ...(has(dto, 'email')
        ? {
            email: dto.email,
          }
        : {}),

      ...(has(dto, 'matriculaSiape')
        ? {
            username: dto.matriculaSiape,
          }
        : {}),
    };

    await kcAdminClient.users.update(
      {
        id: keycloakId,
      },
      {
        ...user,
      },
    );
  }

  async isEmailAvailable(actorContext: ActorContext, email: string) {
    const currentUserWithEmail = await this.findUserByEmail(actorContext, email);
    return currentUserWithEmail === null;
  }

  async isEmailAvailableForUser(actorContext: ActorContext, email: string, keycloakId: string) {
    const currentUserWithEmail = await this.findUserByEmail(actorContext, email);
    const user = await this.findUserByKeycloakIdStrict(actorContext, keycloakId);
    return !currentUserWithEmail || currentUserWithEmail.id === user.id;
  }

  async isUsernameAvailable(actorContext: ActorContext, username: string) {
    const currentUserWithUsername = await this.findUserByUsername(actorContext, username);
    return currentUserWithUsername === null;
  }

  async isUsernameAvailableForUser(actorContext: ActorContext, username: string, keycloakId: string) {
    const currentUserWithUsername = await this.findUserByUsername(actorContext, username);

    const user = await this.findUserByKeycloakIdStrict(actorContext, keycloakId);

    return !currentUserWithUsername || currentUserWithUsername.id === user.id;
  }

  async checkUserPassword(actorContext: ActorContext, keycloakId: string, password: string) {
    const kcUser = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (kcUser) {
      try {
        const username = kcUser.username ?? kcUser.email;

        const tokenset = await this.oidcClient.grant({
          password,
          username,
          grant_type: 'password',
        });

        if (tokenset) {
          return true;
        }
      } catch (error) {}

      return false;
    }
  }

  async updateUserPassword(actorContext: ActorContext, keycloakId: string, dto: IUpdateUsuarioPasswordInput, checkCurrentPassword = true) {
    const kcAdminClient = await this.getKcAdminClient();

    const user = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (user) {
      if (checkCurrentPassword) {
        const isPasswordCorrect = await this.checkUserPassword(actorContext, keycloakId, dto.currentPassword);

        if (!isPasswordCorrect) {
          throw new ForbiddenException('Invalid current password.');
        }
      }

      await kcAdminClient.users.resetPassword({
        id: keycloakId,
        credential: {
          temporary: false,
          type: 'password',
          value: dto.newPassword,
        },
      });

      return true;
    }
  }
}
