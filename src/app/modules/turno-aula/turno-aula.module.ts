import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { DiaSemanaModule } from '../dia-semana/dia-semana.module';
import { PeriodoDiaModule } from '../periodo-dia/periodo-dia.module';
import { TurnoAulaResolver } from './turno-aula.resolver';
import { TurnoAulaService } from './turno-aula.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    DiaSemanaModule,
    PeriodoDiaModule,
  ],
  exports: [TurnoAulaService],
  providers: [TurnoAulaService, TurnoAulaResolver],
})
export class TurnoAulaModule {}
