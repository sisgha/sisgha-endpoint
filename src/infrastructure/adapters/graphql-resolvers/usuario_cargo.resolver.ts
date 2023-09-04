import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  AddCargoToUsuarioInputType,
  AddCargoToUsuarioInputZod,
  CargoType,
  ChecarUsuarioPossuiCargoByUsuarioIdAndCargoSlugInputZod,
  ChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInputType,
  FindUsuarioCargoByIdInputType,
  FindUsuarioCargoByIdInputZod,
  FindUsuarioCargoByUsuarioIdAndCargoIdInputType,
  FindUsuarioCargoByUsuarioIdAndCargoIdInputZod,
  ListCargoFromUsuarioInputType,
  ListCargoFromUsuarioInputZod,
  ListCargoResultType,
  RemoveCargoFromUsuarioInputType,
  RemoveCargoFromUsuarioInputZod,
  UsuarioCargoType,
  UsuarioType,
} from '../../application/dtos';
import { UsuarioCargoService } from '../../application/resources/usuario_cargo/usuario_cargo.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => UsuarioCargoType)
export class UsuarioCargoResolver {
  constructor(private usuarioCargoService: UsuarioCargoService) {}

  // START: queries

  @Query(() => UsuarioCargoType)
  async findUsuarioCargoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioCargoByIdInputZod)
    dto: FindUsuarioCargoByIdInputType,
  ) {
    return this.usuarioCargoService.findUsuarioCargoByIdStrict(actorContext, dto);
  }

  @Query(() => UsuarioCargoType)
  async findUsuarioCargoByUsuarioIdAndCargoId(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioCargoByUsuarioIdAndCargoIdInputZod)
    dto: FindUsuarioCargoByUsuarioIdAndCargoIdInputType,
  ) {
    return this.usuarioCargoService.findUsuarioCargoByUsuarioIdAndCargoIdStrict(actorContext, dto);
  }

  @Query(() => ListCargoResultType)
  async listCargoFromUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ListCargoFromUsuarioInputZod)
    dto: ListCargoFromUsuarioInputType,
  ) {
    return this.usuarioCargoService.listCargoFromUsuario(actorContext, dto);
  }

  @Query(() => Boolean)
  async checarUsuarioPossuiCargoByUsuarioIdAndCargoSlug(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ChecarUsuarioPossuiCargoByUsuarioIdAndCargoSlugInputZod)
    dto: ChecarUsuarioPossuiCargoByUsuarioidAndCargoSlugInputType,
  ) {
    return this.usuarioCargoService.checarUsuarioPossuiCargoByUsuarioIdAndCargoSlug(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioCargoType)
  async addCargoToUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', AddCargoToUsuarioInputZod)
    dto: AddCargoToUsuarioInputType,
  ) {
    return this.usuarioCargoService.addCargoToUsuario(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async removeCargoFromUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', RemoveCargoFromUsuarioInputZod)
    dto: RemoveCargoFromUsuarioInputType,
  ) {
    return this.usuarioCargoService.removeCargoFromUsuario(actorContext, dto);
  }

  // END: mutations

  // START: fields graphql-resolvers

  @ResolveField('cargo', () => CargoType)
  async cargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioCargoType,
  ) {
    return this.usuarioCargoService.getUsuarioCargoCargo(actorContext, parent.id);
  }

  @ResolveField('usuario', () => UsuarioType)
  async usuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioCargoType,
  ) {
    return this.usuarioCargoService.getUsuarioCargoUsuario(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
