import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UsuarioInternoCargoResolver } from '../../../adapters/resolvers/usuario_interno_cargo.resolver';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioInternoModule } from '../usuario_interno/usuario_interno.module';
import { UsuarioInternoCargoService } from './usuario_interno_cargo.service';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    CargoModule,
    UsuarioInternoModule,
  ],
  exports: [UsuarioInternoCargoService],
  providers: [UsuarioInternoCargoService, UsuarioInternoCargoResolver],
})
export class UsuarioInternoCargoModule {}
