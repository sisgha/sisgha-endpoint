import { Module } from '@nestjs/common';
import { UsuarioCargoResolver } from '../../../adapters/graphql-resolvers/usuario_cargo.resolver';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioCargoService } from './usuario_cargo.service';

@Module({
  imports: [UsuarioModule, CargoModule],
  exports: [UsuarioCargoService],
  providers: [UsuarioCargoService, UsuarioCargoResolver],
})
export class UsuarioCargoModule {}
