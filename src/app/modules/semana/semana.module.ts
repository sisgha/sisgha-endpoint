import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { SemanaResolver } from './semana.resolver';
import { SemanaService } from './semana.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [SemanaService],
  providers: [SemanaService, SemanaResolver],
})
export class SemanaModule {}
