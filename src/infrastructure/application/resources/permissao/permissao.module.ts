import { Module } from '@nestjs/common';
import { PermissaoResolver } from '../../../adapters/resolvers/permissao.resolver';
import { PermissaoService } from './permissao.service';
import { DatabaseModule } from '../../../database/database.module';
import { MeiliSearchModule } from '../../../meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [PermissaoService],
  providers: [PermissaoService, PermissaoResolver],
})
export class PermissaoModule {}
