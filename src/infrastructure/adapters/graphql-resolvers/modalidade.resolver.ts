import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CheckModalidadeSlugAvailabilityInputType,
  CreateModalidadeInputType,
  CreateModalidadeInputZod,
  DeleteModalidadeInputType,
  DeleteModalidadeInputZod,
  FindModalidadeByIdInputType,
  FindModalidadeByIdInputZod,
  GenericListInputType,
  GenericListInputZod,
  ListModalidadeResultType,
  ModalidadeType,
  UpdateModalidadeInputType,
  UpdateModalidadeInputZod,
} from '../../application/dtos';
import { CheckModalidadeSlugAvailabilityInputZod } from '../../application/dtos/zod/check_modalidade_slug_availability_input.zod';
import { ModalidadeService } from '../../application/resources/modalidade/modalidade.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => ModalidadeType)
export class ModalidadeResolver {
  constructor(private modalidadeService: ModalidadeService) {}

  // START: queries

  @Query(() => ModalidadeType)
  async findModalidadeById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindModalidadeByIdInputZod)
    dto: FindModalidadeByIdInputType,
  ) {
    return this.modalidadeService.findModalidadeByIdStrict(actorContext, dto);
  }

  @Query(() => ListModalidadeResultType)
  async listModalidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.modalidadeService.listModalidade(actorContext, dto);
  }

  //

  @Query(() => Boolean)
  async checkModalidadeSlugAvailability(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', CheckModalidadeSlugAvailabilityInputZod)
    dto: CheckModalidadeSlugAvailabilityInputType,
  ) {
    return this.modalidadeService.checkModalidadeSlugAvailability(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => ModalidadeType)
  async createModalidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreateModalidadeInputZod)
    dto: CreateModalidadeInputType,
  ) {
    return this.modalidadeService.createModalidade(actorContext, dto);
  }

  @Mutation(() => ModalidadeType)
  async updateModalidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateModalidadeInputZod)
    dto: UpdateModalidadeInputType,
  ) {
    return this.modalidadeService.updateModalidade(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteModalidade(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeleteModalidadeInputZod)
    dto: DeleteModalidadeInputType,
  ) {
    return this.modalidadeService.deleteModalidade(actorContext, dto);
  }

  // END: mutations

  // START: fields graphql-resolvers

  @ResolveField('slug', () => String)
  async slug(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: ModalidadeType,
  ) {
    return this.modalidadeService.getModalidadeSlug(actorContext, parent.id);
  }

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: ModalidadeType,
  ) {
    return this.modalidadeService.getModalidadeDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: ModalidadeType,
  ) {
    return this.modalidadeService.getModalidadeDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: ModalidadeType,
  ) {
    return this.modalidadeService.getModalidadeDateDeleted(actorContext, parent.id);
  }

  @ResolveField('dateSearchSync', () => Date, { nullable: true })
  async dateSearchSync(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent()
    parent: ModalidadeType,
  ) {
    return this.modalidadeService.getModalidadeDateSearchSync(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
