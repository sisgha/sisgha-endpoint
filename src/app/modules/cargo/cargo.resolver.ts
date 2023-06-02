import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AppContext } from 'src/app/AppContext/AppContext';
import { ResolveAppContext } from 'src/app/AppContext/ResolveAppContext';
import {
  GenericListInputType,
  GenericListInputZod,
} from 'src/meilisearch/dtos';
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
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindCargoByIdInputZod)
    dto: FindCargoByIdInputType,
  ) {
    return this.cargoService.findCargoByIdStrict(appContext, dto);
  }

  @Query(() => ListCargoResultType)
  async listCargo(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.cargoService.listCargo(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => CargoType)
  async createCargo(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', CreateCargoInputZod)
    dto: CreateCargoInputType,
  ) {
    return this.cargoService.createCargo(appContext, dto);
  }

  @Mutation(() => CargoType)
  async updateCargo(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', UpdateCargoInputZod)
    dto: UpdateCargoInputType,
  ) {
    return this.cargoService.updateCargo(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteCargo(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', DeleteCargoInputZod)
    dto: DeleteCargoInputType,
  ) {
    return this.cargoService.deleteCargo(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('slug', () => String)
  async slug(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: CargoType,
  ) {
    return this.cargoService.getCargoSlug(appContext, parent.id);
  }

  // END: fields resolvers
}
