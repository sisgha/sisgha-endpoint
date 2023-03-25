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
import {
  CreateLugarInputType,
  CreateLugarInputZod,
  DeleteLugarInputType,
  DeleteLugarInputZod,
  FindLugarByIdInputType,
  FindLugarByIdInputZod,
  UpdateLugarInputType,
  UpdateLugarInputZod,
} from './dtos';
import { LugarService } from './lugar.service';
import { LugarType } from './lugar.type';

@Resolver(() => LugarType)
export class LugarResolver {
  constructor(private lugarService: LugarService) {}

  // START: queries

  @Query(() => LugarType)
  async findLugarById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindLugarByIdInputZod)
    dto: FindLugarByIdInputType,
  ) {
    return this.lugarService.findLugarByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => LugarType)
  async createLugar(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateLugarInputZod)
    dto: CreateLugarInputType,
  ) {
    return this.lugarService.createLugar(appContext, dto);
  }

  @Mutation(() => LugarType)
  async updateLugar(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateLugarInputZod)
    dto: UpdateLugarInputType,
  ) {
    return this.lugarService.updateLugar(appContext, dto);
  }

  @Mutation(() => LugarType)
  async deleteLugar(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteLugarInputZod)
    dto: DeleteLugarInputType,
  ) {
    return this.lugarService.deleteLugar(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('numero', () => String, { nullable: true })
  async numero(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: LugarType,
  ) {
    return this.lugarService.getLugarNumero(appContext, parent.id);
  }

  @ResolveField('descricao', () => String, { nullable: true })
  async descricao(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: LugarType,
  ) {
    return this.lugarService.getLugarDescricao(appContext, parent.id);
  }

  @ResolveField('tipo', () => String, { nullable: true })
  async tipo(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: LugarType,
  ) {
    return this.lugarService.getLugarTipo(appContext, parent.id);
  }

  // END: fields resolvers
}
