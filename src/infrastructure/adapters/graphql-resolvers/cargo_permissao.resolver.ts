import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  AddPermissaoToCargoInputType,
  CargoType,
  FindCargoPermissaoByIdInputType,
  FindCargoPermissaoByIdInputZod,
  ListPermissaoFromCargoInputType,
  ListPermissaoFromCargoInputZod,
  ListPermissaoResultType,
  PermissaoType,
  RemovePermissaoFromCargoInputType,
} from '../../application/dtos';
import { CargoPermissaoType } from '../../application/dtos/graphql/cargo_permissao.type';
import { FindCargoPermissaoByCargoIdAndPermissaoIdInputType } from '../../application/dtos/graphql/find_cargo_permissao_by_cargo_id_and_permissao_id_input.type';
import { AddPermissaoToCargoInputZod } from '../../application/dtos/zod/add_permissao_to_cargo_input.zod';
import { FindCargoPermissaoByCargoIdAndPermissaoIdInputZod } from '../../application/dtos/zod/find_cargo_permissao_by_cargo_id_and_permissao_id_input.zod';
import { RemovePermissaoFromCargoInputZod } from '../../application/dtos/zod/remove_permissao_from_cargo_input.zod';
import { CargoPermissaoService } from '../../application/resources/cargo_permissao/cargo_permissao.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => CargoPermissaoType)
export class CargoPermissaoResolver {
  constructor(
    // ...
    private cargoPermissaoService: CargoPermissaoService,
  ) {}

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

  // START: fields graphql-resolvers

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

  // END: fields graphql-resolvers
}
