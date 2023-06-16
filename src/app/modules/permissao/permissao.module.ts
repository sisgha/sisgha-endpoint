import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { PermissaoResolver } from './permissao.resolver';
import { PermissaoService } from './permissao.service';

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
