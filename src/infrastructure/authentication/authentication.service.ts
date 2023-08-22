import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Client } from 'openid-client';
import { ActorUser } from 'src/infrastructure/actor-context/ActorUser';
import { DataSource } from 'typeorm';
import { Actor } from '../actor-context/Actor';
import { ActorContext } from '../actor-context/ActorContext';
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

  async getAuthedUser(actorContext: ActorContext) {
    const { actor } = actorContext;

    if (actor instanceof ActorUser) {
      const { userRef } = actor;
      return this.usuarioService.findUsuarioByIdStrictSimple(actorContext, userRef.id);
    }

    throw new BadRequestException("You're not logged in");
  }

  async validateAccessToken(accessToken?: string | any) {
    const appContext = new ActorContext(this.dataSource, Actor.forSystemEntity());

    try {
      if (typeof accessToken !== 'string' || accessToken?.length === 0) {
        throw new TypeError();
      }

      const userinfo = await this.openIDClient.userinfo(accessToken);

      const user = await this.usuarioService.loadUsuarioFromKeycloakId(appContext, userinfo.sub);

      return user;
    } catch (err) {
      if (!IS_PRODUCTION_MODE_TOKEN) {
        console.error('auth err:', { err });
      }

      // throw err;
    }

    return null;
  }
}
