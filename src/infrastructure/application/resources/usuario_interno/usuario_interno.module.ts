import { Module } from '@nestjs/common';
import { UsuarioInternoResolver } from '../../../adapters/resolvers/usuario_interno.resolver';
import { DatabaseModule } from '../../../database/database.module';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';
import { UsuarioInternoService } from './usuario_interno.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [UsuarioInternoService],
  providers: [UsuarioInternoService, UsuarioInternoResolver],
})
export class UsuarioInternoModule {}
