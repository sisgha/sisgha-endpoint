import { Module } from '@nestjs/common';
import { UsuarioResolver } from '../../../adapters/resolvers/usuario.resolver';
import { DatabaseModule } from '../../../database/database.module';
import { UsuarioService } from './usuario.service';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [UsuarioService],
  providers: [UsuarioService, UsuarioResolver],
})
export class UsuarioModule {}
