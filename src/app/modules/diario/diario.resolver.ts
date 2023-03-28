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
import { DisciplinaType } from '../disciplina/disciplina.type';
import { TurmaType } from '../turma/turma.type';
import { DiarioService } from './diario.service';
import { DiarioType } from './diario.type';
import {
  CreateDiarioInputType,
  CreateDiarioInputZod,
  DeleteDiarioInputType,
  DeleteDiarioInputZod,
  FindDiarioByIdInputType,
  FindDiarioByIdInputZod,
  UpdateDiarioInputType,
  UpdateDiarioInputZod,
} from './dtos';

@Resolver(() => DiarioType)
export class DiarioResolver {
  constructor(private diarioService: DiarioService) {}

  // START: queries

  @Query(() => DiarioType)
  async findDiarioById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindDiarioByIdInputZod)
    dto: FindDiarioByIdInputType,
  ) {
    return this.diarioService.findDiarioByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => DiarioType)
  async createDiario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateDiarioInputZod)
    dto: CreateDiarioInputType,
  ) {
    return this.diarioService.createDiario(appContext, dto);
  }

  @Mutation(() => DiarioType)
  async updateDiario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateDiarioInputZod)
    dto: UpdateDiarioInputType,
  ) {
    return this.diarioService.updateDiario(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteDiario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteDiarioInputZod)
    dto: DeleteDiarioInputType,
  ) {
    return this.diarioService.deleteDiario(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  /*
  @ResolveField('genericField', () => String)
  async genericField(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: DiarioType,
  ) {
    return this.diarioService.getDiarioGenericField(appContext, parent.id);
  }
  */

  @ResolveField('turma', () => TurmaType)
  async turma(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: DiarioType,
  ) {
    return this.diarioService.getDiarioTurma(appContext, parent.id);
  }

  @ResolveField('disciplina', () => DisciplinaType)
  async disciplina(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: DiarioType,
  ) {
    return this.diarioService.getDiarioDisciplina(appContext, parent.id);
  }

  // END: fields resolvers
}