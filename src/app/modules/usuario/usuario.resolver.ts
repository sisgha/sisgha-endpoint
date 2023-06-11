import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { GenericListInputType, GenericListInputZod } from 'src/meilisearch/dtos';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { CargoType } from '../cargo/cargo.type';
import {
  CreateUsuarioInputType,
  CreateUsuarioInputZod,
  DeleteUsuarioInputType,
  DeleteUsuarioInputZod,
  FindUsuarioByIdInputType,
  FindUsuarioByIdInputZod,
  UpdateUsuarioInputType,
  UpdateUsuarioInputZod,
} from './dtos';
import { ListUsuarioResultType } from './dtos/ListUsuarioResult';
import { UsuarioService } from './usuario.service';
import { UsuarioType } from './usuario.type';

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(private usuarioService: UsuarioService) {}

  // START: queries

  @Query(() => UsuarioType)
  async findUsuarioById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioByIdInputZod)
    dto: FindUsuarioByIdInputType,
  ) {
    return this.usuarioService.findUsuarioByIdStrict(actorContext, dto);
  }

  @Query(() => ListUsuarioResultType)
  async listUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.usuarioService.listUsuario(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioType)
  async createUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreateUsuarioInputZod)
    dto: CreateUsuarioInputType,
  ) {
    return this.usuarioService.createUsuario(actorContext, dto);
  }

  @Mutation(() => UsuarioType)
  async updateUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateUsuarioInputZod)
    dto: UpdateUsuarioInputType,
  ) {
    return this.usuarioService.updateUsuario(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeleteUsuarioInputZod)
    dto: DeleteUsuarioInputType,
  ) {
    return this.usuarioService.deleteUsuario(actorContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('email', () => String, { nullable: true })
  async email(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioEmail(actorContext, parent.id);
  }

  @ResolveField('keycloakId', () => String, { nullable: true })
  async keycloakId(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioKeycloakId(actorContext, parent.id);
  }

  @ResolveField('matriculaSiape', () => String, { nullable: true })
  async matriculaSiape(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioMatriculaSiape(actorContext, parent.id);
  }

  @ResolveField('cargos', () => [CargoType])
  async cargos(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioCargos(actorContext, parent.id);
  }

  // END: fields resolvers
}
