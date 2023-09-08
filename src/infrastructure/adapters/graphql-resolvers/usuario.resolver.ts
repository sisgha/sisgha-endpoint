import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ActorContext } from '../../actor-context/ActorContext';
import {
  CargoType,
  CheckUsuarioEmailAvailabilityInputType,
  CheckUsuarioEmailAvailabilityInputZod,
  CheckUsuarioMatriculaSiapeAvailabilityInputType,
  CheckUsuarioMatriculaSiapeAvailabilityInputZod,
  CreateUsuarioInputType,
  CreateUsuarioInputZod,
  DeleteUsuarioInputType,
  DeleteUsuarioInputZod,
  FindUsuarioByIdInputType,
  FindUsuarioByIdInputZod,
  GenericListInputType,
  GenericListInputZod,
  ListUsuarioResultType,
  PermissaoType,
  UpdateUsuarioInputType,
  UpdateUsuarioInputZod,
  UsuarioType,
} from '../../application/dtos';
import { UpdateUsuarioPasswordInputType } from '../../application/dtos/graphql/update_usuario_password_input.type';
import { UpdateUsuarioPasswordInputZod } from '../../application/dtos/zod/update_usuario_password_input.zod';
import { UsuarioService } from '../../application/resources/usuario/usuario.service';
import { ResolveActorContext } from '../../common/decorators';
import { ValidatedArgs } from '../../validation/ValidatedArgs.decorator';

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(
    // ...
    private usuarioService: UsuarioService,
  ) {}

  // START: queries

  @Query(() => UsuarioType)
  async findUsuarioById(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', FindUsuarioByIdInputZod)
    dto: FindUsuarioByIdInputType,
  ) {
    return this.usuarioService.findUsuarioByIdStrict(actorContext, dto);
  }

  @Query(() => ListUsuarioResultType)
  async listUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.usuarioService.listUsuario(actorContext, dto);
  }

  //

  @Query(() => Boolean)
  async checkUsuarioEmailAvailability(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', CheckUsuarioEmailAvailabilityInputZod)
    dto: CheckUsuarioEmailAvailabilityInputType,
  ) {
    return this.usuarioService.checkUsuarioEmailAvailability(actorContext, dto);
  }

  @Query(() => Boolean)
  async checkUsuarioMatriculaSiapeAvailability(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', CheckUsuarioMatriculaSiapeAvailabilityInputZod)
    dto: CheckUsuarioMatriculaSiapeAvailabilityInputType,
  ) {
    return this.usuarioService.checkUsuarioMatriculaSiapeAvailability(actorContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioType)
  async createUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', CreateUsuarioInputZod)
    dto: CreateUsuarioInputType,
  ) {
    return this.usuarioService.createUsuario(actorContext, dto);
  }

  @Mutation(() => UsuarioType)
  async updateUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', UpdateUsuarioInputZod)
    dto: UpdateUsuarioInputType,
  ) {
    return this.usuarioService.updateUsuario(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async updateUsuarioPassword(
    @ResolveActorContext()
    actorContext: ActorContext,

    @ValidatedArgs('dto', UpdateUsuarioPasswordInputZod)
    dto: UpdateUsuarioPasswordInputType,
  ) {
    return this.usuarioService.updateUsuarioPassword(actorContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteUsuario(
    @ResolveActorContext()
    actorContext: ActorContext,
    @ValidatedArgs('dto', DeleteUsuarioInputZod)
    dto: DeleteUsuarioInputType,
  ) {
    return this.usuarioService.deleteUsuario(actorContext, dto);
  }

  // END: mutations

  // START: fields graphql-resolvers

  @ResolveField('nome', () => String, { nullable: true })
  async nome(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioNome(actorContext, parent.id);
  }

  @ResolveField('email', () => String, { nullable: true })
  async email(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioEmail(actorContext, parent.id);
  }

  @ResolveField('matriculaSiape', () => String, { nullable: true })
  async matriculaSiape(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioMatriculaSiape(actorContext, parent.id);
  }

  //

  @ResolveField('keycloakId', () => String, { nullable: true })
  async keycloakId(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioKeycloakId(actorContext, parent.id);
  }

  // ...

  @ResolveField('dateCreated', () => Date)
  async dateCreated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateCreated(actorContext, parent.id);
  }

  @ResolveField('dateUpdated', () => Date)
  async dateUpdated(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateUpdated(actorContext, parent.id);
  }

  @ResolveField('dateDeleted', () => Date, { nullable: true })
  async dateDeleted(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateDeleted(actorContext, parent.id);
  }

  @ResolveField('dateSearchSync', () => Date, { nullable: true })
  async dateSearchSync(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioDateSearchSync(actorContext, parent.id);
  }

  // ...

  @ResolveField('permissoes', () => [PermissaoType])
  async permissoes(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioPermissoes(actorContext, parent.id);
  }

  @ResolveField('cargos', () => [CargoType])
  async cargos(
    @ResolveActorContext()
    actorContext: ActorContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioCargos(actorContext, parent.id);
  }

  // END: fields graphql-resolvers
}
