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
import { DiaSemanaType } from '../dia-semana/dia-semana.type';
import { PeriodoDiaType } from '../periodo-dia/periodo-dia.type';
import {
  CreateTurnoAulaInputType,
  CreateTurnoAulaInputZod,
  DeleteTurnoAulaInputType,
  DeleteTurnoAulaInputZod,
  FindTurnoAulaByIdInputType,
  FindTurnoAulaByIdInputZod,
  UpdateTurnoAulaInputType,
  UpdateTurnoAulaInputZod,
} from './dtos';
import { TurnoAulaService } from './turno-aula.service';
import { TurnoAulaType } from './turno-aula.type';

@Resolver(() => TurnoAulaType)
export class TurnoAulaResolver {
  constructor(private turnoAulaService: TurnoAulaService) {}

  // START: queries

  @Query(() => TurnoAulaType)
  async findTurnoAulaById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindTurnoAulaByIdInputZod)
    dto: FindTurnoAulaByIdInputType,
  ) {
    return this.turnoAulaService.findTurnoAulaByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => TurnoAulaType)
  async createTurnoAula(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateTurnoAulaInputZod)
    dto: CreateTurnoAulaInputType,
  ) {
    return this.turnoAulaService.createTurnoAula(appContext, dto);
  }

  @Mutation(() => TurnoAulaType)
  async updateTurnoAula(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateTurnoAulaInputZod)
    dto: UpdateTurnoAulaInputType,
  ) {
    return this.turnoAulaService.updateTurnoAula(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteTurnoAula(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteTurnoAulaInputZod)
    dto: DeleteTurnoAulaInputType,
  ) {
    return this.turnoAulaService.deleteTurnoAula(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('diaSemana', () => DiaSemanaType)
  async diaSemana(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: TurnoAulaType,
  ) {
    return this.turnoAulaService.getTurnoAulaDiaSemana(appContext, parent.id);
  }

  @ResolveField('periodoDia', () => PeriodoDiaType)
  async periodoDia(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: TurnoAulaType,
  ) {
    return this.turnoAulaService.getTurnoAulaPeriodoDia(appContext, parent.id);
  }

  // END: fields resolvers
}
