import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { UsuarioInternoResolver } from './usuario_interno.resolver';
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
