import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CargoType,
  CreateCargoInputType,
  CreateCargoInputZod,
  DeleteCargoInputType,
  DeleteCargoInputZod,
  FindCargoByIdInputType,
  FindCargoByIdInputZod,
  FindCargoBySlugInputType,
  FindCargoBySlugInputZod,
  GenericListInputType,
  GenericListInputZod,
  ListCargoResultType,
  UpdateCargoInputType,
  UpdateCargoInputZod,
} from '../../application/dtos';
import { CargoService } from '../../application/resources/cargo/cargo.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

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

  @Query(() => CargoType)
  async findCargoBySlug(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindCargoBySlugInputZod)
    dto: FindCargoBySlugInputType,
  ) {
    return this.cargoService.findCargoBySlugStrict(actorContext, dto);
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

  // START: fields graphql-resolvers

  @ResolveField('slug', () => String)
  async slug(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CargoType,
  ) {
    return this.cargoService.getCargoSlug(actorContext, parent.id);
  }

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CargoType,
  ) {
    return this.cargoService.getCargoDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CargoType,
  ) {
    return this.cargoService.getCargoDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CargoType,
  ) {
    return this.cargoService.getCargoDateDeleted(actorContext, parent.id);
  }

  @ResolveField('dateSearchSync', () => Date, { nullable: true })
  async dateSearchSync(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CargoType,
  ) {
    return this.cargoService.getCargoDateSearchSync(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
