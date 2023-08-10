import { Module } from '@nestjs/common';

import { UsuarioInternoCargoResolver } from '../../../adapters/graphql-resolvers/usuario_interno_cargo.resolver';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioInternoModule } from '../usuario_interno/usuario_interno.module';
import { UsuarioInternoCargoService } from './usuario_interno_cargo.service';

@Module({
  imports: [CargoModule, UsuarioInternoModule],
  exports: [UsuarioInternoCargoService],
  providers: [UsuarioInternoCargoService, UsuarioInternoCargoResolver],
})
export class UsuarioInternoCargoModule {}
