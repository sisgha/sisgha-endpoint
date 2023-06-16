import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { PermissaoResolver } from './permissao.resolver';
import { PermissaoService } from './permissao.service';

@Module({
  imports: [
    MeiliSearchModule,
    // ...
  ],
  exports: [PermissaoService],
  providers: [PermissaoService, PermissaoResolver],
})
export class PermissaoModule {}
