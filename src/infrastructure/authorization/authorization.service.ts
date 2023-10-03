import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ICheckUsuarioAuthorizationsInput,
  ICheckUsuarioAuthorizationsResult,
  ICheckUsuarioAuthorizationsResultCheck,
} from '../../domain/dtos';
import { ActorContext } from '../actor-context/ActorContext';
import { UsuarioService } from '../application/resources/usuario/usuario.service';
import { APP_DATA_SOURCE_TOKEN } from '../database/tokens/APP_DATA_SOURCE_TOKEN';
import { parralelMap } from '../helpers/parralel-map';

@Injectable()
export class AuthorizationService {
  constructor(
    private usuarioService: UsuarioService,
    // ...
    @Inject(APP_DATA_SOURCE_TOKEN)
    private dataSource: DataSource,
  ) {}

  private get systemActorContext() {
    return ActorContext.forSystem(this.dataSource);
  }

  async checkUsuarioAuthorizations(actorContext: ActorContext, dto: ICheckUsuarioAuthorizationsInput) {
    const checkUsuarioAuthorizationsResultChecks = await parralelMap(dto.checks, async (check) => {
      await actorContext.ensurePermission('app.authorization', 'check', check);

      const resultCheck: ICheckUsuarioAuthorizationsResultCheck = {
        usuarioId: check.usuarioId,
        // ...
        recurso: check.recurso,
        verbo: check.verbo,
        //
        entityId: check.entityId,
        // ...
        can: false,
      };

      const usuario = await this.usuarioService.findUsuarioById(this.systemActorContext, { id: check.usuarioId });

      if (usuario) {
        const actorContextForCheckUser = ActorContext.forUser(this.dataSource, usuario.id);

        const entity = check.entityId !== null ? { id: check.entityId } : undefined;

        const can = await actorContextForCheckUser.can(check.recurso, check.verbo, entity);

        resultCheck.can = can;
      }

      return resultCheck;
    });

    const checkUsuarioAuthorizationsResult: ICheckUsuarioAuthorizationsResult = {
      checks: checkUsuarioAuthorizationsResultChecks,
    };

    return checkUsuarioAuthorizationsResult;
  }
}
