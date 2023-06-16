import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { GenericListInputType, GenericListInputZod } from 'src/meilisearch/dtos';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { PermissaoType } from '../permissao/permissao.type';
import {
  CreateUsuarioInternoInputType,
  CreateUsuarioInternoInputZod,
  DeleteUsuarioInternoInputType,
  DeleteUsuarioInternoInputZod,
  FindUsuarioInternoByIdInputType,
  FindUsuarioInternoByIdInputZod,
  ListUsuarioInternoResultType,
  UpdateUsuarioInternoInputType,
  UpdateUsuarioInternoInputZod,
} from './dtos';
import { UsuarioInternoService } from './usuario_interno.service';
import { UsuarioInternoType } from './usuario_interno.type';

@Resolver(() => UsuarioInternoType)
export class UsuarioInternoResolver {
  constructor(private usuarioInternoService: UsuarioInternoService) {}

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

  // START: fields resolvers

  @ResolveField('tipoAtor', () => String, { nullable: false })
  async tipoAtor(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoTipoAtor(actorContext, parent.id);
  }

  // ...

  @ResolveField('createdAt', () => Date)
  async createdAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoCreatedAt(actorContext, parent.id);
  }

  @ResolveField('updatedAt', () => Date)
  async updatedAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoUpdatedAt(actorContext, parent.id);
  }

  @ResolveField('deletedAt', () => Date, { nullable: true })
  async deletedAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoDeletedAt(actorContext, parent.id);
  }

  @ResolveField('searchSyncAt', () => Date, { nullable: true })
  async searchSyncAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoType,
  ) {
    return this.usuarioInternoService.getUsuarioInternoSearchSyncAt(actorContext, parent.id);
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

  // END: fields resolvers
}
