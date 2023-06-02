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
import { CursoService } from './curso.service';
import { CursoType } from './curso.type';
import {
  CreateCursoInputType,
  CreateCursoInputZod,
  DeleteCursoInputType,
  DeleteCursoInputZod,
  FindCursoByIdInputType,
  FindCursoByIdInputZod,
  ListCursoResultType,
  UpdateCursoInputType,
  UpdateCursoInputZod,
} from './dtos';

@Resolver(() => CursoType)
export class CursoResolver {
  constructor(private cursoService: CursoService) {}

  // START: queries

  @Query(() => CursoType)
  async findCursoById(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindCursoByIdInputZod)
    dto: FindCursoByIdInputType,
  ) {
    return this.cursoService.findCursoByIdStrict(appContext, dto);
  }

  @Query(() => ListCursoResultType)
  async listCurso(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.cursoService.listCurso(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => CursoType)
  async createCurso(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', CreateCursoInputZod)
    dto: CreateCursoInputType,
  ) {
    return this.cursoService.createCurso(appContext, dto);
  }

  @Mutation(() => CursoType)
  async updateCurso(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', UpdateCursoInputZod)
    dto: UpdateCursoInputType,
  ) {
    return this.cursoService.updateCurso(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteCurso(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', DeleteCursoInputZod)
    dto: DeleteCursoInputType,
  ) {
    return this.cursoService.deleteCurso(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('nome', () => String)
  async nome(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoNome(appContext, parent.id);
  }

  @ResolveField('tipo', () => String)
  async tipo(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoTipo(appContext, parent.id);
  }

  // END: fields resolvers
}
