import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { DiaSemanaResolver } from './dia-semana.resolver';
import { DiaSemanaService } from './dia-semana.service';

@Module({
  imports: [DatabaseModule, CargoModule],
  exports: [DiaSemanaService],
  providers: [DiaSemanaService, DiaSemanaResolver],
})
export class DiaSemanaModule {}
