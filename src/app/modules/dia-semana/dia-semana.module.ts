import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { DiaSemanaResolver } from './dia-semana.resolver';
import { DiaSemanaService } from './dia-semana.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
  ],
  exports: [DiaSemanaService],
  providers: [DiaSemanaService, DiaSemanaResolver],
})
export class DiaSemanaModule {}
