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
import { DiarioType } from '../diario/diario.type';
import { ProfessorType } from '../professor/professor.type';
import { DiarioProfessorService } from './diario-professor.service';
import { DiarioProfessorType } from './diario-professor.type';
import {
  AddProfessorToDiarioInputType,
  AddProfessorToDiarioInputZod,
  FindDiarioProfessorByIdInputType,
  FindDiarioProfessorByIdInputZod,
  RemoveProfessorFromDiarioInputType,
  RemoveProfessorFromDiarioInputZod,
} from './dtos';

@Resolver(() => DiarioProfessorType)
export class DiarioProfessorResolver {
  constructor(private diarioProfessorService: DiarioProfessorService) {}

  // START: queries

  @Query(() => DiarioProfessorType)
  async findDiarioProfessorById(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindDiarioProfessorByIdInputZod)
    dto: FindDiarioProfessorByIdInputType,
  ) {
    return this.diarioProfessorService.findDiarioProfessorByIdStrict(
      appContext,
      dto,
    );
  }

  // END: queries

  // START: mutations

  @Mutation(() => DiarioProfessorType)
  async addProfessorToDiario(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', AddProfessorToDiarioInputZod)
    dto: AddProfessorToDiarioInputType,
  ) {
    return this.diarioProfessorService.addProfessorToDiario(appContext, dto);
  }

  @Mutation(() => Boolean)
  async removeProfessorFromDiario(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', RemoveProfessorFromDiarioInputZod)
    dto: RemoveProfessorFromDiarioInputType,
  ) {
    return this.diarioProfessorService.removeProfessorFromDiario(
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
    parent: DiarioProfessorType,
  ) {
    return this.diarioProfessorService.getDiarioProfessorGenericField(appContext, parent.id);
  }
  */

  @ResolveField('diario', () => DiarioType)
  async diario(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: DiarioProfessorType,
  ) {
    return this.diarioProfessorService.getDiarioProfessorDiario(
      appContext,
      parent.id,
    );
  }

  @ResolveField('professor', () => ProfessorType)
  async professor(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: DiarioProfessorType,
  ) {
    return this.diarioProfessorService.getDiarioProfessorProfessor(
      appContext,
      parent.id,
    );
  }

  // END: fields resolvers
}
