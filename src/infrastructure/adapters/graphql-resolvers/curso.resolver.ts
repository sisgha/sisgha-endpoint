import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CreateCursoInputType,
  CreateCursoInputZod,
  CursoType,
  DeleteCursoInputType,
  DeleteCursoInputZod,
  FindCursoByIdInputType,
  FindCursoByIdInputZod,
  GenericListInputType,
  GenericListInputZod,
  ListCursoResultType,
  UpdateCursoInputType,
  UpdateCursoInputZod,
} from '../../application/dtos';
import { CursoService } from '../../application/resources/curso/curso.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => CursoType)
export class CursoResolver {
  constructor(private cursoService: CursoService) {}

  // START: queries

  @Query(() => CursoType)
  async findCursoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindCursoByIdInputZod)
    dto: FindCursoByIdInputType,
  ) {
    return this.cursoService.findCursoByIdStrict(actorContext, dto);
  }

  @Query(() => ListCursoResultType)
  async listCurso(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.cursoService.listCurso(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => CursoType)
  async createCurso(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreateCursoInputZod)
    dto: CreateCursoInputType,
  ) {
    return this.cursoService.createCurso(actorContext, dto);
  }

  @Mutation(() => CursoType)
  async updateCurso(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateCursoInputZod)
    dto: UpdateCursoInputType,
  ) {
    return this.cursoService.updateCurso(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteCurso(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeleteCursoInputZod)
    dto: DeleteCursoInputType,
  ) {
    return this.cursoService.deleteCurso(actorContext, dto);
  }

  // END: mutations

  // START: fields

  @ResolveField('nome', () => String)
  async nome(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoNome(actorContext, parent.id);
  }

  @ResolveField('nomeAbreviado', () => String)
  async nomeAbreviado(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoNomeAbreviado(actorContext, parent.id);
  }

  @ResolveField('modalidade', () => String)
  async modalidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoModalidade(actorContext, parent.id);
  }

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoDateDeleted(actorContext, parent.id);
  }

  @ResolveField('dateSearchSync', () => Date, { nullable: true })
  async dateSearchSync(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: CursoType,
  ) {
    return this.cursoService.getCursoDateSearchSync(actorContext, parent.id);
  }

  // END: fields
}
