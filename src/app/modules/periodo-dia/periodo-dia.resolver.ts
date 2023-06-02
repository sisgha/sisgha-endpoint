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
import {
  CreatePeriodoDiaInputType,
  CreatePeriodoDiaInputZod,
  DeletePeriodoDiaInputType,
  DeletePeriodoDiaInputZod,
  FindPeriodoDiaByIdInputType,
  FindPeriodoDiaByIdInputZod,
  ListPeriodoDiaResultType,
  UpdatePeriodoDiaInputType,
  UpdatePeriodoDiaInputZod,
} from './dtos';
import { PeriodoDiaService } from './periodo-dia.service';
import { PeriodoDiaType } from './periodo-dia.type';

@Resolver(() => PeriodoDiaType)
export class PeriodoDiaResolver {
  constructor(private periodoDiaService: PeriodoDiaService) {}

  // START: queries

  @Query(() => PeriodoDiaType)
  async findPeriodoDiaById(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindPeriodoDiaByIdInputZod)
    dto: FindPeriodoDiaByIdInputType,
  ) {
    return this.periodoDiaService.findPeriodoDiaByIdStrict(appContext, dto);
  }

  @Query(() => ListPeriodoDiaResultType)
  async listPeriodoDia(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.periodoDiaService.listPeriodoDia(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => PeriodoDiaType)
  async createPeriodoDia(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', CreatePeriodoDiaInputZod)
    dto: CreatePeriodoDiaInputType,
  ) {
    return this.periodoDiaService.createPeriodoDia(appContext, dto);
  }

  @Mutation(() => PeriodoDiaType)
  async updatePeriodoDia(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', UpdatePeriodoDiaInputZod)
    dto: UpdatePeriodoDiaInputType,
  ) {
    return this.periodoDiaService.updatePeriodoDia(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deletePeriodoDia(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', DeletePeriodoDiaInputZod)
    dto: DeletePeriodoDiaInputType,
  ) {
    return this.periodoDiaService.deletePeriodoDia(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('horaInicio', () => Date)
  async horaInicio(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: PeriodoDiaType,
  ) {
    return this.periodoDiaService.getPeriodoDiaHoraInicio(
      appContext,
      parent.id,
    );
  }

  @ResolveField('horaFim', () => Date)
  async horaFim(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: PeriodoDiaType,
  ) {
    return this.periodoDiaService.getPeriodoDiaHoraFim(appContext, parent.id);
  }

  // END: fields resolvers
}
