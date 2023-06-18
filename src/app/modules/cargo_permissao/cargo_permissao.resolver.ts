import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { CargoPermissaoService } from './cargo_permissao.service';
import { CargoPermissaoType } from './cargo_permissao.type';
import {
  AddPermissaoToCargoInputType,
  AddPermissaoToCargoInputZod,
  FindCargoPermissaoByCargoIdAndPermissaoIdInputType,
  FindCargoPermissaoByCargoIdAndPermissaoIdInputZod,
  FindCargoPermissaoByIdInputType,
  FindCargoPermissaoByIdInputZod,
  ListPermissaoFromCargoInputType,
  ListPermissaoFromCargoInputZod,
  RemovePermissaoFromCargoInputType,
  RemovePermissaoFromCargoInputZod,
} from './dtos';
import { CargoType } from '../cargo/cargo.type';
import { PermissaoType } from '../permissao/permissao.type';
import { ListPermissaoResultType } from '../permissao/dtos';

@Resolver(() => CargoPermissaoType)
export class CargoPermissaoResolver {
  constructor(private cargoPermissaoService: CargoPermissaoService) {}

  // START: queries

  @Query(() => CargoPermissaoType)
  async findCargoPermissaoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindCargoPermissaoByIdInputZod)
    dto: FindCargoPermissaoByIdInputType,
  ) {
    return this.cargoPermissaoService.findCargoPermissaoByIdStrict(actorContext, dto);
  }

  @Query(() => CargoPermissaoType)
  async findCargoPermissaoByCargoIdAndPermissaoId(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindCargoPermissaoByCargoIdAndPermissaoIdInputZod)
    dto: FindCargoPermissaoByCargoIdAndPermissaoIdInputType,
  ) {
    return this.cargoPermissaoService.findCargoPermissaoByCargoIdAndPermissaoIdStrict(actorContext, dto);
  }

  @Query(() => ListPermissaoResultType)
  async listPermissaoFromCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', ListPermissaoFromCargoInputZod)
    dto: ListPermissaoFromCargoInputType,
  ) {
    return this.cargoPermissaoService.listPermissoesFromCargo(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => CargoPermissaoType)
  async addPermissaoToCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', AddPermissaoToCargoInputZod)
    dto: AddPermissaoToCargoInputType,
  ) {
    return this.cargoPermissaoService.addPermissaoToCargo(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async removePermissaoFromCargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', RemovePermissaoFromCargoInputZod)
    dto: RemovePermissaoFromCargoInputType,
  ) {
    return this.cargoPermissaoService.removePermissaoFromCargo(actorContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('cargo', () => CargoType)
  async cargo(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: CargoPermissaoType,
  ) {
    return this.cargoPermissaoService.getCargoPermissaoCargo(actorContext, parent.id);
  }

  @ResolveField('permissao', () => PermissaoType)
  async permissao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: CargoPermissaoType,
  ) {
    return this.cargoPermissaoService.getCargoPermissaoPermissao(actorContext, parent.id);
  }

  // END: fields resolvers
}
