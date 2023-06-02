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
import { LugarType } from '../lugar/lugar.type';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaType } from './disciplina.type';
import {
  CreateDisciplinaInputType,
  CreateDisciplinaInputZod,
  DeleteDisciplinaInputType,
  DeleteDisciplinaInputZod,
  FindDisciplinaByIdInputType,
  FindDisciplinaByIdInputZod,
  ListDisciplinaResultType,
  UpdateDisciplinaInputType,
  UpdateDisciplinaInputZod,
} from './dtos';

@Resolver(() => DisciplinaType)
export class DisciplinaResolver {
  constructor(private disciplinaService: DisciplinaService) {}

  // START: queries

  @Query(() => DisciplinaType)
  async findDisciplinaById(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindDisciplinaByIdInputZod)
    dto: FindDisciplinaByIdInputType,
  ) {
    return this.disciplinaService.findDisciplinaByIdStrict(appContext, dto);
  }

  @Query(() => ListDisciplinaResultType)
  async listDisciplina(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.disciplinaService.listDisciplina(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => DisciplinaType)
  async createDisciplina(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', CreateDisciplinaInputZod)
    dto: CreateDisciplinaInputType,
  ) {
    return this.disciplinaService.createDisciplina(appContext, dto);
  }

  @Mutation(() => DisciplinaType)
  async updateDisciplina(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', UpdateDisciplinaInputZod)
    dto: UpdateDisciplinaInputType,
  ) {
    return this.disciplinaService.updateDisciplina(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteDisciplina(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', DeleteDisciplinaInputZod)
    dto: DeleteDisciplinaInputType,
  ) {
    return this.disciplinaService.deleteDisciplina(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  /*
  @ResolveField('genericField', () => String)
  async genericField(
    @ResolveAppContext()
    appContext: app-context,

    @Parent()
    parent: DisciplinaType,
  ) {
    return this.disciplinaService.getDisciplinaGenericField(appContext, parent.id);
  }
  */

  @ResolveField('nome', () => String)
  async nome(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: DisciplinaType,
  ) {
    return this.disciplinaService.getDisciplinaNome(appContext, parent.id);
  }

  @ResolveField('lugarPadrao', () => LugarType, { nullable: true })
  async lugarPadrao(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: DisciplinaType,
  ) {
    return this.disciplinaService.getDisciplinaLugarPadrao(
      appContext,
      parent.id,
    );
  }

  // END: fields resolvers
}
