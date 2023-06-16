import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from 'src/actor-context/ActorContext';
import { ResolveActorContext } from 'src/actor-context/resolvers/ResolveActorContext';
import { GenericListInputType, GenericListInputZod } from 'src/meilisearch/dtos';
import { ValidatedArgs } from '../../../graphql/ValidatedArgs.decorator';
import { PermissaoService } from './permissao.service';
import { PermissaoType } from './permissao.type';
import {
  CreatePermissaoInputType,
  CreatePermissaoInputZod,
  DeletePermissaoInputType,
  DeletePermissaoInputZod,
  FindPermissaoByIdInputType,
  FindPermissaoByIdInputZod,
  ListPermissaoResultType,
  UpdatePermissaoInputType,
  UpdatePermissaoInputZod,
} from './dtos';
import GraphQLJSON from 'graphql-type-json';

@Resolver(() => PermissaoType)
export class PermissaoResolver {
  constructor(private permissaoService: PermissaoService) {}

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

  @ResolveField('createdAt', () => Date)
  async createdAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoCreatedAt(actorContext, parent.id);
  }

  @ResolveField('updatedAt', () => Date)
  async updatedAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoUpdatedAt(actorContext, parent.id);
  }

  @ResolveField('deletedAt', () => Date, { nullable: true })
  async deletedAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoDeletedAt(actorContext, parent.id);
  }

  @ResolveField('searchSyncAt', () => Date, { nullable: true })
  async searchSyncAt(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: PermissaoType,
  ) {
    return this.permissaoService.getPermissaoSearchSyncAt(actorContext, parent.id);
  }

  // END: fields resolvers
}
