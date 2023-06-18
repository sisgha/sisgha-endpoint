import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { CargoType } from '../cargo/cargo.type';
import { ListCargoResultType } from '../cargo/dtos';
import { UsuarioType } from '../usuario/usuario.type';
import {
  AddCargoToUsuarioInputType,
  AddCargoToUsuarioInputZod,
  FindUsuarioCargoByIdInputType,
  FindUsuarioCargoByIdInputZod,
  FindUsuarioCargoByUsuarioIdAndCargoIdInputType,
  FindUsuarioCargoByUsuarioIdAndCargoIdInputZod,
  ListCargoFromUsuarioInputType,
  ListCargoFromUsuarioInputZod,
  RemoveCargoFromUsuarioInputType,
  RemoveCargoFromUsuarioInputZod,
} from './dtos';
import { UsuarioCargoService } from './usuario_cargo.service';
import { UsuarioCargoType } from './usuario_cargo.type';

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

  // START: fields resolvers

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

  // END: fields resolvers
}
