import { Query, Resolver } from '@nestjs/graphql';
import { UsuarioType } from '../app/modules/usuario/usuario.type';
import { ActorContext } from '../actor-context/ActorContext';
import { ResolveActorContext } from '../actor-context/resolvers/ResolveActorContext';
import { AuthenticationService } from './authentication.service';

@Resolver()
export class AuthenticationResolver {
  constructor(private authService: AuthenticationService) {}

  // START: queries

  @Query(() => UsuarioType)
  async getAuthedUser(
    @ResolveActorContext()
    appContext: ActorContext,
  ) {
    return this.authService.getAuthedUser(appContext);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields resolvers

  // END: fields resolvers
}
