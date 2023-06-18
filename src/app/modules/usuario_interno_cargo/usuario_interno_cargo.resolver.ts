import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { CargoType } from '../cargo/cargo.type';
import { ListCargoResultType } from '../cargo/dtos';
import { UsuarioInternoType } from '../usuario_interno/usuario_interno.type';
import {
  AddCargoToUsuarioInternoInputType,
  AddCargoToUsuarioInternoInputZod,
  FindUsuarioInternoCargoByIdInputType,
  FindUsuarioInternoCargoByIdInputZod,
  FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputType,
  FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod,
  ListCargoFromUsuarioInternoInputType,
  ListCargoFromUsuarioInternoInputZod,
  RemoveCargoFromUsuarioInternoInputType,
  RemoveCargoFromUsuarioInternoInputZod,
} from './dtos';
import { UsuarioInternoCargoService } from './usuario_interno_cargo.service';
import { UsuarioInternoCargoType } from './usuario_interno_cargo.type';

@Resolver(() => UsuarioInternoCargoType)
export class UsuarioInternoCargoResolver {
  constructor(private usuarioInternoCargoService: UsuarioInternoCargoService) {}

  // START: queries

  @Query(() => UsuarioInternoCargoType)
  async findUsuarioInternoCargoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioInternoCargoByIdInputZod)
    dto: FindUsuarioInternoCargoByIdInputType,
  ) {
    return this.usuarioInternoCargoService.findUsuarioInternoCargoByIdStrict(actorContext, dto);
  }

  @Query(() => UsuarioInternoCargoType)
  async findUsuarioInternoCargoByUsuarioInternoIdAndCargoId(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputZod)
    dto: FindUsuarioInternoCargoByUsuarioInternoIdAndCargoIdInputType,
  ) {
    return this.usuarioInternoCargoService.findUsuarioInternoCargoByUsuarioInternoIdAndCargoIdStrict(actorContext, dto);
  }

  @Query(() => ListCargoResultType)
  async listCargoFromUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ListCargoFromUsuarioInternoInputZod)
    dto: ListCargoFromUsuarioInternoInputType,
  ) {
    return this.usuarioInternoCargoService.listCargoFromUsuarioInterno(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioInternoCargoType)
  async addCargoToUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', AddCargoToUsuarioInternoInputZod)
    dto: AddCargoToUsuarioInternoInputType,
  ) {
    return this.usuarioInternoCargoService.addCargoToUsuarioInterno(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async removeCargoFromUsuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', RemoveCargoFromUsuarioInternoInputZod)
    dto: RemoveCargoFromUsuarioInternoInputType,
  ) {
    return this.usuarioInternoCargoService.removeCargoFromUsuarioInterno(actorContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('cargo', () => CargoType)
  async cargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoCargoType,
  ) {
    return this.usuarioInternoCargoService.getUsuarioInternoCargoCargo(actorContext, parent.id);
  }

  @ResolveField('usuarioInterno', () => UsuarioInternoType)
  async usuarioInterno(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioInternoCargoType,
  ) {
    return this.usuarioInternoCargoService.getUsuarioInternoCargoUsuarioInterno(actorContext, parent.id);
  }

  // END: fields resolvers
}
