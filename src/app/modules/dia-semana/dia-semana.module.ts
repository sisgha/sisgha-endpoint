import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DiaSemanaResolver } from './dia-semana.resolver';
import { DiaSemanaService } from './dia-semana.service';

@Module({
  imports: [DatabaseModule],
  exports: [DiaSemanaService],
  providers: [DiaSemanaService, DiaSemanaResolver],
})
export class DiaSemanaModule {}
