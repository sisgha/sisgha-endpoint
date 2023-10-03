import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Client } from 'openid-client';
import { DataSource } from 'typeorm';
import { ActorContext } from '../actor-context/ActorContext';
import { ActorUser } from '../actor-context/ActorUser';
import { UsuarioService } from '../application/resources/usuario/usuario.service';
import { IS_PRODUCTION_MODE_TOKEN } from '../config/IS_PRODUCTION_MODE_TOKEN';
import { APP_DATA_SOURCE_TOKEN } from '../database/tokens/APP_DATA_SOURCE_TOKEN';
import { OPENID_CLIENT_TOKEN } from '../oidc-client/tokens/OPENID_CLIENT_TOKEN';

@Injectable()
export class AuthenticationService {
  constructor(
    private usuarioService: UsuarioService,
    // ...
    @Inject(OPENID_CLIENT_TOKEN)
    private openIDClient: Client,
    // ...
    @Inject(APP_DATA_SOURCE_TOKEN)
    private dataSource: DataSource,
  ) {}

  private get systemActorContext() {
    return ActorContext.forSystem(this.dataSource);
  }

  async getAuthedUsuario(actorContext: ActorContext) {
    const { actor } = actorContext;

    if (actor instanceof ActorUser) {
      const { usuarioRef } = actor;
      return this.usuarioService.findUsuarioByIdStrictSimple(actorContext, usuarioRef.id);
    }

    throw new BadRequestException("You're not logged in");
  }

  async validateAccessToken(accessToken?: string | any) {
    try {
      if (typeof accessToken !== 'string' || accessToken?.length === 0) {
        throw new TypeError();
      }

      const userinfo = await this.openIDClient.userinfo(accessToken);

      const usuario = await this.usuarioService.loadUsuarioFromKeycloakId(this.systemActorContext, userinfo.sub);

      return usuario;
    } catch (err) {
      if (!IS_PRODUCTION_MODE_TOKEN) {
        console.error('auth err:', { err });
      }

      // throw err;
    }

    return null;
  }
}
