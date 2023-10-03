import { Query, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CheckUsuarioAuthorizationsInputType,
  CheckUsuarioAuthorizationsInputZod,
  CheckUsuarioAuthorizationsResultType,
} from '../../application/dtos';
import { AuthorizationService } from '../../authorization/authorization.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver()
export class AuthorizationResolver {
  constructor(
    // ....
    private authorizationService: AuthorizationService,
  ) {}

  // START: queries

  @Query(() => CheckUsuarioAuthorizationsResultType)
  async checkUsuarioAuthorizations(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CheckUsuarioAuthorizationsInputZod)
    dto: CheckUsuarioAuthorizationsInputType,
  ) {
    return this.authorizationService.checkUsuarioAuthorizations(actorContext, dto);
  }

  // END: queries

  // START: mutations

  // END: mutations

  // START: fields graphql-resolvers

  // END: fields graphql-resolvers
}
