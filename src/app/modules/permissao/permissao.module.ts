import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { PermissaoResolver } from './permissao.resolver';
import { PermissaoService } from './permissao.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    //...
  ],
  exports: [PermissaoService],
  providers: [PermissaoService, PermissaoResolver],
})
export class PermissaoModule {}
