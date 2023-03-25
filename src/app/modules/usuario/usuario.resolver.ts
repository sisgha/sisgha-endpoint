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
  CreateUsuarioInputType,
  CreateUsuarioInputZod,
  DeleteUsuarioInputType,
  DeleteUsuarioInputZod,
  FindUsuarioByIdInputType,
  FindUsuarioByIdInputZod,
  UpdateUsuarioInputType,
  UpdateUsuarioInputZod,
} from './dtos';
import { UsuarioService } from './usuario.service';
import { UsuarioType } from './usuario.type';

@Resolver(() => UsuarioType)
export class UsuarioResolver {
  constructor(private usuarioService: UsuarioService) {}

  // START: queries

  @Query(() => UsuarioType)
  async findUsuarioById(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', FindUsuarioByIdInputZod)
    dto: FindUsuarioByIdInputType,
  ) {
    return this.usuarioService.findUsuarioByIdStrict(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioType)
  async createUsuario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', CreateUsuarioInputZod)
    dto: CreateUsuarioInputType,
  ) {
    return this.usuarioService.createUsuario(appContext, dto);
  }

  @Mutation(() => UsuarioType)
  async updateUsuario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', UpdateUsuarioInputZod)
    dto: UpdateUsuarioInputType,
  ) {
    return this.usuarioService.updateUsuario(appContext, dto);
  }

  @Mutation(() => Boolean)
  async deleteUsuario(
    @ResolveAppContext()
    appContext: AppContext,

    @ValidatedArgs('dto', DeleteUsuarioInputZod)
    dto: DeleteUsuarioInputType,
  ) {
    return this.usuarioService.deleteUsuario(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('email', () => String, { nullable: true })
  async email(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioEmail(appContext, parent.id);
  }

  @ResolveField('keycloakId', () => String, { nullable: true })
  async keycloakId(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioKeycloakId(appContext, parent.id);
  }

  @ResolveField('matriculaSiape', () => String, { nullable: true })
  async matriculaSiape(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent() parent: UsuarioType,
  ) {
    return this.usuarioService.getUsuarioMatriculaSiape(appContext, parent.id);
  }

  // END: fields resolvers
}
