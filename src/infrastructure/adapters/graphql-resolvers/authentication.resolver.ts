import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import { UsuarioType } from '../../application/dtos';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ResolveActorContext } from '../../common/decorators';

@Resolver()
export class AuthenticationResolver {
  constructor(private authService: AuthenticationService) {}

  // START: queries

  @Query(() => UsuarioType)
  async authedUser(
    @ResolveActorContext()
    actorContext: ActorContext,
  ) {
    return this.authService.getAuthedUser(actorContext);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields graphql-resolvers

  // END: fields graphql-resolvers
}
