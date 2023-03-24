import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { ResolveAppContext } from 'src/infrastructure/app-context/ResolveAppContext';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { CargoService } from './cargo.service';
import { CargoType } from './cargo.type';
import {
  CreateCargoInputType,
  CreateCargoInputZod,
  DeleteCargoInputType,
  DeleteCargoInputZod,
  FindCargoByIdInputType,
  FindCargoByIdInputZod,
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

  @Mutation(() => CargoType)
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
