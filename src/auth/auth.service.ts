import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Client } from 'openid-client';
import { DataSource } from 'typeorm';
import { UsuarioService } from '../app/modules/usuario/usuario.service';
import { AppContext } from '../app-context/AppContext';
import { IS_PRODUCTION_MODE } from '../common/constants/IS_PRODUCTION_MODE.const';
import { OPENID_CLIENT } from './constants/OPENID_CLIENT.const';
import { DATA_SOURCE } from '../database/constants/DATA_SOURCE';
import { ResourceActionRequest } from './interfaces/ResourceActionRequest';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,

    @Inject(OPENID_CLIENT)
    private openIDClient: Client,

    @Inject(DATA_SOURCE)
    private dataSource: DataSource,
  ) {}

  async getAuthedUser(appContext: AppContext) {
    const { resourceActionRequest } = appContext;

    const { user } = resourceActionRequest;

    if (!user) {
      throw new BadRequestException("You're not logged in");
    }

    return this.usuarioService.findUsuarioByIdStrictSimple(appContext, user.id);
  }

  async validateAccessToken(accessToken?: string | any) {
    const appContext = new AppContext(
      this.dataSource,
      ResourceActionRequest.forSystemInternalActions(),
    );

    try {
      if (typeof accessToken !== 'string' || accessToken?.length === 0) {
        throw new TypeError();
      }

      const userinfo = await this.openIDClient.userinfo(accessToken);

      const user = await this.usuarioService.getUsuarioFromKeycloakId(
        appContext,
        userinfo.sub,
      );

      return user;
    } catch (err) {
      if (!IS_PRODUCTION_MODE) {
        console.error('auth err:', { err });
      }

      throw err;
    }
  }

  async getUsuarioResourceActionRequest(userId: number) {
    return ResourceActionRequest.forUser(userId);
  }
}
