import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CreateUsuarioInternoInputType,
  CreateUsuarioInternoInputZod,
  DeleteUsuarioInternoInputType,
  DeleteUsuarioInternoInputZod,
  FindUsuarioInternoByIdInputType,
  FindUsuarioInternoByIdInputZod,
  GenericListInputType,
  GenericListInputZod,
  ListUsuarioInternoResultType,
  PermissaoType,
  UpdateUsuarioInternoInputType,
  UpdateUsuarioInternoInputZod,
  UsuarioInternoType,
} from '../../application/dtos';
import { UsuarioInternoService } from '../../application/resources/usuario_interno/usuario_interno.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => UsuarioInternoType)
export class UsuarioInternoResolver {
  constructor(
    // ...
    private usuarioInternoService: UsuarioInternoService,
  ) {}

  // START: queries

  @Query(() => UsuarioInternoType)
  async findUsuarioInternoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioInternoByIdInputZod)
    dto: FindUsuarioInternoByIdInputType,
  ) {
    return this.usuarioInternoService.findUsuarioInternoByIdStrict(actorContext, dto);
  }

  @Query(() => ListUsuarioInternoResultType)
  async listUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.usuarioInternoService.listUsuarioInterno(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioInternoType)
  async createUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreateUsuarioInternoInputZod)
    dto: CreateUsuarioInternoInputType,
  ) {
    return this.usuarioInternoService.createUsuarioInterno(actorContext, dto);
  }

  @Mutation(() => UsuarioInternoType)
  async updateUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateUsuarioInternoInputZod)
    dto: UpdateUsuarioInternoInputType,
  ) {
    return this.usuarioInternoService.updateUsuarioInterno(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeleteUsuarioInternoInputZod)
    dto: DeleteUsuarioInternoInputType,
  ) {
    return this.usuarioInternoService.deleteUsuarioInterno(actorContext, dto);
  }

  // END: mutations

  // START: fields graphql-resolvers

  @ResolveField('tipoEntidade', () => String, { nullable: false })
  async tipoEntidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternotipoEntidade(actorContext, parent.id);
  }

  // ...

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoDateDeleted(actorContext, parent.id);
  }

  @ResolveField('dateSearchSync', () => Date, { nullable: true })
  async dateSearchSync(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoDateSearchSync(actorContext, parent.id);
  }

  // ...

  @ResolveField('permissoes', () => [PermissaoType])
  async permissoes(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoPermissoes(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
