import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AppContext } from 'src/infrastructure/app-context/AppContext';
import { ResolveAppContext } from 'src/infrastructure/app-context/ResolveAppContext';
import { ValidatedArgs } from '../../../infrastructure/graphql/ValidatedArgs.decorator';
import { CursoType } from '../curso/curso.type';
import { DisciplinaType } from '../disciplina/disciplina.type';
import { DisciplinaCursoService } from './disciplina-curso.service';
import { DisciplinaCursoType } from './disciplina-curso.type';
import {
  AddDisciplinaToCursoInputType,
  AddDisciplinaToCursoInputZod,
  RemoveDisciplinaFromCursoInputType,
  RemoveDisciplinaFromCursoInputZod,
} from './dtos';

@Resolver(() => DisciplinaCursoType)
export class DisciplinaCursoResolver {
  constructor(private disciplinaCursoService: DisciplinaCursoService) {}

  // START: queries

  // END: queries

  // START: mutations

  @Mutation(() => DisciplinaCursoType)
  async addDisciplinaToCurso(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', AddDisciplinaToCursoInputZod)
    dto: AddDisciplinaToCursoInputType,
  ) {
    return this.disciplinaCursoService.addDisciplinaToCurso(appContext, dto);
  }

  @Mutation(() => Boolean)
  async removeDisciplinaFromCurso(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', RemoveDisciplinaFromCursoInputZod)
    dto: RemoveDisciplinaFromCursoInputType,
  ) {
    return this.disciplinaCursoService.removeDisciplinaFromCurso(
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
    appContext: AppContext,

    @Parent()
    parent: DisciplinaCursoType,
  ) {
    return this.disciplinaCursoService.getDisciplinaCursoGenericField(appContext, parent.id);
  }
  */

  @ResolveField('disciplina', () => DisciplinaType)
  async disciplina(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: DisciplinaCursoType,
  ) {
    return this.disciplinaCursoService.getDisciplinaCursoDisciplina(
      appContext,
      parent.id,
    );
  }

  @ResolveField('curso', () => CursoType)
  async curso(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: DisciplinaCursoType,
  ) {
    return this.disciplinaCursoService.getDisciplinaCursoCurso(
      appContext,
      parent.id,
    );
  }

  // END: fields resolvers
}