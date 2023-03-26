import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DiaSemanaModule } from '../dia-semana/dia-semana.module';
import { PeriodoDiaModule } from '../periodo-dia/periodo-dia.module';
import { TurnoAulaResolver } from './turno-aula.resolver';
import { TurnoAulaService } from './turno-aula.service';

@Module({
  imports: [DatabaseModule, DiaSemanaModule, PeriodoDiaModule],
  exports: [TurnoAulaService],
  providers: [TurnoAulaService, TurnoAulaResolver],
})
export class TurnoAulaModule {}
