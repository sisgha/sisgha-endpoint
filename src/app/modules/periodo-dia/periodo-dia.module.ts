import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { PeriodoDiaResolver } from './periodo-dia.resolver';
import { PeriodoDiaService } from './periodo-dia.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [PeriodoDiaService],
  providers: [PeriodoDiaService, PeriodoDiaResolver],
})
export class PeriodoDiaModule {}
