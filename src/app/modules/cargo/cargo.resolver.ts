import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { GenericListInputType, GenericListInputZod } from 'src/meilisearch/dtos';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { CargoService } from './cargo.service';
import { CargoType } from './cargo.type';
import {
  CreateCargoInputType,
  CreateCargoInputZod,
  DeleteCargoInputType,
  DeleteCargoInputZod,
  FindCargoByIdInputType,
  FindCargoByIdInputZod,
  ListCargoResultType,
  UpdateCargoInputType,
  UpdateCargoInputZod,
} from './dtos';

@Resolver(() => CargoType)
export class CargoResolver {
  constructor(private cargoService: CargoService) {}

  // START: queries

  @Query(() => CargoType)
  async findCargoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindCargoByIdInputZod)
    dto: FindCargoByIdInputType,
  ) {
    return this.cargoService.findCargoByIdStrict(actorContext, dto);
  }

  @Query(() => ListCargoResultType)
  async listCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.cargoService.listCargo(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => CargoType)
  async createCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreateCargoInputZod)
    dto: CreateCargoInputType,
  ) {
    return this.cargoService.createCargo(actorContext, dto);
  }

  @Mutation(() => CargoType)
  async updateCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateCargoInputZod)
    dto: UpdateCargoInputType,
  ) {
    return this.cargoService.updateCargo(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeleteCargoInputZod)
    dto: DeleteCargoInputType,
  ) {
    return this.cargoService.deleteCargo(actorContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('slug', () => String)
  async slug(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: CargoType,
  ) {
    return this.cargoService.getCargoSlug(actorContext, parent.id);
  }

  // END: fields resolvers
}
