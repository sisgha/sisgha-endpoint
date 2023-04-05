import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { CursoResolver } from './curso.resolver';
import { CursoService } from './curso.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [CursoService],
  providers: [CursoService, CursoResolver],
})
export class CursoModule {}
