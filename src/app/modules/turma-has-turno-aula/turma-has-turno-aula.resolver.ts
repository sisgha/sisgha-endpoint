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
import { TurmaType } from '../turma/turma.type';
import { TurnoAulaType } from '../turno-aula/turno-aula.type';
import {
  AddTurnoAulaToTurmaInputType,
  AddTurnoAulaToTurmaInputZod,
  FindTurmaHasTurnoAulaByIdInputType,
  FindTurmaHasTurnoAulaByIdInputZod,
  ListTurmaHasTurnoAulaInputType,
  ListTurmaHasTurnoAulaInputZod,
  ListTurmaHasTurnoAulaResultType,
  RemoveTurnoAulaFromTurmaInputType,
  RemoveTurnoAulaFromTurmaInputZod,
} from './dtos';
import { TurmaHasTurnoAulaService } from './turma-has-turno-aula.service';
import { TurmaHasTurnoAulaType } from './turma-has-turno-aula.type';

@Resolver(() => TurmaHasTurnoAulaType)
export class TurmaHasTurnoAulaResolver {
  constructor(private turmaHasTurnoAulaService: TurmaHasTurnoAulaService) {}

  // START: queries

  @Query(() => TurmaHasTurnoAulaType)
  async findTurmaHasTurnoAulaById(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindTurmaHasTurnoAulaByIdInputZod)
    dto: FindTurmaHasTurnoAulaByIdInputType,
  ) {
    return this.turmaHasTurnoAulaService.findTurmaHasTurnoAulaByIdStrict(
      appContext,
      dto,
    );
  }

  @Query(() => ListTurmaHasTurnoAulaResultType)
  async listTurmaHasTurnoAula(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', ListTurmaHasTurnoAulaInputZod)
    dto: ListTurmaHasTurnoAulaInputType,
  ) {
    return this.turmaHasTurnoAulaService.listTurmaHasTurnoAula(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => TurmaHasTurnoAulaType)
  async addTurnoAulaToTurma(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', AddTurnoAulaToTurmaInputZod)
    dto: AddTurnoAulaToTurmaInputType,
  ) {
    return this.turmaHasTurnoAulaService.addTurnoAulaToTurma(appContext, dto);
  }

  @Mutation(() => Boolean)
  async removeTurnoAulaFromTurma(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', RemoveTurnoAulaFromTurmaInputZod)
    dto: RemoveTurnoAulaFromTurmaInputType,
  ) {
    return this.turmaHasTurnoAulaService.removeTurnoAulaFromTurma(
      appContext,
      dto,
    );
  }

  // END: mutations

  // START: fields resolvers

  /*
  @ResolveField('genericField', () => String)
  async genericField(
    @ResolveAppContext()
    appContext: app-context,

    @Parent()
    parent: TurmaHasTurnoAulaType,
  ) {
    return this.turmaHasTurnoAulaService.getTurmaHasTurnoAulaGenericField(appContext, parent.id);
  }
  */

  @ResolveField('turma', () => TurmaType)
  async disciplina(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: TurmaHasTurnoAulaType,
  ) {
    return this.turmaHasTurnoAulaService.getTurmaHasTurnoAulaTurma(
      appContext,
      parent.id,
    );
  }

  @ResolveField('turnoAula', () => TurnoAulaType)
  async turnoAula(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: TurmaHasTurnoAulaType,
  ) {
    return this.turmaHasTurnoAulaService.getTurmaHasTurnoAulaTurnoAula(
      appContext,
      parent.id,
    );
  }

  // END: fields resolvers
}
