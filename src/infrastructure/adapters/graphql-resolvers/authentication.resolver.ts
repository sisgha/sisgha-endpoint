import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import { UsuarioType } from '../../application/dtos';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ResolveActorContext } from '../../common/decorators';

@Resolver()
export class AuthenticationResolver {
  constructor(private authenticationService: AuthenticationService) {}

  // START: queries

  @Query(() => UsuarioType)
  async authedUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
  ) {
    return this.authenticationService.getAuthedUsuario(actorContext);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields graphql-resolvers

  // END: fields graphql-resolvers
}
