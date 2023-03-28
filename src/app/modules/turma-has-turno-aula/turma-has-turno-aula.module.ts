import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { TurmaModule } from '../turma/turma.module';
import { TurnoAulaModule } from '../turno-aula/turno-aula.module';
import { TurmaHasTurnoAulaResolver } from './turma-has-turno-aula.resolver';
import { TurmaHasTurnoAulaService } from './turma-has-turno-aula.service';

@Module({
  imports: [DatabaseModule, TurmaModule, TurnoAulaModule],
  exports: [TurmaHasTurnoAulaService],
  providers: [TurmaHasTurnoAulaService, TurmaHasTurnoAulaResolver],
})
export class TurmaHasTurnoAulaModule {}
