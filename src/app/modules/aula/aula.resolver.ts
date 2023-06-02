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
import { DiarioType } from '../diario/diario.type';
import { LugarType } from '../lugar/lugar.type';
import { SemanaType } from '../semana/semana.type';
import { TurnoAulaType } from '../turno-aula/turno-aula.type';
import { AulaService } from './aula.service';
import { AulaType } from './aula.type';
import {
  CreateAulaInputType,
  CreateAulaInputZod,
  DeleteAulaInputType,
  DeleteAulaInputZod,
  FindAulaByIdInputType,
  FindAulaByIdInputZod,
  ListAulaResultType,
  UpdateAulaInputType,
  UpdateAulaInputZod,
} from './dtos';

@Resolver(() => AulaType)
export class AulaResolver {
  constructor(private aulaService: AulaService) {}

  // START: queries

  @Query(() => AulaType)
  async findAulaById(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', FindAulaByIdInputZod)
    dto: FindAulaByIdInputType,
  ) {
    return this.aulaService.findAulaByIdStrict(appContext, dto);
  }

  @Query(() => ListAulaResultType)
  async listAula(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.aulaService.listAula(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => AulaType)
  async createAula(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', CreateAulaInputZod)
    dto: CreateAulaInputType,
  ) {
    return this.aulaService.createAula(appContext, dto);
  }

  @Mutation(() => AulaType)
  async updateAula(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', UpdateAulaInputZod)
    dto: UpdateAulaInputType,
  ) {
    return this.aulaService.updateAula(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteAula(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', DeleteAulaInputZod)
    dto: DeleteAulaInputType,
  ) {
    return this.aulaService.deleteAula(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  /*
  @ResolveField('genericField', () => String)
  async genericField(
    @ResolveAppContext()
    appContext: app-context,

    @Parent()
    parent: AulaType,
  ) {
    return this.aulaService.getAulaGenericField(appContext, parent.id);
  }
  */

  @ResolveField('diario', () => DiarioType)
  async diario(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: AulaType,
  ) {
    return this.aulaService.getAulaDiario(appContext, parent.id);
  }

  @ResolveField('semana', () => SemanaType, { nullable: true })
  async semana(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: AulaType,
  ) {
    return this.aulaService.getAulaSemana(appContext, parent.id);
  }

  @ResolveField('turnoAula', () => TurnoAulaType, { nullable: true })
  async turnoAula(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: AulaType,
  ) {
    return this.aulaService.getAulaTurnoAula(appContext, parent.id);
  }

  @ResolveField('lugar', () => LugarType, { nullable: true })
  async lugar(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: AulaType,
  ) {
    return this.aulaService.getAulaLugar(appContext, parent.id);
  }

  // END: fields resolvers
}
