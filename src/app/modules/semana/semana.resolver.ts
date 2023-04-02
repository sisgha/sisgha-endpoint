import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AppContext } from 'src/app-context/AppContext';
import { ResolveAppContext } from 'src/app-context/ResolveAppContext';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import {
  CreateSemanaInputType,
  CreateSemanaInputZod,
  DeleteSemanaInputType,
  DeleteSemanaInputZod,
  FindSemanaByIdInputType,
  FindSemanaByIdInputZod,
  UpdateSemanaInputType,
  UpdateSemanaInputZod,
} from './dtos';
import { SemanaService } from './semana.service';
import { SemanaType } from './semana.type';

@Resolver(() => SemanaType)
export class SemanaResolver {
  constructor(private semanaService: SemanaService) {}

  // START: queries

  @Query(() => SemanaType)
  async findSemanaById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindSemanaByIdInputZod)
    dto: FindSemanaByIdInputType,
  ) {
    return this.semanaService.findSemanaByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => SemanaType)
  async createSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateSemanaInputZod)
    dto: CreateSemanaInputType,
  ) {
    return this.semanaService.createSemana(appContext, dto);
  }

  @Mutation(() => SemanaType)
  async updateSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateSemanaInputZod)
    dto: UpdateSemanaInputType,
  ) {
    return this.semanaService.updateSemana(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteSemanaInputZod)
    dto: DeleteSemanaInputType,
  ) {
    return this.semanaService.deleteSemana(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('dataInicio', () => Date)
  async dataInicio(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: SemanaType,
  ) {
    return this.semanaService.getSemanaDataInicio(appContext, parent.id);
  }

  @ResolveField('dataFim', () => Date)
  async dataFim(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: SemanaType,
  ) {
    return this.semanaService.getSemanaDataFim(appContext, parent.id);
  }

  @ResolveField('status', () => String)
  async status(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: SemanaType,
  ) {
    return this.semanaService.getSemanaStatus(appContext, parent.id);
  }

  // END: fields resolvers
}
