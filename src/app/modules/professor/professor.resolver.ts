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
import {
  CreateProfessorInputType,
  CreateProfessorInputZod,
  DeleteProfessorInputType,
  DeleteProfessorInputZod,
  FindProfessorByIdInputType,
  FindProfessorByIdInputZod,
  UpdateProfessorInputType,
  UpdateProfessorInputZod,
} from './dtos';
import { ProfessorService } from './professor.service';
import { ProfessorType } from './professor.type';

@Resolver(() => ProfessorType)
export class ProfessorResolver {
  constructor(private professorService: ProfessorService) {}

  // START: queries

  @Query(() => ProfessorType)
  async findProfessorById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindProfessorByIdInputZod)
    dto: FindProfessorByIdInputType,
  ) {
    return this.professorService.findProfessorByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => ProfessorType)
  async createProfessor(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateProfessorInputZod)
    dto: CreateProfessorInputType,
  ) {
    return this.professorService.createProfessor(appContext, dto);
  }

  @Mutation(() => ProfessorType)
  async updateProfessor(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateProfessorInputZod)
    dto: UpdateProfessorInputType,
  ) {
    return this.professorService.updateProfessor(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteProfessor(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteProfessorInputZod)
    dto: DeleteProfessorInputType,
  ) {
    return this.professorService.deleteProfessor(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  /*
  @ResolveField('genericField', () => String)
  async genericField(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: ProfessorType,
  ) {
    return this.professorService.getProfessorGenericField(appContext, parent.id);
  }
  */

  @ResolveField('nome', () => String)
  async nome(
    @ResolveAppContext()
    appContext: AppContext,

    @Parent()
    parent: ProfessorType,
  ) {
    return this.professorService.getProfessorNome(appContext, parent.id);
  }

  // END: fields resolvers
}
