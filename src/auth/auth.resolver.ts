import { Query, Resolver } from '@nestjs/graphql';
import { UsuarioType } from '../app/modules/usuario/usuario.type';
import { AppContext } from '../app/AppContext/AppContext';
import { ResolveAppContext } from '../app/AppContext/ResolveAppContext';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // START: queries

  @Query(() => UsuarioType)
  async getAuthedUser(
    @ResolveAppContext()
    appContext: AppContext,
  ) {
    return this.authService.getAuthedUser(appContext);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields resolvers

  // END: fields resolvers
}
