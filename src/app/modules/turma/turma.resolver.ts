import {
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AppContext } from 'src/app-context/AppContext';
import { ResolveAppContext } from 'src/app-context/ResolveAppContext';
import {
  GenericListInputType,
  GenericListInputZod,
} from 'src/meilisearch/dtos';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { CursoType } from '../curso/curso.type';
import { LugarType } from '../lugar/lugar.type';
import {
  CreateTurmaInputType,
  CreateTurmaInputZod,
  DeleteTurmaInputType,
  DeleteTurmaInputZod,
  FindTurmaByIdInputType,
  FindTurmaByIdInputZod,
  ListTurmaResultType,
  UpdateTurmaInputType,
  UpdateTurmaInputZod,
} from './dtos';
import { TurmaService } from './turma.service';
import { TurmaType } from './turma.type';

@Resolver(() => TurmaType)
export class TurmaResolver {
  constructor(private turmaService: TurmaService) {}

  // START: queries

  @Query(() => TurmaType)
  async findTurmaById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindTurmaByIdInputZod)
    dto: FindTurmaByIdInputType,
  ) {
    return this.turmaService.findTurmaByIdStrict(appContext, dto);
  }

  @Query(() => ListTurmaResultType)
  async listTurma(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.turmaService.listTurma(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => TurmaType)
  async createTurma(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateTurmaInputZod)
    dto: CreateTurmaInputType,
  ) {
    return this.turmaService.createTurma(appContext, dto);
  }

  @Mutation(() => TurmaType)
  async updateTurma(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateTurmaInputZod)
    dto: UpdateTurmaInputType,
  ) {
    return this.turmaService.updateTurma(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteTurma(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteTurmaInputZod)
    dto: DeleteTurmaInputType,
  ) {
    return this.turmaService.deleteTurma(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  /*
  @ResolveField('genericField', () => String)
  async genericField(
    @ResolveAppContext()
    appContext: app-context,

    @Parent()
    parent: TurmaType,
  ) {
    return this.turmaService.getTurmaGenericField(appContext, parent.id);
  }
  */

  @ResolveField('periodo', () => String)
  async periodo(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: TurmaType,
  ) {
    return this.turmaService.getTurmaPeriodo(appContext, parent.id);
  }

  @ResolveField('turno', () => String)
  async turno(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: TurmaType,
  ) {
    return this.turmaService.getTurmaTurno(appContext, parent.id);
  }

  @ResolveField('curso', () => CursoType)
  async curso(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: TurmaType,
  ) {
    return this.turmaService.getTurmaCurso(appContext, parent.id);
  }

  @ResolveField('lugarPadrao', () => LugarType, { nullable: true })
  async lugarPadrao(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: TurmaType,
  ) {
    return this.turmaService.getTurmaLugarPadrao(appContext, parent.id);
  }

  // END: fields resolvers
}
