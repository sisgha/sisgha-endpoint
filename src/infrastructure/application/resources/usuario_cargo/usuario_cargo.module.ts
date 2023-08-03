import { Module } from '@nestjs/common';
import { UsuarioCargoResolver } from '../../../adapters/resolvers/usuario_cargo.resolver';
import { DatabaseModule } from '../../../database/database.module';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { UsuarioCargoService } from './usuario_cargo.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    UsuarioModule,
    CargoModule,
  ],
  exports: [UsuarioCargoService],
  providers: [UsuarioCargoService, UsuarioCargoResolver],
})
export class UsuarioCargoModule {}
