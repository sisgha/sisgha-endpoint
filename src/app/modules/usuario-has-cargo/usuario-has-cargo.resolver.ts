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
import { CargoType } from '../cargo/cargo.type';
import { UsuarioType } from '../usuario/usuario.type';
import {
  AddCargoToUsuarioInputType,
  AddCargoToUsuarioInputZod,
  ListUsuarioHasCargoResultType,
  RemoveCargoFromUsuarioInputType,
  RemoveCargoFromUsuarioInputZod,
} from './dtos';
import { UsuarioHasCargoService } from './usuario-has-cargo.service';
import { UsuarioHasCargoType } from './usuario-has-cargo.type';

@Resolver(() => UsuarioHasCargoType)
export class UsuarioResolver {
  constructor(private usuarioHasCargoService: UsuarioHasCargoService) {}

  // START: queries

  @Query(() => ListUsuarioHasCargoResultType)
  async listUsuarioHasCargo(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', GenericListInputZod)
    dto: GenericListInputType,
  ) {
    return this.usuarioHasCargoService.listUsuarioHasCargo(appContext, dto);
  }

  // END: queries

  // START: mutations

  @Mutation(() => UsuarioHasCargoType)
  async addCargoToUsuario(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', AddCargoToUsuarioInputZod)
    dto: AddCargoToUsuarioInputType,
  ) {
    return this.usuarioHasCargoService.addCargoToUsuario(appContext, dto);
  }

  @Mutation(() => Boolean)
  async removeCargoFromUsuario(
    @ResolveAppContext()
    appContext: AppContext,
    @ValidatedArgs('dto', RemoveCargoFromUsuarioInputZod)
    dto: RemoveCargoFromUsuarioInputType,
  ) {
    return this.usuarioHasCargoService.removeCargoFromUsuario(appContext, dto);
  }

  // END: mutations

  // START: fields resolvers

  @ResolveField('usuario', () => UsuarioType)
  async usuario(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: UsuarioHasCargoType,
  ) {
    return this.usuarioHasCargoService.getUsuarioHasCargoUsuario(
      appContext,
      parent.id,
    );
  }

  @ResolveField('cargo', () => CargoType)
  async cargo(
    @ResolveAppContext()
    appContext: AppContext,
    @Parent()
    parent: UsuarioHasCargoType,
  ) {
    return this.usuarioHasCargoService.getUsuarioHasCargoCargo(
      appContext,
      parent.id,
    );
  }

  // END: fields resolvers
}
