import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../database/database.module';
import { TurmaModule } from '../turma/turma.module';
import { TurnoAulaModule } from '../turno-aula/turno-aula.module';
import { TurmaHasTurnoAulaResolver } from './turma-has-turno-aula.resolver';
import { TurmaHasTurnoAulaService } from './turma-has-turno-aula.service';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    TurmaModule,
    TurnoAulaModule,
  ],
  exports: [TurmaHasTurnoAulaService],
  providers: [TurmaHasTurnoAulaService, TurmaHasTurnoAulaResolver],
})
export class TurmaHasTurnoAulaModule {}
