import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { PeriodoDiaResolver } from './periodo-dia.resolver';
import { PeriodoDiaService } from './periodo-dia.service';

@Module({
  imports: [DatabaseModule],
  exports: [PeriodoDiaService],
  providers: [PeriodoDiaService, PeriodoDiaResolver],
})
export class PeriodoDiaModule {}
