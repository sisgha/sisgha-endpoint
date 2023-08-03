import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CreatePermissaoInputType,
  CreatePermissaoInputZod,
  DeletePermissaoInputType,
  DeletePermissaoInputZod,
  FindPermissaoByIdInputType,
  FindPermissaoByIdInputZod,
  GenericListInputType,
  GenericListInputZod,
  ListPermissaoResultType,
  PermissaoType,
  UpdatePermissaoInputType,
  UpdatePermissaoInputZod,
} from '../../application/dtos';
import { PermissaoService } from '../../application/resources/permissao/permissao.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => PermissaoType)
export class PermissaoResolver {
  constructor(
    // ...
    private permissaoService: PermissaoService,
  ) {}

  // START: queries

  @Query(() => PermissaoType)
  async findPermissaoById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindPermissaoByIdInputZod)
    dto: FindPermissaoByIdInputType,
  ) {
    return this.permissaoService.findPermissaoByIdStrict(actorContext, dto);
  }

  @Query(() => ListPermissaoResultType)
  async listPermissao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.permissaoService.listPermissao(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => PermissaoType)
  async createPermissao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreatePermissaoInputZod)
    dto: CreatePermissaoInputType,
  ) {
    return this.permissaoService.createPermissao(actorContext, dto);
  }

  @Mutation(() => PermissaoType)
  async updatePermissao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdatePermissaoInputZod)
    dto: UpdatePermissaoInputType,
  ) {
    return this.permissaoService.updatePermissao(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deletePermissao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeletePermissaoInputZod)
    dto: DeletePermissaoInputType,
  ) {
    return this.permissaoService.deletePermissao(actorContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('descricao', () => String)
  async descricao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoDescricao(actorContext, parent.id);
  }

  @ResolveField('acao', () => String)
  async acao(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoAcao(actorContext, parent.id);
  }

  @ResolveField('recurso', () => String)
  async recurso(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoRecurso(actorContext, parent.id);
  }

  @ResolveField('constraint', () => GraphQLJSON)
  async constraint(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoConstraint(actorContext, parent.id);
  }

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoDateDeleted(actorContext, parent.id);
  }

  @ResolveField('dateSearchSync', () => Date, { nullable: true })
  async dateSearchSync(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoDateSearchSync(actorContext, parent.id);
  }

  // END: fields resolvers
}