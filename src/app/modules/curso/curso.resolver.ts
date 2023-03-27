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
import { CursoService } from './curso.service';
import { CursoType } from './curso.type';
import {
  CreateCursoInputType,
  CreateCursoInputZod,
  DeleteCursoInputType,
  DeleteCursoInputZod,
  FindCursoByIdInputType,
  FindCursoByIdInputZod,
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