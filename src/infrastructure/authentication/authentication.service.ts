import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import jwt, { GetPublicKeyOrSecret, JwtPayload } from 'jsonwebtoken';
import { Client } from 'openid-client';
import { DataSource } from 'typeorm';
import { ActorContext } from '../actor-context/ActorContext';
import { ActorUser } from '../actor-context/ActorUser';
import { UsuarioService } from '../application/resources/usuario/usuario.service';
import { IS_PRODUCTION_MODE_TOKEN } from '../config/IS_PRODUCTION_MODE_TOKEN';
import { APP_DATA_SOURCE_TOKEN } from '../database/tokens/APP_DATA_SOURCE_TOKEN';
import { JwksRSAClient } from '../jwks-rsa/jwks-rsa-client.service';
import { OPENID_CLIENT_TOKEN } from '../oidc-client/tokens/OPENID_CLIENT_TOKEN';

@Injectable()
export class AuthenticationService {
  constructor(
    private usuarioService: UsuarioService,

    // ...

    @Inject(OPENID_CLIENT_TOKEN)
    private openIDClient: Client,

    // ...

    private jwksRSAClient: JwksRSAClient,

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

  private async jwtVerifyAccessToken(accessToken: string) {
    const getKeyFromHeader: GetPublicKeyOrSecret = async (header, callback) => {
      const kid = header.kid;

      if (kid) {
        const publicKey = await this.jwksRSAClient.getSigninKeyPublicKeyByKidCached(kid);

        if (publicKey) {
          callback(null, publicKey);
        } else {
          callback(new InternalServerErrorException());
        }
      }

      callback(new Error());
    };

    return new Promise<null | JwtPayload>((resolve) => {
      jwt.verify(accessToken, getKeyFromHeader, (err, decoded) => {
        if (err) {
          resolve(null);
        } else {
          resolve(<JwtPayload>decoded);
        }
      });
    });
  }

  async handleAccessTokenSoft(accessToken: any) {
    try {
      if (typeof accessToken === 'string') {
        const decoded = await this.jwtVerifyAccessToken(accessToken);

        const sub = decoded?.sub;

        if (sub) {
          return {
            sub: sub,
          };
        }
      }
    } catch (_) {
      return null;
    }

    return false;
  }

  async handleAccessTokenHard(accessToken: any) {
    try {
      if (typeof accessToken === 'string') {
        const userinfo = await this.openIDClient.userinfo(accessToken);

        if (userinfo) {
          return {
            sub: userinfo.sub,
          };
        }
      }
    } catch (_) {
      return null;
    }

    return false;
  }

  async handleAccessToken(accessToken?: any) {
    if (typeof accessToken !== 'string' || accessToken?.length === 0) {
      return false;
    }

    const softResult = await this.handleAccessTokenSoft(accessToken);

    if (softResult !== null) {
      return softResult;
    }

    const hardResult = await this.handleAccessTokenHard(accessToken);

    if (hardResult !== null) {
      return hardResult;
    }

    return false;
  }

  async validateAccessToken(accessToken?: string | any) {
    try {
      const userinfo = await this.handleAccessToken(accessToken);

      if (userinfo) {
        const usuario = await this.usuarioService.loadUsuarioFromKeycloakId(this.systemActorContext, userinfo.sub);

        return usuario;
      }
    } catch (err) {
      if (!IS_PRODUCTION_MODE_TOKEN) {
        console.error('auth err:', { err });
      }

      // throw err;
    }

    return null;
  }
}
